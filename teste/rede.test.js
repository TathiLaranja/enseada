/* Teste das regras da Minha rede. Node puro: node teste/rede.test.js */

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
const r = require("../js/rede.js");

teste("sem nome não guarda", function () {
  assert.strictEqual(r.validarContato({ nome: "   ", rotulo: "x" }).ok, false);
  assert.strictEqual(r.novoContato({ nome: "", rotulo: "x" }, "1"), null);
});

teste("rótulo é opcional e o texto é aparado", function () {
  const c = r.novoContato({ nome: "  Ana ", rotulo: "" }, "1");
  assert.deepStrictEqual(c, { id: "1", nome: "Ana", rotulo: "" });
});

teste("trocar muda só a pessoa escolhida", function () {
  const lista = [{ id: "1", nome: "Ana", rotulo: "" }, { id: "2", nome: "Bia", rotulo: "" }];
  const nova = r.trocarContato(lista, "2", { nome: "Beatriz", rotulo: "irmã" });
  assert.deepStrictEqual(nova[0], lista[0]);
  assert.deepStrictEqual(nova[1], { id: "2", nome: "Beatriz", rotulo: "irmã" });
});

teste("trocar com nome vazio não altera a lista", function () {
  const lista = [{ id: "1", nome: "Ana", rotulo: "" }];
  assert.deepStrictEqual(r.trocarContato(lista, "1", { nome: " ", rotulo: "" }), lista);
});

teste("tirar remove só a pessoa escolhida", function () {
  const lista = [{ id: "1", nome: "Ana", rotulo: "" }, { id: "2", nome: "Bia", rotulo: "" }];
  assert.deepStrictEqual(r.tirarContato(lista, "1").map(function (c) { return c.id; }), ["2"]);
  assert.strictEqual(lista.length, 2);
});

fim("Minha rede");
