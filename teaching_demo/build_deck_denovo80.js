// 5-minute tutorial deck — de novo protein design, 80 aa — "Workflow Architect" dark-teal theme.
// Embeds the RFdiffusion denoising-trajectory GIF (autoplays in slideshow).
const pptxgen = require("pptxgenjs");
const P = new pptxgen();
P.layout = "LAYOUT_WIDE";               // 13.33 x 7.5
P.author = "InnovateBio · Track 3";
P.title  = "De novo protein design in 80 amino acids — a 5-minute tutorial";
const W = 13.33, H = 7.5;

// ---- palette (sampled from the Track-3 slide) ----
const BG    = "0B2327";   // deep teal-black background
const PANEL = "0F2E33";   // card fill
const PANEL2= "10353B";   // lighter card
const LINE  = "24474D";   // hairline borders
const ORANGE= "E29A4B";   // kickers, numbers, accents
const CORAL = "E8A87C";   // secondary warm accent
const TEAL  = "4FA69C";   // teal accent (tags, left bar)
const WHITE = "F4F3EE";   // serif titles
const MUTE  = "9BB0B0";   // body / subtitles
const DIM   = "6E8688";   // faint captions
const GREEN = "6FBF8E";   // pass
const SERIF = "Georgia", SANS = "Helvetica", MONO = "Menlo";
// file-type colours
const FT = { pdb: TEAL, fasta: GREEN, json: "8FA0C0", csv: ORANGE, png: CORAL, spec: DIM };
const GIF = "/Users/xiawu/Documents/innovatebio_hackathon/teaching_demo/figures/denovo80_traj.gif";

const shadow = () => ({ type: "outer", color: "000000", blur: 10, offset: 3, angle: 90, opacity: 0.35 });

// header used on every content slide: double left bar + kicker + serif title
function head(s, track, title, sub) {
  s.background = { color: BG };
  s.addShape(P.shapes.RECTANGLE, { x: 0.7, y: 0.5, w: 0.05, h: 0.62, fill: { color: TEAL } });
  s.addShape(P.shapes.RECTANGLE, { x: 0.78, y: 0.5, w: 0.05, h: 0.62, fill: { color: ORANGE } });
  s.addText(track.toUpperCase(), { x: 0.98, y: 0.46, w: 11, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, color: ORANGE, charSpacing: 3, margin: 0 });
  s.addText(title, { x: 0.96, y: 0.72, w: 11.5, h: 0.55, fontFace: SERIF, fontSize: 28, color: WHITE, margin: 0 });
  if (sub) s.addText(sub, { x: 0.98, y: 1.32, w: 11.5, h: 0.4, fontFace: SERIF, italic: true, fontSize: 15, color: MUTE, margin: 0 });
}
function foot(s, n, label) {
  s.addText(label, { x: 0.98, y: H - 0.42, w: 9, h: 0.3, fontFace: SANS, fontSize: 9, color: DIM, margin: 0 });
  s.addText("Track 3 · The Workflow Architect", { x: W - 4.2, y: H - 0.42, w: 3.0, h: 0.3, fontFace: SANS, fontSize: 9, color: DIM, align: "right", margin: 0 });
  s.addText(String(n), { x: W - 1.0, y: H - 0.42, w: 0.4, h: 0.3, fontFace: SANS, fontSize: 9, color: ORANGE, align: "right", margin: 0 });
}
function panel(s, x, y, w, h, fill = PANEL) {
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: LINE, width: 1 }, shadow: shadow() });
}
function pill(s, x, y, ext, w = 1.5) {
  const c = FT[ext] || DIM;
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.4, rectRadius: 0.06, fill: { color: c } });
  s.addText("." + ext, { x, y, w, h: 0.4, fontFace: SANS, fontSize: 12, bold: true, color: BG, align: "center", valign: "middle", margin: 0 });
}
function arrow(s, x, y, h = 0.6) { s.addText("→", { x, y, w: 0.5, h, fontFace: SANS, fontSize: 20, bold: true, color: ORANGE, align: "center", valign: "middle", margin: 0 }); }

// ================= 1. COVER =================
{
  const s = P.addSlide();
  s.background = { color: BG };
  s.addShape(P.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.14, fill: { color: ORANGE } });
  // left bars
  s.addShape(P.shapes.RECTANGLE, { x: 0.9, y: 1.15, w: 0.06, h: 1.15, fill: { color: TEAL } });
  s.addShape(P.shapes.RECTANGLE, { x: 0.99, y: 1.15, w: 0.06, h: 1.15, fill: { color: ORANGE } });
  s.addText("TUTORIAL · 5 MINUTES · RUNS IN YOUR BROWSER", { x: 1.25, y: 1.12, w: 11, h: 0.35, fontFace: SANS, fontSize: 13, bold: true, color: TEAL, charSpacing: 3, margin: 0 });
  s.addText("De novo protein design", { x: 1.2, y: 1.5, w: 11.6, h: 0.9, fontFace: SERIF, fontSize: 46, color: WHITE, margin: 0 });
  s.addText("Invent a protein that does not exist in nature — 80 amino acids, generated then verified in your browser: one free Colab notebook per step, no install, no code.", { x: 1.23, y: 2.55, w: 11.0, h: 0.8, fontFace: SERIF, italic: true, fontSize: 17, color: MUTE, margin: 0, lineSpacingMultiple: 1.05 });
  // pipeline chips
  const items = [["RFdiffusion", "backbone", "pdb"], ["ProteinMPNN", "sequence", "fasta"], ["ESMFold / AF2", "structure", "pdb"], ["analyze", "verdict", "csv"]];
  let cx = 1.2; const y = 3.55, bw = 2.62, bh = 1.5;
  items.forEach(([t, sub, ext], i) => {
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: cx, y, w: bw, h: bh, rectRadius: 0.09, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(String(i + 1).padStart(2, "0"), { x: cx + 0.2, y: y + 0.16, w: 1, h: 0.35, fontFace: SERIF, fontSize: 15, bold: true, color: ORANGE, margin: 0 });
    s.addText(t, { x: cx + 0.2, y: y + 0.5, w: bw - 0.4, h: 0.35, fontFace: SANS, fontSize: 13.5, bold: true, color: WHITE, margin: 0 });
    s.addText(sub, { x: cx + 0.2, y: y + 0.82, w: bw - 0.4, h: 0.3, fontFace: SANS, fontSize: 11, color: MUTE, margin: 0 });
    pill(s, cx + 0.2, y + 1.08, ext, 1.15);
    if (i < 3) arrow(s, cx + bw - 0.04, y, bh);
    cx += bw + 0.3;
  });
  s.addText("Each tool reads one file and writes the next — and each is a free Colab notebook: open it, click Run, no install and no code.", { x: 1.2, y: 5.45, w: 11.4, h: 0.4, fontFace: SANS, fontSize: 14, color: CORAL, margin: 0 });
  s.addText("Worked example:  one 80-residue backbone invented from noise → 4 sequences designed → all 4 verified self-consistent.", { x: 1.2, y: 6.5, w: 11.4, h: 0.4, fontFace: SANS, italic: true, fontSize: 12.5, color: DIM, margin: 0 });
  s.addNotes("[0:00–0:20] Hook. Today we invent a protein from scratch — 80 amino acids that don't exist in nature — and check our own work. Two ideas only: GENERATE a candidate, then VERIFY it. Four tools: RFdiffusion → ProteinMPNN → ESMFold → analyze. The key practical message: every step is a free Colab notebook you run in the browser — no install, no code to write, and a free GPU. I'll show the numbers from a run I did earlier.");
}

// ================= 2. PREDICTIVE vs GENERATIVE =================
{
  const s = P.addSlide();
  head(s, "Background", "Two kinds of protein AI — predict vs generate", "Both models learn from the same molecules — they solve opposite problems.");
  const py = 1.95, ph = 3.7;
  // LEFT — predictive
  panel(s, 0.98, py, 5.7, ph);
  s.addShape(P.shapes.RECTANGLE, { x: 0.98, y: py, w: 5.7, h: 0.1, fill: { color: TEAL } });
  s.addText("PREDICTIVE", { x: 1.22, y: py + 0.24, w: 5.2, h: 0.32, fontFace: SANS, fontSize: 14, bold: true, color: TEAL, charSpacing: 2, margin: 0 });
  s.addText("read what already exists", { x: 1.22, y: py + 0.58, w: 5.2, h: 0.28, fontFace: SANS, italic: true, fontSize: 11.5, color: DIM, margin: 0 });
  s.addText("sequence  →  structure", { x: 1.22, y: py + 0.92, w: 5.2, h: 0.45, fontFace: SERIF, fontSize: 21, color: WHITE, margin: 0 });
  s.addText("“Given this sequence, what shape does it fold into?”", { x: 1.22, y: py + 1.42, w: 5.2, h: 0.4, fontFace: SANS, italic: true, fontSize: 12.5, color: CORAL, margin: 0 });
  s.addText([
    { text: "Finds the ", options: { color: WHITE } }, { text: "one true answer", options: { bold: true, color: WHITE } },
    { text: " nature already settled — the structure is out there to be recovered.", options: { color: WHITE } },
  ], { x: 1.22, y: py + 1.95, w: 5.25, h: 0.8, fontFace: SANS, fontSize: 12, color: WHITE, margin: 0, lineSpacingMultiple: 1.05 });
  ["AlphaFold2", "ESMFold"].forEach((t, i) => {
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 1.22 + i * 1.75, y: py + 2.85, w: 1.6, h: 0.42, rectRadius: 0.06, fill: { color: "0C282D" }, line: { color: TEAL, width: 1 } });
    s.addText(t, { x: 1.22 + i * 1.75, y: py + 2.85, w: 1.6, h: 0.42, fontFace: SANS, fontSize: 12, bold: true, color: TEAL, align: "center", valign: "middle", margin: 0 });
  });
  s.addText("≈ like READING an existing book", { x: 1.22, y: py + 3.34, w: 5.2, h: 0.3, fontFace: SANS, italic: true, fontSize: 11, color: MUTE, margin: 0 });
  // RIGHT — generative
  panel(s, 6.95, py, 5.7, ph);
  s.addShape(P.shapes.RECTANGLE, { x: 6.95, y: py, w: 5.7, h: 0.1, fill: { color: ORANGE } });
  s.addText("GENERATIVE", { x: 7.19, y: py + 0.24, w: 5.2, h: 0.32, fontFace: SANS, fontSize: 14, bold: true, color: ORANGE, charSpacing: 2, margin: 0 });
  s.addText("create what never existed", { x: 7.19, y: py + 0.58, w: 5.2, h: 0.28, fontFace: SANS, italic: true, fontSize: 11.5, color: DIM, margin: 0 });
  s.addText("goal / length  →  new protein", { x: 7.19, y: py + 0.92, w: 5.3, h: 0.45, fontFace: SERIF, fontSize: 21, color: WHITE, margin: 0 });
  s.addText("“Invent me a protein that does something new.”", { x: 7.19, y: py + 1.42, w: 5.2, h: 0.4, fontFace: SANS, italic: true, fontSize: 12.5, color: CORAL, margin: 0 });
  s.addText([
    { text: "There is ", options: { color: WHITE } }, { text: "no single right answer", options: { bold: true, color: WHITE } },
    { text: " — many valid proteins fit the goal. The model invents ones evolution never tried.", options: { color: WHITE } },
  ], { x: 7.19, y: py + 1.95, w: 5.25, h: 0.8, fontFace: SANS, fontSize: 12, color: WHITE, margin: 0, lineSpacingMultiple: 1.05 });
  ["RFdiffusion", "ProteinMPNN"].forEach((t, i) => {
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 7.19 + i * 1.9, y: py + 2.85, w: 1.75, h: 0.42, rectRadius: 0.06, fill: { color: "0C282D" }, line: { color: ORANGE, width: 1 } });
    s.addText(t, { x: 7.19 + i * 1.9, y: py + 2.85, w: 1.75, h: 0.42, fontFace: SANS, fontSize: 12, bold: true, color: ORANGE, align: "center", valign: "middle", margin: 0 });
  });
  s.addText("≈ like WRITING a new book", { x: 7.19, y: py + 3.34, w: 5.2, h: 0.3, fontFace: SANS, italic: true, fontSize: 11, color: MUTE, margin: 0 });
  // bridge callout
  panel(s, 0.98, 5.85, 11.67, 0.82, PANEL2);
  s.addText([
    { text: "This demo uses both:  ", options: { bold: true, color: ORANGE } },
    { text: "generative models ", options: { bold: true, color: ORANGE } },
    { text: "design the protein, then a ", options: { color: WHITE } },
    { text: "predictive model ", options: { bold: true, color: TEAL } },
    { text: "folds it back to check the work.  That pairing is the whole loop.", options: { color: WHITE } },
  ], { x: 1.25, y: 5.85, w: 11.1, h: 0.82, fontFace: SANS, fontSize: 13.5, valign: "middle", margin: 0, lineSpacingMultiple: 1.03 });
  foot(s, 2, "Background · predict vs generate");
  s.addNotes("[0:20–1:05] Ground the audience first. There are two families of protein AI. PREDICTIVE — AlphaFold, ESMFold — takes a sequence and predicts its structure; it's recovering the one answer nature already fixed, like reading an existing book. GENERATIVE — RFdiffusion, ProteinMPNN — goes the other way: you give a goal or just a length and it invents a brand-new protein, like writing a new book; there's no single right answer. The punchline at the bottom: today's loop pairs them — generate a design, then use a predictive model to independently check it.");
}

// ================= 3. WHY DE NOVO =================
{
  const s = P.addSlide();
  head(s, "Why it matters", "Why invent proteins that don't exist yet?", "Evolution explored only a tiny corner of what proteins could be.");
  // left — the space stat
  panel(s, 0.98, 1.95, 5.5, 3.75);
  s.addText("The unexplored space", { x: 1.22, y: 2.1, w: 5.1, h: 0.32, fontFace: SANS, fontSize: 13.5, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "20", options: { color: WHITE, fontSize: 40, bold: true } },
    { text: "100", options: { color: ORANGE, fontSize: 20, bold: true, superscript: true } },
  ], { x: 1.22, y: 2.5, w: 5.1, h: 0.9, fontFace: SERIF, margin: 0 });
  s.addText("possible sequences for a 100-aa protein — more than atoms in the universe.", { x: 1.22, y: 3.35, w: 5.1, h: 0.6, fontFace: SANS, fontSize: 12.5, color: MUTE, margin: 0, lineSpacingMultiple: 1.05 });
  s.addText([
    { text: "Evolution sampled a ", options: { color: WHITE } },
    { text: "vanishing fraction", options: { bold: true, color: CORAL } },
    { text: " of that. De novo design lets us reach the rest — ", options: { color: WHITE } },
    { text: "proteins on purpose, not by accident.", options: { bold: true, color: WHITE } },
  ], { x: 1.22, y: 4.05, w: 5.1, h: 1.1, fontFace: SANS, fontSize: 13, margin: 0, lineSpacingMultiple: 1.08 });
  // right — what for (cards)
  const uses = [
    ["Medicines & binders", "custom proteins that grip a disease target — new drugs, antivirals, diagnostics"],
    ["Enzymes", "catalysts for reactions nature never evolved — greener chemistry, recycling"],
    ["Vaccines & biosensors", "engineered scaffolds that present antigens or detect molecules"],
  ];
  let uy = 1.95;
  uses.forEach(([t, d], i) => {
    panel(s, 6.7, uy, 5.95, 1.0, PANEL);
    s.addShape(P.shapes.OVAL, { x: 6.9, y: uy + 0.28, w: 0.44, h: 0.44, fill: { color: i % 2 ? TEAL : ORANGE } });
    s.addText(String(i + 1), { x: 6.9, y: uy + 0.28, w: 0.44, h: 0.44, fontFace: SERIF, fontSize: 15, bold: true, color: BG, align: "center", valign: "middle", margin: 0 });
    s.addText(t, { x: 7.5, y: uy + 0.12, w: 5.0, h: 0.35, fontFace: SANS, fontSize: 14, bold: true, color: WHITE, margin: 0 });
    s.addText(d, { x: 7.5, y: uy + 0.46, w: 5.0, h: 0.5, fontFace: SANS, fontSize: 11.5, color: MUTE, margin: 0, lineSpacingMultiple: 1.0 });
    uy += 1.12;
  });
  // why now callout
  panel(s, 0.98, 5.85, 11.67, 0.82, "0E2E2A");
  s.addText([
    { text: "Why now:  ", options: { bold: true, color: GREEN } },
    { text: "the 2024 Nobel Prize in Chemistry went to exactly these two ideas — ", options: { color: WHITE } },
    { text: "AlphaFold (predict)", options: { bold: true, color: TEAL } },
    { text: "  and  ", options: { color: WHITE } },
    { text: "de novo design (generate)", options: { bold: true, color: ORANGE } },
    { text: ".  And you can now run both on a laptop before ever touching a wet lab.", options: { color: WHITE } },
  ], { x: 1.25, y: 5.85, w: 11.1, h: 0.82, fontFace: SANS, fontSize: 13, valign: "middle", margin: 0, lineSpacingMultiple: 1.03 });
  foot(s, 3, "Why it matters · de novo design");
  s.addNotes("[1:05–1:50] Motivation — why bother inventing proteins. The number on the left: a 100-residue protein has 20^100 possible sequences, more than atoms in the universe. Evolution only ever tried a vanishing sliver. De novo design lets us reach the rest, and make proteins on purpose instead of waiting for accident. What for — right side: new medicines and binders, novel enzymes for greener chemistry, vaccines and biosensors. Why now, bottom: the 2024 Chemistry Nobel honored exactly this pair — AlphaFold for prediction, de novo design for generation — and the tools are now light enough to run on a laptop. That's what we'll do.");
}

// ================= 4. THE IDEA =================
{
  const s = P.addSlide();
  head(s, "The idea", "Generate → Verify: the whole loop is files flowing between tools", "Redesign copies an existing fold; de novo invents a brand-new one from just a length.");
  const y = 2.2, bw = 2.7, bh = 1.7;
  const stages = [
    { t: "RFdiffusion", sub: "invent a backbone", ext: "pdb", note: "⏱ ~1–2 min" },
    { t: "ProteinMPNN", sub: "design a sequence", ext: "fasta", note: "⏱ ~1 s" },
    { t: "ESMFold / AF2", sub: "fold it back", ext: "pdb", note: "⏱ ~15 s / ~5 min" },
    { t: "analyze", sub: "score & decide", ext: "csv", note: "⏱ instant" },
  ];
  let cx = 0.98;
  stages.forEach((st, i) => {
    panel(s, cx, y, bw, bh);
    s.addShape(P.shapes.RECTANGLE, { x: cx, y, w: bw, h: 0.09, fill: { color: FT[st.ext] } });
    s.addText(st.t, { x: cx + 0.15, y: y + 0.24, w: bw - 0.3, h: 0.4, fontFace: SANS, fontSize: 15, bold: true, color: WHITE, align: "center", margin: 0 });
    s.addText(st.sub, { x: cx + 0.15, y: y + 0.66, w: bw - 0.3, h: 0.32, fontFace: SANS, fontSize: 12, color: MUTE, align: "center", margin: 0 });
    pill(s, cx + bw / 2 - 0.75, y + 1.06, st.ext, 1.5);
    s.addText(st.note, { x: cx + 0.15, y: y + 1.46, w: bw - 0.3, h: 0.24, fontFace: SANS, italic: true, fontSize: 10.5, color: DIM, align: "center", margin: 0 });
    if (i < 3) arrow(s, cx + bw - 0.02, y, bh);
    cx += bw + 0.34;
  });
  // verify idea callout
  panel(s, 0.98, 4.35, 11.67, 1.05, PANEL2);
  s.addText([
    { text: "The trick:  ", options: { bold: true, color: ORANGE } },
    { text: "nothing outside told us the design is good.  We fold the sequence back independently and check it lands on the shape we generated — ", options: { color: WHITE } },
    { text: "agreement = a self-consistent design.", options: { bold: true, color: CORAL } },
  ], { x: 1.25, y: 4.35, w: 11.1, h: 1.05, fontFace: SANS, fontSize: 14, valign: "middle", margin: 0, lineSpacingMultiple: 1.05 });
  // "run it the easy way" — Colab band with runtimes
  s.addText([
    { text: "▶ HOW YOU RUN IT — ", options: { bold: true, color: ORANGE } },
    { text: "one free Colab notebook per step: no install, no code. Turn on the GPU once (Runtime → Change runtime type → T4). Times below are on that free GPU.", options: { color: MUTE } },
  ], { x: 0.98, y: 5.62, w: 11.67, h: 0.3, fontFace: SANS, fontSize: 12, margin: 0 });
  const colabs = [
    ["RFdiffusion", "~1–2 min", "https://colab.research.google.com/github/sokrypton/ColabDesign/blob/main/rf/examples/diffusion.ipynb"],
    ["ProteinMPNN", "~1 s", "https://colab.research.google.com/github/dauparas/ProteinMPNN/blob/main/colab_notebooks/quickdemo.ipynb"],
    ["ESMFold", "~15 s", "https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/ESMFold.ipynb"],
    ["AlphaFold2 (ColabFold)", "~5 min", "https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb"],
  ];
  let clx = 0.98; const cbw = 2.85;
  colabs.forEach(([name, rt, url]) => {
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: clx, y: 6.0, w: cbw, h: 0.62, rectRadius: 0.06, fill: { color: PANEL }, line: { color: TEAL, width: 1 } });
    s.addText([
      { text: name + "\n", options: { bold: true, color: TEAL, fontSize: 11, breakLine: true, hyperlink: { url } } },
      { text: "Colab · " + rt, options: { color: MUTE, fontSize: 9.5 } },
    ], { x: clx + 0.12, y: 6.0, w: cbw - 0.2, h: 0.62, fontFace: SANS, valign: "middle", margin: 0, lineSpacingMultiple: 0.95 });
    clx += cbw + 0.09;
  });
  foot(s, 4, "Generate → verify · all in the browser on Colab");
  s.addNotes("[1:50–2:20] The map. Four boxes, left to right. RFdiffusion invents a 3D backbone — shape only, no sequence. ProteinMPNN reads that shape and writes amino-acid sequences that should fold into it — inverse folding. ESMFold folds each sequence back, completely independently. analyze applies the pass rule. Practical note for students, bottom band: you do NOT have to install anything — every tool has a free, official Colab notebook you run in the browser. Typical times on Colab's free GPU: RFdiffusion 1–2 min, ProteinMPNN about a second, ESMFold ~15 s, AlphaFold2 a few minutes (it also builds an MSA). The links are live in this slide.");
}

// ================= 3. STEP 1 — RFdiffusion + GIF =================
{
  const s = P.addSlide();
  head(s, "Step 1 · generate", "RFdiffusion — invent an 80-aa backbone from noise");
  // left: explanation + command
  panel(s, 0.98, 2.0, 5.7, 2.35);
  s.addText("What it does", { x: 1.2, y: 2.14, w: 5.3, h: 0.32, fontFace: SANS, fontSize: 13.5, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "Starts from ", options: { color: WHITE } }, { text: "random noise", options: { bold: true, color: CORAL } },
    { text: " and, over ", options: { color: WHITE } }, { text: "50 denoising steps", options: { bold: true, color: WHITE } },
    { text: ", sculpts a 3-D backbone. You specify ", options: { color: WHITE } },
    { text: "only the length", options: { bold: true, color: WHITE } },
    { text: " — the shape is invented. No sequence yet.", options: { color: WHITE } },
  ], { x: 1.2, y: 2.5, w: 5.3, h: 1.1, fontFace: SANS, fontSize: 13, color: WHITE, margin: 0, lineSpacingMultiple: 1.06 });
  s.addText("⏱  ~1–2 min on Colab's free T4 GPU · the heaviest step", { x: 1.2, y: 3.9, w: 5.3, h: 0.3, fontFace: SANS, italic: true, fontSize: 11, color: DIM, margin: 0 });
  // Colab steps (no code)
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 0.98, y: 4.4, w: 5.7, h: 1.7, rectRadius: 0.06, fill: { color: "071A1D" }, line: { color: TEAL, width: 1 } });
  s.addText("In the RFdiffusion Colab — just fill the form:", { x: 1.18, y: 4.5, w: 5.35, h: 0.3, fontFace: SANS, fontSize: 11.5, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "①  Runtime → Change runtime type → ", options: { color: "DDE7EE" } }, { text: "T4 GPU\n", options: { bold: true, color: WHITE, breakLine: true } },
    { text: "②  contigs = ", options: { color: "DDE7EE" } }, { text: "[80-80]", options: { bold: true, color: CORAL } }, { text: " · num_designs = ", options: { color: "DDE7EE" } }, { text: "1\n", options: { bold: true, color: CORAL, breakLine: true } },
    { text: "③  press ", options: { color: "DDE7EE" } }, { text: "Run", options: { bold: true, color: WHITE } }, { text: " — no code to write", options: { color: "DDE7EE" } },
  ], { x: 1.18, y: 4.82, w: 5.35, h: 1.0, fontFace: SANS, fontSize: 11.5, valign: "top", margin: 0, lineSpacingMultiple: 1.25 });
  s.addText("→ downloads denovo80_0.pdb  +  the 50-step trajectory (the GIF)", { x: 1.2, y: 5.82, w: 5.4, h: 0.3, fontFace: SANS, italic: true, fontSize: 10, color: MUTE, margin: 0 });
  // right: the GIF (autoplays in slideshow)
  panel(s, 6.95, 2.0, 5.7, 4.55, "071A1D");
  s.addImage({ path: GIF, x: 7.05, y: 2.1, w: 4.35, h: 4.35 });
  s.addText([
    { text: "watch it fold\n", options: { bold: true, color: ORANGE, fontSize: 15, breakLine: true } },
    { text: "confidence (pLDDT)\n", options: { color: MUTE, fontSize: 12, breakLine: true } },
    { text: "11  →  94", options: { bold: true, color: CORAL, fontSize: 22 } },
  ], { x: 11.35, y: 3.4, w: 1.25, h: 1.6, fontFace: SANS, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 1.05 });
  s.addText("▶ GIF · plays automatically in slideshow", { x: 11.32, y: 5.9, w: 1.3, h: 0.5, fontFace: SANS, italic: true, fontSize: 9.5, color: DIM, align: "center", margin: 0 });
  foot(s, 5, "Step 1 · RFdiffusion");
  s.addNotes("[2:20–3:05] The money shot — press play. This GIF is the actual RFdiffusion trajectory for our 80-aa design, 50 steps. Left it's a loose, extended chain; watch it collapse into a compact fold. The bar at the bottom is the model's own confidence — pLDDT climbs from 11 to 94 as the shape settles. In the Colab you set just one field — contigs = [80-80] — pick the T4 GPU, and click Run; out comes this backbone plus the trajectory. Note: this GIF autoplays in Slideshow mode — it won't move in edit view.");
}

// ================= 4. STEP 2 — ProteinMPNN =================
{
  const s = P.addSlide();
  head(s, "Step 2 · generate", "ProteinMPNN — design sequences for that backbone");
  panel(s, 0.98, 2.0, 5.5, 4.1);
  s.addText("What it does", { x: 1.2, y: 2.14, w: 5.1, h: 0.32, fontFace: SANS, fontSize: 13.5, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "Reads the backbone shape and writes amino-acid ", options: { color: WHITE } },
    { text: "sequences that should fold into it", options: { bold: true, color: CORAL } },
    { text: " — “inverse folding.” Generation is random, so ask for several.", options: { color: WHITE } },
  ], { x: 1.2, y: 2.5, w: 5.1, h: 1.0, fontFace: SANS, fontSize: 13, color: WHITE, margin: 0, lineSpacingMultiple: 1.06 });
  s.addText([
    { text: "seq_recovery ≈ 2.5%", options: { bold: true, color: ORANGE } },
    { text: "  — expected here: the backbone was invented, so there is no 'true' sequence to recover. We are designing from scratch.", options: { color: MUTE } },
  ], { x: 1.2, y: 3.6, w: 5.1, h: 1.0, fontFace: SANS, fontSize: 12, margin: 0, lineSpacingMultiple: 1.05 });
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 1.2, y: 4.62, w: 5.1, h: 1.46, rectRadius: 0.06, fill: { color: "071A1D" }, line: { color: TEAL, width: 1 } });
  s.addText("In the ProteinMPNN Colab — no code:", { x: 1.38, y: 4.72, w: 4.8, h: 0.3, fontFace: SANS, fontSize: 11.5, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "①  upload the backbone ", options: { color: "DDE7EE" } }, { text: "denovo80_0.pdb\n", options: { bold: true, color: CORAL, breakLine: true } },
    { text: "②  sequences = ", options: { color: "DDE7EE" } }, { text: "4", options: { bold: true, color: CORAL } }, { text: " · temperature = ", options: { color: "DDE7EE" } }, { text: "0.1\n", options: { bold: true, color: CORAL, breakLine: true } },
    { text: "③  press ", options: { color: "DDE7EE" } }, { text: "Run", options: { bold: true, color: WHITE } }, { text: "  ·  ~1 s", options: { color: "DDE7EE" } },
  ], { x: 1.38, y: 5.02, w: 4.8, h: 1.0, fontFace: SANS, fontSize: 11.5, valign: "top", margin: 0, lineSpacingMultiple: 1.18 });
  // right: sequences table
  panel(s, 6.7, 2.0, 5.95, 4.1);
  s.addText("4 sequences · length 80 · model v_48_020 · seed 37", { x: 6.95, y: 2.14, w: 5.5, h: 0.32, fontFace: SANS, fontSize: 12, bold: true, color: TEAL, margin: 0 });
  const seqs = [
    ["#1", "1.14", "NVLEKIDLDLPVEEIVEKIFKLCKEEGLSLEEFKKILEEV…"],
    ["#2", "1.10", "SILDKINLNDPVKKIVKKIKELCEKEGKSLEEMREIYNKF…"],
    ["#3", "1.07", "NILEEIDLNDPVEKLVEKIFELCKEKGLSLEEMKEIWEEV…"],
    ["#4", "1.16", "SVLEKIDLDLPVEEIVDKIFELCEEAGLSDEEMVEIAKKF…"],
  ];
  let ry = 2.6;
  s.addText("SEQ", { x: 6.95, y: ry, w: 0.7, h: 0.3, fontFace: SANS, fontSize: 10, bold: true, color: DIM, margin: 0 });
  s.addText("SCORE↓", { x: 7.55, y: ry, w: 1.0, h: 0.3, fontFace: SANS, fontSize: 10, bold: true, color: DIM, margin: 0 });
  s.addText("DESIGNED SEQUENCE (first 40 aa)", { x: 8.55, y: ry, w: 4.0, h: 0.3, fontFace: SANS, fontSize: 10, bold: true, color: DIM, margin: 0 });
  ry += 0.38;
  seqs.forEach(([id, sc, seq], i) => {
    const best = i === 2;
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 6.9, y: ry, w: 5.55, h: 0.62, rectRadius: 0.04, fill: { color: best ? "10353B" : "0C282D" }, line: { color: best ? GREEN : LINE, width: best ? 1.25 : 0.75 } });
    s.addText(id, { x: 7.0, y: ry, w: 0.6, h: 0.62, fontFace: SANS, fontSize: 13, bold: true, color: best ? GREEN : WHITE, valign: "middle", margin: 0 });
    s.addText(sc, { x: 7.6, y: ry, w: 0.9, h: 0.62, fontFace: MONO, fontSize: 12, color: best ? GREEN : MUTE, valign: "middle", margin: 0 });
    s.addText(seq, { x: 8.55, y: ry, w: 3.85, h: 0.62, fontFace: MONO, fontSize: 8.5, color: CORAL, valign: "middle", margin: 0 });
    if (best) s.addText("best", { x: 11.75, y: ry, w: 0.65, h: 0.62, fontFace: SANS, fontSize: 9.5, bold: true, color: GREEN, align: "right", valign: "middle", margin: 0 });
    ry += 0.7;
  });
  s.addText("Lower score = the model is more comfortable with that sequence on this backbone.", { x: 6.95, y: ry + 0.02, w: 5.5, h: 0.4, fontFace: SANS, italic: true, fontSize: 10.5, color: DIM, margin: 0 });
  foot(s, 6, "Step 2 · ProteinMPNN");
  s.addNotes("[3:05–3:40] Now the backbone gets a sequence. ProteinMPNN reads the shape and proposes amino-acid strings that should fold into it. We asked for four; each is 80 residues. The score column — lower is better — is the model's comfort; sequence #3 wins here. One honest caveat: seq_recovery is ~2.5%, and that's exactly right — the backbone was invented, there's no natural sequence to 'recover.' We're designing from a blank slate. Because sampling is random, always make several and filter.");
}

// ================= 5. STEP 3 & 4 — VERIFY + RUBRIC =================
{
  const s = P.addSlide();
  head(s, "Step 3 + 4 · verify & decide", "Fold it back, then apply one pass rule");
  // left: verify concept
  panel(s, 0.98, 2.0, 5.85, 4.1);
  s.addText("ESMFold / AlphaFold2 — the independent check", { x: 1.2, y: 2.14, w: 5.45, h: 0.32, fontFace: SANS, fontSize: 13, bold: true, color: TEAL, margin: 0 });
  s.addText([
    { text: "Predict the 3-D structure of each designed sequence, then ", options: { color: WHITE } },
    { text: "superpose it on the backbone we generated", options: { bold: true, color: CORAL } },
    { text: ".  In the ESMFold Colab it takes ~15 s; AlphaFold2 (ColabFold) is more accurate but a few minutes (it also builds an MSA).", options: { color: WHITE } },
  ], { x: 1.2, y: 2.5, w: 5.45, h: 1.2, fontFace: SANS, fontSize: 12.5, color: WHITE, margin: 0, lineSpacingMultiple: 1.06 });
  s.addText("Two numbers you read together", { x: 1.2, y: 3.8, w: 5.45, h: 0.3, fontFace: SANS, fontSize: 12.5, bold: true, color: ORANGE, margin: 0 });
  s.addText([
    { text: "pLDDT", options: { bold: true, color: "8FB8D8" } },
    { text: "  — the model's confidence in its OWN prediction (0–100).\n", options: { color: MUTE, breakLine: true } },
    { text: "Cα-RMSD", options: { bold: true, color: TEAL } },
    { text: "  — distance to the target shape, in Å. Lower = closer.", options: { color: MUTE } },
  ], { x: 1.2, y: 4.2, w: 5.45, h: 1.2, fontFace: SANS, fontSize: 12, margin: 0, lineSpacingMultiple: 1.15 });
  s.addText("⚠  High confidence + high RMSD = confidently folded into the WRONG shape. Read both.", { x: 1.2, y: 5.55, w: 5.45, h: 0.5, fontFace: SANS, italic: true, fontSize: 11, color: CORAL, margin: 0, lineSpacingMultiple: 1.05 });
  // right top: the pass rule
  panel(s, 7.05, 2.0, 5.6, 1.5, "0E332B");
  s.addShape(P.shapes.RECTANGLE, { x: 7.05, y: 2.0, w: 0.08, h: 1.5, fill: { color: GREEN } });
  s.addText("THE PASS RULE", { x: 7.35, y: 2.13, w: 5.1, h: 0.3, fontFace: SANS, fontSize: 11.5, bold: true, color: GREEN, charSpacing: 2, margin: 0 });
  s.addText([
    { text: "self-consistent", options: { bold: true, color: WHITE, fontSize: 17 } },
    { text: "  if   ", options: { color: MUTE, fontSize: 13 } },
    { text: "Cα-RMSD < 2 Å", options: { bold: true, color: TEAL, fontSize: 15 } },
    { text: "  AND  ", options: { color: MUTE, fontSize: 12 } },
    { text: "pLDDT > 80", options: { bold: true, color: "8FB8D8", fontSize: 15 } },
  ], { x: 7.35, y: 2.5, w: 5.15, h: 0.55, fontFace: SERIF, valign: "middle", margin: 0 });
  s.addText("Fold each sequence back with ESMFold, superpose on our backbone.", { x: 7.35, y: 3.06, w: 5.1, h: 0.3, fontFace: SANS, italic: true, fontSize: 10.5, color: DIM, margin: 0 });
  // right bottom: ONE hero result (ProteinMPNN's top pick, folded back)
  panel(s, 7.05, 3.65, 5.6, 2.45, PANEL2);
  s.addText("RESULT — fold ProteinMPNN's best design back", { x: 7.3, y: 3.78, w: 5.15, h: 0.3, fontFace: SANS, fontSize: 12.5, bold: true, color: WHITE, margin: 0 });
  // hero card
  s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: 7.3, y: 4.15, w: 5.1, h: 1.35, rectRadius: 0.06, fill: { color: "10353B" }, line: { color: GREEN, width: 1.4 } });
  s.addText([
    { text: "design #3", options: { bold: true, color: WHITE, fontSize: 14 } },
    { text: "   ProteinMPNN's top-scoring sequence", options: { color: MUTE, fontSize: 10.5 } },
  ], { x: 7.5, y: 4.28, w: 4.8, h: 0.3, fontFace: SANS, margin: 0 });
  s.addText([
    { text: "89.3", options: { bold: true, color: "8FB8D8", fontSize: 26 } },
    { text: "\npLDDT", options: { color: MUTE, fontSize: 10 } },
  ], { x: 7.55, y: 4.62, w: 1.7, h: 0.75, fontFace: MONO, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 0.9 });
  s.addText([
    { text: "0.69 Å", options: { bold: true, color: TEAL, fontSize: 26 } },
    { text: "\nCα-RMSD", options: { color: MUTE, fontSize: 10 } },
  ], { x: 9.2, y: 4.62, w: 1.9, h: 0.75, fontFace: MONO, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 0.9 });
  s.addText([
    { text: "✓", options: { color: GREEN, fontSize: 22, bold: true } },
    { text: "\nself-\nconsistent", options: { color: GREEN, fontSize: 10.5, bold: true } },
  ], { x: 11.1, y: 4.58, w: 1.2, h: 0.85, fontFace: SANS, align: "center", valign: "middle", margin: 0, lineSpacingMultiple: 0.9 });
  s.addText("< 2 Å  and  > 80  →  pass.   (For time we show one — all 4 designs pass, 4/4.)", { x: 7.3, y: 5.62, w: 5.15, h: 0.4, fontFace: SANS, italic: true, fontSize: 10.5, color: DIM, margin: 0 });
  foot(s, 7, "Step 3 + 4 · verify & decide");
  s.addNotes("[3:40–4:25] Verify — the payoff, and note this step IS the predictive model doing its job. We take the sequence ProteinMPNN liked best — design #3 — and fold it back with ESMFold, completely independent of how we made it, then superpose on our RFdiffusion backbone. Two numbers together: pLDDT 89.3 (the model's confidence in itself) and Cα-RMSD 0.69 Å (distance to our target shape). Both clear the bar — under 2 Å and over 80 — so it's self-consistent. Watch the trap from the left: high confidence with high RMSD would mean confidently folded into the wrong shape, so you always read both. For time I'm showing just this one; for the record all four designs pass, 4 out of 4.");
}

// ================= 6. RECAP =================
{
  const s = P.addSlide();
  s.background = { color: BG };
  s.addShape(P.shapes.RECTANGLE, { x: 0, y: 0, w: W, h: 0.14, fill: { color: TEAL } });
  s.addShape(P.shapes.RECTANGLE, { x: 0.9, y: 0.7, w: 0.06, h: 0.95, fill: { color: TEAL } });
  s.addShape(P.shapes.RECTANGLE, { x: 0.99, y: 0.7, w: 0.06, h: 0.95, fill: { color: ORANGE } });
  s.addText("RECAP", { x: 1.25, y: 0.66, w: 11, h: 0.3, fontFace: SANS, fontSize: 13, bold: true, color: ORANGE, charSpacing: 3, margin: 0 });
  s.addText("Follow the files, run the loop", { x: 1.2, y: 0.96, w: 11.5, h: 0.7, fontFace: SERIF, fontSize: 34, color: WHITE, margin: 0 });
  const steps = [["01  RFdiffusion", "length → backbone", "pdb"], ["02  ProteinMPNN", "backbone → sequence", "fasta"], ["03  ESMFold / AF2", "sequence → structure", "pdb"], ["04  analyze", "structure → verdict", "csv"]];
  let cx = 1.2; const by = 2.4, bw = 2.62, bh = 1.75;
  steps.forEach(([t, sub, ext], i) => {
    s.addShape(P.shapes.ROUNDED_RECTANGLE, { x: cx, y: by, w: bw, h: bh, rectRadius: 0.09, fill: { color: PANEL }, line: { color: LINE, width: 1 } });
    s.addText(t, { x: cx + 0.18, y: by + 0.24, w: bw - 0.3, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: WHITE, margin: 0 });
    s.addText(sub, { x: cx + 0.18, y: by + 0.72, w: bw - 0.3, h: 0.5, fontFace: SANS, fontSize: 11.5, color: MUTE, margin: 0 });
    pill(s, cx + 0.18, by + 1.2, ext, 1.15);
    if (i < 3) arrow(s, cx + bw - 0.04, by, bh);
    cx += bw + 0.3;
  });
  s.addText([
    { text: "The pass rule:   ", options: { color: MUTE } },
    { text: "Cα-RMSD < 2 Å   AND   pLDDT > 80", options: { bold: true, color: WHITE } },
    { text: "   →   self-consistent design", options: { bold: true, color: GREEN } },
  ], { x: 1.2, y: 4.6, w: 11.5, h: 0.5, fontFace: SANS, fontSize: 17, align: "center", margin: 0 });
  s.addText("…and remember: a pass is an in-silico hypothesis — not proof the protein folds or works in real life.", { x: 1.2, y: 5.25, w: 11.5, h: 0.4, fontFace: SERIF, italic: true, fontSize: 14, color: CORAL, align: "center", margin: 0 });
  s.addText("Try it yourself — a free Colab notebook per step, no install:  RFdiffusion → ProteinMPNN → ESMFold → analyze   ·   our run: 4/4 self-consistent", { x: 1.2, y: 6.5, w: 11.5, h: 0.4, fontFace: SANS, fontSize: 11.5, color: DIM, align: "center", margin: 0 });
  s.addNotes("[4:25–5:00] Recap and land it. Four boxes, one arrow of files: length → backbone → sequence → structure → verdict. One rule to remember: RMSD under 2 and pLDDT over 80 is self-consistent. The honesty line — this is an in-silico hypothesis, not a working protein; the wet lab is the real test. And the takeaway for the students: none of this needs a local install or a line of code — every step is a free Colab notebook in the browser, and our run passed 4 out of 4. Questions?");
}

// ================= 9. RESOURCES — the four Colab links =================
{
  const s = P.addSlide();
  head(s, "Resources", "Open these — one free Colab notebook per step", "No install. Turn on the free GPU once: Runtime → Change runtime type → T4.");
  const DIR = "/Users/xiawu/Documents/innovatebio_hackathon/teaching_demo/figures/";
  const links = [
    ["01", "RFdiffusion", "generate the backbone · ~1–2 min", "colab.research.google.com/github/sokrypton/ColabDesign/blob/main/rf/examples/diffusion.ipynb", "https://colab.research.google.com/github/sokrypton/ColabDesign/blob/main/rf/examples/diffusion.ipynb", DIR + "qr_rfdiffusion.png"],
    ["02", "ProteinMPNN", "design the sequence · ~1 s", "colab.research.google.com/github/dauparas/ProteinMPNN/blob/main/colab_notebooks/quickdemo.ipynb", "https://colab.research.google.com/github/dauparas/ProteinMPNN/blob/main/colab_notebooks/quickdemo.ipynb", DIR + "qr_proteinmpnn.png"],
    ["03", "ESMFold", "verify — fast · ~15 s", "colab.research.google.com/github/sokrypton/ColabFold/blob/main/ESMFold.ipynb", "https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/ESMFold.ipynb", DIR + "qr_esmfold.png"],
    ["04", "AlphaFold2 (ColabFold)", "verify — accurate · ~5 min", "colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb", "https://colab.research.google.com/github/sokrypton/ColabFold/blob/main/AlphaFold2.ipynb", DIR + "qr_alphafold2.png"],
  ];
  let ry = 1.95; const rh = 1.05;
  links.forEach(([n, tool, role, disp, url, qr]) => {
    panel(s, 0.98, ry, 11.67, rh - 0.1);
    s.addText(n, { x: 1.2, y: ry, w: 0.6, h: rh - 0.1, fontFace: SERIF, fontSize: 20, bold: true, color: ORANGE, valign: "middle", margin: 0 });
    s.addText([
      { text: tool, options: { bold: true, color: WHITE, fontSize: 15 } },
      { text: "   " + role, options: { color: MUTE, fontSize: 11.5 } },
    ], { x: 1.85, y: ry + 0.16, w: 9.0, h: 0.35, fontFace: SANS, margin: 0 });
    s.addText(disp, { x: 1.85, y: ry + 0.54, w: 9.2, h: 0.32, fontFace: MONO, fontSize: 10, color: TEAL, valign: "middle", margin: 0, hyperlink: { url, tooltip: "Open in Colab" } });
    s.addImage({ path: qr, x: 11.55, y: ry + 0.05, w: rh - 0.2, h: rh - 0.2 });
    ry += rh;
  });
  s.addText("▶ Scan a QR or click a link — the notebook opens in your browser, ready to run.", { x: 0.98, y: 6.28, w: 11.67, h: 0.3, fontFace: SANS, italic: true, fontSize: 11.5, color: CORAL, margin: 0 });
  s.addText([
    { text: "📖 Full step-by-step manual", options: { bold: true, color: ORANGE } },
    { text: "  (every parameter explained + our 80-aa values):  ", options: { color: MUTE } },
    { text: "teaching_demo/DE_NOVO_COLAB_MANUAL.md", options: { color: TEAL, fontFace: MONO } },
  ], { x: 0.98, y: 6.62, w: 11.67, h: 0.3, fontFace: SANS, fontSize: 11.5, margin: 0 });
  foot(s, 9, "Resources · run it yourself");
  s.addNotes("Leave-up / backup slide. The four notebooks, in order: RFdiffusion to generate the backbone, ProteinMPNN to design the sequence, then ESMFold (fast) or AlphaFold2/ColabFold (more accurate) to verify. Every link is clickable and each has a QR code students can scan from the projected slide. Reminder: switch the runtime to the free T4 GPU first.");
}

P.writeFile({ fileName: "/Users/xiawu/Documents/innovatebio_hackathon/De_novo_80aa_Tutorial.pptx" }).then(f => console.log("WROTE", f));
