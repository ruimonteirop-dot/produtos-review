// Converte o texto da review (formato simples) em blocos:
//   "## Título" -> h2, "### Título" -> h3, "- item" -> lista, linha em branco -> novo parágrafo,
//   **negrito** dentro do texto.
export const parseBody = (text = "") => {
  const blocks = [];
  let para = [];
  let list = null;
  const flushPara = () => { if (para.length) { blocks.push({ type: "p", text: para.join(" ") }); para = []; } };
  const flushList = () => { if (list) { blocks.push({ type: "ul", items: list }); list = null; } };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) { flushPara(); flushList(); continue; }
    if (line.startsWith("### ")) { flushPara(); flushList(); blocks.push({ type: "h3", text: line.slice(4) }); continue; }
    if (line.startsWith("## ")) { flushPara(); flushList(); blocks.push({ type: "h2", text: line.slice(3) }); continue; }
    if (line.startsWith("- ")) { flushPara(); (list = list || []).push(line.slice(2)); continue; }
    flushList();
    para.push(line);
  }
  flushPara(); flushList();
  return blocks;
};

// Divide "texto **negrito** texto" em partes para render seguro (sem HTML).
export const inlineParts = (text = "") =>
  text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((t) =>
    t.startsWith("**") && t.endsWith("**") ? { bold: true, text: t.slice(2, -2) } : { bold: false, text: t });
