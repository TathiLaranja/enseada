/* Teste do armazenamento. Node puro: node teste/armazenamento.test.js
   O depósito falso imita o localStorage do navegador. */

const assert = require("node:assert");
const g = require("../js/armazenamento.js");

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

function depositoFalso(conteudoInicial) {
  const caixa = Object.assign({}, conteudoInicial || {});
  return {
    getItem: function (chave) {
      return Object.prototype.hasOwnProperty.call(caixa, chave) ? caixa[chave] : null;
    },
    setItem: function (chave, valor) { caixa[chave] = String(valor); },
    removeItem: function (chave) { delete caixa[chave]; },
    espiar: function () { return caixa; }
  };
}

function depositoCheio() {
  return {
    getItem: function () { return null; },
    setItem: function () { throw new Error("cheio"); },
    removeItem: function () { throw new Error("cheio"); }
  };
}

teste("aparelho novo começa sem âncora nenhuma", function () {
  const armazem = g.criarArmazenamento(depositoFalso());
  assert.deepStrictEqual(armazem.ler().ancoras, []);
});

teste("aparelho novo começa com a letra normal", function () {
  const ajustes = g.criarArmazenamento(depositoFalso()).ler().ajustes;
  assert.strictEqual(ajustes.fonte, "normal");
});

teste("o tema escuro antigo não vale: só o Modo Baixo Estímulo liga o tema", function () {
  const bruto = JSON.stringify({ ajustes: { tema: "escuro", fonte: "normal" } });
  const ajustes = g.criarArmazenamento(depositoFalso({ "enseada.v1": bruto })).ler().ajustes;
  assert.deepStrictEqual(Object.keys(ajustes).sort(), ["boasVindasVistas", "fonte", "tema"]);
  assert.strictEqual(ajustes.tema, "claro");
});

teste("grava e lê de volta igual", function () {
  const armazem = g.criarArmazenamento(depositoFalso());
  armazem.mudar(function (d) {
    d.ancoras = [{ id: "x", oQueE: "Nadar", oQueFaz: "no meu ritmo", link: "", peso: "pesada", estado: "ativa" }];
    return d;
  });
  const lido = armazem.ler().ancoras[0];
  assert.strictEqual(lido.oQueE, "Nadar");
  assert.strictEqual(lido.peso, "pesada");
});

teste("conteúdo estragado não derruba o app", function () {
  const armazem = g.criarArmazenamento(depositoFalso({ "enseada.v1": "{isto não é json" }));
  assert.deepStrictEqual(armazem.ler().ancoras, []);
});

teste("âncora sem o campo o que é não entra", function () {
  const bruto = JSON.stringify({ ancoras: [{ id: "x", oQueE: "   " }, { id: "y", oQueE: "Nadar" }] });
  const armazem = g.criarArmazenamento(depositoFalso({ "enseada.v1": bruto }));
  const lista = armazem.ler().ancoras;
  assert.strictEqual(lista.length, 1);
  assert.strictEqual(lista[0].id, "y");
});

teste("estado desconhecido vira ativa, peso desconhecido vira leve", function () {
  const bruto = JSON.stringify({ ancoras: [{ id: "x", oQueE: "Nadar", peso: "enorme", estado: "sumida" }] });
  const lido = g.criarArmazenamento(depositoFalso({ "enseada.v1": bruto })).ler().ancoras[0];
  assert.strictEqual(lido.peso, "leve");
  assert.strictEqual(lido.estado, "ativa");
});

teste("tamanho de letra inventado volta para normal", function () {
  const bruto = JSON.stringify({ ajustes: { fonte: "gigante" } });
  const ajustes = g.criarArmazenamento(depositoFalso({ "enseada.v1": bruto })).ler().ajustes;
  assert.strictEqual(ajustes.fonte, "normal");
});

teste("o roteiro parado no meio volta de onde parou", function () {
  const armazem = g.criarArmazenamento(depositoFalso());
  armazem.mudar(function (d) {
    d.roteiro = { etapa: "mecanismo", indice: 4, abertura1: "Natação", abertura2: "", memoria: "", itens: ["Natação"], itemEscolhido: "Natação", mecanismo: ["sim"] };
    return d;
  });
  const voltou = armazem.ler().roteiro;
  assert.strictEqual(voltou.etapa, "mecanismo");
  assert.strictEqual(voltou.indice, 4);
  assert.strictEqual(voltou.mecanismo[0], "sim");
});

teste("o que foi escrito no tempo do nome Pouso não se perde", function () {
  const antigo = JSON.stringify({ ancoras: [{ id: "x", oQueE: "Nadar", oQueFaz: "no meu ritmo", link: "", peso: "pesada", estado: "ativa" }] });
  const deposito = depositoFalso({ "pouso.v1": antigo });
  const armazem = g.criarArmazenamento(deposito);
  const lista = armazem.ler().ancoras;
  assert.strictEqual(lista.length, 1);
  assert.strictEqual(lista[0].oQueE, "Nadar");
  assert.strictEqual(lista[0].peso, "pesada");
});

teste("depois de trazer, a chave antiga some e não volta a ser usada", function () {
  const antigo = JSON.stringify({ ancoras: [{ id: "x", oQueE: "Nadar" }] });
  const deposito = depositoFalso({ "pouso.v1": antigo });
  const armazem = g.criarArmazenamento(deposito);
  armazem.ler();
  assert.deepStrictEqual(Object.keys(deposito.espiar()), ["enseada.v1"]);
});

teste("o que já está no nome novo manda, e o antigo não atropela", function () {
  const antigo = JSON.stringify({ ancoras: [{ id: "x", oQueE: "Antiga" }] });
  const novo = JSON.stringify({ ancoras: [{ id: "y", oQueE: "Nova" }] });
  const armazem = g.criarArmazenamento(depositoFalso({ "pouso.v1": antigo, "enseada.v1": novo }));
  const lista = armazem.ler().ancoras;
  assert.strictEqual(lista.length, 1);
  assert.strictEqual(lista[0].oQueE, "Nova");
});

teste("apagar tudo não deixa nada no aparelho", function () {
  const deposito = depositoFalso();
  const armazem = g.criarArmazenamento(deposito);
  armazem.mudar(function (d) {
    d.ancoras = [{ id: "x", oQueE: "Nadar", oQueFaz: "", link: "", peso: "leve", estado: "ativa" }];
    return d;
  });
  armazem.apagarTudo();
  assert.deepStrictEqual(Object.keys(deposito.espiar()), []);
  assert.deepStrictEqual(armazem.ler().ancoras, []);
});

teste("baixar meus dados devolve tudo em texto", function () {
  const armazem = g.criarArmazenamento(depositoFalso());
  armazem.mudar(function (d) {
    d.ancoras = [{ id: "x", oQueE: "Nadar", oQueFaz: "no meu ritmo", link: "", peso: "leve", estado: "ativa" }];
    return d;
  });
  const texto = armazem.exportar();
  assert.ok(texto.indexOf("Nadar") !== -1);
  assert.ok(texto.indexOf("no meu ritmo") !== -1);
});

teste("aparelho sem espaço não quebra o app", function () {
  const armazem = g.criarArmazenamento(depositoCheio());
  assert.strictEqual(armazem.gravar({ ancoras: [] }), false);
  assert.deepStrictEqual(armazem.ler().ancoras, []);
});

teste("Modo Baixo Estímulo começa desligado e fica guardado quando ligado", function () {
  const armazem = g.criarArmazenamento(depositoFalso());
  assert.strictEqual(armazem.ler().ajustes.tema, "claro");
  armazem.mudar(function (d) { d.ajustes.tema = "baixo"; return d; });
  assert.strictEqual(armazem.ler().ajustes.tema, "baixo");
});

teste("boas-vindas: começa por mostrar, guarda só sim ou não, e valor estranho volta a mostrar", function () {
  const armazem = g.criarArmazenamento(depositoFalso());
  assert.strictEqual(armazem.ler().ajustes.boasVindasVistas, false);
  armazem.mudar(function (d) { d.ajustes.boasVindasVistas = true; return d; });
  assert.strictEqual(armazem.ler().ajustes.boasVindasVistas, true);
  assert.strictEqual(g.normalizar({ ajustes: { boasVindasVistas: "sim" } }).ajustes.boasVindasVistas, false);
});

teste("tema desconhecido volta para o claro", function () {
  const n = g.normalizar({ ajustes: { fonte: "normal", tema: "vermelho" } });
  assert.strictEqual(n.ajustes.tema, "claro");
});

teste("a folha de Escrever volta exatamente como foi escrita", function () {
  const armazem = g.criarArmazenamento(depositoFalso());
  armazem.mudar(function (d) { d.escrita = "linha 1\n\n  linha 3"; return d; });
  assert.strictEqual(armazem.ler().escrita, "linha 1\n\n  linha 3");
});

teste("desenho guarda os traços e joga fora pontos estragados", function () {
  const n = g.normalizar({ desenho: [
    { apagar: false, pontos: [[0.1, 0.2], [0.3, "x"], null, [0.4, 0.5]] },
    { apagar: true, pontos: [] },
    "lixo"
  ] });
  assert.strictEqual(n.desenho.length, 1);
  assert.deepStrictEqual(n.desenho[0].pontos, [[0.1, 0.2], [0.4, 0.5]]);
});

teste("traço guarda só o nome de uma cor do tema; código de cor solto vira o texto", function () {
  const n = g.normalizar({ desenho: [
    { cor: "detalhe", pontos: [[0, 0]] },
    { cor: "#E53E3E", pontos: [[0, 0]] },
    { pontos: [[0, 0]] }
  ] });
  assert.deepStrictEqual(n.desenho.map(function (t) { return t.cor; }), ["detalhe", "texto", "texto"]);
});

teste("rede guarda só nome e rótulo, e descarta o que não tem nome", function () {
  const n = g.normalizar({ rede: [
    { id: "a", nome: "Ana", rotulo: "vizinha", telefone: "123" },
    { id: "b", nome: "   ", rotulo: "x" },
    { id: "c", nome: "Bia" }
  ] });
  assert.deepStrictEqual(n.rede, [
    { id: "a", nome: "Ana", rotulo: "vizinha" },
    { id: "c", nome: "Bia", rotulo: "" }
  ]);
});

teste("apagar tudo também apaga escrita, desenho e rede", function () {
  const armazem = g.criarArmazenamento(depositoFalso());
  armazem.mudar(function (d) {
    d.escrita = "oi"; d.desenho = [{ apagar: false, pontos: [[0, 0]] }];
    d.rede = [{ id: "a", nome: "Ana", rotulo: "" }];
    return d;
  });
  armazem.apagarTudo();
  const d = armazem.ler();
  assert.strictEqual(d.escrita, "");
  assert.deepStrictEqual(d.desenho, []);
  assert.deepStrictEqual(d.rede, []);
});

if (falhas.length > 0) {
  console.log("FALHOU " + falhas.length + " de " + (passaram + falhas.length));
  falhas.forEach(function (f) { console.log(" - " + f); });
} else {
  console.log("Passaram " + passaram + " testes de armazenamento.");
}
process.exit(falhas.length > 0 ? 1 : 0);
