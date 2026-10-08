/* Teste da paleta do desenho. Node puro: node teste/paleta.test.js */

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
const p = require("../js/paleta.js");
const g = require("../js/armazenamento.js");

function luz(h) {
  const c = [1, 3, 5].map(function (i) { return parseInt(h.slice(i, i + 2), 16) / 255; })
    .map(function (v) { return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function contraste(a, b) {
  const x = luz(a), y = luz(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

teste("a paleta tem as cores pedidas e os nomes batem com o armazenamento", function () {
  const nomes = p.PALETA_DESENHO.map(function (c) { return c.nome; });
  ["vermelho", "amarelo", "azul", "verde", "roxo", "rosa", "laranja", "marrom"].forEach(function (n) {
    assert.ok(nomes.indexOf(n) !== -1, n);
  });
  assert.deepStrictEqual(nomes, g.CORES_DO_DESENHO);
});

teste("toda cor tem nome escrito (cor nunca vai sozinha)", function () {
  p.PALETA_DESENHO.forEach(function (c) { assert.ok(c.rotulo && c.rotulo.length > 2); });
});

teste("cada tom aparece com contraste de 3:1 ou mais sobre o fundo do seu tema", function () {
  p.PALETA_DESENHO.filter(function (c) { return !c.tema; }).forEach(function (c) {
    assert.ok(contraste(c.claro, "#F8F9FA") >= 3, c.nome + " no claro");
    assert.ok(contraste(c.escuro, "#1B2328") >= 3, c.nome + " no escuro");
  });
});

teste("o tom muda com o tema e as cores do tema vêm das variáveis", function () {
  const ler = function (v) { return "var:" + v; };
  assert.strictEqual(p.corDoDesenho("azul", false, ler), "#1565C0");
  assert.strictEqual(p.corDoDesenho("azul", true, ler), "#6FA8F0");
  assert.strictEqual(p.corDoDesenho("detalhe", true, ler), "var:--detalhe");
  assert.strictEqual(p.corDoDesenho("inexistente", false, ler), "var:--texto");
});

teste("o armazenamento guarda o nome das cores novas e recusa código solto", function () {
  const n = g.normalizar({ desenho: [
    { cor: "vermelho", pontos: [[0, 0]] },
    { cor: "#FF0000", pontos: [[0, 0]] }
  ] });
  assert.deepStrictEqual(n.desenho.map(function (t) { return t.cor; }), ["vermelho", "texto"]);
});

fim("paleta");
