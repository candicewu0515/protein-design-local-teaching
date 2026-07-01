// Student-facing hands-on deck: every step shows INPUT format -> TOOL -> OUTPUT files -> next step.
const pptxgen = require("pptxgenjs");
const P = new pptxgen();
P.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
P.author = "InnovateBio";
P.title = "Run the protein-design loop yourself — a hands-on student guide";
const W = 13.33, H = 7.5;

// palette
const INK = "12253B", NAVY2 = "284A6E", TEAL = "2C7DA0", ORANGE = "DD8452";
const LIGHT = "F4F7FA", CARD = "FFFFFF", TXT = "1E2A38", SUB = "4F6070", LINE = "D4DCE4";
const GREEN = "2E8B6F", PURPLE = "7E6BA6", SLATE = "5B6B7B", GO = "2E8B57";
const HF = "Trebuchet MS", BF = "Calibri", MONO = "Consolas";
// file-type colours (used everywhere consistently)
const FT = { fasta: GREEN, pdb: TEAL, json: SLATE, csv: ORANGE, png: PURPLE, text: "8A8F98" };
const sh = () => ({ type: "outer", color: "9AA9B8", blur: 8, offset: 2.5, angle: 90, opacity: 0.25 });

function head(s, kicker, title) {
  s.background = { color: LIGHT };
  s.addShape(P.shapes.RECTANGLE, { x: 0, y: 0, w: 0.22, h: H, fill: { color: TEAL } });
  s.addText(kicker.toUpperCase(), { x: 0.7, y: 0.36, w: 12, h: 0.3, fontFace: HF, fontSize: 12.5, bold: true, color: ORANGE, charSpacing: 2, margin: 0 });
  s.addText(title, { x: 0.7, y: 0.62, w: 12.3, h: 0.7, fontFace: HF, fontSize: 27, bold: true, color: INK, margin: 0 });
}
function foot(s, n) {
  s.addText("Hands-on guide · the generate → verify loop, GPU-free", { x: 0.7, y: H - 0.4, w: 9, h: 0.3, fontFace: BF, fontSize: 9, color: SUB, margin: 0 });
  s.addText(String(n), { x: W - 0.85, y: H - 0.4, w: 0.4, h: 0.3, fontFace: BF, fontSize: 9, color: SUB, align: "right", margin: 0 });
}
function card(s, x, y, w, h, fill = CARD, border = LINE) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.07, fill: { color: fill }, line: { color: border, width: 1 }, shadow: sh() });
}
// file chip: coloured pill with ".ext" badge + filename
function fileChip(s, x, y, w, ext, fname, h = 0.62) {
  const c = FT[ext] || SLATE;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.06, fill: { color: "FFFFFF" }, line: { color: c, width: 1.25 } });
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: x + 0.07, y: y + 0.1, w: 0.92, h: h - 0.2, rectRadius: 0.05, fill: { color: c } });
  s.addText("." + ext, { x: x + 0.07, y: y + 0.1, w: 0.92, h: h - 0.2, fontFace: BF, fontSize: 11.5, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
  s.addText(fname, { x: x + 1.06, y: y, w: w - 1.12, h, fontFace: MONO, fontSize: 11.5, color: TXT, valign: "middle", margin: 0 });
}
// code box (dark)
function code(s, x, y, w, h, lines) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.05, fill: { color: INK } });
  s.addText(lines.map((t, i) => ({ text: t, options: { breakLine: i < lines.length - 1, color: i === 0 ? "8Fd0C4" : "DDE7EE" } })),
    { x: x + 0.18, y: y + 0.04, w: w - 0.34, h: h - 0.08, fontFace: MONO, fontSize: 11, valign: "middle", margin: 0, lineSpacingMultiple: 1.12 });
}
function arrow(s, x, y) { s.addText("▶", { x, y, w: 0.4, h: 0.6, fontFace: BF, fontSize: 15, color: ORANGE, align: "center", valign: "middle", margin: 0 }); }

// reusable INPUT -> TOOL -> OUTPUT -> NEXT step header strip
function flow(s, y, inChip, tool, outChips, nextTxt) {
  // input
  s.addText("INPUT", { x: 0.7, y: y - 0.32, w: 2.6, h: 0.25, fontFace: HF, fontSize: 10, bold: true, color: SUB, charSpacing: 1, margin: 0 });
  fileChip(s, 0.7, y, 2.85, inChip[0], inChip[1]);
  arrow(s, 3.62, y + 0.01);
  // tool
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 4.05, y: y - 0.06, w: 2.5, h: 0.75, rectRadius: 0.08, fill: { color: NAVY2 } });
  s.addText(tool, { x: 4.05, y: y - 0.06, w: 2.5, h: 0.75, fontFace: HF, fontSize: 14.5, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
  arrow(s, 6.6, y + 0.01);
  // outputs
  s.addText("OUTPUT", { x: 7.0, y: y - 0.32, w: 3, h: 0.25, fontFace: HF, fontSize: 10, bold: true, color: SUB, charSpacing: 1, margin: 0 });
  let oy = y;
  outChips.forEach(c => { fileChip(s, 7.0, oy, 3.0, c[0], c[1], 0.56); oy += 0.66; });
  // next
  const nextH = Math.max(1.2, 0.75 + (outChips.length - 1) * 0.66);
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 10.25, y: y - 0.06, w: 2.45, h: nextH, rectRadius: 0.08, fill: { color: "EAF1E9" }, line: { color: GO, width: 1 } });
  s.addText([{ text: "NEXT →\n", options: { bold: true, color: GO, fontSize: 10.5, breakLine: true } }, { text: nextTxt, options: { color: TXT, fontSize: 10.5 } }],
    { x: 10.42, y: y - 0.02, w: 2.2, h: nextH - 0.08, fontFace: BF, valign: "middle", margin: 0, lineSpacingMultiple: 1.0 });
}

// ============ 1. TITLE ============
{
  const s = P.addSlide();
  s.background = { color: INK };
  s.addShape(P.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.16, fill: { color: ORANGE } });
  s.addText("HANDS-ON GUIDE  ·  FOR STUDENTS", { x: 0.9, y: 0.72, w: 11, h: 0.35, fontFace: HF, fontSize: 13, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  s.addText("Run the protein-design loop yourself", { x: 0.9, y: 1.12, w: 11.6, h: 0.95, fontFace: HF, fontSize: 41, bold: true, color: "FFFFFF", margin: 0 });
  s.addText("What goes in, what comes out, and which file feeds the next step", { x: 0.9, y: 2.12, w: 11.6, h: 0.5, fontFace: HF, fontSize: 20, color: "CFE0EC", margin: 0 });
  // the flow teaser with file types
  const items = [["RFdiffusion", "pdb"], ["ProteinMPNN", "fasta"], ["ESMFold / AF2", "pdb"], ["analyze", "csv"]];
  let cx = 0.9; const y = 3.25;
  items.forEach(([t, ext], i) => {
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: cx, y, w: 2.45, h: 1.15, rectRadius: 0.09, fill: { color: NAVY2 }, line: { color: TEAL, width: 1 } });
    s.addText(t, { x: cx, y: y + 0.14, w: 2.45, h: 0.4, fontFace: HF, fontSize: 14, bold: true, color: "FFFFFF", align: "center", margin: 0 });
    // output file chip inside
    const c = FT[ext];
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: cx + 0.55, y: y + 0.62, w: 1.35, h: 0.36, rectRadius: 0.05, fill: { color: c } });
    s.addText("." + ext, { x: cx + 0.55, y: y + 0.62, w: 1.35, h: 0.36, fontFace: BF, fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    if (i < 3) s.addText("▶", { x: cx + 2.45, y, w: 0.5, h: 1.15, fontFace: BF, fontSize: 16, color: ORANGE, align: "center", valign: "middle", margin: 0 });
    cx += 2.95;
  });
  s.addText("Each tool reads one file type and writes another — follow the files and you can run the whole loop on a laptop, no GPU.", { x: 0.9, y: 4.95, w: 11.6, h: 0.5, fontFace: BF, fontSize: 15, color: "AFC3D4", margin: 0 });
  s.addText("4 small proteins (20–76 aa)  ·  every result reproducible from one script", { x: 0.9, y: 6.35, w: 11.6, h: 0.4, fontFace: BF, fontSize: 13, italic: true, color: "7E97AB", margin: 0 });
}

// ============ 2. THE DATA FLOW (MAP) ============
{
  const s = P.addSlide();
  head(s, "The big picture", "The whole loop is just files flowing between tools");
  const y = 2.05;
  const stages = [
    { tool: "RFdiffusion", sub: "generate backbone", out: ["pdb", "backbone"] },
    { tool: "ProteinMPNN", sub: "design sequence", out: ["fasta", "sequence"] },
    { tool: "ESMFold / AF2", sub: "predict structure", out: ["pdb", "structure"] },
    { tool: "analyze", sub: "score & decide", out: ["csv", "results"] },
  ];
  let cx = 0.7; const bw = 2.7, ch = 1.72;
  stages.forEach((st, i) => {
    card(s, cx, y, bw, ch);
    s.addShape(P.shapes.RECTANGLE, { x: cx, y, w: bw, h: 0.1, fill: { color: FT[st.out[0]] } });
    s.addText(st.tool, { x: cx + 0.1, y: y + 0.26, w: bw - 0.2, h: 0.45, fontFace: HF, fontSize: 15.5, bold: true, color: INK, align: "center", margin: 0 });
    s.addText(st.sub, { x: cx + 0.1, y: y + 0.68, w: bw - 0.2, h: 0.35, fontFace: BF, fontSize: 12.5, color: SUB, align: "center", margin: 0 });
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: cx + 0.55, y: y + 1.08, w: bw - 1.1, h: 0.48, rectRadius: 0.05, fill: { color: FT[st.out[0]] } });
    s.addText("." + st.out[0], { x: cx + 0.55, y: y + 1.08, w: bw - 1.1, h: 0.48, fontFace: BF, fontSize: 13, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    if (i < 3) s.addText("▶", { x: cx + bw - 0.02, y, w: 0.42, h: ch, fontFace: BF, fontSize: 18, color: ORANGE, align: "center", valign: "middle", margin: 0 });
    cx += bw + 0.4;
  });
  // verify loop annotation
  s.addText("The verify idea:  the structure ESMFold predicts (.pdb) is compared back to the shape you started from — agreement = a good design.", { x: 0.7, y: 4.25, w: 12, h: 0.4, fontFace: BF, fontSize: 14, italic: true, color: TXT, margin: 0 });
  // file-type legend
  card(s, 0.7, 4.95, 11.95, 1.55, "FBFCFD");
  s.addText("File types you will see", { x: 0.95, y: 5.08, w: 6, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: INK, margin: 0 });
  const leg = [["pdb", "3D structure (atoms)"], ["fasta", "amino-acid sequence"], ["json", "scores (pLDDT, pTM)"], ["csv", "results table"], ["png", "plots / figures"]];
  let lx = 0.95;
  leg.forEach(([ext, d]) => {
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: lx, y: 5.55, w: 0.95, h: 0.4, rectRadius: 0.05, fill: { color: FT[ext] } });
    s.addText("." + ext, { x: lx, y: 5.55, w: 0.95, h: 0.4, fontFace: BF, fontSize: 11.5, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    s.addText(d, { x: lx, y: 6.0, w: 2.3, h: 0.35, fontFace: BF, fontSize: 11, color: SUB, margin: 0 });
    lx += 2.38;
  });
  foot(s, 2);
}

// ============ 3. BEFORE YOU START ============
{
  const s = P.addSlide();
  head(s, "Before you start", "Install once, then pick a track");
  card(s, 0.7, 1.8, 5.9, 2.7);
  s.addText("You already have", { x: 0.95, y: 1.95, w: 5.4, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "Pinned environments for the three tools (one-time install + model download)", options: { bullet: true, breakLine: true } },
    { text: "Four experimental structures to practice on:", options: { bullet: true, breakLine: true } },
  ], { x: 0.95, y: 2.4, w: 5.4, h: 1.0, fontFace: BF, fontSize: 13.5, color: TXT, margin: 0, paraSpaceAfter: 5 });
  fileChip(s, 1.2, 3.62, 5.1, "pdb", "ref_pdb/1L2Y,1VII,1PGA,1UBQ.pdb");
  card(s, 6.8, 1.8, 5.85, 2.7);
  s.addText("Two tracks", { x: 7.05, y: 1.95, w: 5.4, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: ORANGE, margin: 0 });
  s.addText([
    { text: "A · Redesign (recommended start). ", options: { bold: true, color: TXT } },
    { text: "Start from a native .pdb — you have an answer key.\n", options: { color: TXT, breakLine: true } },
    { text: "B · De novo (harder). ", options: { bold: true, color: TXT } },
    { text: "Start from just a length — RFdiffusion invents the backbone.", options: { color: TXT } },
  ], { x: 7.05, y: 2.45, w: 5.4, h: 1.6, fontFace: BF, fontSize: 13.5, margin: 0, lineSpacingMultiple: 1.05 });
  s.addText("Activate the right environment for each step (each tool has its own):", { x: 0.7, y: 4.5, w: 12, h: 0.35, fontFace: BF, fontSize: 13.5, bold: true, color: TXT, margin: 0 });
  code(s, 0.7, 4.95, 11.95, 1.25, [
    "# wrappers set up paths + the correct env for you:",
    "protein_model_tools/run_rfdiffusion.sh   run_esmfold.sh   run_colabfold.sh",
    "# ProteinMPNN: python protein_mpnn_run.py ...",
  ]);
  foot(s, 3);
}

// ============ 4. STEP 1 RFdiffusion ============
{
  const s = P.addSlide();
  head(s, "Step 1 · (de novo track only)", "RFdiffusion — invent a backbone shape");
  flow(s, 1.95, ["text", "length spec"], "RFdiffusion", [["pdb", "denovo80_0.pdb"]], "feed the .pdb to ProteinMPNN");
  card(s, 0.7, 3.25, 6.0, 3.0);
  s.addText("What it does", { x: 0.95, y: 3.4, w: 5.4, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "Generates a 3D backbone ", options: {} }, { text: "from noise", options: { bold: true } },
    { text: " — geometry only, ", options: {} }, { text: "no sequence yet", options: { bold: true } },
    { text: ". You tell it only how long the protein should be.", options: {} },
  ], { x: 0.95, y: 3.8, w: 5.5, h: 1.0, fontFace: BF, fontSize: 13.5, color: TXT, margin: 0, lineSpacingMultiple: 1.05 });
  s.addText("⏱  ~3.7 min for 80 aa on CPU · the heaviest step (skip on the redesign track — there you start from a native .pdb).", { x: 0.95, y: 4.9, w: 5.5, h: 1.0, fontFace: BF, fontSize: 12.5, italic: true, color: SUB, margin: 0, lineSpacingMultiple: 1.05 });
  card(s, 6.9, 3.25, 5.75, 3.0, "12253B");
  s.addText("Command", { x: 7.15, y: 3.4, w: 5, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: ORANGE, margin: 0 });
  s.addText([
    { text: "run_rfdiffusion.sh \\\n", options: { breakLine: true, color: "8FD0C4" } },
    { text: "  inference.output_prefix=rfdiff_out_80aa/denovo80 \\\n", options: { breakLine: true, color: "DDE7EE" } },
    { text: "  'contigmap.contigs=[80-80]' \\\n", options: { breakLine: true, color: "DDE7EE" } },
    { text: "  inference.num_designs=1", options: { color: "DDE7EE" } },
  ], { x: 7.15, y: 3.85, w: 5.3, h: 1.5, fontFace: MONO, fontSize: 11.5, margin: 0, lineSpacingMultiple: 1.1 });
  s.addText("contigs=[80-80] → an 80-residue chain. Output: rfdiff_out_80aa/denovo80_0.pdb", { x: 7.15, y: 5.55, w: 5.3, h: 0.6, fontFace: BF, fontSize: 12, color: "AFC3D4", margin: 0 });
  foot(s, 4);
}

// ============ 5. STEP 2 ProteinMPNN ============
{
  const s = P.addSlide();
  head(s, "Step 2 · generate", "ProteinMPNN — design a sequence for the backbone");
  flow(s, 1.95, ["pdb", "backbone.pdb"], "ProteinMPNN", [["fasta", "seqs/*.fa"]], "feed the .fa to ESMFold");
  card(s, 0.7, 3.25, 6.0, 3.0);
  s.addText("What it does", { x: 0.95, y: 3.4, w: 5.4, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "Reads a backbone shape and writes amino-acid ", options: {} },
    { text: "sequences that should fold into it", options: { bold: true } },
    { text: " (“inverse folding”). Ask for several per backbone — generation is random.", options: {} },
  ], { x: 0.95, y: 3.8, w: 5.5, h: 1.1, fontFace: BF, fontSize: 13.5, color: TXT, margin: 0, lineSpacingMultiple: 1.05 });
  s.addText("⏱  Seconds on CPU. The FASTA header carries the model name (v_48_020) and seed.", { x: 0.95, y: 5.0, w: 5.5, h: 0.9, fontFace: BF, fontSize: 12.5, italic: true, color: SUB, margin: 0, lineSpacingMultiple: 1.05 });
  card(s, 6.9, 3.25, 5.75, 3.0, "12253B");
  s.addText("Command", { x: 7.15, y: 3.4, w: 5, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: ORANGE, margin: 0 });
  s.addText([
    { text: "python protein_mpnn_run.py \\\n", options: { breakLine: true, color: "8FD0C4" } },
    { text: "  --pdb_path rfdiff_out_80aa/denovo80_0.pdb \\\n", options: { breakLine: true, color: "DDE7EE" } },
    { text: "  --out_folder denovo80_mpnn \\\n", options: { breakLine: true, color: "DDE7EE" } },
    { text: "  --num_seq_per_target 4 \\\n", options: { breakLine: true, color: "DDE7EE" } },
    { text: "  --sampling_temp 0.1", options: { color: "DDE7EE" } },
  ], { x: 7.15, y: 3.85, w: 5.3, h: 1.7, fontFace: MONO, fontSize: 11.5, margin: 0, lineSpacingMultiple: 1.1 });
  s.addText("Output: denovo80_mpnn/seqs/denovo80_0.fa  (4 sequences)", { x: 7.15, y: 5.7, w: 5.3, h: 0.4, fontFace: BF, fontSize: 12, color: "AFC3D4", margin: 0 });
  foot(s, 5);
}

// ============ 6. STEP 3 ESMFold / ColabFold ============
{
  const s = P.addSlide();
  head(s, "Step 3 · verify", "ESMFold / AlphaFold2 — fold the sequence back");
  flow(s, 1.95, ["fasta", "designs.fasta"], "ESMFold / AF2", [["pdb", "<name>.pdb"], ["json", "scores (AF2)"]], "compare the .pdb to your target");
  card(s, 0.7, 3.55, 6.0, 2.7);
  s.addText("What it does", { x: 0.95, y: 3.7, w: 5.4, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "Predicts the 3D structure of each designed sequence. ", options: {} },
    { text: "ESMFold", options: { bold: true, color: "0072B2" } },
    { text: " (single-sequence) is fastest; ", options: {} },
    { text: "AlphaFold2", options: { bold: true, color: "B5740E" } },
    { text: " (with MSA) is more accurate but ~100× slower on CPU.", options: {} },
  ], { x: 0.95, y: 4.1, w: 5.5, h: 1.2, fontFace: BF, fontSize: 13.5, color: TXT, margin: 0, lineSpacingMultiple: 1.05 });
  s.addText("pLDDT (confidence) is stored in the .pdb B-factor column; AF2 also writes a scores .json and .png plots.", { x: 0.95, y: 5.35, w: 5.5, h: 0.8, fontFace: BF, fontSize: 12, italic: true, color: SUB, margin: 0, lineSpacingMultiple: 1.05 });
  card(s, 6.9, 3.55, 5.75, 2.7, "12253B");
  s.addText("Commands", { x: 7.15, y: 3.68, w: 5, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: ORANGE, margin: 0 });
  s.addText([
    { text: "# fast, single-sequence:\n", options: { breakLine: true, color: "8FD0C4" } },
    { text: "run_esmfold.sh designs.fasta -o esmfold_out\n\n", options: { breakLine: true, color: "DDE7EE" } },
    { text: "# optional, MSA-based:\n", options: { breakLine: true, color: "8FD0C4" } },
    { text: "run_colabfold.sh designs.fasta colabfold_out", options: { color: "DDE7EE" } },
  ], { x: 7.15, y: 4.12, w: 5.3, h: 2.0, fontFace: MONO, fontSize: 11.5, margin: 0, lineSpacingMultiple: 1.1 });
  foot(s, 6);
}

// ============ 7. STEP 4 ANALYZE ============
{
  const s = P.addSlide();
  head(s, "Step 4 · decide", "Score it and apply the rubric");
  flow(s, 1.95, ["pdb", "predicted + target"], "analyze", [["csv", "data_summary.csv"], ["png", "figures"]], "read the table → pass or not");
  card(s, 0.7, 3.55, 6.0, 2.7);
  s.addText("What it does", { x: 0.95, y: 3.7, w: 5.4, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "Superposes your predicted .pdb on the target and computes ", options: {} },
    { text: "Cα-RMSD", options: { bold: true } },
    { text: " (how close) and reads ", options: {} },
    { text: "pLDDT", options: { bold: true } },
    { text: " (how confident). One row per design, written to one CSV.", options: {} },
  ], { x: 0.95, y: 4.1, w: 5.5, h: 1.2, fontFace: BF, fontSize: 13.5, color: TXT, margin: 0, lineSpacingMultiple: 1.05 });
  code(s, 0.95, 5.4, 5.5, 0.55, ["python analyze_structures.py"]);
  // rubric card
  card(s, 6.9, 3.55, 5.75, 2.7, "EAF1E9", GO);
  s.addText("The pass rule (rubric)", { x: 7.15, y: 3.7, w: 5.3, h: 0.35, fontFace: HF, fontSize: 15, bold: true, color: GO, margin: 0 });
  s.addText([
    { text: "✓ self-consistent  ", options: { bold: true, color: GO } },
    { text: "if  Cα-RMSD < 2 Å  AND  pLDDT > 80", options: { color: TXT, bold: true } },
  ], { x: 7.15, y: 4.2, w: 5.3, h: 0.5, fontFace: BF, fontSize: 14, margin: 0 });
  s.addText([
    { text: "Cα-RMSD = primary (Å to target; lower = closer)", options: { bullet: true, breakLine: true } },
    { text: "pLDDT = the model's own confidence (0–100)", options: { bullet: true, breakLine: true } },
    { text: "TM-score also reported — but ignore it for ≤30-aa chains", options: { bullet: true } },
  ], { x: 7.15, y: 4.75, w: 5.3, h: 1.4, fontFace: BF, fontSize: 12.5, color: TXT, margin: 0, paraSpaceAfter: 6 });
  foot(s, 7);
}

// ============ 8. FILE-TYPE CHEAT SHEET ============
{
  const s = P.addSlide();
  head(s, "Cheat sheet", "Every file type: what it is, who makes it, who reads it");
  const rows = [
    ["pdb", "3D atomic coordinates of a structure", "RFdiffusion, ESMFold, AF2, RCSB", "ProteinMPNN, analyze"],
    ["fasta", "Plain-text amino-acid sequence", "ProteinMPNN (you, by hand too)", "ESMFold, AlphaFold2"],
    ["json", "AF2 scores: pLDDT array, pTM, PAE", "ColabFold / AlphaFold2", "analyze"],
    ["csv", "The results table (one row per design)", "analyze_structures.py", "you — read it / plot it"],
    ["png", "Plots: pLDDT, PAE, coverage, overlays", "ColabFold, make_figures", "you — put in report"],
  ];
  let y = 1.95; const rh = 0.95;
  // header row
  s.addText("FILE", { x: 0.85, y: y, w: 1.3, h: 0.35, fontFace: HF, fontSize: 11, bold: true, color: SUB, charSpacing: 1, margin: 0 });
  s.addText("WHAT IT IS", { x: 2.3, y: y, w: 4.2, h: 0.35, fontFace: HF, fontSize: 11, bold: true, color: SUB, charSpacing: 1, margin: 0 });
  s.addText("MADE BY", { x: 6.7, y: y, w: 3.2, h: 0.35, fontFace: HF, fontSize: 11, bold: true, color: SUB, charSpacing: 1, margin: 0 });
  s.addText("READ BY", { x: 10.0, y: y, w: 2.7, h: 0.35, fontFace: HF, fontSize: 11, bold: true, color: SUB, charSpacing: 1, margin: 0 });
  y += 0.42;
  rows.forEach(([ext, what, made, read]) => {
    card(s, 0.7, y, 11.95, rh - 0.12);
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 0.85, y: y + 0.16, w: 1.2, h: 0.5, rectRadius: 0.05, fill: { color: FT[ext] } });
    s.addText("." + ext, { x: 0.85, y: y + 0.16, w: 1.2, h: 0.5, fontFace: BF, fontSize: 12.5, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    s.addText(what, { x: 2.3, y: y, w: 4.3, h: rh - 0.12, fontFace: BF, fontSize: 12.5, color: TXT, valign: "middle", margin: 0 });
    s.addText(made, { x: 6.7, y: y, w: 3.2, h: rh - 0.12, fontFace: BF, fontSize: 12, color: "39485A", valign: "middle", margin: 0 });
    s.addText(read, { x: 10.0, y: y, w: 2.55, h: rh - 0.12, fontFace: BF, fontSize: 12, color: "39485A", valign: "middle", margin: 0 });
    y += rh;
  });
  foot(s, 8);
}

// ============ 9. HOW TO READ YOUR RESULT ============
{
  const s = P.addSlide();
  head(s, "Reading your result", "Two numbers — read them together");
  card(s, 0.7, 1.85, 5.9, 1.85);
  s.addText("pLDDT — confidence (0–100)", { x: 0.95, y: 2.0, w: 5.4, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: "0072B2", margin: 0 });
  s.addText("How sure the predictor is about its OWN prediction. >90 very high, >80 good. It does NOT tell you if you hit the target shape.", { x: 0.95, y: 2.45, w: 5.4, h: 1.4, fontFace: BF, fontSize: 13.5, color: TXT, margin: 0, lineSpacingMultiple: 1.06 });
  card(s, 6.75, 1.85, 5.9, 1.85);
  s.addText("Cα-RMSD — accuracy (Å)", { x: 7.0, y: 2.0, w: 5.4, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: TEAL, margin: 0 });
  s.addText("How far your predicted structure is from the TARGET shape. Lower = closer. < 2 Å is the pass line for these small proteins.", { x: 7.0, y: 2.45, w: 5.4, h: 1.4, fontFace: BF, fontSize: 13.5, color: TXT, margin: 0, lineSpacingMultiple: 1.06 });
  // worked examples
  s.addText("Worked example — two designs from the SAME protein G backbone", { x: 0.7, y: 4.25, w: 12, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: INK, margin: 0 });
  const ex = [
    ["1PGA_design2", "93.6", "0.35 Å", "PASS ✓", GO, "EAF1E9"],
    ["1PGA_design1", "85.3", "2.91 Å", "borderline", "B5740E", "FBF2EA"],
  ];
  let ey = 4.75;
  ex.forEach(([id, pl, rm, verdict, c, bg]) => {
    card(s, 0.7, ey, 11.95, 0.78, bg);
    s.addText(id, { x: 0.95, y: ey, w: 3.0, h: 0.78, fontFace: MONO, fontSize: 14, bold: true, color: TXT, valign: "middle", margin: 0 });
    s.addText([{ text: "pLDDT ", options: { color: SUB } }, { text: pl, options: { bold: true, color: "0072B2" } }], { x: 4.0, y: ey, w: 2.6, h: 0.78, fontFace: BF, fontSize: 14, valign: "middle", margin: 0 });
    s.addText([{ text: "RMSD ", options: { color: SUB } }, { text: rm, options: { bold: true, color: TEAL } }], { x: 6.7, y: ey, w: 2.6, h: 0.78, fontFace: BF, fontSize: 14, valign: "middle", margin: 0 });
    s.addText(verdict, { x: 9.5, y: ey, w: 3.0, h: 0.78, fontFace: HF, fontSize: 14, bold: true, color: c, align: "right", valign: "middle", margin: 0 });
    ey += 0.86;
  });
  s.addText("⚠  High pLDDT + high RMSD (design1) = it folded confidently into a DIFFERENT shape. That's why you read both.", { x: 0.7, y: 6.5, w: 12, h: 0.4, fontFace: BF, fontSize: 12.5, italic: true, color: "B5740E", margin: 0 });
  foot(s, 9);
}

// ============ 10. TIPS & GOTCHAS ============
{
  const s = P.addSlide();
  head(s, "Tips & gotchas", "Five things that will save you time");
  const tips = [
    ["Stay small, GPU-free", "Keep proteins ≤ ~80 aa. RFdiffusion is the slow step (and needs a CPU patch on Mac)."],
    ["Sample several, then filter", "Same backbone can give a pass AND a fail. Always make ≥2 sequences and keep the good ones."],
    ["Don't trust one metric", "Read pLDDT + RMSD together. TM-score / pTM are unreliable for ≤30-aa chains."],
    ["Self-consistency ≠ truth", "A pass is an in-silico hypothesis — not proof the protein folds or works in real life."],
    ["Keep your files tidy", "One folder per step; the filenames ARE your lab notebook (seed + model are in the headers)."],
  ];
  const pos = [[0.7, 1.85], [6.85, 1.85], [0.7, 3.45], [6.85, 3.45], [0.7, 5.05]];
  tips.forEach(([t, d], i) => {
    const [x, y] = pos[i];
    card(s, x, y, 5.75, 1.45);
    s.addShape(P.shapes.OVAL, { x: x + 0.25, y: y + 0.4, w: 0.6, h: 0.6, fill: { color: i % 2 ? TEAL : ORANGE } });
    s.addText(String(i + 1), { x: x + 0.25, y: y + 0.4, w: 0.6, h: 0.6, fontFace: HF, fontSize: 21, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: x + 1.02, y: y + 0.17, w: 4.55, h: 0.4, fontFace: HF, fontSize: 15, bold: true, color: INK, margin: 0 });
    s.addText(d, { x: x + 1.02, y: y + 0.58, w: 4.6, h: 0.8, fontFace: BF, fontSize: 12, color: TXT, margin: 0, lineSpacingMultiple: 1.02 });
  });
  // last cell: outcome
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 6.85, y: 5.05, w: 5.75, h: 1.45, rectRadius: 0.07, fill: { color: INK } });
  s.addText("You finish with", { x: 7.1, y: 5.2, w: 5.3, h: 0.35, fontFace: HF, fontSize: 14, bold: true, color: ORANGE, margin: 0 });
  s.addText("predicted .pdb structures + one data_summary.csv — re-run analyze_structures.py and every number regenerates.", { x: 7.1, y: 5.6, w: 5.35, h: 0.85, fontFace: BF, fontSize: 12.5, color: "DDE7EE", margin: 0, lineSpacingMultiple: 1.04 });
  foot(s, 10);
}

// ============ 11. RECAP ============
{
  const s = P.addSlide();
  s.background = { color: INK };
  s.addShape(P.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.16, fill: { color: TEAL } });
  s.addText("ONE-PAGE RECAP", { x: 0.9, y: 0.7, w: 11, h: 0.35, fontFace: HF, fontSize: 13, bold: true, color: ORANGE, charSpacing: 2, margin: 0 });
  s.addText("Follow the files, run the loop", { x: 0.9, y: 1.08, w: 11.5, h: 0.7, fontFace: HF, fontSize: 32, bold: true, color: "FFFFFF", margin: 0 });
  // compact flow
  const steps = [["1  RFdiffusion", "length → backbone", "pdb"], ["2  ProteinMPNN", "backbone → sequence", "fasta"], ["3  ESMFold / AF2", "sequence → structure", "pdb"], ["4  analyze", "structure → verdict", "csv"]];
  let cx = 0.9; const bw = 2.7, by = 2.3;
  steps.forEach(([t, sub, ext], i) => {
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: cx, y: by, w: bw, h: 1.7, rectRadius: 0.08, fill: { color: NAVY2 }, line: { color: TEAL, width: 1.25 } });
    s.addText(t, { x: cx + 0.1, y: by + 0.2, w: bw - 0.2, h: 0.4, fontFace: HF, fontSize: 14.5, bold: true, color: "FFFFFF", align: "center", margin: 0 });
    s.addText(sub, { x: cx + 0.1, y: by + 0.62, w: bw - 0.2, h: 0.5, fontFace: BF, fontSize: 12, color: "BCD0E0", align: "center", margin: 0 });
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: cx + 0.65, y: by + 1.12, w: bw - 1.3, h: 0.42, rectRadius: 0.05, fill: { color: FT[ext] } });
    s.addText("." + ext, { x: cx + 0.65, y: by + 1.12, w: bw - 1.3, h: 0.42, fontFace: BF, fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0 });
    if (i < 3) s.addText("▶", { x: cx + bw - 0.02, y: by, w: 0.42, h: 1.7, fontFace: BF, fontSize: 17, color: ORANGE, align: "center", valign: "middle", margin: 0 });
    cx += bw + 0.4;
  });
  s.addText("The pass rule:  Cα-RMSD < 2 Å  AND  pLDDT > 80  →  self-consistent design", { x: 0.9, y: 4.45, w: 11.6, h: 0.5, fontFace: HF, fontSize: 17, bold: true, color: "FFFFFF", align: "center", margin: 0 });
  s.addText("…and remember: that's an in-silico hypothesis, not a working protein.", { x: 0.9, y: 5.05, w: 11.6, h: 0.4, fontFace: BF, fontSize: 14, italic: true, color: ORANGE, align: "center", margin: 0 });
  s.addText("Everything reproducible from one script · ref_pdb/ → seqs/ → esmfold_out/ + colabfold_native/ → data_summary.csv", { x: 0.9, y: 6.4, w: 11.6, h: 0.4, fontFace: MONO, fontSize: 11.5, color: "7E97AB", align: "center", margin: 0 });
}

P.writeFile({ fileName: "/Users/xiawu/Documents/innovatebio_hackathon/Protein_Design_Student_Guide.pptx" }).then(f => console.log("WROTE", f));
