/* Enseada - as cores do desenho.
   Aqui as cores sao da pessoa: tinta para desenhar, nao cor da interface.
   Cada cor tem dois tons, um para o tema claro e um para o Modo Baixo
   Estimulo, para o traco nunca sumir no fundo (contraste de 3:1 ou mais nos
   dois). Os tons pastel e o amarelo-sol sao claros por natureza: marcados com
   suave: true, no tema claro valem 1.8:1 ou mais (o minimo do teste) e no
   escuro ficam bem legiveis. Tres nomes seguem as cores do proprio tema.
   O desenho guarda so o NOME da cor, nunca o codigo. */

var PALETA_DESENHO = [
  { nome: "texto", rotulo: "Grafite quente", tema: "--texto" },
  { nome: "destaque", rotulo: "Azul de enseada", tema: "--destaque" },
  { nome: "detalhe", rotulo: "Verde de restinga", tema: "--detalhe" },
  { nome: "vermelho", rotulo: "Vermelho", claro: "#C62828", escuro: "#EF7B7B" },
  { nome: "laranja", rotulo: "Laranja", claro: "#D84A00", escuro: "#FFA040" },
  { nome: "amarelo", rotulo: "Mostarda", claro: "#B58900", escuro: "#FFD54F" },
  { nome: "verde", rotulo: "Verde", claro: "#2E7D32", escuro: "#7BC67E" },
  { nome: "azul", rotulo: "Azul", claro: "#1565C0", escuro: "#6FA8F0" },
  { nome: "roxo", rotulo: "Roxo", claro: "#7B1FA2", escuro: "#BF8BE0" },
  { nome: "rosa", rotulo: "Rosa", claro: "#D81B60", escuro: "#F58FB5" },
  { nome: "marrom", rotulo: "Marrom", claro: "#6D4C41", escuro: "#C09A86" },
  { nome: "grafite", rotulo: "Cinza-azulado", claro: "#263238", escuro: "#CFD8DC" },
  { nome: "sol", rotulo: "Amarelo sol", claro: "#E5B200", escuro: "#FFE066", suave: true },
  { nome: "laranjapastel", rotulo: "Laranja pastel", claro: "#F0955A", escuro: "#FFC299", suave: true },
  { nome: "salmao", rotulo: "Salmão", claro: "#E8837A", escuro: "#FFA8A0", suave: true },
  { nome: "rosapastel", rotulo: "Rosa pastel", claro: "#E0759F", escuro: "#F7B8D0", suave: true },
  { nome: "lilas", rotulo: "Lilás", claro: "#9A7CCF", escuro: "#CDB8F0", suave: true },
  { nome: "azulsuave", rotulo: "Azul suave", claro: "#5E9BD6", escuro: "#A9CCF0", suave: true },
  { nome: "verdeclaro", rotulo: "Verde claro", claro: "#5DB57E", escuro: "#A8E0B8", suave: true }
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
