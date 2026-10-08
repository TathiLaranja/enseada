/* Teste das palavras cruzadas. Node puro: node teste/cruzadas.test.js */

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
const c = require("../js/cruzadas.js");

function sequencia(semente) {
  let x = semente;
  return function () { x = (x * 1664525 + 1013904223) % 4294967296; return x / 4294967296; };
}

/* Toda sequencia de 2 ou mais letras na grade tem de ser uma entrada. */
function gradeConsistente(j) {
  const achadas = [];
  for (let r = 0; r < j.linhas; r++) {
    let seq = "", ini = 0;
    for (let k = 0; k <= j.colunas; k++) {
      const v = k < j.colunas ? j.grade[r][k] : "";
      if (v !== "") { if (seq === "") { ini = k; } seq += v; }
      else { if (seq.length >= 2) { achadas.push(["h", r, ini, seq]); } seq = ""; }
    }
  }
  for (let col = 0; col < j.colunas; col++) {
    let seq = "", ini = 0;
    for (let k = 0; k <= j.linhas; k++) {
      const v = k < j.linhas ? j.grade[k][col] : "";
      if (v !== "") { if (seq === "") { ini = k; } seq += v; }
      else { if (seq.length >= 2) { achadas.push(["v", ini, col, seq]); } seq = ""; }
    }
  }
  const dasEntradas = j.entradas.map(function (e) { return [e.direcao, e.linha, e.coluna, e.resposta].join(); }).sort();
  return achadas.map(function (a) { return a.join(); }).sort().join("|") === dasEntradas.join("|");
}

teste("em 1000 jogos a grade nunca forma palavra que não esteja nas dicas", function () {
  for (let n = 1; n <= 1000; n++) {
    assert.ok(gradeConsistente(c.cruzadasNovo(sequencia(n))), "semente " + n);
  }
});

teste("todo jogo tem pelo menos 6 palavras, todas cruzadas e numeradas", function () {
  for (let n = 1; n <= 100; n++) {
    const j = c.cruzadasNovo(sequencia(n));
    assert.ok(j.entradas.length >= 6, "semente " + n);
    j.entradas.forEach(function (e) { assert.ok(e.numero >= 1 && e.dica.length > 0); });
  }
});

teste("a grade cabe em 9 colunas e nenhuma palavra se repete", function () {
  for (let n = 1; n <= 100; n++) {
    const j = c.cruzadasNovo(sequencia(n));
    assert.ok(j.colunas <= 9 && j.linhas <= 9);
    assert.strictEqual(new Set(j.entradas.map(function (e) { return e.resposta; })).size, j.entradas.length);
  }
});

teste("o jogo novo começa vazio", function () {
  const j = c.cruzadasNovo(sequencia(3));
  assert.ok(j.atual.every(function (l) { return l.every(function (v) { return v === ""; }); }));
  assert.strictEqual(c.cruzadasCheio(j), false);
  assert.strictEqual(c.cruzadasCerto(j), false);
});

teste("letra aceita com ou sem acento e minúscula; símbolo e número não", function () {
  assert.strictEqual(c.cruzadasLetra("é"), "E");
  assert.strictEqual(c.cruzadasLetra("ç"), "C");
  assert.strictEqual(c.cruzadasLetra("a"), "A");
  assert.strictEqual(c.cruzadasLetra("7"), "");
  assert.strictEqual(c.cruzadasLetra("!"), "");
  assert.strictEqual(c.cruzadasLetra("ab"), "");
});

teste("colocar não altera o jogo antigo e não aceita casa sem letra", function () {
  const j = c.cruzadasNovo(sequencia(4));
  let r0 = -1, c0 = -1, vr = -1, vc = -1;
  for (let r = 0; r < j.linhas; r++) { for (let k = 0; k < j.colunas; k++) {
    if (j.grade[r][k] !== "" && r0 < 0) { r0 = r; c0 = k; }
    if (j.grade[r][k] === "" && vr < 0) { vr = r; vc = k; }
  } }
  const n = c.cruzadasColocar(j, r0, c0, "x");
  assert.strictEqual(n.atual[r0][c0], "X");
  assert.strictEqual(j.atual[r0][c0], "");
  if (vr >= 0) { assert.strictEqual(c.cruzadasColocar(j, vr, vc, "a"), j); }
  assert.strictEqual(c.cruzadasColocar(j, r0, c0, "7"), j);
});

teste("letra errada é aceita sem aviso; a dica corrige e nunca tira acerto", function () {
  let j = c.cruzadasNovo(sequencia(5));
  let r0 = 0, c0 = 0;
  for (let r = 0; r < j.linhas; r++) { for (let k = 0; k < j.colunas; k++) { if (j.grade[r][k] !== "") { r0 = r; c0 = k; } } }
  const errada = j.grade[r0][c0] === "A" ? "B" : "A";
  j = c.cruzadasColocar(j, r0, c0, errada);
  assert.strictEqual(j.atual[r0][c0], errada);
  const sorteio = sequencia(6);
  for (let i = 0; i < 200; i++) {
    const d = c.cruzadasDica(j, sorteio);
    if (!d.casa) { break; }
    assert.strictEqual(d.jogo.atual[d.casa[0]][d.casa[1]], j.grade[d.casa[0]][d.casa[1]]);
    j = d.jogo;
  }
  assert.strictEqual(c.cruzadasCerto(j), true);
  assert.strictEqual(c.cruzadasCheio(j), true);
  assert.strictEqual(c.cruzadasDica(j, sorteio).casa, null);
});

teste("digitar número ou símbolo por cima de uma letra NÃO apaga a letra", function () {
  assert.strictEqual(c.cruzadasLerDigitacao("E", "E7"), "E");
  assert.strictEqual(c.cruzadasLerDigitacao("E", "E!"), "E");
  assert.strictEqual(c.cruzadasLerDigitacao("", "7"), "");
});

teste("digitar letra nova por cima troca a letra; apagar esvazia; acento vira letra", function () {
  assert.strictEqual(c.cruzadasLerDigitacao("E", "Ea"), "A");
  assert.strictEqual(c.cruzadasLerDigitacao("E", ""), "");
  assert.strictEqual(c.cruzadasLerDigitacao("", "é"), "E");
  assert.strictEqual(c.cruzadasLerDigitacao("A", "e\u0301"), "E");
});

fim("palavras cruzadas");
