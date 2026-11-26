/* Teste do som do app. Node puro: node teste/som.test.js */

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
const s = require("../js/som.js");
const fs = require("node:fs");

teste("o volume tem teto, e pedir mais alto não passa dele", function () {
  assert.ok(s.SOM_VOLUME_MAXIMO <= 0.2, "teto alto demais: " + s.SOM_VOLUME_MAXIMO);
  assert.ok(s.SOM_VOLUME_PADRAO <= s.SOM_VOLUME_MAXIMO);
  assert.strictEqual(s.somLimitarVolume(9), s.SOM_VOLUME_MAXIMO);
  assert.strictEqual(s.somLimitarVolume(-3), 0);
  assert.strictEqual(s.somLimitarVolume("alto"), s.SOM_VOLUME_PADRAO);
  assert.strictEqual(s.somLimitarVolume(undefined), s.SOM_VOLUME_PADRAO);
  assert.strictEqual(s.somLimitarVolume(0.05), 0.05);
});

teste("as notas são distintas, em ordem, e dentro do que o ouvido aguenta", function () {
  assert.ok(s.SOM_NOTAS.length >= 6);
  const hz = s.SOM_NOTAS.map(n => n.hz);
  hz.forEach(function (f, i) {
    assert.ok(f >= 200 && f <= 900, "frequência fora da faixa confortável: " + f);
    if (i > 0) { assert.ok(f > hz[i - 1], "notas fora de ordem em " + f); }
  });
  const ids = s.SOM_NOTAS.map(n => n.id);
  ids.forEach((id, i) => assert.strictEqual(ids.indexOf(id), i, "id repetido: " + id));
  /* cada som tem nome escrito: som nunca informa sozinho */
  s.SOM_NOTAS.forEach(n => assert.ok(n.nome && n.nome.trim() !== "", "nota sem nome: " + n.id));
});

teste("sem Web Audio no aparelho, nada quebra", function () {
  assert.strictEqual(s.somContexto({}), null);
  assert.strictEqual(s.somContexto(null), null);
  assert.strictEqual(s.somTocarNota(null, 440, 0.5, 0.1), false);
});

teste("o som não começa sozinho: o contexto só nasce quando pedem", function () {
  let criados = 0;
  function Falso() { criados++; this.currentTime = 0; this.state = "running"; }
  const janela = { AudioContext: Falso };
  assert.strictEqual(criados, 0);
  s.somContexto(janela);
  assert.strictEqual(criados, 1);
  s.somContexto(janela);
  assert.strictEqual(criados, 1, "criou um contexto novo a cada pedido");
});

teste("o som sai com subida e descida, e com o volume limitado", function () {
  const feito = { ganhos: [], parou: null, comecou: null };
  const contexto = {
    currentTime: 10,
    destination: {},
    createOscillator: () => ({ frequency: {}, connect(){}, start(t){feito.comecou=t;}, stop(t){feito.parou=t;} }),
    createGain: () => ({ gain: {
      setValueAtTime(v){ feito.ganhos.push(v); },
      exponentialRampToValueAtTime(v){ feito.ganhos.push(v); }
    }, connect(){} })
  };
  assert.strictEqual(s.somTocarNota(contexto, 440, 0.6, 99), true);
  assert.ok(Math.max.apply(null, feito.ganhos) <= s.SOM_VOLUME_MAXIMO, "passou do teto de volume");
  assert.ok(feito.ganhos.length >= 3, "sem subida e descida o som entra seco");
  assert.strictEqual(feito.comecou, 10);
  assert.ok(feito.parou > 10 && feito.parou <= 10.7);
  /* duração absurda também tem teto */
  s.somTocarNota(contexto, 440, 60, 0.1);
  assert.ok(feito.parou <= 12.05, "deixou tocar uma nota longa demais");
});

teste("nenhum arquivo de áudio e nada vindo da rede", function () {
  const js = fs.readFileSync("js/som.js", "utf8") +
    fs.readFileSync("js/tela-somemoria.js", "utf8");
  [/fetch\(/, /XMLHttpRequest/, /new Audio\(/, /<audio/i, /\.mp3/, /\.wav/, /\.ogg/, /https?:\/\//]
    .forEach(p => assert.ok(!p.test(js), "o som passou a depender de " + p));
});

fim("som");
