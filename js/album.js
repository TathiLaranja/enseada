/* Enseada - regras do Album de Retratos (funcoes puras, sem tela e sem gravacao).
   O album e uma lista de paginas; cada pagina e um mural onde ficam polaroids
   (foto + moldura + anotacao opcional). Comeca com 3 paginas e a pessoa
   acrescenta quantas quiser. Posicao e sempre uma fracao da pagina (0 a 1),
   do canto de cima da esquerda, para valer em qualquer tamanho de tela e na
   imagem baixada. Cada funcao devolve um album novo; o antigo nao e alterado. */

var ALBUM_PAGINAS_INICIAIS = 3;
var ALBUM_MAXIMO_DE_POLAROIDS = 30;
var ALBUM_TAMANHO_DA_NOTA = 40;

/* Pagina em pe, 3 para 4. A polaroid ocupa 42% da largura; o cartao tem
   1.16 vezes a largura de altura (foto quadrada + espaco branco embaixo). */
var POLAROID_LARGURA = 0.42;
var POLAROID_PROPORCAO = 1.16;
var PAGINA_PROPORCAO = 4 / 3;
var POLAROID_ALTURA = POLAROID_LARGURA * POLAROID_PROPORCAO / PAGINA_PROPORCAO;

function albumLimitar(v, minimo, maximo) {
  return Math.min(maximo, Math.max(minimo, v));
}

function albumNovo(novoId) {
  var paginas = [];
  for (var i = 0; i < ALBUM_PAGINAS_INICIAIS; i++) {
    paginas.push({ id: novoId(), polaroids: [] });
  }
  return { paginas: paginas };
}

function albumCopiar(album, trocar) {
  return { paginas: album.paginas.map(function (p) { return trocar(p); }) };
}

function albumAdicionarPagina(album, id) {
  return { paginas: album.paginas.concat([{ id: id, polaroids: [] }]) };
}

function albumTotalDePolaroids(album) {
  return album.paginas.reduce(function (s, p) { return s + p.polaroids.length; }, 0);
}

function albumPodeAdicionar(album) {
  return albumTotalDePolaroids(album) < ALBUM_MAXIMO_DE_POLAROIDS;
}

/* Foto nova no meio da pagina, com um desvio por polaroid para nao cairem uma em cima da outra. */
function albumAdicionarPolaroid(album, paginaId, id, foto, giro) {
  if (!albumPodeAdicionar(album)) { return album; }
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    var n = p.polaroids.length;
    var x = albumLimitar((1 - POLAROID_LARGURA) / 2 + ((n % 4) - 1.5) * 0.06, 0, 1 - POLAROID_LARGURA);
    var y = albumLimitar((1 - POLAROID_ALTURA) / 2 + ((n % 4) - 1.5) * 0.05, 0, 1 - POLAROID_ALTURA);
    return { id: p.id, polaroids: p.polaroids.concat([{
      id: id, foto: foto, nota: "", x: x, y: y,
      giro: albumLimitar(giro || 0, -8, 8)
    }]) };
  });
}

function albumTrocarPolaroid(album, paginaId, polaroidId, trocar) {
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    return { id: p.id, polaroids: p.polaroids.map(function (q) { return q.id === polaroidId ? trocar(q) : q; }) };
  });
}

/* Move a polaroid, sem deixar ela sair da pagina. */
function albumMover(album, paginaId, polaroidId, x, y) {
  return albumTrocarPolaroid(album, paginaId, polaroidId, function (q) {
    return { id: q.id, foto: q.foto, nota: q.nota, giro: q.giro,
      x: albumLimitar(x, 0, 1 - POLAROID_LARGURA), y: albumLimitar(y, 0, 1 - POLAROID_ALTURA) };
  });
}

function albumAnotar(album, paginaId, polaroidId, texto) {
  var nota = String(texto).slice(0, ALBUM_TAMANHO_DA_NOTA);
  return albumTrocarPolaroid(album, paginaId, polaroidId, function (q) {
    return { id: q.id, foto: q.foto, x: q.x, y: q.y, giro: q.giro, nota: nota };
  });
}

/* A polaroid escolhida vai para cima das outras (o fim da lista fica por cima). */
function albumTrazerParaFrente(album, paginaId, polaroidId) {
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    var alvo = p.polaroids.filter(function (q) { return q.id === polaroidId; });
    var resto = p.polaroids.filter(function (q) { return q.id !== polaroidId; });
    return { id: p.id, polaroids: resto.concat(alvo) };
  });
}

function albumTirarPolaroid(album, paginaId, polaroidId) {
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    return { id: p.id, polaroids: p.polaroids.filter(function (q) { return q.id !== polaroidId; }) };
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
    ALBUM_TAMANHO_DA_NOTA: ALBUM_TAMANHO_DA_NOTA,
    POLAROID_LARGURA: POLAROID_LARGURA,
    POLAROID_PROPORCAO: POLAROID_PROPORCAO,
    POLAROID_ALTURA: POLAROID_ALTURA,
    albumNovo: albumNovo,
    albumAdicionarPagina: albumAdicionarPagina,
    albumTotalDePolaroids: albumTotalDePolaroids,
    albumPodeAdicionar: albumPodeAdicionar,
    albumAdicionarPolaroid: albumAdicionarPolaroid,
    albumMover: albumMover,
    albumAnotar: albumAnotar,
    albumTrazerParaFrente: albumTrazerParaFrente,
    albumTirarPolaroid: albumTirarPolaroid,
    albumRecorteQuadrado: albumRecorteQuadrado
  };
}
