/* Teste do jogo da memoria. Node puro: node teste/memoria.test.js */

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

function posicoesDe(jogo, id) {
  return jogo.cartas.map(function (ficha, indice) {
    return ficha.id === id ? indice : -1;
  }).filter(function (indice) { return indice !== -1; });
}

teste("existem 24 fichas diferentes, organizadas em três coleções", function () {
  assert.strictEqual(memoria.FICHAS_MEMORIA.length, 24);
  assert.strictEqual(new Set(memoria.FICHAS_MEMORIA.map(function (ficha) {
    return ficha.id;
  })).size, 24);
  assert.deepStrictEqual(memoria.COLECOES_MEMORIA.map(function (colecao) {
    return memoria.FICHAS_MEMORIA.filter(function (ficha) {
      return ficha.colecao === colecao.id;
    }).length;
  }), [8, 8, 8]);
});

teste("cada coleção começa com oito pares e fica embaralhada sem alterar as fichas", function () {
  memoria.COLECOES_MEMORIA.forEach(function (colecao) {
    const jogo = memoria.novoJogo(semSorteio, colecao.id);
    assert.strictEqual(jogo.cartas.length, 16);
    memoria.FICHAS_MEMORIA.filter(function (ficha) {
      return ficha.colecao === colecao.id;
    }).forEach(function (ficha) {
      assert.strictEqual(posicoesDe(jogo, ficha.id).length, 2);
    });
  });
  assert.strictEqual(memoria.FICHAS_MEMORIA.length, 24);
});

teste("duas fichas iguais formam um par sem alterar o jogo anterior", function () {
  const inicial = memoria.novoJogo(semSorteio);
  const posicoes = posicoesDe(inicial, inicial.cartas[0].id);
  const uma = memoria.tocar(inicial, posicoes[0]);
  const duas = memoria.tocar(uma, posicoes[1]);
  assert.deepStrictEqual(duas.achadas.slice().sort(), posicoes.slice().sort());
  assert.deepStrictEqual(duas.viradas, []);
  assert.deepStrictEqual(inicial.achadas, []);
});

teste("fichas diferentes continuam viradas até a próxima escolha", function () {
  const jogo = memoria.novoJogo(semSorteio);
  const a = jogo.cartas.findIndex(function (ficha) { return ficha.id !== jogo.cartas[0].id; });
  const viradas = memoria.tocar(memoria.tocar(jogo, 0), a);
  assert.deepStrictEqual(viradas.viradas, [0, a]);
  assert.deepStrictEqual(viradas.achadas, []);
});

teste("a próxima escolha fecha as duas diferentes e abre a nova", function () {
  let jogo = memoria.novoJogo(semSorteio);
  const primeira = 0;
  const segunda = jogo.cartas.findIndex(function (ficha) {
    return ficha.id !== jogo.cartas[primeira].id;
  });
  jogo = memoria.tocar(memoria.tocar(jogo, primeira), segunda);
  jogo = memoria.tocar(jogo, jogo.cartas.findIndex(function (ficha, indice) {
    return indice !== primeira && indice !== segunda;
  }));
  assert.strictEqual(jogo.viradas.length, 1);
});

teste("toques inválidos, repetidos ou em par encontrado não mudam o estado", function () {
  let jogo = memoria.novoJogo(semSorteio);
  assert.strictEqual(memoria.tocar(jogo, -1), jogo);
  assert.strictEqual(memoria.tocar(jogo, 1.5), jogo);
  const par = posicoesDe(jogo, jogo.cartas[0].id);
  jogo = memoria.tocar(memoria.tocar(jogo, par[0]), par[1]);
  assert.strictEqual(memoria.tocar(jogo, par[0]), jogo);
});

teste("encontrar todos os pares conclui a rodada", function () {
  let jogo = memoria.novoJogo(semSorteio, "bosque");
  memoria.FICHAS_MEMORIA.filter(function (ficha) {
    return ficha.colecao === "bosque";
  }).forEach(function (ficha) {
    posicoesDe(jogo, ficha.id).forEach(function (indice) {
      jogo = memoria.tocar(jogo, indice);
    });
  });
  assert.strictEqual(memoria.terminou(jogo), true);
});

teste("coleção desconhecida é informada como erro", function () {
  assert.throws(function () {
    memoria.novoJogo(semSorteio, "inventada");
  }, RangeError);
});

fim();
