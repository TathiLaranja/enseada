/* Teste das regras do jogo da memoria. Node puro: node teste/memoria.test.js
   As 24 fichas, as colecoes e a partida por tema sao testadas em fichas.test.js.
   Aqui ficam so as regras puras de js/memoria.js. */

const assert = require("node:assert");
const memoria = require("../js/memoria.js");
let passaram = 0;
const falhas = [];

function teste(nome, corpo) {
  try { corpo(); passaram++; } catch (erro) { falhas.push(nome + "\n   " + erro.message); }
}

function fim() {
  if (falhas.length > 0) {
    console.log("FALHOU " + falhas.length + " de " + (passaram + falhas.length));
    falhas.forEach(function (falha) { console.log(" - " + falha); });
  } else {
    console.log("Passaram " + passaram + " testes do jogo da memoria.");
  }
  process.exit(falhas.length > 0 ? 1 : 0);
}

const semSorteio = function () { return 0; };
const ITENS = ["a", "b", "c", "d", "e", "f", "g", "h"];

function posicoesDe(jogo, item) {
  return jogo.cartas.map(function (carta, indice) {
    return carta === item ? indice : -1;
  }).filter(function (indice) { return indice !== -1; });
}

teste("embaralhar mantém os mesmos itens, não altera a lista original e é repetível", function () {
  const original = ITENS.slice();
  const um = memoria.embaralhar(ITENS, semSorteio);
  const dois = memoria.embaralhar(ITENS, semSorteio);
  assert.deepStrictEqual(ITENS, original);
  assert.deepStrictEqual(um.slice().sort(), original.slice().sort());
  assert.deepStrictEqual(um, dois);
  assert.notStrictEqual(um, ITENS);
});

teste("cada item da lista vira exatamente duas cartas", function () {
  const jogo = memoria.novoJogo(semSorteio, ITENS);
  assert.strictEqual(jogo.cartas.length, 16);
  ITENS.forEach(function (item) {
    assert.strictEqual(posicoesDe(jogo, item).length, 2);
  });
  assert.deepStrictEqual(jogo.achadas, []);
  assert.deepStrictEqual(jogo.viradas, []);
});

teste("sem lista, o jogo usa as palavras de sempre, em pares", function () {
  const jogo = memoria.novoJogo(semSorteio);
  assert.strictEqual(jogo.cartas.length, memoria.PALAVRAS_DO_JOGO.length * 2);
  memoria.PALAVRAS_DO_JOGO.forEach(function (palavra) {
    assert.strictEqual(posicoesDe(jogo, palavra).length, 2);
  });
});

teste("duas cartas iguais formam um par sem alterar o jogo anterior", function () {
  const inicial = memoria.novoJogo(semSorteio, ITENS);
  const posicoes = posicoesDe(inicial, inicial.cartas[0]);
  const uma = memoria.tocar(inicial, posicoes[0]);
  const duas = memoria.tocar(uma, posicoes[1]);
  assert.deepStrictEqual(duas.achadas.slice().sort(), posicoes.slice().sort());
  assert.deepStrictEqual(duas.viradas, []);
  assert.deepStrictEqual(inicial.achadas, []);
  assert.deepStrictEqual(inicial.viradas, []);
});

teste("cartas diferentes continuam viradas até a próxima escolha", function () {
  const jogo = memoria.novoJogo(semSorteio, ITENS);
  const outra = jogo.cartas.findIndex(function (carta) { return carta !== jogo.cartas[0]; });
  const viradas = memoria.tocar(memoria.tocar(jogo, 0), outra);
  assert.deepStrictEqual(viradas.viradas, [0, outra]);
  assert.deepStrictEqual(viradas.achadas, []);
});

teste("a próxima escolha fecha as duas diferentes e abre a nova", function () {
  let jogo = memoria.novoJogo(semSorteio, ITENS);
  const segunda = jogo.cartas.findIndex(function (carta) { return carta !== jogo.cartas[0]; });
  jogo = memoria.tocar(memoria.tocar(jogo, 0), segunda);
  const terceira = jogo.cartas.findIndex(function (carta, indice) {
    return indice !== 0 && indice !== segunda;
  });
  jogo = memoria.tocar(jogo, terceira);
  assert.deepStrictEqual(jogo.viradas, [terceira]);
});

teste("toques inválidos, repetidos ou em par encontrado não mudam o estado", function () {
  let jogo = memoria.novoJogo(semSorteio, ITENS);
  assert.strictEqual(memoria.tocar(jogo, -1), jogo);
  assert.strictEqual(memoria.tocar(jogo, 16), jogo);
  const par = posicoesDe(jogo, jogo.cartas[0]);
  const uma = memoria.tocar(jogo, par[0]);
  assert.strictEqual(memoria.tocar(uma, par[0]), uma);
  jogo = memoria.tocar(uma, par[1]);
  assert.strictEqual(memoria.tocar(jogo, par[0]), jogo);
});

teste("não existe derrota: errar não tira nada e só encontrar todos os pares termina", function () {
  let jogo = memoria.novoJogo(semSorteio, ITENS);
  assert.strictEqual(memoria.terminou(jogo), false);
  ITENS.forEach(function (item) {
    posicoesDe(jogo, item).forEach(function (indice) {
      jogo = memoria.tocar(jogo, indice);
    });
    assert.strictEqual(memoria.terminou(jogo), item === ITENS[ITENS.length - 1]);
  });
  assert.strictEqual(jogo.achadas.length, 16);
});

teste("sortearItens não repete, não altera a lista e pede no máximo o que existe", function () {
  const original = ITENS.slice();
  const tres = memoria.sortearItens(ITENS, 3, semSorteio);
  assert.strictEqual(tres.length, 3);
  assert.strictEqual(new Set(tres).size, 3);
  assert.deepStrictEqual(ITENS, original);
  assert.strictEqual(memoria.sortearItens(ITENS, 99, semSorteio).length, ITENS.length);
});

fim();
