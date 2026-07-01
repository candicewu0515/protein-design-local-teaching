delete all
load /Users/xiawu/Documents/innovatebio_hackathon/teaching_demo/rfdiff_out_80aa/traj/denovo80_0_pX0_traj_pymol.pdb, denovo80_pX0
hide everything
show cartoon, denovo80_pX0
set all_states, off
spectrum resi, rainbow, denovo80_pX0
set cartoon_fancy_helices, 1
set cartoon_smooth_loops, 1
set ray_opaque_background, off
bg_color white
orient denovo80_pX0
mset 1 x50
mplay
