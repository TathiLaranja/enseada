/* Enseada - regras do sudoku calmo (funcoes puras, sem tela).
   Gerado aqui mesmo, sem rede e sem lista pronta. Sem derrota, sem
   cronometro, sem pontuacao e sem contar jogadas. Em vez de apontar erro, o
   jogo oferece dica: a dica poe o numero certo numa casa. A grade e uma lista
   de 81 numeros, de 0 (vazia) a 9, lida linha por linha. */

var SUDOKU_VAZIAS = 45;

function sudokuMisturar(lista, sorteio) {
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(sorteio() * (i + 1));
    var guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}

/* Numeros ainda possiveis numa casa, olhando linha, coluna e quadrado. */
function sudokuCandidatos(grade, i) {
  var linha = Math.floor(i / 9);
  var coluna = i % 9;
  var usados = {};
  for (var k = 0; k < 9; k++) {
    usados[grade[linha * 9 + k]] = true;
    usados[grade[k * 9 + coluna]] = true;
  }
  var l0 = Math.floor(linha / 3) * 3;
  var c0 = Math.floor(coluna / 3) * 3;
  for (var a = 0; a < 3; a++) {
    for (var b = 0; b < 3; b++) {
      usados[grade[(l0 + a) * 9 + c0 + b]] = true;
    }
  }
  var livres = [];
  for (var n = 1; n <= 9; n++) {
    if (!usados[n]) { livres.push(n); }
  }
  return livres;
}

/* Conta solucoes, parando em `limite`. Escolhe sempre a casa com menos opcoes. */
function sudokuContar(grade, limite) {
  var melhor = -1;
  var melhoresOpcoes = null;
  for (var i = 0; i < 81; i++) {
    if (grade[i] !== 0) { continue; }
    var opcoes = sudokuCandidatos(grade, i);
    if (melhoresOpcoes === null || opcoes.length < melhoresOpcoes.length) {
      melhor = i;
      melhoresOpcoes = opcoes;
      if (opcoes.length === 0) { return 0; }
    }
  }
  if (melhor === -1) { return 1; }

  var total = 0;
  for (var o = 0; o < melhoresOpcoes.length && total < limite; o++) {
    grade[melhor] = melhoresOpcoes[o];
    total += sudokuContar(grade, limite - total);
  }
  grade[melhor] = 0;
  return total;
}

function sudokuSolucao(sorteio) {
  var grade = [];
  for (var i = 0; i < 81; i++) { grade.push(0); }

  function preencher(pos) {
    if (pos === 81) { return true; }
    var opcoes = sudokuMisturar(sudokuCandidatos(grade, pos), sorteio);
    for (var o = 0; o < opcoes.length; o++) {
      grade[pos] = opcoes[o];
      if (preencher(pos + 1)) { return true; }
    }
    grade[pos] = 0;
    return false;
  }

  preencher(0);
  return grade;
}

/* Novo jogo: tira casas da solucao so enquanto a solucao continuar unica. */
function sudokuNovo(sorteio, vazias) {
  var alvo = typeof vazias === "number" ? vazias : SUDOKU_VAZIAS;
  var solucao = sudokuSolucao(sorteio);
  var dadas = solucao.slice();
  var ordem = [];
  for (var i = 0; i < 81; i++) { ordem.push(i); }
  ordem = sudokuMisturar(ordem, sorteio);

  var tiradas = 0;
  for (var k = 0; k < ordem.length && tiradas < alvo; k++) {
    var casa = ordem[k];
    var valor = dadas[casa];
    dadas[casa] = 0;
    if (sudokuContar(dadas.slice(), 2) === 1) {
      tiradas++;
    } else {
      dadas[casa] = valor;
    }
  }
  return { solucao: solucao, dadas: dadas, atual: dadas.slice() };
}

/* Poe (ou tira, com 0) um numero numa casa que nao veio pronta. Devolve jogo novo. */
function sudokuColocar(jogo, casa, valor) {
  if (casa < 0 || casa > 80) { return jogo; }
  if (jogo.dadas[casa] !== 0) { return jogo; }
  if (valor < 0 || valor > 9 || Math.floor(valor) !== valor) { return jogo; }
  var atual = jogo.atual.slice();
  atual[casa] = valor;
  return { solucao: jogo.solucao, dadas: jogo.dadas, atual: atual };
}

/* Dica: poe o numero certo numa casa vazia ou fora do lugar. Nao diz "erro". */
function sudokuDica(jogo, sorteio) {
  var pendentes = [];
  for (var i = 0; i < 81; i++) {
    if (jogo.atual[i] !== jogo.solucao[i]) { pendentes.push(i); }
  }
  if (pendentes.length === 0) { return { jogo: jogo, casa: -1 }; }
  var casa = pendentes[Math.floor(sorteio() * pendentes.length)];
  var atual = jogo.atual.slice();
  atual[casa] = jogo.solucao[casa];
  return {
    jogo: { solucao: jogo.solucao, dadas: jogo.dadas, atual: atual },
    casa: casa
  };
}

function sudokuCheio(jogo) {
  return jogo.atual.indexOf(0) === -1;
}

function sudokuCerto(jogo) {
  for (var i = 0; i < 81; i++) {
    if (jogo.atual[i] !== jogo.solucao[i]) { return false; }
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SUDOKU_VAZIAS: SUDOKU_VAZIAS,
    sudokuCandidatos: sudokuCandidatos,
    sudokuContar: sudokuContar,
    sudokuSolucao: sudokuSolucao,
    sudokuNovo: sudokuNovo,
    sudokuColocar: sudokuColocar,
    sudokuDica: sudokuDica,
    sudokuCheio: sudokuCheio,
    sudokuCerto: sudokuCerto
  };
}
