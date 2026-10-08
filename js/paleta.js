/* Enseada - as cores do desenho.
   Aqui as cores sao da pessoa: tinta para desenhar, nao cor da interface.
   Cada cor tem dois tons, um para o tema claro e um para o Modo Baixo
   Estimulo, para o traco nunca sumir no fundo (contraste de 3:1 ou mais nos
   dois). Tres nomes seguem as cores do proprio tema e mudam com ele.
   O desenho guarda so o NOME da cor, nunca o codigo. */

var PALETA_DESENHO = [
  { nome: "texto", rotulo: "Verde profundo", tema: "--texto" },
  { nome: "destaque", rotulo: "Azul turquesa", tema: "--destaque" },
  { nome: "detalhe", rotulo: "Verde-água", tema: "--detalhe" },
  { nome: "vermelho", rotulo: "Vermelho", claro: "#C62828", escuro: "#EF7B7B" },
  { nome: "laranja", rotulo: "Laranja", claro: "#D84A00", escuro: "#FFA040" },
  { nome: "amarelo", rotulo: "Amarelo", claro: "#B58900", escuro: "#FFD54F" },
  { nome: "verde", rotulo: "Verde", claro: "#2E7D32", escuro: "#7BC67E" },
  { nome: "azul", rotulo: "Azul", claro: "#1565C0", escuro: "#6FA8F0" },
  { nome: "roxo", rotulo: "Roxo", claro: "#7B1FA2", escuro: "#BF8BE0" },
  { nome: "rosa", rotulo: "Rosa", claro: "#D81B60", escuro: "#F58FB5" },
  { nome: "marrom", rotulo: "Marrom", claro: "#6D4C41", escuro: "#C09A86" },
  { nome: "grafite", rotulo: "Grafite", claro: "#263238", escuro: "#CFD8DC" }
];

/* O tom certo da cor para o tema que estiver ligado. */
function corDoDesenho(nome, modoBaixo, lerVariavel) {
  var item = PALETA_DESENHO.filter(function (c) { return c.nome === nome; })[0] || PALETA_DESENHO[0];
  if (item.tema) { return lerVariavel(item.tema); }
  return modoBaixo ? item.escuro : item.claro;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { PALETA_DESENHO: PALETA_DESENHO, corDoDesenho: corDoDesenho };
}
