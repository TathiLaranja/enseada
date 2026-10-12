/* Enseada - a tela de Ajuda: aviso, CVV, aparência e dados.
   O estado de cada ajuste é dito em palavra, nunca só em cor. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var recado = document.getElementById("recado-dados");

  var nomeDaFonte = { normal: "normal", grande: "grande", maior: "maior" };

  /* Samsung TalkBack exige clear → delay → set para detectar a mutação.
     Sem o intervalo de 50 ms, a região aria-live permanece muda. */
  function anunciarLive(id, texto) {
    var el = document.getElementById(id);
    el.textContent = "";
    setTimeout(function () { el.textContent = texto; }, 50);
  }

  function dizerEscolhas() {
    var fonte = armazem.ler().ajustes.fonte;
    Array.prototype.forEach.call(document.querySelectorAll("[data-fonte-escolha]"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-fonte-escolha") === fonte ? "true" : "false");
    });
    anunciarLive("fonte-atual", "Tamanho: " + nomeDaFonte[fonte] + ".");
  }

  function dizerModo() {
    var mini = armazem.ler().ajustes.modo === "mini";
    Array.prototype.forEach.call(document.querySelectorAll("[data-modo-escolha]"), function (b) {
      var esse = b.getAttribute("data-modo-escolha") === "mini";
      b.setAttribute("aria-pressed", esse === mini ? "true" : "false");
    });
    anunciarLive("modo-atual", "Agora está: " + (mini ? "Mini (Enseadinha)." : "Adulto."));
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-modo-escolha]"), function (b) {
    b.addEventListener("click", function () {
      guardarAjuste("modo", b.getAttribute("data-modo-escolha"));
      dizerModo();
      var card = document.getElementById("card-mini");
      if (card) { window.location.reload(); }
    });
  });

  var botaoTema = document.getElementById("botao-baixo-estimulo");

  function dizerTema() {
    var baixo = armazem.ler().ajustes.tema === "baixo";
    botaoTema.setAttribute("aria-pressed", baixo ? "true" : "false");
    botaoTema.textContent = baixo ? "Desativar Modo Baixo Estímulo" : "Ativar Modo Baixo Estímulo";
    anunciarLive("tema-atual", "Agora está: " + (baixo ? "ligado." : "desligado."));
  }

  botaoTema.addEventListener("click", function () {
    var baixo = armazem.ler().ajustes.tema === "baixo";
    guardarAjuste("tema", baixo ? "claro" : "baixo");
    dizerTema();
  });

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-fonte-escolha]"),
    function (botao) {
      botao.addEventListener("click", function () {
        guardarAjuste("fonte", botao.getAttribute("data-fonte-escolha"));
        dizerEscolhas();
      });
    }
  );

  document.getElementById("botao-baixar").addEventListener("click", function () {
    var conteudo = armazem.exportar();
    var arquivo = new Blob([conteudo], { type: "application/json" });
    var endereco = URL.createObjectURL(arquivo);
    var link = document.createElement("a");
    link.href = endereco;
    link.download = "enseada-meus-dados.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(endereco);
    anunciarLive("recado-dados", "O arquivo foi para a pasta de downloads do aparelho.");
    if (navigator.vibrate) { navigator.vibrate([30]); }
  });

  var botaoApagar = document.getElementById("botao-apagar");
  botaoApagar.addEventListener("click", function () {
    if (botaoApagar.getAttribute("data-confirmar") === "sim") {
      armazem.apagarTudo();
      botaoApagar.removeAttribute("data-confirmar");
      botaoApagar.textContent = "Apagar tudo";
      anunciarLive("recado-dados", "Apagado. Não ficou nada neste aparelho.");
      aplicarAjustes();
      dizerEscolhas();
      dizerTema();
      dizerModo();
      return;
    }
    botaoApagar.setAttribute("data-confirmar", "sim");
    botaoApagar.textContent = "Apagar mesmo";
    anunciarLive("recado-dados", "Isso apaga as âncoras, o que você escreveu e desenhou, as fotos, as respostas do Modo Mini, a sua rede, os ajustes e o roteiro. Não dá para desfazer.");
    if (navigator.vibrate) { navigator.vibrate([30]); }
  });

  dizerEscolhas();
  dizerTema();
  dizerModo();
}());
