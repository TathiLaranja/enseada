/* Teste da Forca sem forca. Node puro: node teste/forca.test.js */

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
const f = require("../js/forca.js");
const fs = require("node:fs");
const BANCO = [{ resposta: "CASA", dica: "Lugar onde se mora." }];
const nova = () => f.forcaNova(BANCO, () => 0);

teste("a palavra começa escondida e a dica de texto aparece", function () {
  const e = nova();
  assert.strictEqual(f.forcaPista(e), "_ _ _ _");
  assert.strictEqual(e.dica, "Lugar onde se mora.");
  assert.ok(!f.forcaAcertou(e));
});

teste("letra certa aparece em TODAS as casas onde ela está", function () {
  let e = f.forcaTentar(nova(), "a");
  assert.strictEqual(f.forcaPista(e), "_ A _ A");
});

teste("letra da palavra não pode entrar na lista de fora da palavra", function () {
  let e = f.forcaTentar(f.forcaTentar(nova(), "A"), "Z");
  assert.deepStrictEqual(f.forcaCertas(e), ["A"]);
  assert.deepStrictEqual(f.forcaErradas(e), ["Z"]);
  assert.ok(f.forcaTemLetra(e, "A") && !f.forcaTemLetra(e, "Z"));
});

teste("letra errada não some: fica na lista para não repetir", function () {
  let e = f.forcaTentar(nova(), "Z");
  assert.deepStrictEqual(f.forcaErradas(e), ["Z"]);
  assert.strictEqual(f.forcaPista(e), "_ _ _ _");
  /* e tentar de novo não duplica */
  e = f.forcaTentar(e, "z");
  assert.deepStrictEqual(e.tentadas, ["Z"]);
});

teste("não existe perder: pode errar o alfabeto inteiro e seguir jogando", function () {
  let e = nova();
  f.FORCA_ALFABETO.split("").forEach(function (l) {
    if ("CASA".indexOf(l) === -1) { e = f.forcaTentar(e, l); }
  });
  assert.strictEqual(f.forcaErradas(e).length, 23);
  assert.ok(!f.forcaAcertou(e), "não pode ter acabado sem acertar a palavra");
  e = f.forcaTentar(f.forcaTentar(e, "C"), "A");
  e = f.forcaTentar(e, "S");
  assert.ok(f.forcaAcertou(e), "depois de todos os erros, ainda tem de dar para ganhar");
});

teste("nada que não seja uma letra entra na conta", function () {
  const e = nova();
  ["", " ", "1", "AB", "!", null, undefined].forEach(function (x) {
    assert.deepStrictEqual(f.forcaTentar(e, x).tentadas, [], "aceitou " + JSON.stringify(x));
  });
});

teste("acento e minúscula valem a mesma letra", function () {
  const e = f.forcaNova([{ resposta: "CAFE", dica: "x" }], () => 0);
  assert.strictEqual(f.forcaPista(f.forcaTentar(e, "é")), "_ _ _ E");
});

teste("a dica revela a próxima letra que falta, da esquerda para a direita", function () {
  let e = nova();
  e = f.forcaDica(e);
  assert.strictEqual(f.forcaPista(e), "C _ _ _");
  e = f.forcaDica(e);
  assert.strictEqual(f.forcaPista(e), "C A _ A");
  e = f.forcaDica(e);
  assert.ok(f.forcaAcertou(e));
  /* dica com tudo revelado não quebra */
  assert.deepStrictEqual(f.forcaDica(e).tentadas, e.tentadas);
});

teste("não há boneco, nem contagem de erro, nem derrota no código", function () {
  const js = fs.readFileSync("js/forca.js", "utf8") +
    fs.readFileSync("js/tela-forca.js", "utf8");
  [/perdeu/i, /derrota/i, /você perde/i, /enforc/i, /vidas?\b/i, /tentativas restantes/i]
    .forEach(function (proibido) {
      assert.ok(!proibido.test(js), "o jogo voltou a ter " + proibido);
    });
});

fim("forca");
