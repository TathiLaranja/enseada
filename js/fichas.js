/* Enseada - fichas do jogo da memoria "Pequenos Tesouros".
   Tres folhas de sprite:
     jogo-memoria.jpg  -> adultos (temas: Bichinhos, Jardim, Tudo misturado)
     jm-frutas.jpg     -> Mini: Frutinhas (12 pares)
     jm-bichinhos.jpg  -> Mini: Florestinha (20 pares)
   Cada ficha tem cx/cy (centro em px na folha) e folha (chave em FICHAS_FOLHAS).
   Fichas sem "folha" usam a folha padrao (jogo-memoria). */

/* Folhas de sprite: dimensoes e raio do circulo de recorte. */
var FICHAS_FOLHAS = {
  "jogo-memoria": {
    imagem: "public/images/jogo-memoria.jpg",
    largura: 1079, altura: 1080, raio: 82
  },
  "frutas": {
    imagem: "public/images/jm-frutas.jpg",
    largura: 1280, altura: 277, raio: 30
  },
  "bichinhos-mini": {
    imagem: "public/images/jm-bichinhos.jpg",
    largura: 1080, altura: 830, raio: 65
  }
};

/* Folha padrao (para fichas legadas sem propriedade "folha"). */
var FICHAS_IMAGEM  = FICHAS_FOLHAS["jogo-memoria"].imagem;
var FICHAS_LARGURA = FICHAS_FOLHAS["jogo-memoria"].largura;
var FICHAS_ALTURA  = FICHAS_FOLHAS["jogo-memoria"].altura;
var FICHAS_RAIO    = FICHAS_FOLHAS["jogo-memoria"].raio;

/* ===== Adultos: jogo-memoria.jpg (5x5 grid, posicao do meio da linha 5 e duplicata) ===== */
var FICHAS = [
  /* Linha 1 (cy=136) */
  { id: "beterraba",  nome: "beterraba",            cx: 175, cy: 136 },
  { id: "bolota",     nome: "folha com bolota",       cx: 374, cy: 136 },
  { id: "casinha",    nome: "casinha de passarinho",  cx: 558, cy: 136 },
  { id: "lagarta",    nome: "lagarta",                cx: 753, cy: 136 },
  { id: "libelula",   nome: "libélula",          cx: 940, cy: 136 },
  /* Linha 2 (cy=323) */
  { id: "limoes",     nome: "limões",            cx: 193, cy: 323 },
  { id: "borboleta",  nome: "borboleta",              cx: 377, cy: 323 },
  { id: "ourico",     nome: "ourico",                 cx: 564, cy: 323 },
  { id: "miosotis",   nome: "flores azuis",           cx: 760, cy: 323 },
  { id: "amanita",    nome: "cogumelo vermelho",      cx: 927, cy: 323 },
  /* Linha 3 (cy=517) */
  { id: "coelho",     nome: "coelhinho",              cx: 172, cy: 517 },
  { id: "pisco",      nome: "passarinho com minhoca", cx: 367, cy: 517 },
  { id: "framboesas", nome: "framboesas",             cx: 560, cy: 517 },
  { id: "camundongo", nome: "camundongo",             cx: 740, cy: 517 },
  { id: "caracol",    nome: "caracol",                cx: 932, cy: 517 },
  /* Linha 4 (cy=719) */
  { id: "cogumelo",   nome: "cogumelo marrom",        cx: 168, cy: 719 },
  { id: "regador",    nome: "regador",                cx: 352, cy: 719 },
  { id: "formiga",    nome: "formiga",                cx: 534, cy: 719 },
  { id: "laranjas",   nome: "cogumelos laranja",      cx: 729, cy: 719 },
  { id: "gafanhoto",  nome: "gafanhoto",              cx: 917, cy: 719 },
  /* Linha 5 (cy=903) - posicao do meio e duplicata do camundongo (pulada) */
  { id: "abelha",     nome: "abelha",                 cx: 179, cy: 903 },
  { id: "joaninha",   nome: "joaninha no trevo",      cx: 351, cy: 903 },
  { id: "margaridas", nome: "margaridas",             cx: 723, cy: 903 },
  { id: "esquilo",    nome: "esquilo",                cx: 915, cy: 903 }
];

/* ===== Mini: jm-frutas.jpg (3 linhas de pares, 17 unicas) ===== */
/* Selecionadas as 12 mais vibrantes por analise de saturacao de cor. */
var FICHAS_FRUTAS_TODAS = [
  /* Linha 1 (cy=65) */
  { id: "fr-morango",  nome: "morango",    cx:  71, cy:  65, folha: "frutas" },
  { id: "fr-banana",   nome: "banana",     cx: 276, cy:  65, folha: "frutas" },
  { id: "fr-laranja",  nome: "laranja",    cx: 490, cy:  65, folha: "frutas" },
  { id: "fr-maca",     nome: "maçã", cx: 697, cy:  65, folha: "frutas" },
  { id: "fr-pera",     nome: "pera",       cx: 904, cy:  65, folha: "frutas" },   /* excluida */
  { id: "fr-uva",      nome: "uva",        cx:1115, cy:  65, folha: "frutas" },   /* excluida */
  /* Linha 2 (cy=143) */
  { id: "fr-melancia", nome: "melancia",   cx:  71, cy: 143, folha: "frutas" },
  { id: "fr-abacaxi",  nome: "abacaxi",    cx: 275, cy: 143, folha: "frutas" },
  { id: "fr-pessego",  nome: "pêssego", cx: 488, cy: 143, folha: "frutas" },
  { id: "fr-manga",    nome: "manga",      cx: 697, cy: 143, folha: "frutas" },
  { id: "fr-kiwi",     nome: "kiwi",       cx: 905, cy: 143, folha: "frutas" },
  { id: "fr-limao",    nome: "limão", cx:1115, cy: 143, folha: "frutas" },
  /* Linha 3 (cy=225) */
  { id: "fr-cereja",   nome: "cereja",     cx:  72, cy: 225, folha: "frutas" },   /* excluida */
  { id: "fr-mirtilo",  nome: "mirtilo",    cx: 276, cy: 225, folha: "frutas" },   /* excluida */
  { id: "fr-mamao",    nome: "mamão", cx: 488, cy: 225, folha: "frutas" },
  { id: "fr-coco",     nome: "coco",       cx: 699, cy: 225, folha: "frutas" },
  { id: "fr-lichia",   nome: "lichia",     cx: 905, cy: 225, folha: "frutas" }    /* excluida */
];

/* ===== Mini: jm-bichinhos.jpg (4x5 grid, 20 unicas) ===== */
var FICHAS_BICHINHOS = [
  /* Linha 1 (cy=111) */
  { id: "fl-bolota",      nome: "bolota",        cx: 108, cy: 111, folha: "bichinhos-mini" },
  { id: "fl-borboleta",   nome: "borboleta",     cx: 324, cy: 111, folha: "bichinhos-mini" },
  { id: "fl-arvore",      nome: "árvore",   cx: 540, cy: 111, folha: "bichinhos-mini" },
  { id: "fl-montanha",    nome: "montanha",      cx: 756, cy: 111, folha: "bichinhos-mini" },
  { id: "fl-cogumelo",    nome: "cogumelo",      cx: 972, cy: 111, folha: "bichinhos-mini" },
  /* Linha 2 (cy=309) */
  { id: "fl-lua",         nome: "lua",           cx: 108, cy: 309, folha: "bichinhos-mini" },
  { id: "fl-coelho",      nome: "coelho",        cx: 324, cy: 309, folha: "bichinhos-mini" },
  { id: "fl-girassol",    nome: "girassol",      cx: 540, cy: 309, folha: "bichinhos-mini" },
  { id: "fl-urso",        nome: "ursinho",       cx: 756, cy: 309, folha: "bichinhos-mini" },
  { id: "fl-nuvem",       nome: "nuvem",         cx: 972, cy: 309, folha: "bichinhos-mini" },
  /* Linha 3 (cy=510) */
  { id: "fl-minhoca",     nome: "minhoca",       cx: 108, cy: 510, folha: "bichinhos-mini" },
  { id: "fl-folha",       nome: "folha",         cx: 324, cy: 510, folha: "bichinhos-mini" },
  { id: "fl-estrela",     nome: "estrela",       cx: 540, cy: 510, folha: "bichinhos-mini" },
  { id: "fl-toco",        nome: "toquinho",      cx: 756, cy: 510, folha: "bichinhos-mini" },
  { id: "fl-joaninha",    nome: "joaninha",      cx: 972, cy: 510, folha: "bichinhos-mini" },
  /* Linha 4 (cy=704) */
  { id: "fl-coruja",      nome: "coruja",        cx: 108, cy: 704, folha: "bichinhos-mini" },
  { id: "fl-caracol",     nome: "caracol",       cx: 324, cy: 704, folha: "bichinhos-mini" },
  { id: "fl-maca",        nome: "maçã",cx: 540, cy: 704, folha: "bichinhos-mini" },
  { id: "fl-pinheiro",    nome: "pinheirinho",   cx: 756, cy: 704, folha: "bichinhos-mini" },
  { id: "fl-bagas",       nome: "bagas",         cx: 972, cy: 704, folha: "bichinhos-mini" }
];

/* Indice unificado: todas as fichas pesquisaveis por id. */
var TODAS_FICHAS = FICHAS.concat(FICHAS_FRUTAS_TODAS).concat(FICHAS_BICHINHOS);

/* ===== Temas ===== */
var FICHAS_PARES_POR_PARTIDA = 8;  /* padrao para temas adultos */

var FICHAS_TEMAS = [
  /* Adultos */
  { id: "bichinhos", nome: "Bichinhos",
    fichas: ["borboleta","ourico","coelho","pisco","camundongo","caracol","formiga","gafanhoto","abelha","joaninha","esquilo","lagarta","libelula"] },
  { id: "jardim",    nome: "Jardim e horta",
    fichas: ["beterraba","bolota","limoes","miosotis","framboesas","margaridas","amanita","cogumelo","laranjas","regador","casinha"] },
  { id: "misturado", nome: "Tudo misturado", fichas: null },
  /* Mini (Versao Mini) */
  { id: "frutinhas",   nome: "Frutinhas", mini: true, pares: 12,
    fichas: ["fr-laranja","fr-manga","fr-maca","fr-coco","fr-limao","fr-mamao","fr-pessego","fr-abacaxi","fr-morango","fr-banana","fr-melancia","fr-kiwi"] },
  { id: "florestinha", nome: "Florestinha", mini: true, pares: 20,
    fichas: ["fl-bolota","fl-borboleta","fl-arvore","fl-montanha","fl-cogumelo","fl-lua","fl-coelho","fl-girassol","fl-urso","fl-nuvem","fl-minhoca","fl-folha","fl-estrela","fl-toco","fl-joaninha","fl-coruja","fl-caracol","fl-maca","fl-pinheiro","fl-bagas"] }
];

/* ===== Funcoes ===== */

function fichasDoTema(temaId) {
  var tema = FICHAS_TEMAS.filter(function (t) { return t.id === temaId; })[0] || FICHAS_TEMAS[0];
  if (!tema.fichas) { return FICHAS.map(function (f) { return f.id; }); }
  return tema.fichas.slice();
}

function fichaPorId(id) {
  for (var i = 0; i < TODAS_FICHAS.length; i++) {
    if (TODAS_FICHAS[i].id === id) { return TODAS_FICHAS[i]; }
  }
  return null;
}

/* Retorna o estilo CSS que recorta circularmente a ficha na folha de sprite.
   Tudo em porcentagem do proprio elemento, entao serve em qualquer tamanho de tela.
   Usa o campo "folha" da ficha se existir; caso contrario usa a folha padrao. */
function fichaEstilo(ficha) {
  var folha = ficha.folha ? FICHAS_FOLHAS[ficha.folha] : FICHAS_FOLHAS["jogo-memoria"];
  if (!folha) { folha = FICHAS_FOLHAS["jogo-memoria"]; }
  var lado = 2 * folha.raio;
  var posX = Math.max(0, Math.min(100, ((ficha.cx - folha.raio) / (folha.largura - lado)) * 100));
  var posY = Math.max(0, Math.min(100, ((ficha.cy - folha.raio) / (folha.altura  - lado)) * 100));
  return {
    backgroundImage: "url(" + folha.imagem + ")",
    backgroundSize: ((folha.largura / lado) * 100).toFixed(2) + "% " + ((folha.altura / lado) * 100).toFixed(2) + "%",
    backgroundPosition: posX.toFixed(2) + "% " + posY.toFixed(2) + "%"
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    FICHAS: FICHAS,
    FICHAS_FRUTAS_TODAS: FICHAS_FRUTAS_TODAS,
    FICHAS_BICHINHOS: FICHAS_BICHINHOS,
    TODAS_FICHAS: TODAS_FICHAS,
    FICHAS_FOLHAS: FICHAS_FOLHAS,
    FICHAS_IMAGEM: FICHAS_IMAGEM,
    FICHAS_LARGURA: FICHAS_LARGURA,
    FICHAS_ALTURA: FICHAS_ALTURA,
    FICHAS_RAIO: FICHAS_RAIO,
    FICHAS_TEMAS: FICHAS_TEMAS,
    FICHAS_PARES_POR_PARTIDA: FICHAS_PARES_POR_PARTIDA,
    fichasDoTema: fichasDoTema,
    fichaPorId: fichaPorId,
    fichaEstilo: fichaEstilo
  };
}
