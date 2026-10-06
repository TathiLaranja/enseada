/* Pouso - a tela de Ajuda: aviso, CVV, aparência e dados.
   O estado de cada ajuste é dito em palavra, nunca só em cor. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var recado = document.getElementById("recado-dados");

  var nomeDoTema = { sistema: "seguindo o celular", claro: "claro", escuro: "escuro" };
  var nomeDaFonte = { normal: "normal", grande: "grande", maior: "maior" };

  function dizerEscolhas() {
    var ajustes = armazem.ler().ajustes;
    document.getElementById("tema-atual").textContent =
      "Agora está: " + nomeDoTema[ajustes.tema] + ".";
    document.getElementById("fonte-atual").textContent =
      "Agora está: " + nomeDaFonte[ajustes.fonte] + ".";
  }

  Array.prototype.forEach.call(
    document.querySelectorAll("[data-tema-escolha]"),
    function (botao) {
      botao.addEventListener("click", function () {
        guardarAjuste("tema", botao.getAttribute("data-tema-escolha"));
        dizerEscolhas();
      });
    }
  );

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
    link.download = "pouso-meus-dados.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(endereco);
    recado.textContent = "O arquivo foi para a pasta de downloads do aparelho.";
  });

  var botaoApagar = document.getElementById("botao-apagar");
  botaoApagar.addEventListener("click", function () {
    if (botaoApagar.getAttribute("data-confirmar") === "sim") {
      armazem.apagarTudo();
      botaoApagar.removeAttribute("data-confirmar");
      botaoApagar.textContent = "Apagar tudo";
      recado.textContent = "Apagado. Não ficou nada neste aparelho.";
      aplicarAjustes();
      dizerEscolhas();
      return;
    }
    botaoApagar.setAttribute("data-confirmar", "sim");
    botaoApagar.textContent = "Apagar mesmo";
    recado.textContent = "Isso apaga as âncoras, os ajustes e o roteiro. Não dá para desfazer.";
  });

  dizerEscolhas();
}());
