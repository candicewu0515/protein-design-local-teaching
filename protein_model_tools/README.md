# Protein Model Tools

Installed on this Mac for comparing:

- ESMFold
- LocalColabFold / AlphaFold
- RFdiffusion

## ESMFold

Installed in:

```bash
/Users/xiawu/Documents/innovatebio_hackathon/envs/esmfold
```

Run:

```bash
/Users/xiawu/Documents/innovatebio_hackathon/protein_model_tools/run_esmfold.sh input.fasta -o esmfold_outputs
```

The first real run downloads `facebook/esmfold_v1` weights into the project cache.

## LocalColabFold / AlphaFold

Installed in:

```bash
/Users/xiawu/Documents/innovatebio_hackathon/protein_model_tools/localcolabfold/.pixi/envs/default
```

Run:

```bash
/Users/xiawu/Documents/innovatebio_hackathon/protein_model_tools/run_colabfold.sh input.fasta colabfold_outputs
```

On Apple Silicon this is CPU/Metal-limited and much slower than Linux with NVIDIA GPU. The first real prediction downloads AlphaFold parameters automatically.

## RFdiffusion

Code and weights are installed in:

```bash
/Users/xiawu/Documents/innovatebio_hackathon/protein_model_tools/RFdiffusion
/Users/xiawu/Documents/innovatebio_hackathon/protein_model_tools/RFdiffusion/models
```

Seven official RFdiffusion weights are downloaded:

- `Base_ckpt.pt`
- `Complex_base_ckpt.pt`
- `Complex_Fold_base_ckpt.pt`
- `InpaintSeq_ckpt.pt`
- `InpaintSeq_Fold_ckpt.pt`
- `ActiveSite_ckpt.pt`
- `Base_epoch8_ckpt.pt`

Run wrapper:

```bash
/Users/xiawu/Documents/innovatebio_hackathon/protein_model_tools/run_rfdiffusion.sh 'contigmap.contigs=[100-100]' inference.output_prefix=test_outputs/test inference.num_designs=1 inference.model_directory_path=models
```

Important: RFdiffusion officially targets Linux with NVIDIA CUDA and DGL CUDA. This Mac install can import packages and start the Hydra CLI, but serious inference should be run on a CUDA workstation, HPC node, or the official Docker image.

## Verification Performed

- ESMFold: `EsmForProteinFolding` imports successfully.
- LocalColabFold: `colabfold_batch --help` works.
- RFdiffusion: `scripts/run_inference.py --help` works after setting `DGLBACKEND=pytorch`.

## Notes

This project uses local caches under:

```bash
/Users/xiawu/Documents/innovatebio_hackathon/protein_model_tools/.cache
```

That avoids permission issues with user-home cache directories in this environment.
