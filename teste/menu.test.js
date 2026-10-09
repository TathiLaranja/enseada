/* Teste do menu fixo. Node puro: node teste/menu.test.js */

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
const fs = require("node:fs");
const menu = require("../js/menu.js");

const telas = ["index", "ancoras", "achar", "escrever", "desenhar", "fotos", "jogos", "rede", "ajuda"];

teste("o menu tem as nove telas, sem repetir", function () {
  const arquivos = menu.ITENS_DO_MENU.map(function (i) { return i.arquivo; });
  assert.deepStrictEqual(arquivos, telas.map(function (t) { return t + ".html"; }));
});

teste("caminho vazio ou barra final é a tela Agora", function () {
  assert.strictEqual(menu.arquivoDaTela("/"), "index.html");
  assert.strictEqual(menu.arquivoDaTela("/enseada/"), "index.html");
  assert.strictEqual(menu.arquivoDaTela("/enseada/rede.html"), "rede.html");
});

teste("toda tela existe, carrega o menu e o service worker guarda o arquivo", function () {
  const sw = fs.readFileSync("service-worker.js", "utf8");
  telas.forEach(function (t) {
    const html = fs.readFileSync(t + ".html", "utf8");
    assert.ok(html.indexOf('src="js/menu.js"') !== -1, t + " sem o menu");
    assert.ok(html.indexOf("rodape-navegacao") === -1, t + " ainda tem rodapé antigo");
    assert.ok(sw.indexOf('"' + t + '.html"') !== -1, t + " fora do cache");
  });
});

teste("o álbum tem menu, vive no cartão Fotos e o service worker guarda seus arquivos", function () {
  const html = fs.readFileSync("album.html", "utf8");
  const sw = fs.readFileSync("service-worker.js", "utf8");
  assert.ok(html.indexOf('src="js/menu.js"') !== -1);
  ["album.html", "js/album.js", "js/adesivos.js", "js/tela-album.js"].forEach(function (n) {
    assert.ok(sw.indexOf('"' + n + '"') !== -1, n);
  });
  const fotos = menu.ITENS_DO_MENU.filter(function (i) { return i.arquivo === "fotos.html"; })[0];
  assert.ok(fotos.tambem.indexOf("album.html") !== -1);
});

teste("todo arquivo listado no service worker existe", function () {
  const sw = fs.readFileSync("service-worker.js", "utf8");
  const bloco = sw.slice(sw.indexOf("var ARQUIVOS"), sw.indexOf("];"));
  const nomes = bloco.match(/"[^"]+"/g).map(function (n) { return n.slice(1, -1); });
  nomes.forEach(function (n) {
    if (n === "./") { return; }
    assert.ok(fs.existsSync(n), n + " não existe");
  });
});

fim("menu");
