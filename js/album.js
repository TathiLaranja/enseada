/* Enseada - regras do Album de Retratos (funcoes puras, sem tela e sem gravacao).
   O album e uma lista de paginas; cada pagina e um mural onde ficam polaroids
   (foto + moldura + fita adesiva + anotacao opcional) e adesivos. Comeca com
   3 paginas e a pessoa acrescenta quantas quiser. Posicao e sempre uma fracao
   da pagina (0 a 1), do canto de cima da esquerda, para valer em qualquer
   tamanho de tela e na imagem baixada. Cada funcao devolve um album novo; o
   antigo nao e alterado. */

var ALBUM_PAGINAS_INICIAIS = 3;
var ALBUM_MAXIMO_DE_POLAROIDS = 30;
var ALBUM_MAXIMO_DE_ADESIVOS = 80;
var ALBUM_TAMANHO_DA_NOTA = 40;
var ALBUM_CORES_DA_FITA = ["#E8B9A8", "#B8B0C8", "#A5B09A", "#9EBBC0"];

/* Pagina em pe, 3 para 4. A polaroid ocupa 42% da largura; o cartao tem
   1.16 vezes a largura de altura (foto quadrada + espaco branco embaixo).
   O adesivo e quadrado: ocupa `tam` da largura e 0.75 * tam da altura. */
var POLAROID_LARGURA = 0.42;
var POLAROID_PROPORCAO = 1.16;
var PAGINA_PROPORCAO = 4 / 3;
var POLAROID_ALTURA = POLAROID_LARGURA * POLAROID_PROPORCAO / PAGINA_PROPORCAO;
var ADESIVO_TAMANHO_INICIAL = 0.22;
var ADESIVO_TAMANHO_MINIMO = 0.1;
var ADESIVO_TAMANHO_MAXIMO = 0.4;
var ADESIVO_PASSO = 0.04;

function albumLimitar(v, minimo, maximo) {
  return Math.min(maximo, Math.max(minimo, v));
}

function albumPagina(p, polaroids, adesivos) {
  return { id: p.id, polaroids: polaroids, adesivos: adesivos };
}

function albumNovo(novoId) {
  var paginas = [];
  for (var i = 0; i < ALBUM_PAGINAS_INICIAIS; i++) {
    paginas.push({ id: novoId(), polaroids: [], adesivos: [] });
  }
  return { paginas: paginas };
}

function albumCopiar(album, trocar) {
  return { paginas: album.paginas.map(function (p) { return trocar(p); }) };
}

function albumAdicionarPagina(album, id) {
  return { paginas: album.paginas.concat([{ id: id, polaroids: [], adesivos: [] }]) };
}

function albumTotalDePolaroids(album) {
  return album.paginas.reduce(function (s, p) { return s + p.polaroids.length; }, 0);
}

function albumTotalDeAdesivos(album) {
  return album.paginas.reduce(function (s, p) { return s + (p.adesivos || []).length; }, 0);
}

function albumPodeAdicionar(album) {
  return albumTotalDePolaroids(album) < ALBUM_MAXIMO_DE_POLAROIDS;
}

function albumPodeAdicionarAdesivo(album) {
  return albumTotalDeAdesivos(album) < ALBUM_MAXIMO_DE_ADESIVOS;
}

/* Altura de um adesivo de lado `tam`, como fracao da altura da pagina. */
function albumAlturaDoAdesivo(tam) {
  return tam / PAGINA_PROPORCAO;
}

/* Foto nova no meio da pagina, com um desvio por polaroid para nao cairem uma em cima da outra. */
function albumAdicionarPolaroid(album, paginaId, id, foto, giro, fita) {
  if (!albumPodeAdicionar(album)) { return album; }
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    var n = p.polaroids.length;
    var x = albumLimitar((1 - POLAROID_LARGURA) / 2 + ((n % 4) - 1.5) * 0.06, 0, 1 - POLAROID_LARGURA);
    var y = albumLimitar((1 - POLAROID_ALTURA) / 2 + ((n % 4) - 1.5) * 0.05, 0, 1 - POLAROID_ALTURA);
    return albumPagina(p, p.polaroids.concat([{
      id: id, foto: foto, nota: "", x: x, y: y,
      giro: albumLimitar(giro || 0, -8, 8),
      fita: Math.min(ALBUM_CORES_DA_FITA.length - 1, Math.max(0, Math.floor(fita || 0)))
    }]), p.adesivos);
  });
}

/* Adesivo novo perto do meio da pagina, tambem com desvio para nao empilhar. */
function albumAdicionarAdesivo(album, paginaId, id, tipo, giro) {
  if (!albumPodeAdicionarAdesivo(album)) { return album; }
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    var n = p.adesivos.length;
    var tam = ADESIVO_TAMANHO_INICIAL;
    var x = albumLimitar((1 - tam) / 2 + ((n % 5) - 2) * 0.07, 0, 1 - tam);
    var y = albumLimitar((1 - albumAlturaDoAdesivo(tam)) / 2 + ((n % 5) - 2) * 0.05, 0, 1 - albumAlturaDoAdesivo(tam));
    return albumPagina(p, p.polaroids, p.adesivos.concat([{
      id: id, tipo: tipo, x: x, y: y, tam: tam, giro: albumLimitar(giro || 0, -12, 12)
    }]));
  });
}

/* Procura um item (polaroid ou adesivo) pelo id na pagina. */
function albumBuscar(pagina, itemId) {
  var i;
  for (i = 0; i < pagina.polaroids.length; i++) {
    if (pagina.polaroids[i].id === itemId) { return { tipo: "polaroid", item: pagina.polaroids[i] }; }
  }
  for (i = 0; i < pagina.adesivos.length; i++) {
    if (pagina.adesivos[i].id === itemId) { return { tipo: "adesivo", item: pagina.adesivos[i] }; }
  }
  return null;
}

function albumTrocarItem(album, paginaId, itemId, trocar) {
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    return albumPagina(p,
      p.polaroids.map(function (q) { return q.id === itemId ? trocar(q, "polaroid") : q; }),
      p.adesivos.map(function (q) { return q.id === itemId ? trocar(q, "adesivo") : q; }));
  });
}

function albumCom(q, mudancas) {
  var novo = {};
  Object.keys(q).forEach(function (k) { novo[k] = q[k]; });
  Object.keys(mudancas).forEach(function (k) { novo[k] = mudancas[k]; });
  return novo;
}

/* Move a polaroid ou o adesivo, sem deixar sair da pagina. */
function albumMover(album, paginaId, itemId, x, y) {
  return albumTrocarItem(album, paginaId, itemId, function (q, tipo) {
    var largura = tipo === "adesivo" ? q.tam : POLAROID_LARGURA;
    var altura = tipo === "adesivo" ? albumAlturaDoAdesivo(q.tam) : POLAROID_ALTURA;
    return albumCom(q, { x: albumLimitar(x, 0, 1 - largura), y: albumLimitar(y, 0, 1 - altura) });
  });
}

/* Ajusta a inclinacao de uma polaroid, limitada a oito graus para cada lado. */
function albumGirarPolaroid(album, paginaId, itemId, giro) {
  return albumTrocarItem(album, paginaId, itemId, function (q, tipo) {
    return tipo === "polaroid" ? albumCom(q, { giro: albumLimitar(giro, -8, 8) }) : q;
  });
}

/* Aumenta ou diminui um adesivo (passo de 4% da largura), mantendo dentro da pagina. */
function albumRedimensionarAdesivo(album, paginaId, itemId, sentido) {
  return albumTrocarItem(album, paginaId, itemId, function (q, tipo) {
    if (tipo !== "adesivo") { return q; }
    var tam = albumLimitar(Math.round((q.tam + sentido * ADESIVO_PASSO) * 100) / 100, ADESIVO_TAMANHO_MINIMO, ADESIVO_TAMANHO_MAXIMO);
    return albumCom(q, {
      tam: tam,
      x: albumLimitar(q.x, 0, 1 - tam),
      y: albumLimitar(q.y, 0, 1 - albumAlturaDoAdesivo(tam))
    });
  });
}

function albumAnotar(album, paginaId, polaroidId, texto) {
  var nota = String(texto).slice(0, ALBUM_TAMANHO_DA_NOTA);
  return albumTrocarItem(album, paginaId, polaroidId, function (q, tipo) {
    return tipo === "polaroid" ? albumCom(q, { nota: nota }) : q;
  });
}

/* O item escolhido vai para cima dos outros do mesmo tipo (o fim da lista fica por cima).
   Os adesivos ficam sempre por cima das polaroids, como adesivo de verdade. */
function albumTrazerParaFrente(album, paginaId, itemId) {
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    function ao_fim(lista) {
      var alvo = lista.filter(function (q) { return q.id === itemId; });
      var resto = lista.filter(function (q) { return q.id !== itemId; });
      return resto.concat(alvo);
    }
    return albumPagina(p, ao_fim(p.polaroids), ao_fim(p.adesivos));
  });
}

function albumTirar(album, paginaId, itemId) {
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    return albumPagina(p,
      p.polaroids.filter(function (q) { return q.id !== itemId; }),
      p.adesivos.filter(function (q) { return q.id !== itemId; }));
  });
}

/* Recorte quadrado no centro da foto: o mesmo que o CSS object-fit: cover faz. */
function albumRecorteQuadrado(largura, altura) {
  var lado = Math.min(largura, altura);
  return { x: (largura - lado) / 2, y: (altura - lado) / 2, lado: lado };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    ALBUM_PAGINAS_INICIAIS: ALBUM_PAGINAS_INICIAIS,
    ALBUM_MAXIMO_DE_POLAROIDS: ALBUM_MAXIMO_DE_POLAROIDS,
    ALBUM_MAXIMO_DE_ADESIVOS: ALBUM_MAXIMO_DE_ADESIVOS,
    ALBUM_TAMANHO_DA_NOTA: ALBUM_TAMANHO_DA_NOTA,
    ALBUM_CORES_DA_FITA: ALBUM_CORES_DA_FITA,
    POLAROID_LARGURA: POLAROID_LARGURA,
    POLAROID_PROPORCAO: POLAROID_PROPORCAO,
    POLAROID_ALTURA: POLAROID_ALTURA,
    ADESIVO_TAMANHO_INICIAL: ADESIVO_TAMANHO_INICIAL,
    ADESIVO_TAMANHO_MINIMO: ADESIVO_TAMANHO_MINIMO,
    ADESIVO_TAMANHO_MAXIMO: ADESIVO_TAMANHO_MAXIMO,
    albumNovo: albumNovo,
    albumAdicionarPagina: albumAdicionarPagina,
    albumTotalDePolaroids: albumTotalDePolaroids,
    albumTotalDeAdesivos: albumTotalDeAdesivos,
    albumPodeAdicionar: albumPodeAdicionar,
    albumPodeAdicionarAdesivo: albumPodeAdicionarAdesivo,
    albumAlturaDoAdesivo: albumAlturaDoAdesivo,
    albumAdicionarPolaroid: albumAdicionarPolaroid,
    albumAdicionarAdesivo: albumAdicionarAdesivo,
    albumBuscar: albumBuscar,
    albumMover: albumMover,
    albumGirarPolaroid: albumGirarPolaroid,
    albumRedimensionarAdesivo: albumRedimensionarAdesivo,
    albumAnotar: albumAnotar,
    albumTrazerParaFrente: albumTrazerParaFrente,
    albumTirar: albumTirar,
    albumTirarPolaroid: albumTirar,
    albumRecorteQuadrado: albumRecorteQuadrado
  };
}
