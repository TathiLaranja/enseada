/* Teste do Anagrama. Node puro: node teste/anagrama.test.js */

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
const a = require("../js/anagrama.js");
const c = require("../js/cruzadas.js");
const BANCO = [{ resposta: "LIVRO", dica: "Tem páginas para ler." }];

teste("a pessoa pode escrever com acento, minúscula e espaço", function () {
  assert.strictEqual(a.anagramaNormalizar(" cafés "), "CAFES");
  assert.strictEqual(a.anagramaNormalizar("Ação"), "ACAO");
  assert.strictEqual(a.anagramaNormalizar("avó"), "AVO");
});

teste("as letras saem fora de ordem, nunca entregando a palavra pronta", function () {
  /* sorteio que não embaralha nada: o jogo tem de desarrumar mesmo assim */
  const parado = () => 0.999999;
  const letras = a.anagramaEmbaralhar("LIVRO", parado);
  assert.strictEqual(letras.length, 5);
  assert.notStrictEqual(letras.join(""), "LIVRO", "entregou a resposta pronta");
  assert.deepStrictEqual(letras.slice().sort(), "LIVRO".split("").sort(),
    "trocou as letras da palavra");
});

teste("palavra de uma letra só, ou de letras iguais, não trava o jogo", function () {
  assert.deepStrictEqual(a.anagramaEmbaralhar("A", () => 0), ["A"]);
  assert.deepStrictEqual(a.anagramaEmbaralhar("AAA", () => 0.999999), ["A", "A", "A"]);
});

teste("a dica revela uma letra por vez e para quando acaba a palavra", function () {
  let e = a.anagramaNovo(BANCO, () => 0);
  assert.strictEqual(a.anagramaPista(e), "_ _ _ _ _");
  e = a.anagramaDica(e);
  assert.strictEqual(a.anagramaPista(e), "L _ _ _ _");
  for (let i = 0; i < 20; i++) { e = a.anagramaDica(e); }
  assert.strictEqual(e.reveladas, 5, "passou do tamanho da palavra");
  assert.strictEqual(a.anagramaPista(e), "L I V R O");
});

teste("acerto não depende de acento nem de maiúscula", function () {
  const e = a.anagramaNovo([{ resposta: "CAFE", dica: "x" }], () => 0);
  assert.ok(a.anagramaConferir(e, "café"));
  assert.ok(a.anagramaConferir(e, " CAFE "));
  assert.ok(!a.anagramaConferir(e, "chá"));
});

teste("errar não tira nada: o estado continua igual", function () {
  const e = a.anagramaNovo(BANCO, () => 0);
  assert.ok(!a.anagramaConferir(e, "casa"));
  assert.strictEqual(e.reveladas, 0);
  assert.strictEqual(e.resposta, "LIVRO");
});

teste("dica até o fim também encerra a palavra, sem obrigar a digitar", function () {
  let e = a.anagramaNovo(BANCO, () => 0);
  assert.ok(!a.anagramaCerto(e, ""));
  for (let i = 0; i < 5; i++) { e = a.anagramaDica(e); }
  assert.ok(a.anagramaCerto(e, ""));
});

teste("usa o banco das cruzadas, que já é curto e sem acento na resposta", function () {
  assert.ok(c.CRUZADAS_BANCO.length >= 20);
  c.CRUZADAS_BANCO.forEach(function (p) {
    assert.strictEqual(p.resposta, a.anagramaNormalizar(p.resposta),
      "resposta com acento ou minúscula: " + p.resposta);
    assert.ok(p.dica && p.dica.trim() !== "", "palavra sem dica: " + p.resposta);
  });
});

fim("anagrama");
