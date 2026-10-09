/* Enseada - regras do quebra-cabeca, sem tela. */

var NIVEIS_QUEBRA_CABECA = [
  { id: "chegar", nome: "Chegar", linhas: 2, colunas: 3 },
  { id: "explorar", nome: "Explorar", linhas: 3, colunas: 4 },
  { id: "permanecer", nome: "Permanecer", linhas: 5, colunas: 6 }
];

function embaralharPecas(lista, sorteio) {
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(sorteio() * (i + 1));
    var guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}

function novoQuebraCabeca(nivelId, sorteio) {
  var nivel = NIVEIS_QUEBRA_CABECA.find(function (item) {
    return item.id === nivelId;
  });
  if (!nivel) { throw new RangeError("Nivel de quebra-cabeca desconhecido."); }

  var pecas = [];
  var total = nivel.linhas * nivel.colunas;
  for (var ordem = 0; ordem < total; ordem++) {
    pecas.push({ ordem: ordem, linha: Math.floor(ordem / nivel.colunas), coluna: ordem % nivel.colunas });
  }

  return {
    nivel: nivel.id,
    linhas: nivel.linhas,
    colunas: nivel.colunas,
    pecas: embaralharPecas(pecas, sorteio || Math.random),
    encaixadas: []
  };
}

function encaixarPeca(jogo, ordemPeca, casa) {
  if (!Number.isInteger(ordemPeca) || !Number.isInteger(casa)) { return jogo; }
  if (ordemPeca !== casa || ordemPeca < 0 || ordemPeca >= jogo.pecas.length) { return jogo; }
  if (jogo.encaixadas.indexOf(ordemPeca) !== -1) { return jogo; }

  return {
    nivel: jogo.nivel,
    linhas: jogo.linhas,
    colunas: jogo.colunas,
    pecas: jogo.pecas,
    encaixadas: jogo.encaixadas.concat(ordemPeca)
  };
}

function terminouQuebraCabeca(jogo) {
  return jogo.encaixadas.length === jogo.pecas.length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    NIVEIS_QUEBRA_CABECA: NIVEIS_QUEBRA_CABECA,
    novoQuebraCabeca: novoQuebraCabeca,
    encaixarPeca: encaixarPeca,
    terminouQuebraCabeca: terminouQuebraCabeca
  };
}
