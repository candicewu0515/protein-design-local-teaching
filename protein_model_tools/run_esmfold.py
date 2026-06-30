#!/usr/bin/env python3
"""Run ESMFold through Hugging Face Transformers and write one PDB per FASTA record."""

from __future__ import annotations

import argparse
from pathlib import Path

import torch
from transformers import AutoTokenizer, EsmForProteinFolding


def read_fasta(path: Path) -> list[tuple[str, str]]:
    records: list[tuple[str, str]] = []
    name: str | None = None
    chunks: list[str] = []
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line:
            continue
        if line.startswith(">"):
            if name and chunks:
                records.append((name, "".join(chunks)))
            name = line[1:].split()[0] or f"seq{len(records) + 1}"
            chunks = []
        else:
            chunks.append(line)
    if name and chunks:
        records.append((name, "".join(chunks)))
    if not records:
        raise SystemExit(f"No FASTA records found in {path}")
    return records


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("fasta", type=Path)
    parser.add_argument("-o", "--outdir", type=Path, default=Path("esmfold_outputs"))
    parser.add_argument("--model", default="facebook/esmfold_v1")
    args = parser.parse_args()

    args.outdir.mkdir(parents=True, exist_ok=True)
    device = "mps" if torch.backends.mps.is_available() else "cpu"

    tokenizer = AutoTokenizer.from_pretrained(args.model)
    model = EsmForProteinFolding.from_pretrained(args.model, low_cpu_mem_usage=True)
    model = model.to(device).eval()

    for name, sequence in read_fasta(args.fasta):
        inputs = tokenizer([sequence], return_tensors="pt", add_special_tokens=False)
        inputs = {key: value.to(device) for key, value in inputs.items()}
        with torch.no_grad():
            output = model.infer_pdb(sequence)
        out_path = args.outdir / f"{name}.pdb"
        out_path.write_text(output)
        print(out_path)


if __name__ == "__main__":
    main()
