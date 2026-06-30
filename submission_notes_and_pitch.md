# 投稿配套笔记(不进正文)— BAMBEd "An Idea to Explore"

> 这个文件是给你自己用的:投稿清单 + 改稿存档。正文文件 `BAMBEd_Idea_to_Explore_draft.md` 已是干净英文稿,不含任何占位符散落在行间。

## 1. Table 1 / Table 2 — 已用你的真实数据填好

- **Table 1(工具×算力)**:已做成 markdown 表插入正文。
- **Table 2(worked-example 结果)**:已用 `teaching_demo/data_summary.csv` 的真实输出填入(8 个 redesign + 2 个 de novo,含 pLDDT / Cα RMSD / self-consistent·borderline 判定 + 原生 sanity-check 数字)。**全部为你本地实测,无任何网络数据。**

> 注:正文 Table 2 的 RMSD 用的是你 CSV 里的 `CA_RMSD_A`(Cα RMSD,Kabsch);verdict 用你的 `self-consistent / borderline` 两档。若你之后重跑数据有变,改 CSV 后把新数字发我即可同步。

## 2. 投稿前清单(BAMBEd / Idea to Explore)

- [x] 标题已以 `An Idea to Explore:` 开头
- [x] 正文 ≤ 4000 词(当前约 2,870,不含参考)
- [x] Table 1 / Table 2 已用真实数据填好
- [x] 作者信息:Xia Wu(University of Iowa)+ ORCID + 通讯邮箱,已加入 byline
- [x] 参考文献 6、7 作者名单已补全核实(ref 6: Chungyoun M, Au G, Carpentier B, Puvada S, Thomas C, Gray JJ;ref 7: Teufel AI, Liberles DA, J Microbiol Biol Educ 2026;27:e00331-25)
- [x] **投前联系主编 = 不需要**:经核实,"prior approval from the editor-in-chief" 是 **Media Reviews** 的要求;**"An Idea to Explore" 不需要投前 pitch**,直接走投稿系统即可
- [ ] 参考文献 6 若 arXiv 版日后正式发表,替换为 peer-reviewed 版
- [ ] 参考文献格式转成 BAMBEd/Wiley 要求的样式(投稿系统里确认是数字上标还是其他)
- [ ] (可选)Data & Code Availability 声明,指向公开仓库
- [ ] supplementary 打包:pinned environment 文件 + 各步骤脚本/notebook + worked-example 输入输出 + 学生 rubric 手册 + instructor guide

## 3. review 里已落实的修改(存档)

- [P0] 核心 claim 改为 low-resource / laptop / GPU-free;CUDA 改为"推荐非必需";硬件诚实标注 consumer Apple Silicon laptop (M4 Max, 48 GB)
- [P0] 删除所有行间占位符;正文为干净英文;byline 已加
- [P0] 软化 "fully offline / nothing leaves the machine / byte-for-byte";obj 2 改为 "after initial installation and model download, without relying on cloud notebooks"
- [P0] de novo 数量与数据对齐:one 30-residue backbone with two designed sequences
- [P1] 参考文献:修正 Boland&Ayres 刊名(PLOS Comput Biol);删可疑的 refolding-pipeline 条;补 ColabFold;ref 6/7 作者核实
- [P1] 加入真实 worked example(Table 2:1L2Y/1VII/1PGA/1UBQ + 2 个 de novo);加 "teaching examples, not a benchmark" 提示
- [P1] scRMSD<2Å / pLDDT>70 弱化为 self-consistent/borderline 的 classroom rubric,非 field standard
- [自查] 补 ESMFold vs AF2 精度取舍 caveat;补 prerequisite knowledge;预计算 de novo 解决单机可扩展性;统一对象为 upper-division undergrad / early-grad
