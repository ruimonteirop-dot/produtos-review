export const SITE = {
  name: "Myg Reviews",
  handle: "@mygreviews",
  email: "reviewsmyg@gmail.com",
};

export const FALLBACK_PHOTO = "/products/ap25-hero.jpg";

export const DISCLOSURE_GIFT =
  "Recebi este produto gratuitamente para teste. Ninguém reviu ou aprovou este texto antes da publicação.";

export const DISCLOSURE_AFFILIATE =
  "Como Associado da Amazon, recebo uma comissão pelas compras qualificadas feitas através dos links deste site, sem custo adicional para ti.";

export const METHOD = [
  { n: "01", title: "Digo de onde vem", text: "Alguns produtos recebo gratuitamente para teste, outros compro. Cada review diz qual é o caso." },
  { n: "02", title: "Uso a sério", text: "Semanas na rotina real da casa antes de escrever uma única linha." },
  { n: "03", title: "Comparo", text: "Preço, qualidade e alternativas lado a lado. Vale o que custa?" },
  { n: "04", title: "Falo claro", text: "Nota de 0 a 10, prós, contras e um veredicto curto. Ninguém aprova o texto antes de sair." },
];

export const MARQUEE = ["Reviews honestas", "Testado em casa", "Origem sempre indicada", "Compra consciente", "Nota de 0 a 10", "Prós e contras"];

export const formatScore = (score) =>
  score === null || score === undefined || score === "" ? "–" : Number(score).toFixed(1);
