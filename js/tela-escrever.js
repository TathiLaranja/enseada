/* Enseada - a tela Escrever: uma folha em branco.
   Guarda a cada toque de tecla. Nao conta palavra, nao mede tempo e nao
   mostra data: so devolve o texto exatamente como foi escrito. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var folha = document.getElementById("folha");
  var recado = document.getElementById("recado-folha");
  var botaoApagar = document.getElementById("botao-apagar-folha");
  var botaoBaixar = document.getElementById("baixar-folha");
  var botaoCompartilhar = document.getElementById("compartilhar-folha");

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

  /* ---------- levar o texto embora ----------
     O texto e dela: tem de poder sair do app sem passar por lugar nenhum.
     Baixar grava um .txt no proprio aparelho. Compartilhar abre a folha do
     sistema, e so sai dali se ela escolher para quem mandar: o Enseada nao
     envia nada e nao guarda nada sobre isso. */

  var NOME_DO_ARQUIVO = "escrita-enseada.txt";

  function vazia() {
    if (folha.value.trim() !== "") { return false; }
    recado.textContent = "A folha está em branco. Escreva alguma coisa primeiro.";
    return true;
  }

  function baixar() {
    var blob = new Blob([folha.value], { type: "text/plain;charset=utf-8" });
    var endereco = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = endereco;
    link.download = NOME_DO_ARQUIVO;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(endereco);
  }

  botaoBaixar.addEventListener("click", function () {
    if (vazia()) { return; }
    baixar();
    recado.textContent = "O arquivo foi para a pasta de downloads do aparelho.";
    desfazerConfirmacao();
  });

  botaoCompartilhar.addEventListener("click", function () {
    if (vazia()) { return; }
    desfazerConfirmacao();
    var dados = { title: "O que eu escrevi", text: folha.value };
    if (navigator.share && navigator.canShare && navigator.canShare(dados)) {
      navigator.share(dados).then(function () {
        recado.textContent = "";
      }).catch(function (erro) {
        /* A pessoa fechou a folha de compartilhar: nada foi enviado. */
        recado.textContent = erro && erro.name === "AbortError"
          ? "Nada foi enviado."
          : "Não foi possível compartilhar. Tente de novo.";
      });
      return;
    }
    baixar();
    recado.textContent = "Este aparelho não compartilha direto. O arquivo foi para a pasta de downloads; mande por lá.";
  });
}());
