/* Enseada - regras do jogo da memoria, sem tela. */

var FICHAS_MEMORIA = [
  { id: "beterraba", nome: "Beterraba", coluna: 0, linha: 0, colecao: "horta" },
  { id: "bolota", nome: "Bolota", coluna: 1, linha: 0, colecao: "horta" },
  { id: "casinha-de-passaro", nome: "Casinha de passarinho", coluna: 2, linha: 0, colecao: "bosque" },
  { id: "lagarta", nome: "Lagarta", coluna: 3, linha: 0, colecao: "bichos" },
  { id: "libelula", nome: "Libelula", coluna: 4, linha: 0, colecao: "bichos" },
  { id: "limoes", nome: "Limoes", coluna: 0, linha: 1, colecao: "horta" },
  { id: "borboleta", nome: "Borboleta", coluna: 1, linha: 1, colecao: "bichos" },
  { id: "ourico", nome: "Ouriço", coluna: 2, linha: 1, colecao: "bichos" },
  { id: "flores-azuis", nome: "Flores azuis", coluna: 3, linha: 1, colecao: "horta" },
  { id: "cogumelo-vermelho", nome: "Cogumelo", coluna: 4, linha: 1, colecao: "horta" },
  { id: "coelho", nome: "Coelho", coluna: 0, linha: 2, colecao: "bichos" },
  { id: "passaro", nome: "Passarinho", coluna: 1, linha: 2, colecao: "bosque" },
  { id: "morangos", nome: "Morangos", coluna: 2, linha: 2, colecao: "horta" },
  { id: "rato", nome: "Rato", coluna: 3, linha: 2, colecao: "bosque" },
  { id: "caracol", nome: "Caracol", coluna: 4, linha: 2, colecao: "bichos" },
  { id: "cogumelos-claros", nome: "Cogumelos", coluna: 0, linha: 3, colecao: "bosque" },
  { id: "regador", nome: "Regador", coluna: 1, linha: 3, colecao: "horta" },
  { id: "formiga", nome: "Formiga", coluna: 2, linha: 3, colecao: "bichos" },
  { id: "cogumelos-do-bosque", nome: "Cogumelos do bosque", coluna: 3, linha: 3, colecao: "bosque" },
  { id: "gafanhoto", nome: "Gafanhoto", coluna: 4, linha: 3, colecao: "bichos" },
  { id: "abelha", nome: "Abelha", coluna: 0, linha: 4, colecao: "bosque" },
  { id: "joaninha", nome: "Joaninha", coluna: 1, linha: 4, colecao: "bosque" },
  { id: "margaridas", nome: "Margaridas", coluna: 3, linha: 4, colecao: "horta" },
  { id: "esquilo", nome: "Esquilo", coluna: 4, linha: 4, colecao: "bosque" }
];

var COLECOES_MEMORIA = [
  { id: "horta", nome: "Horta e pomar" },
  { id: "bichos", nome: "Bichos pequenos" },
  { id: "bosque", nome: "Bosque" }
];

function embaralhar(lista, sorteio) {
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(sorteio() * (i + 1));
    var guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}

function novoJogo(sorteio, colecaoId) {
  var colecao = colecaoId || COLECOES_MEMORIA[0].id;
  var fichas = FICHAS_MEMORIA.filter(function (ficha) {
    return ficha.colecao === colecao;
  });
  if (fichas.length !== 8) {
    throw new RangeError("A colecao da memoria deve ter oito fichas.");
  }

  var pares = fichas.concat(fichas);
  return {
    colecao: colecao,
    cartas: embaralhar(pares, sorteio || Math.random),
    achadas: [],
    viradas: []
  };
}

function tocar(jogo, indice) {
  if (!Number.isInteger(indice) || indice < 0 || indice >= jogo.cartas.length) { return jogo; }
  if (jogo.achadas.indexOf(indice) !== -1) { return jogo; }
  if (jogo.viradas.indexOf(indice) !== -1) { return jogo; }

  var viradas = jogo.viradas.slice();
  var achadas = jogo.achadas.slice();

  if (viradas.length === 2) { viradas = []; }
  viradas.push(indice);

  if (viradas.length === 2 && jogo.cartas[viradas[0]].id === jogo.cartas[viradas[1]].id) {
    achadas = achadas.concat(viradas);
    viradas = [];
  }

  return { colecao: jogo.colecao, cartas: jogo.cartas, achadas: achadas, viradas: viradas };
}

function terminou(jogo) {
  return jogo.achadas.length === jogo.cartas.length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FICHAS_MEMORIA: FICHAS_MEMORIA,
    COLECOES_MEMORIA: COLECOES_MEMORIA,
    embaralhar: embaralhar,
    novoJogo: novoJogo,
    tocar: tocar,
    terminou: terminou
  };
}
