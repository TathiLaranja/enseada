/* Enseada - as perguntas do Modo Mini, a Enseadinha (funcoes puras, sem tela).
   Para criancas a partir de 3 anos, com um adulto por perto.
   Perguntas curtas, de ate 6 palavras, uma por tela e com um desenho.
   Sem certo e sem errado: nada e corrigido, nada e medido, nenhuma pergunta
   oferece resposta pronta. A crianca responde falando (um adulto escreve),
   escrevendo do jeito dela ou desenhando; o que escrever nao e conferido. */

var MINI_PERGUNTAS = [
  { id: "brincar", texto: "Do que você gosta de brincar?" },
  { id: "rir", texto: "Quem faz você rir?" },
  { id: "musica", texto: "Qual música ou história você ama?" },
  { id: "calmo", texto: "O que deixa você calminho?" },
  { id: "lugar", texto: "Onde você gosta de ficar?" },
  { id: "abraco", texto: "Quem dá abraço gostoso?" }
];

/* Devolve um conjunto novo de respostas; o antigo nao e alterado. */
function miniResponder(respostas, id, texto) {
  var novo = {};
  Object.keys(respostas).forEach(function (k) { novo[k] = respostas[k]; });
  if (typeof texto === "string" && texto.trim() !== "") { novo[id] = texto; } else { delete novo[id]; }
  return novo;
}

/* O que a crianca respondeu, na ordem das perguntas, so o que ela disse. */
function miniRespondidas(respostas) {
  return MINI_PERGUNTAS.filter(function (p) {
    return typeof respostas[p.id] === "string" && respostas[p.id].trim() !== "";
  }).map(function (p) { return { id: p.id, pergunta: p.texto, resposta: respostas[p.id] }; });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    MINI_PERGUNTAS: MINI_PERGUNTAS,
    miniResponder: miniResponder,
    miniRespondidas: miniRespondidas
  };
}
