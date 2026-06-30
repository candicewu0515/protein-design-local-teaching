# 投稿配套笔记(不进正文)— BAMBEd "An Idea to Explore"

> 这个文件是给你自己用的:pitch 模板、投稿清单、以及正文里**唯一还需要你填的真实数据**。正文文件 `BAMBEd_Idea_to_Explore_draft.md` 已是干净英文稿,不含任何占位符散落在行间。

## 1. Table 1 / Table 2 — 已用你的真实数据填好

- **Table 1(工具×算力)**:已做成 markdown 表插入正文。
- **Table 2(worked-example 结果)**:已用 `teaching_demo/data_summary.csv` 的真实输出填入(8 个 redesign + 2 个 de novo,含 pLDDT / Cα RMSD / self-consistent·borderline 判定 + 原生 sanity-check 数字)。**全部为你本地实测,无任何网络数据。**

> 注:正文 Table 2 的 RMSD 用的是你 CSV 里的 `CA_RMSD_A`(Cα RMSD,Kabsch);verdict 用你的 `self-consistent / borderline` 两档。若你之后重跑数据有变,改 CSV 后把新数字发我即可同步。

## 2. 投稿前清单(BAMBEd / Idea to Explore)

- [ ] 标题已以 `An Idea to Explore:` 开头 ✅(已符合)
- [x] 正文 ≤ 4000 词 ✅(当前 2,841,不含参考)
- [x] Table 1 / Table 2 已用真实数据填好
- [ ] 作者信息:姓名、单位、ORCID、通讯作者 + 邮箱
- [x] **参考文献 6、7 作者名单已补全核实**(ref 6: Chungyoun M, Au G, Carpentier B, Puvada S, Thomas C, Gray JJ;ref 7: Teufel AI, Liberles DA, J Microbiol Biol Educ 2026;27:e00331-25)
- [ ] 参考文献 6 若 arXiv 版日后正式发表,替换为 peer-reviewed 版
- [ ] 参考文献格式转成 BAMBEd/Wiley 要求的样式(投稿系统里确认是数字上标还是其他)
- [ ] **强烈建议(非确认的硬性规定)**:投稿前先给主编发下面的 pitch 邮件,问选题是否 of interest。当前主编是谁请在期刊主页核实,勿写死人名
- [ ] supplementary 打包:pinned environment 文件 + 各步骤脚本/notebook + worked-example 输入输出 + 学生 rubric 手册 + instructor guide

## 3. 给主编的 pre-submission pitch(~150 词,单独邮件发)

> Dear Professor [主编名],
>
> I am writing to ask whether an "An Idea to Explore" manuscript on the following topic would be of interest to *BAMBEd*. Generative protein design (RFdiffusion, ProteinMPNN, ESMFold) is entering biochemistry curricula, but almost always via cloud notebooks that obscure the pipeline and depend on rationed GPU quotas. I describe a low-resource local teaching workflow that runs the complete generate–design–validate loop on an ordinary laptop without a dedicated GPU (demonstrated end-to-end on a CPU-only machine), and that centers the in silico self-consistency (designability) screen as a concrete, student-computable success criterion. The piece covers a small worked example, measurable learning objectives, a two-session module plan, and a path for others to assess effectiveness. It is offered as a transparent, equity-minded alternative to cloud-based instruction and has not yet been formally evaluated. Would this fit the "An Idea to Explore" scope? I would be glad to send a draft.
>
> Sincerely, [你]

## 4. review 里已落实的修改(存档)

- [P0] 核心 claim 改为 low-resource / laptop / GPU-free(Apple M4 Max CPU);CUDA 改为"推荐非必需"
- [P0] 删除所有行间占位符;正文为干净英文
- [P0] 软化 "fully offline / nothing leaves the machine / byte-for-byte" → "after a one-time setup ... runs without sending data off the machine";去掉 byte-for-byte
- [P1] 参考文献:修正 Boland&Ayres 刊名(PLOS Comput Biol,非 BAMBEd);删可疑的 refolding-pipeline 条;补 ColabFold
- [P1] 加入真实 worked example(1L2Y/1VII/1PGA/1UBQ + 两个 de novo)
- [P1] scRMSD<2Å / pLDDT>70 弱化为"classroom rubric adapted from common screens",非 field standard
- [自查] 补 ESMFold vs AF2 精度取舍 caveat;补 prerequisite knowledge;修正单机可扩展性(预计算 de novo);统一对象为 upper-division undergrad / early-grad
- [P2] pitch 与中文备注移出正文到本文件
