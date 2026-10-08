/* Enseada - regras do jogo da memoria (funcoes puras, sem tela).
   Sem derrota, sem cronometro, sem pontuacao e sem contar jogadas.
   Carta errada nao some sozinha: as duas ficam viradas ate a proxima carta
   ser tocada. Assim nao existe pressa. */

var PALAVRAS_DO_JOGO = ["Mar", "Sol", "Pão", "Lua", "Chá", "Rio"];

/* Embaralha sem alterar a lista original. `sorteio` devolve numero de 0 a 1
   e existe como parametro para o teste poder fixar o resultado. */
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

function novoJogo(sorteio) {
  var pares = PALAVRAS_DO_JOGO.concat(PALAVRAS_DO_JOGO);
  return {
    cartas: embaralhar(pares, sorteio),
    achadas: [],
    viradas: []
  };
}

/* Toca numa carta. Devolve um jogo novo; o antigo nao e alterado. */
function tocar(jogo, indice) {
  if (indice < 0 || indice >= jogo.cartas.length) { return jogo; }
  if (jogo.achadas.indexOf(indice) !== -1) { return jogo; }
  if (jogo.viradas.indexOf(indice) !== -1) { return jogo; }

  var viradas = jogo.viradas.slice();
  var achadas = jogo.achadas.slice();

  /* Duas cartas erradas ainda viradas: o toque novo fecha as duas e abre a nova. */
  if (viradas.length === 2) { viradas = []; }

  viradas.push(indice);

  if (viradas.length === 2 && jogo.cartas[viradas[0]] === jogo.cartas[viradas[1]]) {
    achadas = achadas.concat(viradas);
    viradas = [];
  }

  return { cartas: jogo.cartas, achadas: achadas, viradas: viradas };
}

function terminou(jogo) {
  return jogo.achadas.length === jogo.cartas.length;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PALAVRAS_DO_JOGO: PALAVRAS_DO_JOGO,
    embaralhar: embaralhar,
    novoJogo: novoJogo,
    tocar: tocar,
    terminou: terminou
  };
}
