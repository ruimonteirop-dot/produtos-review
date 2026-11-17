export const SITE = { name: "Myg Reviews", handle: "@mygreviews", email: "[seu-email@exemplo.com]" };

export const FEATURED = {
  id: "ap-25",
  name: "Seladora a Vácuo AP-25",
  category: "Cozinha",
  score: 8.7,
  verdict: "Escolha do Myg",
  summary:
    "Inox escovado, quatro botões e zero frescura. Testei a AP-25 selando carne, queijo e grãos — e ela virou parte da rotina da cozinha.",
  priceUrl: "#",
  photos: [
    { src: "/products/unboxed.webp", label: "Fora da caixa" },
    { src: "/products/wrapped.webp", label: "Unboxing" },
    { src: "/products/box.webp", label: "A caixa" },
  ],
  pros: [
    "4 modos para alimentos: Dry, Moist, Moist+ e Soft",
    "Botão Pulse para controlar o vácuo na mão",
    "Seal Only: sela sem puxar o ar",
    "Acabamento em inox escovado, bonito no balcão",
  ],
  cons: ["Painel todo em inglês", "Sacos de reposição vendidos à parte"],
  specs: [
    ["Modelo", "AP-25"],
    ["Tipo", "Seladora a vácuo doméstica"],
    ["Na caixa", "Seladora, cabo e sacos"],
    ["Painel", "Touch com display"],
  ],
};

export const CATEGORIES = ["Todos", "Cozinha", "Áudio", "Casa"];

export const REVIEWS = [
  { id: "airfryer", title: "Air Fryer Digital 4L", category: "Cozinha", score: 9.1, tag: "Mais pedido", img: "/products/airfryer.jpg", color: "var(--yellow)", priceUrl: "#" },
  { id: "fone", title: "Headphone Bluetooth ANC", category: "Áudio", score: 8.9, tag: "Custo-benefício", img: "/products/fone.jpg", color: "var(--coral)", priceUrl: "#" },
  { id: "robo", title: "Robô Aspirador Smart", category: "Casa", score: 8.4, tag: "Preguiça aprovada", img: "/products/robo.jpg", color: "var(--mint)", priceUrl: "#" },
  { id: "espresso", title: "Cafeteira Espresso Manual", category: "Cozinha", score: 9.3, tag: "Favorita", img: "/products/espresso.jpg", color: "var(--sky)", priceUrl: "#" },
];

export const METHOD = [
  { n: "01", title: "Eu compro", text: "Produto pago do meu bolso. Nada de caixinha mandada por marca.", color: "var(--yellow)" },
  { n: "02", title: "Eu uso de verdade", text: "Semanas na rotina real da casa antes de escrever qualquer linha.", color: "var(--coral)" },
  { n: "03", title: "Eu comparo", text: "Preço, qualidade e alternativas lado a lado. Vale o que custa?", color: "var(--mint)" },
  { n: "04", title: "Eu falo reto", text: "Nota de 0 a 10, prós, contras e um veredito curtinho.", color: "var(--sky)" },
];

export const MARQUEE = ["Reviews sinceras", "Sem jabá", "Testado em casa", "Compra consciente", "Nota de 0 a 10", "Prós & contras"];
