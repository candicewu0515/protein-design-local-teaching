#!/usr/bin/env python3
"""Unified structure-metric table for the generate->verify demo (journal supplement).

Produces ONE table (data_summary.csv) from which every numeric claim in the
write-up is reproducible. Covers all three result classes:

  verify_native   : predictor folds the NATIVE sequence  -> compare to experiment
  generate_verify : ProteinMPNN redesign -> ESMFold      -> compare to native fold
  denovo_verify   : RFdiffusion backbone -> MPNN -> ESMFold -> compare to that backbone

Metrics, with explicit conventions (see Methods):
  * CA atoms only, chain A, model 1.
  * Two structures here always represent a SINGLE chain of IDENTICAL length in 1:1
    sequence correspondence, so CA atoms are mapped by ORDINAL position after
    sorting by residue number. This is required because experimental chains may
    use offset numbering (e.g. 1VII is numbered 41-76, predictions are 1-36).
    n_aligned is reported; a mismatch in length is flagged, never silently cropped
    beyond min().
  * Superposition: Kabsch (optimal least-squares on the mapped CA pairs).
  * CA_RMSD_A: RMSD after that superposition.
  * TMscore  : sum 1/(1+(d_i/d0)^2) / L_ref, d0=1.24*(L_ref-15)^(1/3)-1.8 (d0>=0.5),
               L_ref = reference length. NOTE: fixed-superposition (Kabsch) score,
               not TM-align's rotation-optimized value; reported for scale-awareness,
               with CA-RMSD as the primary metric for these short chains.
  * mean_pLDDT: ESMFold PDBs store per-residue confidence as a 0-1 B-factor -> x100;
               ColabFold pLDDT/pTM are read from the rank_001 scores JSON (already 0-100).
"""
import glob, json, os, csv
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))


# ---------- PDB parsing ----------
def read_ca(path, model1_only=True):
    """Return CA coords ordered by residue number, plus mean pLDDT estimate.
    coords: (N,3); resseq list; bfac list (raw)."""
    rows = []; inmodel = True
    for line in open(path):
        if line.startswith('ENDMDL'):
            inmodel = False
        if model1_only and not inmodel:
            continue
        if line.startswith('ATOM') and line[12:16].strip() == 'CA':
            if line[21] not in ('A', ' '):
                continue
            alt = line[16]
            if alt not in (' ', 'A'):
                continue
            resseq = int(line[22:26])
            xyz = (float(line[30:38]), float(line[38:46]), float(line[46:54]))
            bf = float(line[60:66])
            rows.append((resseq, xyz, bf))
    rows.sort(key=lambda r: r[0])
    # de-dup residues keeping first occurrence
    seen = set(); keep = []
    for r in rows:
        if r[0] in seen:
            continue
        seen.add(r[0]); keep.append(r)
    coords = np.array([r[1] for r in keep], float)
    bfac = np.array([r[2] for r in keep], float)
    return coords, bfac


def pdb_plddt(path):
    """mean pLDDT from B-factor; auto-scale 0-1 (ESMFold) -> 0-100."""
    _, bf = read_ca(path)
    if bf.size == 0:
        return float('nan')
    m = float(bf.mean())
    return m * 100.0 if bf.max() <= 1.5 else m


# ---------- geometry ----------
def kabsch(P, Q):
    Pc = P - P.mean(0); Qc = Q - Q.mean(0)
    V, S, Wt = np.linalg.svd(Pc.T @ Qc)
    d = np.sign(np.linalg.det(V @ Wt))
    U = V @ np.diag([1, 1, d]) @ Wt
    return Pc @ U, Qc


def metrics(pred_pdb, ref_pdb):
    P, _ = read_ca(pred_pdb)
    Q, _ = read_ca(ref_pdb)
    n = min(len(P), len(Q))
    flag = "" if len(P) == len(Q) else f"len_mismatch({len(P)}vs{len(Q)})"
    P, Q = P[:n], Q[:n]
    Pa, Qc = kabsch(P, Q)
    d = np.sqrt(((Pa - Qc) ** 2).sum(1))
    rmsd = float(np.sqrt((d ** 2).mean()))
    L = len(Q)
    d0 = max(1.24 * (L - 15) ** (1 / 3) - 1.8, 0.5) if L > 15 else 0.5
    tm = float((1.0 / (1.0 + (d / d0) ** 2)).sum() / L)
    return rmsd, tm, n, flag


# ---------- sequences ----------
def read_fasta(path):
    seqs = {}; name = None
    for line in open(path):
        line = line.rstrip()
        if line.startswith('>'):
            name = line[1:].split()[0]; seqs[name] = ''
        elif name:
            seqs[name] += line
    return seqs

native = read_fasta(os.path.join(HERE, 'seqs/native4.fasta'))   # {'1L2Y_native': '...'}
design = read_fasta(os.path.join(HERE, 'seqs/designed8.fasta'))  # {'1L2Y_design1': '...'}

def seqid(a, b):
    n = min(len(a), len(b))
    if n == 0:
        return float('nan')
    return round(100.0 * sum(x == y for x, y in zip(a[:n], b[:n])) / n, 0)


# ---------- protein metadata ----------
PROT = {  # pid -> (display name, experimental ref pdb)
    '1L2Y': ('Trp-cage (20 aa)',     'ref_pdb/1L2Y.pdb'),
    '1VII': ('villin HP36 (36 aa)',  'ref_pdb/1VII.pdb'),
    '1PGA': ('protein G B1 (56 aa)', 'ref_pdb/1PGA.pdb'),
    '1UBQ': ('ubiquitin (76 aa)',    'ref_pdb/1UBQ.pdb'),
}

def verdict(plddt, rmsd):
    if plddt >= 80 and rmsd < 2.0:
        return 'self-consistent'
    if plddt >= 80 and rmsd < 3.0:
        return 'borderline'
    return 'borderline' if rmsd < 3.0 else 'inconsistent'


rows = []

def add(stage, rid, protein, length, predictor, reference, ref_path,
        sid, pred_pdb, ptm=''):
    if not os.path.exists(os.path.join(HERE, pred_pdb)):
        print(f"[skip] {rid}: missing {pred_pdb}")
        return
    rmsd, tm, n, flag = metrics(os.path.join(HERE, pred_pdb), os.path.join(HERE, ref_path))
    pl = pdb_plddt(os.path.join(HERE, pred_pdb))
    rows.append(dict(stage=stage, id=rid, protein=protein, length=length,
                     predictor=predictor, reference=reference,
                     seqID_to_native_pct=('' if sid is None else int(sid)),
                     mean_pLDDT=round(pl, 1), pTM=ptm,
                     CA_RMSD_A=round(rmsd, 2), TMscore=round(tm, 3),
                     n_aligned=n, verdict=verdict(pl, rmsd), flag=flag))


# ---- verify_native: ESMFold on native sequences ----
for pid, (name, ref) in PROT.items():
    L = len(native[f'{pid}_native'])
    add('verify_native', f'{pid}_ESMFold', name, L, 'ESMFold',
        'experimental', ref, 100, f'esmfold_out/{pid}_native.pdb')

# ---- verify_native: ColabFold (AlphaFold2) on native sequences ----
for pid, (name, ref) in PROT.items():
    L = len(native[f'{pid}_native'])
    pdbs = sorted(glob.glob(os.path.join(HERE, 'colabfold_native', f'{pid}_native*rank_001*.pdb')))
    jsons = sorted(glob.glob(os.path.join(HERE, 'colabfold_native', f'{pid}_native*scores_rank_001*.json')))
    if not pdbs or not jsons:
        print(f"[skip] {pid}_ColabFold: outputs not present yet")
        continue
    sc = json.load(open(jsons[0]))
    pl = round(float(np.mean(sc['plddt'])), 1)
    ptm = round(float(sc.get('ptm', float('nan'))), 3)
    rmsd, tm, n, flag = metrics(pdbs[0], os.path.join(HERE, ref))
    rows.append(dict(stage='verify_native', id=f'{pid}_ColabFold', protein=name, length=L,
                     predictor='ColabFold(AF2)', reference='experimental',
                     seqID_to_native_pct=100, mean_pLDDT=pl, pTM=ptm,
                     CA_RMSD_A=round(rmsd, 2), TMscore=round(tm, 3),
                     n_aligned=n, verdict=verdict(pl, rmsd), flag=flag))

# ---- generate_verify: ProteinMPNN redesign -> ESMFold vs native fold ----
for pid, (name, ref) in PROT.items():
    nat = native[f'{pid}_native']
    for k in (1, 2):
        did = f'{pid}_design{k}'
        if did not in design:
            continue
        sid = seqid(design[did], nat)
        add('generate_verify', did, name, len(nat), 'ESMFold',
            'native_fold', ref, sid, f'esmfold_designed/{did}.pdb')

# ---- denovo_verify: RFdiffusion backbone -> MPNN -> ESMFold vs that backbone ----
for k in (1, 2, 3, 4):
    add('denovo_verify', f'denovo80_design{k}', 'de novo (80 aa)', 80, 'ESMFold',
        'rfdiff_backbone', 'rfdiff_out_80aa/denovo80_0.pdb', None,
        f'esmfold_denovo80/denovo80_design{k}.pdb')


# ---------- write ----------
fields = ['stage', 'id', 'protein', 'length', 'predictor', 'reference',
          'seqID_to_native_pct', 'mean_pLDDT', 'pTM', 'CA_RMSD_A', 'TMscore',
          'n_aligned', 'verdict', 'flag']
out = os.path.join(HERE, 'data_summary.csv')
with open(out, 'w', newline='') as f:
    w = csv.DictWriter(f, fieldnames=fields)
    w.writeheader(); w.writerows(rows)

# pretty print
print(f"\n{'id':<18}{'pred':<16}{'ref':<14}{'seqID':>6}{'pLDDT':>7}{'pTM':>7}"
      f"{'RMSD':>7}{'TM':>7}{'n':>4}  verdict")
for r in rows:
    print(f"{r['id']:<18}{r['predictor']:<16}{r['reference']:<14}"
          f"{str(r['seqID_to_native_pct']):>6}{r['mean_pLDDT']:>7}{str(r['pTM']):>7}"
          f"{r['CA_RMSD_A']:>7}{r['TMscore']:>7}{r['n_aligned']:>4}  {r['verdict']}"
          + (f"  [{r['flag']}]" if r['flag'] else ""))
print(f"\nwrote {out}  ({len(rows)} rows)")
