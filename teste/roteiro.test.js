/* Teste do roteiro. Node puro, sem biblioteca: node teste/roteiro.test.js
   O teste mais importante deste arquivo é o último grupo: o app só pode
   devolver palavras que a pessoa escreveu. */

const assert = require("node:assert");
const r = require("../js/roteiro.js");
const p = require("../js/perguntas.js");

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

function responderTudo(estado, respostas) {
  respostas.forEach(function (resposta) {
    estado = resposta === null ? r.pular(estado) : r.responder(estado, resposta);
  });
  return estado;
}

teste("quebra o texto em linhas e tira marcador de lista", function () {
  assert.deepStrictEqual(r.linhas("- Natação\n\n  * Balé \n• Violão"), ["Natação", "Balé", "Violão"]);
});

teste("começa na primeira abertura", function () {
  assert.strictEqual(r.iniciar().etapa, "abertura1");
});

teste("duas aberturas curtas descem para a memória única", function () {
  let e = r.responder(r.iniciar(), "Natação");
  e = r.responder(e, "");
  assert.strictEqual(e.etapa, "memoria");
});

teste("aberturas com três linhas pulam a memória única", function () {
  let e = r.responder(r.iniciar(), "Natação\nBalé");
  e = r.responder(e, "Reler o mesmo livro");
  assert.strictEqual(e.etapa, "escolher");
});

teste("a lista de itens é só o que ela escreveu, sem repetir", function () {
  let e = r.responder(r.iniciar(), "Natação\nBalé");
  e = r.responder(e, "natação\nDesenhar");
  assert.deepStrictEqual(e.itens, ["Natação", "Balé", "Desenhar"]);
});

teste("depois de escolher o item vêm as perguntas de mecanismo", function () {
  let e = r.responder(r.responder(r.iniciar(), "Natação\nBalé"), "Desenhar");
  e = r.responder(e, "Natação");
  assert.strictEqual(e.etapa, "mecanismo");
  assert.strictEqual(e.indice, 0);
});

teste("são dez perguntas de mecanismo e depois o fim", function () {
  assert.strictEqual(p.MECANISMO.length, 10);
  let e = r.responder(r.responder(r.iniciar(), "Natação\nBalé"), "Desenhar");
  e = r.responder(e, "Natação");
  e = responderTudo(e, ["sim", "não", "não", "sim", "de cor", "não", "sozinha", "horas", "eu", "sim"]);
  assert.strictEqual(e.etapa, "fim");
});

teste("pular não guarda resposta nenhuma", function () {
  let e = r.responder(r.responder(r.iniciar(), "Natação\nBalé"), "Desenhar");
  e = r.responder(e, "Natação");
  e = r.pular(e);
  assert.strictEqual(e.mecanismo[0], "");
  assert.strictEqual(e.indice, 1);
});

teste("dá para voltar no meio das perguntas", function () {
  let e = r.responder(r.responder(r.iniciar(), "Natação\nBalé"), "Desenhar");
  e = r.responder(e, "Natação");
  e = r.responder(e, "estavam ocupadas");
  e = r.voltar(e);
  assert.strictEqual(e.indice, 0);
  assert.strictEqual(e.mecanismo[0], "estavam ocupadas");
});

teste("pulou tudo: não existe devolutiva inventada", function () {
  let e = r.responder(r.responder(r.iniciar(), "Natação\nBalé"), "Desenhar");
  e = r.responder(e, "Natação");
  e = responderTudo(e, [null, null, null, null, null, null, null, null, null, null]);
  assert.strictEqual(r.montarDevolutiva(e), null);
});

teste("a devolutiva repete as respostas dela, na ordem", function () {
  let e = r.responder(r.responder(r.iniciar(), "Natação\nBalé"), "Desenhar");
  e = r.responder(e, "Natação");
  e = responderTudo(e, ["mãos ocupadas", null, "sem palavra", null, null, null, null, null, null, "sim, ficava"]);
  const d = r.montarDevolutiva(e);
  assert.deepStrictEqual(d.palavras, ["mãos ocupadas", "sem palavra", "sim, ficava"]);
  assert.strictEqual(d.item, "Natação");
});

/* A regra número 2 do produto: o app nunca sugere uma âncora que ela não
   escreveu. Estes dois testes são os que guardam essa regra. */

teste("o rascunho da âncora só tem palavras dela", function () {
  let e = r.responder(r.responder(r.iniciar(), "Natação\nBalé"), "Desenhar");
  e = r.responder(e, "Natação");
  e = responderTudo(e, ["mãos ocupadas", null, null, null, null, null, null, null, null, "ficava quieta"]);
  const rascunho = r.rascunhoDeAncora(e);
  assert.strictEqual(rascunho.oQueE, "Natação");
  assert.strictEqual(rascunho.oQueFaz, "mãos ocupadas. ficava quieta");
});

teste("a devolutiva não traz nenhuma palavra do quadro de mecanismos", function () {
  const quadro = [
    "baixar o som do mundo", "ocupar as mãos", "previsibilidade",
    "corpo em ritmo próprio", "corpo em ritmo externo", "sistema com regras"
  ];
  let e = r.responder(r.responder(r.iniciar(), "Natação\nBalé"), "Desenhar");
  e = r.responder(e, "Natação");
  e = responderTudo(e, ["cansa", null, null, null, null, null, null, null, null, null]);
  const saida = JSON.stringify(r.montarDevolutiva(e)).toLowerCase();
  quadro.forEach(function (familia) {
    assert.strictEqual(saida.indexOf(familia), -1, "vazou a palavra do app: " + familia);
  });
});

teste("nenhuma pergunta do roteiro oferece exemplo de âncora pronta", function () {
  const proibidas = ["por exemplo", "experimente", "que tal", "sugestão", "recomendamos"];
  const tudo = [p.ABERTURA_UM, p.ABERTURA_DOIS, p.MEMORIA_UNICA, p.ESCOLHER_ITEM]
    .concat(p.MECANISMO).join(" ").toLowerCase();
  proibidas.forEach(function (palavra) {
    assert.strictEqual(tudo.indexOf(palavra), -1, "o app sugeriu: " + palavra);
  });
});

if (falhas.length > 0) {
  console.log("FALHOU " + falhas.length + " de " + (passaram + falhas.length));
  falhas.forEach(function (f) { console.log(" - " + f); });
} else {
  console.log("Passaram " + passaram + " testes de roteiro.");
}
process.exit(falhas.length > 0 ? 1 : 0);
