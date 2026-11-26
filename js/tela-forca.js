/* Enseada - a tela da Forca sem forca. Regras em js/forca.js, banco de
   palavras em js/cruzadas.js. Nao grava nada.
   Nao tem boneco, nao tem contagem de erro e nao tem perder. O teclado de
   letras e de botoes de verdade, entao o leitor de tela anda por ele e diz
   quais letras ja foram tentadas. */

document.addEventListener("DOMContentLoaded", function () {
  var painel = document.getElementById("painel-forca");
  if (!painel) { return; }

  var elPista = document.getElementById("pista-forca");
  var elDica = document.getElementById("dica-forca");
  var elTentadas = document.getElementById("tentadas-forca");
  var teclado = document.getElementById("teclado-forca");
  var recado = document.getElementById("recado-forca");
  var btnDica = document.getElementById("dica-forca-botao");
  var btnOutra = document.getElementById("outra-forca");

  var estado = null;
  var botoes = {};

  function montarTeclado() {
    teclado.textContent = "";
    botoes = {};
    FORCA_ALFABETO.split("").forEach(function (letra) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "tecla-forca";
      b.textContent = letra;
      b.addEventListener("click", function () { tentar(letra); });
      teclado.appendChild(b);
      botoes[letra] = b;
    });
  }

  function desenhar() {
    elPista.textContent = forcaPista(estado);
    elPista.setAttribute("aria-label", "Palavra: " + estado.resposta.split("").map(function (l) {
      return estado.tentadas.indexOf(l) !== -1 ? l : "espaço em branco";
    }).join(", "));
    elDica.textContent = "Dica: " + estado.dica;

    var erradas = forcaErradas(estado);
    elTentadas.textContent = erradas.length === 0
      ? "Nenhuma letra fora da palavra ainda."
      : "Fora da palavra: " + erradas.join(", ") + ".";

    FORCA_ALFABETO.split("").forEach(function (letra) {
      var usada = estado.tentadas.indexOf(letra) !== -1;
      var dentro = usada && forcaTemLetra(estado, letra);
      botoes[letra].disabled = usada;
      botoes[letra].classList.toggle("usada", usada);
      botoes[letra].classList.toggle("dentro", dentro);
      /* A cor nunca conta sozinha: a palavra vai junto, no rotulo. */
      botoes[letra].setAttribute("aria-label", usada
        ? letra + ", já tentada, " + (dentro ? "está na palavra" : "fora da palavra")
        : "Letra " + letra);
    });
    btnDica.disabled = forcaAcertou(estado);
  }

  function tentar(letra) {
    if (forcaAcertou(estado)) { return; }
    var antes = estado;
    estado = forcaTentar(estado, letra);
    if (estado === antes) { return; }
    desenhar();
    if (forcaAcertou(estado)) {
      recado.textContent = "Isso: " + estado.resposta + ". Toque em Outra palavra quando quiser.";
      return;
    }
    /* Errar nao e aviso nem perda: so diz onde a letra ficou. */
    recado.textContent = forcaTemLetra(estado, letra)
      ? letra + " está na palavra. " + forcaPista(estado)
      : letra + " não está nesta palavra. Pode seguir tentando.";
  }

  function nova() {
    estado = forcaNova(CRUZADAS_BANCO);
    recado.textContent = "Palavra nova, com " + estado.resposta.length + " letras.";
    desenhar();
  }

  btnDica.addEventListener("click", function () {
    estado = forcaDica(estado);
    desenhar();
    recado.textContent = forcaAcertou(estado)
      ? "A palavra era " + estado.resposta + ". Toque em Outra palavra quando quiser."
      : "Uma letra a mais: " + forcaPista(estado) + ".";
  });

  btnOutra.addEventListener("click", nova);

  /* Teclado de verdade tambem joga. */
  painel.addEventListener("keydown", function (e) {
    if (e.target.tagName === "BUTTON" || painel.hidden) { return; }
    var l = forcaNormalizar(e.key);
    if (l.length === 1) { tentar(l); }
  });

  montarTeclado();
  nova();
});
