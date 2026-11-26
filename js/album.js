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

/* Pagina em pe, 3 para 4. A polaroid nasce com 42% da largura e a pessoa
   aumenta ou diminui; o cartao tem 1.16 vezes a sua largura de altura (foto
   quadrada + espaco branco embaixo).
   O adesivo e quadrado: ocupa `tam` da largura e 0.75 * tam da altura. */
var POLAROID_LARGURA = 0.42;
var POLAROID_TAMANHO_INICIAL = 0.42;
var POLAROID_TAMANHO_MINIMO = 0.24;
var POLAROID_TAMANHO_MAXIMO = 0.7;
var POLAROID_PASSO = 0.06;
/* Inclinacao: 30 graus para cada lado. Oito era tao pouco que nao se via. */
var POLAROID_GIRO_MAXIMO = 30;
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

/* Altura de uma polaroid de largura `tam`, como fracao da altura da pagina. */
function albumAlturaDaPolaroid(tam) {
  return tam * POLAROID_PROPORCAO / PAGINA_PROPORCAO;
}

/* Altura de um adesivo de lado `tam`, como fracao da altura da pagina. */
function albumAlturaDoAdesivo(tam) {
  return tam / PAGINA_PROPORCAO;
}

/* Lugar de uma foto nova: seis posicoes que nao se encostam (duas colunas por
   tres linhas), com uma inclinacao de bagunca pequena. Depois da sexta volta
   ao comeco, deslocado, para empilhar de proposito como num album de verdade.
   Antes eram quatro posicoes muito juntas e tudo caia num monte so. */
function albumLugarDaPolaroid(n, tam) {
  var alt = albumAlturaDaPolaroid(tam);
  var colunas = Math.max(1, Math.floor(1 / tam));
  var linhas = Math.max(1, Math.floor(1 / alt));
  var vagas = colunas * linhas;
  var volta = Math.floor(n / vagas);
  var vaga = n % vagas;
  var sobraX = (1 - colunas * tam) / (colunas + 1);
  var sobraY = (1 - linhas * alt) / (linhas + 1);
  var x = sobraX + (vaga % colunas) * (tam + sobraX) + volta * 0.035;
  var y = sobraY + Math.floor(vaga / colunas) * (alt + sobraY) + volta * 0.03;
  return { x: albumLimitar(x, 0, 1 - tam), y: albumLimitar(y, 0, 1 - alt) };
}

/* Foto nova numa vaga livre da pagina. */
function albumAdicionarPolaroid(album, paginaId, id, foto, giro, fita) {
  if (!albumPodeAdicionar(album)) { return album; }
  return albumCopiar(album, function (p) {
    if (p.id !== paginaId) { return p; }
    var tam = POLAROID_TAMANHO_INICIAL;
    var lugar = albumLugarDaPolaroid(p.polaroids.length, tam);
    return albumPagina(p, p.polaroids.concat([{
      id: id, foto: foto, nota: "", x: lugar.x, y: lugar.y, tam: tam, fx: 0.5, fy: 0.5,
      giro: albumLimitar(giro || 0, -POLAROID_GIRO_MAXIMO, POLAROID_GIRO_MAXIMO),
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
    var tam = typeof q.tam === "number" ? q.tam : POLAROID_TAMANHO_INICIAL;
    var largura = tam;
    var altura = tipo === "adesivo" ? albumAlturaDoAdesivo(tam) : albumAlturaDaPolaroid(tam);
    return albumCom(q, { x: albumLimitar(x, 0, 1 - largura), y: albumLimitar(y, 0, 1 - altura) });
  });
}

/* Ajusta a inclinacao de uma polaroid, limitada a trinta graus para cada lado. */
function albumGirarPolaroid(album, paginaId, itemId, giro) {
  return albumTrocarItem(album, paginaId, itemId, function (q, tipo) {
    return tipo === "polaroid"
      ? albumCom(q, { giro: albumLimitar(giro, -POLAROID_GIRO_MAXIMO, POLAROID_GIRO_MAXIMO) })
      : q;
  });
}

/* Limites de cada tipo, num lugar so: a pinca e os botoes tem de obedecer
   exatamente o mesmo teto e o mesmo piso, senao um faz o que o outro proibe. */
function albumLimitesDoTamanho(tipo) {
  return tipo === "adesivo"
    ? { minimo: ADESIVO_TAMANHO_MINIMO, maximo: ADESIVO_TAMANHO_MAXIMO }
    : { minimo: POLAROID_TAMANHO_MINIMO, maximo: POLAROID_TAMANHO_MAXIMO };
}

function albumGiroMaximo(tipo) {
  return tipo === "adesivo" ? 12 : POLAROID_GIRO_MAXIMO;
}

function albumAlturaDoItem(tipo, tam) {
  return tipo === "adesivo" ? albumAlturaDoAdesivo(tam) : albumAlturaDaPolaroid(tam);
}

/* Põe o tamanho num valor qualquer (e o que a pinca de dois dedos usa),
   sem deixar o item sair da pagina. Os botoes passam por aqui tambem. */
function albumDefinirTamanho(album, paginaId, itemId, tamanho) {
  return albumTrocarItem(album, paginaId, itemId, function (q, tipo) {
    var lim = albumLimitesDoTamanho(tipo);
    var tam = albumLimitar(tamanho, lim.minimo, lim.maximo);
    return albumCom(q, {
      tam: tam,
      x: albumLimitar(q.x, 0, 1 - tam),
      y: albumLimitar(q.y, 0, 1 - albumAlturaDoItem(tipo, tam))
    });
  });
}

/* Diferenca entre dois angulos pelo caminho mais curto. Sem isto, girar com
   dois dedos passando de 179 para -179 graus daria um pulo de meia volta. */
function albumAnguloCurto(d) {
  /* Faixa de -180 (exclusivo) a 180 (inclusivo): a meia volta conta como
     meia volta para a frente, e nunca sai desse intervalo. */
  return 180 - (((180 - d) % 360) + 360) % 360;
}

/* Põe a inclinacao num valor qualquer (e o que o giro de dois dedos usa). */
function albumGirar(album, paginaId, itemId, giro) {
  return albumTrocarItem(album, paginaId, itemId, function (q, tipo) {
    var teto = albumGiroMaximo(tipo);
    return albumCom(q, { giro: albumLimitar(giro, -teto, teto) });
  });
}

/* Aumenta ou diminui uma polaroid (passo de 6% da largura da pagina),
   mantendo o cartao inteiro dentro da pagina. */
function albumRedimensionarPolaroid(album, paginaId, itemId, sentido) {
  var achado = null;
  album.paginas.forEach(function (p) {
    if (p.id === paginaId) { achado = albumBuscar(p, itemId); }
  });
  if (!achado || achado.tipo !== "polaroid") { return album; }
  var agora = typeof achado.item.tam === "number" ? achado.item.tam : POLAROID_TAMANHO_INICIAL;
  return albumDefinirTamanho(album, paginaId, itemId,
    Math.round((agora + sentido * POLAROID_PASSO) * 100) / 100);
}

/* Enquadra: escolhe que parte da foto aparece no quadrado da moldura.
   0.5 e 0.5 e o meio, que era o unico recorte possivel antes. */
function albumEnquadrar(album, paginaId, itemId, fx, fy) {
  return albumTrocarItem(album, paginaId, itemId, function (q, tipo) {
    return tipo === "polaroid"
      ? albumCom(q, { fx: albumLimitar(fx, 0, 1), fy: albumLimitar(fy, 0, 1) })
      : q;
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

/* Recorte quadrado da foto, na mesma conta que o CSS object-fit: cover com
   object-position faz. Sem fx e fy, recorta no meio, como antes. */
function albumRecorteQuadrado(largura, altura, fx, fy) {
  var lado = Math.min(largura, altura);
  var ex = typeof fx === "number" && isFinite(fx) ? albumLimitar(fx, 0, 1) : 0.5;
  var ey = typeof fy === "number" && isFinite(fy) ? albumLimitar(fy, 0, 1) : 0.5;
  return { x: (largura - lado) * ex, y: (altura - lado) * ey, lado: lado };
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
    POLAROID_TAMANHO_INICIAL: POLAROID_TAMANHO_INICIAL,
    POLAROID_TAMANHO_MINIMO: POLAROID_TAMANHO_MINIMO,
    POLAROID_TAMANHO_MAXIMO: POLAROID_TAMANHO_MAXIMO,
    POLAROID_GIRO_MAXIMO: POLAROID_GIRO_MAXIMO,
    albumAlturaDaPolaroid: albumAlturaDaPolaroid,
    albumLugarDaPolaroid: albumLugarDaPolaroid,
    albumRedimensionarPolaroid: albumRedimensionarPolaroid,
    albumDefinirTamanho: albumDefinirTamanho,
    albumGirar: albumGirar,
    albumAnguloCurto: albumAnguloCurto,
    albumLimitesDoTamanho: albumLimitesDoTamanho,
    albumGiroMaximo: albumGiroMaximo,
    albumAlturaDoItem: albumAlturaDoItem,
    albumEnquadrar: albumEnquadrar,
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
