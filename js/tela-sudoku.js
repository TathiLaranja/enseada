/* Enseada - o sudoku calmo na tela Jogos calmos.
   Regras em js/sudoku.js. Aqui so desenha a grade e escuta o toque.
   Nada aponta erro, nada conta tempo e nada pontua. O estado de cada casa e
   dito em palavra (leitor de tela) e em forma (negrito, borda), nao so em cor. */

(function () {
  var jogo = null;
  var escolhida = -1;
  var confirmando = false;

  var grade = document.getElementById("sudoku-grade");
  var teclado = document.getElementById("sudoku-teclado");
  var recado = document.getElementById("sudoku-recado");
  var botaoDica = document.getElementById("sudoku-dica");
  var botaoNovo = document.getElementById("sudoku-novo");

  function comecar() {
    jogo = sudokuNovo(Math.random);
    escolhida = -1;
    confirmando = false;
    botaoNovo.textContent = "Novo sudoku";
    recado.textContent = "";
    desenhar();
  }

  function dizer() {
    if (sudokuCheio(jogo)) {
      recado.textContent = sudokuCerto(jogo)
        ? "Todas as casas estão preenchidas."
        : "Todas as casas têm número, mas algum está fora do lugar. Peça uma dica ou troque um número.";
    } else if (escolhida === -1) {
      recado.textContent = "";
    }
  }

  function desenhar() {
    grade.textContent = "";
    for (var i = 0; i < 81; i++) {
      grade.appendChild(criarCasa(i));
    }
    dizer();
  }

  function criarCasa(i) {
    var linha = Math.floor(i / 9);
    var coluna = i % 9;
    var valor = jogo.atual[i];
    var dada = jogo.dadas[i] !== 0;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "casa";
    b.textContent = valor === 0 ? "" : String(valor);
    if (dada) { b.setAttribute("data-dada", "sim"); }
    if (coluna % 3 === 2 && coluna !== 8) { b.setAttribute("data-borda-direita", "sim"); }
    if (linha % 3 === 2 && linha !== 8) { b.setAttribute("data-borda-baixo", "sim"); }
    b.setAttribute("aria-pressed", i === escolhida ? "true" : "false");
    b.setAttribute("aria-label",
      "Linha " + (linha + 1) + ", coluna " + (coluna + 1) + ", " +
      (valor === 0 ? "vazia" : valor) + (dada ? ", veio pronta" : ""));
    if (dada) {
      b.disabled = true;
    } else {
      b.addEventListener("click", function () {
        escolhida = i;
        recado.textContent = "Casa escolhida: linha " + (linha + 1) + ", coluna " + (coluna + 1) + ".";
        desenhar();
        grade.children[i].focus();
      });
    }
    return b;
  }

  function colocar(valor) {
    if (escolhida === -1) {
      recado.textContent = "Escolha uma casa primeiro.";
      return;
    }
    jogo = sudokuColocar(jogo, escolhida, valor);
    var casa = escolhida;
    recado.textContent = "";
    desenhar();
    grade.children[casa].focus();
  }

  for (var n = 1; n <= 9; n++) {
    (function (numero) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tecla";
      b.textContent = String(numero);
      b.setAttribute("aria-label", "Colocar " + numero);
      b.addEventListener("click", function () { colocar(numero); });
      teclado.appendChild(b);
    }(n));
  }

  var tirar = document.createElement("button");
  tirar.type = "button";
  tirar.className = "tecla";
  tirar.textContent = "Tirar";
  tirar.setAttribute("aria-label", "Tirar o número da casa escolhida");
  tirar.addEventListener("click", function () { colocar(0); });
  teclado.appendChild(tirar);

  botaoDica.addEventListener("click", function () {
    var resultado = sudokuDica(jogo, Math.random);
    jogo = resultado.jogo;
    escolhida = -1;
    desenhar();
    if (resultado.casa === -1) {
      recado.textContent = "Não há mais o que ajudar: tudo está no lugar.";
    } else {
      var l = Math.floor(resultado.casa / 9) + 1;
      var c = (resultado.casa % 9) + 1;
      recado.textContent = "Dica: pus o " + jogo.atual[resultado.casa] +
        " na linha " + l + ", coluna " + c + ".";
    }
  });

  botaoNovo.addEventListener("click", function () {
    if (confirmando) {
      comecar();
      return;
    }
    confirmando = true;
    botaoNovo.textContent = "Começar outro mesmo";
    recado.textContent = "Isso troca este sudoku por outro. O que você preencheu aqui se perde.";
  });

  comecar();
}());
