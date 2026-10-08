/* Enseada - a tela Escrever: uma folha em branco.
   Guarda a cada toque de tecla. Nao conta palavra, nao mede tempo e nao
   mostra data: so devolve o texto exatamente como foi escrito. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var folha = document.getElementById("folha");
  var recado = document.getElementById("recado-folha");
  var botaoApagar = document.getElementById("botao-apagar-folha");

  folha.value = armazem.ler().escrita;

  folha.addEventListener("input", function () {
    armazem.mudar(function (d) {
      d.escrita = folha.value;
      return d;
    });
    recado.textContent = "";
    desfazerConfirmacao();
  });

  function desfazerConfirmacao() {
    botaoApagar.removeAttribute("data-confirmar");
    botaoApagar.textContent = "Apagar a folha";
  }

  botaoApagar.addEventListener("click", function () {
    if (botaoApagar.getAttribute("data-confirmar") === "sim") {
      armazem.mudar(function (d) {
        d.escrita = "";
        return d;
      });
      folha.value = "";
      desfazerConfirmacao();
      recado.textContent = "A folha está em branco.";
      return;
    }
    botaoApagar.setAttribute("data-confirmar", "sim");
    botaoApagar.textContent = "Apagar mesmo";
    recado.textContent = "Isso apaga tudo o que está na folha. Não dá para desfazer.";
  });
}());
