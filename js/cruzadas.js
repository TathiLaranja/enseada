/* Enseada - regras das palavras cruzadas calmas (funcoes puras, sem tela).
   A grade e montada aqui mesmo, a cada jogo, encaixando palavras de uma lista
   curta. Sem cronometro, sem pontuacao, sem derrota. Em vez de apontar erro,
   o jogo oferece dica: a dica poe a letra certa numa casa. As respostas ficam
   sem acento; a dica de texto pode ter. */

var CRUZADAS_TAMANHO = 9;
var CRUZADAS_QUANTIDADE = 7;

var CRUZADAS_BANCO = [
  { resposta: "MAR", dica: "Água salgada com ondas." },
  { resposta: "RIO", dica: "Água doce que corre até o mar." },
  { resposta: "SOL", dica: "Estrela que ilumina o dia." },
  { resposta: "LUA", dica: "Aparece no céu à noite." },
  { resposta: "LUZ", dica: "O que clareia o ambiente." },
  { resposta: "CHA", dica: "Bebida quente feita com folhas." },
  { resposta: "PAO", dica: "Alimento de farinha que vai ao forno." },
  { resposta: "CAFE", dica: "Bebida quente e escura." },
  { resposta: "CASA", dica: "Lugar onde se mora." },
  { resposta: "MESA", dica: "Móvel onde se come." },
  { resposta: "CAMA", dica: "Móvel onde se dorme." },
  { resposta: "FLOR", dica: "Nasce na planta e tem perfume." },
  { resposta: "AGUA", dica: "Líquido que se bebe." },
  { resposta: "LIVRO", dica: "Tem páginas para ler." },
  { resposta: "PEDRA", dica: "Pedaço duro de rocha." },
  { resposta: "VENTO", dica: "Ar em movimento." },
  { resposta: "NUVEM", dica: "Fica no céu e pode trazer chuva." },
  { resposta: "FOLHA", dica: "Parte verde da árvore." },
  { resposta: "PRAIA", dica: "Faixa de areia junto ao mar." },
  { resposta: "TERRA", dica: "O planeta onde vivemos." },
  { resposta: "ARVORE", dica: "Planta grande com tronco." },
  { resposta: "MUSICA", dica: "Sons que se ouvem e se cantam." },
  { resposta: "JANELA", dica: "Abertura na parede, com vidro." },
  { resposta: "SILENCIO", dica: "Ausência de barulho." }
];

function cruzadasMisturar(lista, sorteio) {
  var copia = lista.slice();
  for (var i = copia.length - 1; i > 0; i--) {
    var j = Math.floor(sorteio() * (i + 1));
    var guardado = copia[i];
    copia[i] = copia[j];
    copia[j] = guardado;
  }
  return copia;
}

/* Tira acento e deixa em maiuscula. Devolve "" se nao for uma letra de A a Z. */
function cruzadasLetra(texto) {
  var limpo = String(texto || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
  return /^[A-Z]$/.test(limpo) ? limpo : "";
}

/* O que fica na casa depois de a pessoa digitar. A casa guarda ate 2 caracteres
   para a letra nova poder entrar por cima da antiga. Digitou algo que nao e
   letra (numero, simbolo): a letra que ja estava la fica, nao e apagada. */
function cruzadasLerDigitacao(anterior, digitado) {
  if (digitado === "") { return ""; }
  return cruzadasLetra(digitado.slice(-1)) || cruzadasLetra(digitado) || anterior;
}

/* Uma tentativa de montar a grade. Devolve as palavras encaixadas. */
function cruzadasTentar(sorteio) {
  var N = CRUZADAS_TAMANHO;
  var letras = [];
  var usos = [];
  for (var r = 0; r < N; r++) {
    letras.push([]);
    usos.push([]);
    for (var c = 0; c < N; c++) { letras[r].push(""); usos[r].push({ h: false, v: false }); }
  }
  var colocadas = [];

  function vazia(r, c) {
    return r < 0 || c < 0 || r >= N || c >= N || letras[r][c] === "";
  }

  function serve(palavra, r0, c0, d) {
    var dr = d === "v" ? 1 : 0;
    var dc = d === "h" ? 1 : 0;
    var r1 = r0 + dr * (palavra.length - 1);
    var c1 = c0 + dc * (palavra.length - 1);
    if (r0 < 0 || c0 < 0 || r1 >= N || c1 >= N) { return false; }
    if (!vazia(r0 - dr, c0 - dc) || !vazia(r1 + dr, c1 + dc)) { return false; }
    var cruzamentos = 0;
    for (var i = 0; i < palavra.length; i++) {
      var r = r0 + dr * i;
      var c = c0 + dc * i;
      if (letras[r][c] !== "") {
        if (letras[r][c] !== palavra.charAt(i)) { return false; }
        if (usos[r][c][d]) { return false; }
        cruzamentos++;
      } else if (!vazia(r + dc, c + dr) || !vazia(r - dc, c - dr)) {
        return false;
      }
    }
    return cruzamentos >= 1;
  }

  function por(palavra, r0, c0, d) {
    var dr = d === "v" ? 1 : 0;
    var dc = d === "h" ? 1 : 0;
    for (var i = 0; i < palavra.resposta.length; i++) {
      letras[r0 + dr * i][c0 + dc * i] = palavra.resposta.charAt(i);
      usos[r0 + dr * i][c0 + dc * i][d] = true;
    }
    colocadas.push({ resposta: palavra.resposta, dica: palavra.dica, linha: r0, coluna: c0, direcao: d });
  }

  var banco = cruzadasMisturar(CRUZADAS_BANCO, sorteio);
  var primeira = banco.filter(function (p) { return p.resposta.length >= 5; })[0] || banco[0];
  por(primeira, Math.floor(N / 2), Math.floor((N - primeira.resposta.length) / 2), "h");

  banco.forEach(function (palavra) {
    if (colocadas.length >= CRUZADAS_QUANTIDADE || palavra === primeira) { return; }
    var opcoes = [];
    ["h", "v"].forEach(function (d) {
      for (var r0 = 0; r0 < N; r0++) {
        for (var c0 = 0; c0 < N; c0++) {
          if (serve(palavra.resposta, r0, c0, d)) { opcoes.push([r0, c0, d]); }
        }
      }
    });
    if (opcoes.length > 0) {
      var o = opcoes[Math.floor(sorteio() * opcoes.length)];
      por(palavra, o[0], o[1], o[2]);
    }
  });
  return colocadas;
}

/* Monta o jogo: corta a grade ao tamanho usado e numera as entradas. */
function cruzadasNovo(sorteio) {
  var melhor = [];
  for (var t = 0; t < 40 && melhor.length < CRUZADAS_QUANTIDADE; t++) {
    var tentativa = cruzadasTentar(sorteio);
    if (tentativa.length > melhor.length) { melhor = tentativa; }
  }

  var menorR = 99, menorC = 99, maiorR = 0, maiorC = 0;
  melhor.forEach(function (e) {
    var fimR = e.linha + (e.direcao === "v" ? e.resposta.length - 1 : 0);
    var fimC = e.coluna + (e.direcao === "h" ? e.resposta.length - 1 : 0);
    menorR = Math.min(menorR, e.linha);
    menorC = Math.min(menorC, e.coluna);
    maiorR = Math.max(maiorR, fimR);
    maiorC = Math.max(maiorC, fimC);
  });

  var linhas = maiorR - menorR + 1;
  var colunas = maiorC - menorC + 1;
  var grade = [];
  for (var r = 0; r < linhas; r++) {
    grade.push([]);
    for (var c = 0; c < colunas; c++) { grade[r].push(""); }
  }
  var entradas = melhor.map(function (e) {
    return {
      resposta: e.resposta, dica: e.dica, direcao: e.direcao,
      linha: e.linha - menorR, coluna: e.coluna - menorC, numero: 0
    };
  });
  entradas.forEach(function (e) {
    for (var i = 0; i < e.resposta.length; i++) {
      var rr = e.linha + (e.direcao === "v" ? i : 0);
      var cc = e.coluna + (e.direcao === "h" ? i : 0);
      grade[rr][cc] = e.resposta.charAt(i);
    }
  });

  /* Numero na ordem de leitura; casa que abre duas palavras leva um numero so. */
  var numeros = {};
  var proximo = 1;
  for (var rr2 = 0; rr2 < linhas; rr2++) {
    for (var cc2 = 0; cc2 < colunas; cc2++) {
      var abre = entradas.some(function (e) { return e.linha === rr2 && e.coluna === cc2; });
      if (abre) { numeros[rr2 + "," + cc2] = proximo++; }
    }
  }
  entradas.forEach(function (e) { e.numero = numeros[e.linha + "," + e.coluna]; });
  entradas.sort(function (a, b) { return a.numero - b.numero; });

  var atual = grade.map(function (linha) { return linha.map(function () { return ""; }); });
  return { linhas: linhas, colunas: colunas, grade: grade, entradas: entradas, atual: atual, numeros: numeros };
}

/* Poe (ou tira, com "") uma letra numa casa que faz parte do jogo. */
function cruzadasColocar(jogo, r, c, texto) {
  if (r < 0 || c < 0 || r >= jogo.linhas || c >= jogo.colunas) { return jogo; }
  if (jogo.grade[r][c] === "") { return jogo; }
  var letra = texto === "" ? "" : cruzadasLetra(texto);
  if (texto !== "" && letra === "") { return jogo; }
  var atual = jogo.atual.map(function (linha) { return linha.slice(); });
  atual[r][c] = letra;
  return cruzadasCopiar(jogo, atual);
}

function cruzadasCopiar(jogo, atual) {
  return {
    linhas: jogo.linhas, colunas: jogo.colunas, grade: jogo.grade,
    entradas: jogo.entradas, atual: atual, numeros: jogo.numeros
  };
}

/* Dica: poe a letra certa numa casa vazia ou fora do lugar. Nao diz "erro". */
function cruzadasDica(jogo, sorteio) {
  var pendentes = [];
  for (var r = 0; r < jogo.linhas; r++) {
    for (var c = 0; c < jogo.colunas; c++) {
      if (jogo.grade[r][c] !== "" && jogo.atual[r][c] !== jogo.grade[r][c]) { pendentes.push([r, c]); }
    }
  }
  if (pendentes.length === 0) { return { jogo: jogo, casa: null }; }
  var casa = pendentes[Math.floor(sorteio() * pendentes.length)];
  var atual = jogo.atual.map(function (linha) { return linha.slice(); });
  atual[casa[0]][casa[1]] = jogo.grade[casa[0]][casa[1]];
  return { jogo: cruzadasCopiar(jogo, atual), casa: casa };
}

function cruzadasCheio(jogo) {
  for (var r = 0; r < jogo.linhas; r++) {
    for (var c = 0; c < jogo.colunas; c++) {
      if (jogo.grade[r][c] !== "" && jogo.atual[r][c] === "") { return false; }
    }
  }
  return true;
}

function cruzadasCerto(jogo) {
  for (var r = 0; r < jogo.linhas; r++) {
    for (var c = 0; c < jogo.colunas; c++) {
      if (jogo.grade[r][c] !== jogo.atual[r][c]) { return false; }
    }
  }
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CRUZADAS_BANCO: CRUZADAS_BANCO,
    CRUZADAS_QUANTIDADE: CRUZADAS_QUANTIDADE,
    cruzadasLetra: cruzadasLetra,
    cruzadasLerDigitacao: cruzadasLerDigitacao,
    cruzadasNovo: cruzadasNovo,
    cruzadasColocar: cruzadasColocar,
    cruzadasDica: cruzadasDica,
    cruzadasCheio: cruzadasCheio,
    cruzadasCerto: cruzadasCerto
  };
}
