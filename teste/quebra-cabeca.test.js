/* Teste do quebra-cabeca. Node puro: node teste/quebra-cabeca.test.js */

const assert = require("node:assert");
const quebraCabeca = require("../js/quebra-cabeca.js");
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
    console.log("Passaram " + passaram + " testes do quebra-cabeca.");
  }
  process.exit(falhas.length > 0 ? 1 : 0);
}

const semSorteio = function () { return 0; };
const esperado = { chegar: 6, explorar: 12, permanecer: 30 };

teste("os níveis têm exatamente 6, 12 e 30 peças", function () {
  quebraCabeca.NIVEIS_QUEBRA_CABECA.forEach(function (nivel) {
    const jogo = quebraCabeca.novoQuebraCabeca(nivel.id, semSorteio);
    assert.strictEqual(jogo.pecas.length, esperado[nivel.id]);
    assert.strictEqual(new Set(jogo.pecas.map(function (peca) {
      return peca.ordem;
    })).size, esperado[nivel.id]);
    assert.strictEqual(jogo.linhas * jogo.colunas, esperado[nivel.id]);
  });
});

teste("encaixe incorreto ou inválido não altera o tabuleiro", function () {
  const jogo = quebraCabeca.novoQuebraCabeca("chegar", semSorteio);
  assert.strictEqual(quebraCabeca.encaixarPeca(jogo, 0, 1), jogo);
  assert.strictEqual(quebraCabeca.encaixarPeca(jogo, -1, 0), jogo);
  assert.strictEqual(quebraCabeca.encaixarPeca(jogo, 0, 0.5), jogo);
  assert.deepStrictEqual(jogo.encaixadas, []);
});

teste("peça no espaço correspondente é encaixada sem mutar o estado anterior", function () {
  const inicial = quebraCabeca.novoQuebraCabeca("chegar", semSorteio);
  const seguinte = quebraCabeca.encaixarPeca(inicial, 3, 3);
  assert.deepStrictEqual(seguinte.encaixadas, [3]);
  assert.deepStrictEqual(inicial.encaixadas, []);
});

teste("um nível termina apenas quando todas as peças estão encaixadas", function () {
  let jogo = quebraCabeca.novoQuebraCabeca("permanecer", semSorteio);
  assert.strictEqual(quebraCabeca.terminouQuebraCabeca(jogo), false);
  for (let ordem = 0; ordem < jogo.pecas.length; ordem++) {
    jogo = quebraCabeca.encaixarPeca(jogo, ordem, ordem);
  }
  assert.strictEqual(quebraCabeca.terminouQuebraCabeca(jogo), true);
});

teste("nível desconhecido é informado como erro", function () {
  assert.throws(function () {
    quebraCabeca.novoQuebraCabeca("inexistente", semSorteio);
  }, RangeError);
});

fim();
