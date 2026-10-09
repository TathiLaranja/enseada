/* Teste do Modo Mini. Node puro: node teste/mini.test.js */

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
const m = require("../js/mini.js");

teste("as perguntas são curtas (até 6 palavras), uma por desenho, sem repetir", function () {
  const ids = {};
  m.MINI_PERGUNTAS.forEach(function (p) {
    assert.ok(p.texto.split(" ").length <= 6, p.texto);
    assert.ok(/\?$/.test(p.texto));
    assert.ok(!ids[p.id]);
    ids[p.id] = true;
  });
  assert.ok(m.MINI_PERGUNTAS.length >= 5);
});

teste("nenhuma pergunta sugere resposta, cobra ortografia ou fala em nota", function () {
  m.MINI_PERGUNTAS.forEach(function (p) {
    assert.ok(!/certo|errado|nota|ponto|acert|erro|escreva corretamente/i.test(p.texto), p.texto);
  });
});

teste("responder guarda o texto, apagar tira, e o conjunto antigo não muda", function () {
  const a = {};
  const b = m.miniResponder(a, "rir", "meu irmão");
  assert.deepStrictEqual(b, { rir: "meu irmão" });
  assert.deepStrictEqual(a, {});
  assert.deepStrictEqual(m.miniResponder(b, "rir", "   "), {});
});

teste("respondidas vem na ordem das perguntas e só traz o que a criança disse", function () {
  const r = m.miniRespondidas({ abraco: "mamãe", brincar: "bola", rir: "" });
  assert.deepStrictEqual(r.map(function (x) { return x.id; }), ["brincar", "abraco"]);
  assert.strictEqual(r[0].resposta, "bola");
});

teste("a tela do Mini desliga a correção ortográfica e não mostra nota nem contagem", function () {
  const js = require("node:fs").readFileSync("js/tela-mini.js", "utf8");
  assert.ok(js.indexOf("spellcheck = false") !== -1);
  assert.ok(!/pontos|nota |acertos|erros/i.test(js.replace(/\/\*[\s\S]*?\*\//g, "")));
});

fim("Modo Mini");
