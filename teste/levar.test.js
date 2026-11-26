/* Teste de levar e trazer âncoras. Node puro: node teste/levar.test.js */

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
const l = require("../js/levar.js");
let n = 0;
const novoId = () => "id" + (++n);

teste("o pacote que sai leva só as âncoras, nunca o resto", function () {
  const p = l.levarPacoteDeAncoras([
    { id: "a1", oQueE: "Caminhar", oQueFaz: "Acalma", link: "", peso: "leve", estado: "ativa" }
  ]);
  assert.strictEqual(p.tipo, "ancoras");
  assert.strictEqual(p.ancoras.length, 1);
  const texto = JSON.stringify(p);
  ["escrita", "fotos", "album", "desenho", "rascunho", "roteiro", "mini"].forEach(function (campo) {
    assert.ok(texto.indexOf(campo) === -1, "o pacote levou junto: " + campo);
  });
  /* nem o id de dentro do aparelho dela */
  assert.strictEqual(p.ancoras[0].id, undefined, "o pacote levou o id interno");
});

teste("âncora sem o que ela é não entra no pacote nem na junção", function () {
  const p = l.levarPacoteDeAncoras([{ oQueE: "   " }, { oQueFaz: "só isso" }, null, "x"]);
  assert.strictEqual(p.ancoras.length, 0);
  assert.deepStrictEqual(l.levarJuntar([], [{ oQueE: "" }, null], novoId), []);
});

teste("arquivo estranho é recusado inteiro, não entra pela metade", function () {
  ["", "nada disso", "{", "[1,2,3]", "null", JSON.stringify({ oi: 1 }),
   JSON.stringify({ ancoras: "texto" }), JSON.stringify({ ancoras: [] }),
   JSON.stringify({ ancoras: [{ oQueFaz: "sem o que é" }] })]
    .forEach(function (t) {
      assert.strictEqual(l.levarLer(t), null, "aceitou lixo: " + t.slice(0, 30));
    });
});

teste("lê tanto o pacote de âncoras quanto o arquivo inteiro da Ajuda", function () {
  const pacote = JSON.stringify(l.levarPacoteDeAncoras([{ oQueE: "Chá" }]));
  assert.strictEqual(l.levarLer(pacote).ancoras.length, 1);
  const inteiro = JSON.stringify({ versao: 1, escrita: "diário secreto",
    ancoras: [{ id: "z", oQueE: "Chá", oQueFaz: "Esquenta" }], fotos: [] });
  const lido = l.levarLer(inteiro);
  assert.strictEqual(lido.ancoras.length, 1);
  assert.strictEqual(lido.escrita, undefined, "trouxe junto o que ela escreveu");
});

teste("trazer nunca apaga e nunca sobrescreve o que já estava lá", function () {
  const minhas = [{ id: "a1", oQueE: "Caminhar", oQueFaz: "Meu jeito", peso: "pesada", estado: "dormente" }];
  const juntas = l.levarJuntar(minhas, [{ oQueE: "Chá", oQueFaz: "Esquenta" }], novoId);
  assert.strictEqual(juntas.length, 2);
  assert.deepStrictEqual(juntas[0], minhas[0], "mexeu na âncora que já existia");
  assert.deepStrictEqual(minhas.length, 1, "mexeu na lista de origem");
});

teste("âncora repetida não entra de novo, mesmo com espaço e caixa diferentes", function () {
  const minhas = [{ id: "a1", oQueE: "Caminhar", oQueFaz: "Acalma", peso: "leve", estado: "ativa" }];
  const juntas = l.levarJuntar(minhas, [
    { oQueE: "  caminhar ", oQueFaz: "ACALMA" },
    { oQueE: "Caminhar", oQueFaz: "Acalma" },
    { oQueE: "Caminhar", oQueFaz: "outra coisa" }
  ], novoId);
  assert.strictEqual(juntas.length, 2, "duplicou âncora");
  assert.strictEqual(juntas[1].oQueFaz, "outra coisa");
});

teste("a âncora trazida ganha id novo e chega ativa", function () {
  const juntas = l.levarJuntar([{ id: "a1", oQueE: "X" }],
    [{ oQueE: "Y", peso: "pesada", estado: "dormente", id: "a1" }], novoId);
  assert.notStrictEqual(juntas[1].id, "a1", "trouxe o id do aparelho da outra pessoa");
  assert.strictEqual(juntas[1].estado, "ativa", "âncora trazida não pode chegar dormente");
  assert.strictEqual(juntas[1].peso, "pesada");
});

teste("dá para dizer quantas entrariam antes de mexer em qualquer coisa", function () {
  const minhas = [{ id: "a1", oQueE: "Caminhar", oQueFaz: "Acalma" }];
  const trazidas = [{ oQueE: "Caminhar", oQueFaz: "Acalma" }, { oQueE: "Chá" }, { oQueE: "Chá" }];
  assert.strictEqual(l.levarQuantasNovas(minhas, trazidas), 1);
  assert.strictEqual(minhas.length, 1, "contar não pode mexer em nada");
  assert.strictEqual(l.levarQuantasNovas([], []), 0);
});

fim("levar e trazer");
