/* Enseada - regras do quebra-cabeca "Cantinho Tranquilo" (funcoes puras, sem tela).
   Sem derrota, sem cronometro, sem pontuacao e sem contar jogadas: peca no
   lugar errado simplesmente fica onde foi solta. Tres niveis, sem pressa:
   Chegar (6 pecas), Explorar (12) e Permanecer (30).

   Medidas em "unidades da mesa": 1 = a largura da mesa. O quadro e um quadrado
   de 1 x 1 no alto; a bandeja das pecas soltas fica logo abaixo. */

var QC_NIVEIS = [
  { id: "chegar",    nome: "Chegar",    colunas: 3, linhas: 4 },  /* ~12 pecas */
  { id: "explorar",  nome: "Explorar",  colunas: 4, linhas: 6 },  /* ~24 pecas */
  { id: "permanecer",nome: "Permanecer",colunas: 7, linhas: 8 }   /* ~56 pecas */
];

var QC_BANDEJA_TOPO = 1.06;
var QC_BANDEJA_ALTURA = 0.7;
var QC_MESA_ALTURA = QC_BANDEJA_TOPO + QC_BANDEJA_ALTURA + 0.02;
/* A peca encaixa quando fica a menos de 48% do seu tamanho do lugar certo.
   48% e o maximo sem que zonas de peca adjacentes se sobreponham. */
var QC_IMA = 0.48;

function qcNivel(id) {
  return QC_NIVEIS.filter(function (n) { return n.id === id; })[0] || QC_NIVEIS[0];
}

function qcMisturar(lista, sorteio) {
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(sorteio() * (i + 1));
    var g = copia[i];
    copia[i] = copia[j];
    copia[j] = g;
  }
  return copia;
}

function qcLimitar(v, a, b) { return Math.min(b, Math.max(a, v)); }

/* Lugar certo da peca no quadro (canto de cima da esquerda). */
function qcLugar(estado, peca) {
  return { x: peca.col / estado.colunas, y: peca.row / estado.linhas };
}

function qcNovo(nivelId, sorteio) {
  var nivel = qcNivel(nivelId);
  var pw = 1 / nivel.colunas, ph = 1 / nivel.linhas;
  var celulas = [];
  for (var r = 0; r < nivel.linhas; r++) {
    for (var c = 0; c < nivel.colunas; c++) { celulas.push({ c: c, r: r }); }
  }
  var destinos = qcMisturar(celulas, sorteio);
  var celW = 1 / nivel.colunas, celH = QC_BANDEJA_ALTURA / nivel.linhas;
  var pecas = celulas.map(function (cel, i) {
    var d = destinos[i];
    /* um pequeno desvio faz a bandeja parecer solta e nao um tabuleiro */
    var x = d.c * celW + (sorteio() - 0.5) * pw * 0.2;
    var y = QC_BANDEJA_TOPO + d.r * celH + (sorteio() - 0.5) * ph * 0.1;
    return {
      id: "p" + cel.r + "-" + cel.c, col: cel.c, row: cel.r,
      x: qcLimitar(x, 0, 1 - pw), y: qcLimitar(y, QC_BANDEJA_TOPO, QC_MESA_ALTURA - ph),
      encaixada: false
    };
  });
  return { nivel: nivel.id, colunas: nivel.colunas, linhas: nivel.linhas, pecas: qcMisturar(pecas, sorteio) };
}

function qcTrocar(estado, id, trocar) {
  return {
    nivel: estado.nivel, colunas: estado.colunas, linhas: estado.linhas,
    pecas: estado.pecas.map(function (p) { return p.id === id ? trocar(p) : p; })
  };
}

/* A peca escolhida passa para cima das outras (o fim da lista fica por cima). */
function qcTrazerParaFrente(estado, id) {
  var alvo = estado.pecas.filter(function (p) { return p.id === id; });
  var resto = estado.pecas.filter(function (p) { return p.id !== id; });
  return { nivel: estado.nivel, colunas: estado.colunas, linhas: estado.linhas, pecas: resto.concat(alvo) };
}

/* Solta a peca em (x, y). Perto do lugar certo ela encaixa; senao fica onde esta. */
function qcSoltar(estado, id, x, y) {
  var pw = 1 / estado.colunas, ph = 1 / estado.linhas;
  return qcTrocar(estado, id, function (p) {
    if (p.encaixada) { return p; }
    var lugar = qcLugar(estado, p);
    if (Math.abs(x - lugar.x) < pw * QC_IMA && Math.abs(y - lugar.y) < ph * QC_IMA) {
      return { id: p.id, col: p.col, row: p.row, x: lugar.x, y: lugar.y, encaixada: true };
    }
    return { id: p.id, col: p.col, row: p.row, encaixada: false,
      x: qcLimitar(x, 0, 1 - pw), y: qcLimitar(y, 0, QC_MESA_ALTURA - ph) };
  });
}

/* Mover sem soltar (durante o arrasto): so a posicao, sem encaixar. */
function qcMover(estado, id, x, y) {
  var pw = 1 / estado.colunas, ph = 1 / estado.linhas;
  return qcTrocar(estado, id, function (p) {
    if (p.encaixada) { return p; }
    return { id: p.id, col: p.col, row: p.row, encaixada: false,
      x: qcLimitar(x, 0, 1 - pw), y: qcLimitar(y, 0, QC_MESA_ALTURA - ph) };
  });
}

/* Ajuda: encaixa uma peca que ainda esta solta. Nao diz "erro" nem conta. */
function qcAjudar(estado, sorteio) {
  var soltas = estado.pecas.filter(function (p) { return !p.encaixada; });
  if (soltas.length === 0) { return { estado: estado, id: null }; }
  var p = soltas[Math.floor(sorteio() * soltas.length)];
  var lugar = qcLugar(estado, p);
  return { estado: qcTrocar(estado, p.id, function (q) {
    return { id: q.id, col: q.col, row: q.row, x: lugar.x, y: lugar.y, encaixada: true };
  }), id: p.id };
}

function qcCompleto(estado) {
  return estado.pecas.every(function (p) { return p.encaixada; });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    QC_NIVEIS: QC_NIVEIS,
    QC_BANDEJA_TOPO: QC_BANDEJA_TOPO,
    QC_MESA_ALTURA: QC_MESA_ALTURA,
    QC_IMA: QC_IMA,
    qcNivel: qcNivel,
    qcLugar: qcLugar,
    qcNovo: qcNovo,
    qcMover: qcMover,
    qcSoltar: qcSoltar,
    qcTrazerParaFrente: qcTrazerParaFrente,
    qcAjudar: qcAjudar,
    qcCompleto: qcCompleto
  };
}
