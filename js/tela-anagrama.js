/* Enseada - a tela do Anagrama. Regras em js/anagrama.js, banco de palavras
   em js/cruzadas.js. Nao grava nada: a palavra da vez vive so na memoria.
   Tudo e texto, entao o jogo inteiro funciona com leitor de tela: as letras
   saem separadas por virgula e cada resposta vira recado numa regiao viva. */

document.addEventListener("DOMContentLoaded", function () {
  var painel = document.getElementById("painel-anagrama");
  if (!painel) { return; }

  var elLetras = document.getElementById("letras-anagrama");
  var elDica = document.getElementById("dica-anagrama");
  var elPista = document.getElementById("pista-anagrama");
  var campo = document.getElementById("resposta-anagrama");
  var recado = document.getElementById("recado-anagrama");
  var btnConferir = document.getElementById("conferir-anagrama");
  var btnDica = document.getElementById("dica-anagrama-botao");
  var btnOutra = document.getElementById("outra-anagrama");

  var estado = null;

  function desenhar() {
    elLetras.textContent = estado.letras.join(" ");
    /* O leitor de tela soletra melhor com virgula entre as letras. */
    elLetras.setAttribute("aria-label", "Letras fora de ordem: " + estado.letras.join(", "));
    elDica.textContent = "Dica: " + estado.dica;
    elPista.textContent = anagramaPista(estado);
    elPista.setAttribute("aria-label", estado.reveladas === 0
      ? "Nenhuma letra revelada. A palavra tem " + estado.resposta.length + " letras."
      : "Letras reveladas: " + estado.resposta.slice(0, estado.reveladas).split("").join(", ") +
        ". Faltam " + (estado.resposta.length - estado.reveladas) + ".");
    btnDica.disabled = estado.reveladas >= estado.resposta.length;
  }

  function nova() {
    estado = anagramaNovo(CRUZADAS_BANCO);
    campo.value = "";
    recado.textContent = "Palavra nova, com " + estado.resposta.length + " letras.";
    desenhar();
    campo.focus();
  }

  function conferir() {
    if (anagramaConferir(estado, campo.value)) {
      recado.textContent = "Isso: " + estado.resposta + ". Toque em Outra palavra quando quiser.";
      return;
    }
    /* Errar nao tira nada e nao e aviso: so ainda nao e essa. */
    recado.textContent = campo.value.trim() === ""
      ? "Escreva a palavra no campo antes de conferir."
      : "Ainda não é essa. Pode tentar de novo ou pedir uma dica.";
  }

  btnConferir.addEventListener("click", conferir);
  campo.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); conferir(); }
  });

  btnDica.addEventListener("click", function () {
    estado = anagramaDica(estado);
    desenhar();
    recado.textContent = anagramaCerto(estado, "")
      ? "A palavra era " + estado.resposta + ". Toque em Outra palavra quando quiser."
      : "Mais uma letra: " + anagramaPista(estado) + ".";
    campo.focus();
  });

  btnOutra.addEventListener("click", nova);

  nova();
});
