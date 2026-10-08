/* Teste do Tetris Calmo. Node puro: node teste/tetris.test.js */

const assert = require("node:assert");
let passaram = 0;
const falhas = [];
function teste(nome, corpo) {
  try { corpo(); passaram++; } catch (erro) { falhas.push(nome + "\n   " + erro.message); }
}
function fim(nomeDoTeste) {
  if (falhas.length > 0) {
    console.log("FALHOU " + falhas.length + " de " + (passaram + falhas.length));
    falhas.forEach(function (f) { console.log(" - " + f); });
  } else {
    console.log("Passaram " + passaram + " testes de " + nomeDoTeste + ".");
  }
  process.exit(falhas.length > 0 ? 1 : 0);
}
const t = require("../js/tetris.js");

function fixo(valor) { return function () { return valor; }; }
function sequencia(semente) {
  let x = semente;
  return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
}
function vazio() {
  const l = [];
  for (let r = 0; r < t.TETRIS_ALTURA; r++) { l.push(new Array(t.TETRIS_LARGURA).fill(0)); }
  return l;
}
function contar(e) { return e.celulas.reduce(function (s, l) { return s + l.reduce(function (a, b) { return a + b; }, 0); }, 0); }
function comPeca(e, tipo, linha, coluna, celulas) {
  return { celulas: celulas || e.celulas, saco: e.saco, aviso: "",
    peca: { tipo: tipo, forma: t.TETRIS_FORMAS[tipo], linha: linha, coluna: coluna } };
}

teste("o jogo começa com tabuleiro vazio e uma peça no alto, sem aviso", function () {
  const e = t.tetrisNovo(sequencia(1));
  assert.strictEqual(contar(e), 0);
  assert.strictEqual(e.peca.linha, 0);
  assert.strictEqual(e.aviso, "");
});

teste("a peça não cai sozinha: sem toque, o estado não muda", function () {
  const e = t.tetrisNovo(sequencia(1));
  assert.strictEqual(e.peca.linha, 0);
  assert.strictEqual(t.tetrisMover(e, 0, 0).peca.linha, 0);
});

teste("todas as peças têm 4 quadrados e girar quatro vezes volta ao começo", function () {
  Object.keys(t.TETRIS_FORMAS).forEach(function (k) {
    let f = t.TETRIS_FORMAS[k];
    assert.strictEqual(f.length, 4);
    for (let i = 0; i < 4; i++) { f = t.tetrisGirarForma(f); }
    assert.deepStrictEqual(f.slice().sort(), t.TETRIS_FORMAS[k].slice().sort());
  });
});

teste("a peça não sai pelas paredes nem pelo chão", function () {
  let e = comPeca(t.tetrisNovo(sequencia(1)), "O", 0, 0);
  assert.strictEqual(t.tetrisMover(e, 0, -1), e);
  e = comPeca(e, "O", 0, 8);
  assert.strictEqual(t.tetrisMover(e, 0, 1), e);
  e = comPeca(e, "O", 18, 4);
  assert.strictEqual(t.tetrisMover(e, 1, 0), e);
});

teste("girar perto da parede empurra para dentro em vez de travar", function () {
  const e = comPeca(t.tetrisNovo(sequencia(1)), "I", 5, 0);
  const girada = t.tetrisGirar(comPeca(e, "I", 5, 9));
  assert.notStrictEqual(girada, undefined);
  assert.ok(t.tetrisCabe(e.celulas, girada.peca.forma, girada.peca.linha, girada.peca.coluna));
});

teste("descer no chão prende a peça e chama a próxima", function () {
  const e = comPeca(t.tetrisNovo(sequencia(2)), "O", 18, 4);
  const n = t.tetrisDescer(e, sequencia(3));
  assert.strictEqual(contar(n), 4);
  assert.strictEqual(n.peca.linha, 0);
});

teste("linha completa é desfeita, sem contar nada", function () {
  const base = vazio();
  for (let c = 0; c < 10; c++) { if (c < 4 || c > 5) { base[19][c] = 1; } }
  const e = comPeca(t.tetrisNovo(sequencia(4)), "O", 18, 4, base);
  const n = t.tetrisDescer(e, sequencia(5));
  assert.strictEqual(n.aviso, "linha");
  assert.strictEqual(n.celulas[19].reduce(function (a, b) { return a + b; }, 0), 2);
  assert.strictEqual(Object.keys(n).sort().join(), "aviso,celulas,peca,saco");
});

teste("não existe fim: tabuleiro cheio é esvaziado e o jogo segue", function () {
  const cheio = vazio();
  for (let r = 0; r < 20; r++) { for (let c = 0; c < 10; c++) { cheio[r][c] = (c === 0 ? 0 : 1); } }
  const e = comPeca(t.tetrisNovo(sequencia(6)), "O", 18, 4, cheio);
  const n = t.tetrisDescer(e, sequencia(7));
  assert.strictEqual(n.aviso, "esvaziou");
  assert.strictEqual(contar(n), 0);
  assert.ok(t.tetrisCabe(n.celulas, n.peca.forma, n.peca.linha, n.peca.coluna));
});

teste("jogar muito tempo sem fazer nada nunca trava nem termina", function () {
  let e = t.tetrisNovo(sequencia(8));
  const sorteio = sequencia(9);
  for (let i = 0; i < 3000; i++) { e = t.tetrisSoltar(e, sorteio); }
  assert.ok(t.tetrisCabe(e.celulas, e.peca.forma, e.peca.linha, e.peca.coluna));
});

teste("soltar leva a peça até o fundo e a prende", function () {
  const e = comPeca(t.tetrisNovo(sequencia(10)), "O", 0, 4);
  const n = t.tetrisSoltar(e, sequencia(11));
  assert.strictEqual(n.celulas[19][4], 1);
  assert.strictEqual(n.celulas[18][5], 1);
});

teste("as sete peças saem todas antes de qualquer uma repetir", function () {
  let e = t.tetrisNovo(sequencia(12));
  const vistos = [e.peca.tipo];
  const sorteio = sequencia(13);
  for (let i = 0; i < 6; i++) { e = t.tetrisSoltar(e, sorteio); vistos.push(e.peca.tipo); }
  assert.strictEqual(new Set(vistos).size, 7);
});

teste("mover não altera o estado antigo", function () {
  const e = t.tetrisNovo(sequencia(14));
  const antes = JSON.stringify(e);
  t.tetrisMover(e, 1, 0);
  t.tetrisGirar(e);
  assert.strictEqual(JSON.stringify(e), antes);
});

fim("Tetris Calmo");
