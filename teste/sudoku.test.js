/* Teste do sudoku calmo. Node puro: node teste/sudoku.test.js */

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
const s = require("../js/sudoku.js");

function aleatorioFixo(semente) {
  let x = semente;
  return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
}

function grupoValido(g, indices) {
  return indices.map(function (i) { return g[i]; }).sort().join("") === "123456789";
}

function solucaoValida(g) {
  for (let k = 0; k < 9; k++) {
    const linha = [], coluna = [], quadrado = [];
    for (let m = 0; m < 9; m++) {
      linha.push(k * 9 + m);
      coluna.push(m * 9 + k);
      quadrado.push((Math.floor(k / 3) * 3 + Math.floor(m / 3)) * 9 + (k % 3) * 3 + (m % 3));
    }
    if (!grupoValido(g, linha) || !grupoValido(g, coluna) || !grupoValido(g, quadrado)) { return false; }
  }
  return true;
}

teste("a solução gerada respeita linha, coluna e quadrado", function () {
  for (let n = 1; n <= 5; n++) {
    assert.ok(solucaoValida(s.sudokuSolucao(aleatorioFixo(n))));
  }
});

teste("o jogo novo tem solução única e começa com casas prontas e vazias", function () {
  const j = s.sudokuNovo(aleatorioFixo(7));
  assert.strictEqual(s.sudokuContar(j.dadas.slice(), 2), 1);
  assert.strictEqual(j.dadas.filter(function (v) { return v === 0; }).length, s.SUDOKU_VAZIAS);
  j.dadas.forEach(function (v, i) { if (v !== 0) { assert.strictEqual(v, j.solucao[i]); } });
});

teste("o jogo novo nasce igual às casas dadas", function () {
  const j = s.sudokuNovo(aleatorioFixo(3));
  assert.deepStrictEqual(j.atual, j.dadas);
});

teste("colocar não altera o jogo antigo nem as casas que vieram prontas", function () {
  const j = s.sudokuNovo(aleatorioFixo(11));
  const vazia = j.dadas.indexOf(0);
  const pronta = j.dadas.findIndex(function (v) { return v !== 0; });
  const novo = s.sudokuColocar(j, vazia, 5);
  assert.strictEqual(novo.atual[vazia], 5);
  assert.strictEqual(j.atual[vazia], 0);
  assert.strictEqual(s.sudokuColocar(j, pronta, 1), j);
  assert.strictEqual(s.sudokuColocar(j, 99, 1), j);
  assert.strictEqual(s.sudokuColocar(j, vazia, 10), j);
});

teste("número repetido não é tratado como erro: o jogo só aceita", function () {
  const j = s.sudokuNovo(aleatorioFixo(5));
  const vazia = j.dadas.indexOf(0);
  const errado = (j.solucao[vazia] % 9) + 1;
  assert.strictEqual(s.sudokuColocar(j, vazia, errado).atual[vazia], errado);
});

teste("a dica põe o número certo e nunca tira uma casa certa", function () {
  let j = s.sudokuNovo(aleatorioFixo(13));
  const sorteio = aleatorioFixo(99);
  for (let n = 0; n < 200; n++) {
    const r = s.sudokuDica(j, sorteio);
    if (r.casa === -1) { break; }
    assert.strictEqual(r.jogo.atual[r.casa], j.solucao[r.casa]);
    j = r.jogo;
  }
  assert.strictEqual(s.sudokuCerto(j), true);
  assert.strictEqual(s.sudokuDica(j, sorteio).casa, -1);
});

teste("dica corrige uma casa fora do lugar", function () {
  const j = s.sudokuNovo(aleatorioFixo(21));
  const vazia = j.dadas.indexOf(0);
  const torto = s.sudokuColocar(j, vazia, (j.solucao[vazia] % 9) + 1);
  let atual = torto;
  for (let n = 0; n < 100 && !s.sudokuCerto(atual); n++) {
    atual = s.sudokuDica(atual, aleatorioFixo(n + 1)).jogo;
  }
  assert.strictEqual(atual.atual[vazia], j.solucao[vazia]);
});

teste("cheio e certo são coisas separadas", function () {
  const j = s.sudokuNovo(aleatorioFixo(2));
  assert.strictEqual(s.sudokuCheio(j), false);
  const cheioTorto = { solucao: j.solucao, dadas: j.dadas, atual: j.solucao.map(function (v) { return (v % 9) + 1; }) };
  assert.strictEqual(s.sudokuCheio(cheioTorto), true);
  assert.strictEqual(s.sudokuCerto(cheioTorto), false);
});

fim("sudoku");
