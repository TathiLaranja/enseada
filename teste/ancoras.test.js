/* Teste das regras de âncora. Node puro, sem biblioteca: node teste/ancoras.test.js */

const assert = require("node:assert");
const a = require("../js/ancoras.js");

let passaram = 0;
const falhas = [];

function teste(nome, corpo) {
  try {
    corpo();
    passaram++;
  } catch (erro) {
    falhas.push(nome + "\n   " + erro.message);
  }
}

const valida = { oQueE: "Nadar", oQueFaz: "meu corpo no meu ritmo", link: "", peso: "leve" };

teste("exige o campo o que é", function () {
  assert.strictEqual(a.validarAncora({ oQueE: "   ", peso: "leve" }).ok, false);
});

teste("exige escolher o peso", function () {
  assert.strictEqual(a.validarAncora({ oQueE: "Nadar", peso: "" }).ok, false);
});

teste("recusa peso inventado", function () {
  assert.strictEqual(a.validarAncora({ oQueE: "Nadar", peso: "media" }).ok, false);
});

teste("aceita âncora sem link e sem o que faz", function () {
  assert.strictEqual(a.validarAncora({ oQueE: "Nadar", peso: "pesada" }).ok, true);
});

teste("recusa link javascript:", function () {
  assert.strictEqual(a.linkAceito("javascript:alert(1)"), null);
});

teste("recusa link data:", function () {
  assert.strictEqual(a.linkAceito("data:text/html,<b>oi</b>"), null);
});

teste("recusa texto que não é link", function () {
  assert.strictEqual(a.linkAceito("minha playlist"), null);
});

teste("aceita link https", function () {
  assert.strictEqual(a.linkAceito("https://exemplo.com/lista"), "https://exemplo.com/lista");
});

teste("âncora nova nasce ativa", function () {
  assert.strictEqual(a.criarAncora(valida, "id1").estado, "ativa");
});

teste("não guarda data, contador nem histórico", function () {
  const campos = Object.keys(a.criarAncora(valida, "id1")).sort();
  assert.deepStrictEqual(campos, ["estado", "id", "link", "oQueE", "oQueFaz", "peso"]);
});

teste("dormente sai da lista ativa e continua guardada", function () {
  let lista = a.acrescentar([], valida, "id1");
  lista = a.adormecer(lista, "id1");
  assert.strictEqual(a.ativas(lista).length, 0);
  assert.strictEqual(a.dormentes(lista).length, 1);
  assert.strictEqual(lista.length, 1);
});

teste("trazer de volta devolve para a lista ativa", function () {
  let lista = a.acrescentar([], valida, "id1");
  lista = a.acordar(a.adormecer(lista, "id1"), "id1");
  assert.strictEqual(a.ativas(lista).length, 1);
});

teste("editar mantém id e estado dormente", function () {
  let lista = a.adormecer(a.acrescentar([], valida, "id1"), "id1");
  lista = a.editar(lista, "id1", { oQueE: "Nadar de manhã", oQueFaz: "", link: "", peso: "pesada" });
  assert.strictEqual(lista[0].id, "id1");
  assert.strictEqual(lista[0].estado, "dormente");
  assert.strictEqual(lista[0].oQueE, "Nadar de manhã");
});

teste("editar não mexe nas outras", function () {
  let lista = a.acrescentar(a.acrescentar([], valida, "id1"), { oQueE: "Desenhar", peso: "leve" }, "id2");
  lista = a.editar(lista, "id1", { oQueE: "Outra", peso: "leve" });
  assert.strictEqual(a.porId(lista, "id2").oQueE, "Desenhar");
});

teste("apagar tira só a escolhida", function () {
  let lista = a.acrescentar(a.acrescentar([], valida, "id1"), { oQueE: "Desenhar", peso: "leve" }, "id2");
  lista = a.apagar(lista, "id1");
  assert.strictEqual(lista.length, 1);
  assert.strictEqual(lista[0].id, "id2");
});

teste("o app não preenche o que isso faz em você", function () {
  assert.strictEqual(a.criarAncora({ oQueE: "Nadar", peso: "leve" }, "id1").oQueFaz, "");
});

teste("a lista não vem com nenhuma âncora de fábrica", function () {
  assert.deepStrictEqual(a.ativas([]), []);
});

if (falhas.length > 0) {
  console.log("FALHOU " + falhas.length + " de " + (passaram + falhas.length));
  falhas.forEach(function (f) { console.log(" - " + f); });
} else {
  console.log("Passaram " + passaram + " testes de âncora.");
}
process.exit(falhas.length > 0 ? 1 : 0);
