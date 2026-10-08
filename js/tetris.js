/* Enseada - regras do Tetris Calmo (funcoes puras, sem tela).
   Sem pressa e sem derrota:
   - a peca NAO cai sozinha; so se mexe quando a pessoa toca;
   - nao existe pontuacao, nivel, contagem de linhas nem aceleracao;
   - se o tabuleiro encher, ele e esvaziado e o jogo segue (nao ha "fim").
   Cada funcao devolve um estado novo; o antigo nao e alterado. Quando nada
   muda, devolve o MESMO estado, e quem chama pode comparar com ===. */

var TETRIS_LARGURA = 10;
var TETRIS_ALTURA = 20;

/* Cada forma e uma lista de [linha, coluna] a partir do canto de cima. */
var TETRIS_FORMAS = {
  I: [[0, 0], [0, 1], [0, 2], [0, 3]],
  O: [[0, 0], [0, 1], [1, 0], [1, 1]],
  T: [[0, 0], [0, 1], [0, 2], [1, 1]],
  S: [[0, 1], [0, 2], [1, 0], [1, 1]],
  Z: [[0, 0], [0, 1], [1, 1], [1, 2]],
  J: [[0, 0], [1, 0], [1, 1], [1, 2]],
  L: [[0, 2], [1, 0], [1, 1], [1, 2]]
};

function tetrisMisturar(lista, sorteio) {
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(sorteio() * (i + 1));
    var guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}

function tetrisTabuleiroVazio() {
  var linhas = [];
  for (var r = 0; r < TETRIS_ALTURA; r++) {
    var linha = [];
    for (var c = 0; c < TETRIS_LARGURA; c++) { linha.push(0); }
    linhas.push(linha);
  }
  return linhas;
}

/* Gira um quarto de volta no sentido horario, sem sair do canto de cima. */
function tetrisGirarForma(forma) {
  var maiorLinha = Math.max.apply(null, forma.map(function (p) { return p[0]; }));
  return forma.map(function (p) { return [p[1], maiorLinha - p[0]]; });
}

function tetrisLargura(forma) {
  return Math.max.apply(null, forma.map(function (p) { return p[1]; })) + 1;
}

/* A forma, posta em (linha, coluna), cabe dentro do tabuleiro e em casas livres? */
function tetrisCabe(celulas, forma, linha, coluna) {
  for (var i = 0; i < forma.length; i++) {
    var r = linha + forma[i][0];
    var c = coluna + forma[i][1];
    if (r < 0 || r >= TETRIS_ALTURA || c < 0 || c >= TETRIS_LARGURA) { return false; }
    if (celulas[r][c] !== 0) { return false; }
  }
  return true;
}

/* Poe a proxima peca no alto. Se nao couber, esvazia o tabuleiro e segue. */
function tetrisChamarPeca(celulas, saco, sorteio, aviso) {
  var restante = saco.slice();
  if (restante.length === 0) {
    restante = tetrisMisturar(Object.keys(TETRIS_FORMAS), sorteio);
  }
  var tipo = restante.pop();
  var forma = TETRIS_FORMAS[tipo];
  var coluna = Math.floor((TETRIS_LARGURA - tetrisLargura(forma)) / 2);

  var avisoFinal = aviso;
  var base = celulas;
  if (!tetrisCabe(base, forma, 0, coluna)) {
    base = tetrisTabuleiroVazio();
    avisoFinal = "esvaziou";
  }
  return {
    celulas: base,
    peca: { tipo: tipo, forma: forma, linha: 0, coluna: coluna },
    saco: restante,
    aviso: avisoFinal
  };
}

function tetrisNovo(sorteio) {
  return tetrisChamarPeca(tetrisTabuleiroVazio(), [], sorteio, "");
}

function tetrisMover(estado, dLinha, dColuna) {
  var p = estado.peca;
  if (!tetrisCabe(estado.celulas, p.forma, p.linha + dLinha, p.coluna + dColuna)) {
    return estado;
  }
  return {
    celulas: estado.celulas,
    peca: { tipo: p.tipo, forma: p.forma, linha: p.linha + dLinha, coluna: p.coluna + dColuna },
    saco: estado.saco,
    aviso: ""
  };
}

/* Gira; se bater na parede, tenta uma ou duas casas ao lado. */
function tetrisGirar(estado) {
  var p = estado.peca;
  var nova = tetrisGirarForma(p.forma);
  var empurrar = [0, -1, 1, -2, 2];
  for (var k = 0; k < empurrar.length; k++) {
    var coluna = p.coluna + empurrar[k];
    if (tetrisCabe(estado.celulas, nova, p.linha, coluna)) {
      return {
        celulas: estado.celulas,
        peca: { tipo: p.tipo, forma: nova, linha: p.linha, coluna: coluna },
        saco: estado.saco,
        aviso: ""
      };
    }
  }
  return estado;
}

/* Prende a peca no tabuleiro, desfaz as linhas completas e chama a proxima. */
function tetrisFixar(estado, sorteio) {
  var p = estado.peca;
  var celulas = estado.celulas.map(function (linha) { return linha.slice(); });
  p.forma.forEach(function (q) { celulas[p.linha + q[0]][p.coluna + q[1]] = 1; });

  var restantes = celulas.filter(function (linha) {
    return linha.some(function (v) { return v === 0; });
  });
  var desfeitas = celulas.length - restantes.length;
  while (restantes.length < TETRIS_ALTURA) {
    var vazia = [];
    for (var c = 0; c < TETRIS_LARGURA; c++) { vazia.push(0); }
    restantes.unshift(vazia);
  }
  return tetrisChamarPeca(restantes, estado.saco, sorteio, desfeitas > 0 ? "linha" : "");
}

/* Desce uma casa; se nao der, a peca fica onde esta e a proxima aparece. */
function tetrisDescer(estado, sorteio) {
  var descida = tetrisMover(estado, 1, 0);
  if (descida !== estado) { return descida; }
  return tetrisFixar(estado, sorteio);
}

/* Solta a peca ate o fundo e a prende. */
function tetrisSoltar(estado, sorteio) {
  var atual = estado;
  var proximo = tetrisMover(atual, 1, 0);
  while (proximo !== atual) {
    atual = proximo;
    proximo = tetrisMover(atual, 1, 0);
  }
  return tetrisFixar(atual, sorteio);
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    TETRIS_LARGURA: TETRIS_LARGURA,
    TETRIS_ALTURA: TETRIS_ALTURA,
    TETRIS_FORMAS: TETRIS_FORMAS,
    tetrisGirarForma: tetrisGirarForma,
    tetrisCabe: tetrisCabe,
    tetrisNovo: tetrisNovo,
    tetrisMover: tetrisMover,
    tetrisGirar: tetrisGirar,
    tetrisDescer: tetrisDescer,
    tetrisSoltar: tetrisSoltar
  };
}
