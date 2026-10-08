/* Enseada - a tela Agora.
   Mostra as âncoras ativas em botões grandes. Nada mais.
   A âncora com link vira um botão que abre o link. A âncora sem link fica
   como lembrete escrito, sem nada para apertar. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var caixa = document.getElementById("lista");

  function escrever(elemento, texto) {
    elemento.appendChild(document.createTextNode(texto));
  }

  function desenharAncora(ancora) {
    if (ancora.link) {
      var botao = document.createElement("a");
      botao.className = "botao";
      botao.href = ancora.link;
      botao.rel = "noopener noreferrer";
      escrever(botao, ancora.oQueE);

      var dizer = document.createElement("span");
      dizer.className = "mecanismo";
      escrever(dizer, ancora.oQueFaz ? ancora.oQueFaz + " — abre o link" : "abre o link");
      botao.appendChild(dizer);
      return botao;
    }

    var cartao = document.createElement("div");
    cartao.className = "botao-simples";
    escrever(cartao, ancora.oQueE);

    if (ancora.oQueFaz) {
      var nota = document.createElement("span");
      nota.className = "mecanismo";
      escrever(nota, ancora.oQueFaz);
      cartao.appendChild(nota);
    }
    return cartao;
  }

  function desenhar() {
    var lista = ativas(armazem.ler().ancoras);
    caixa.textContent = "";

    if (lista.length === 0) {
      var vazio = document.createElement("div");
      vazio.className = "vazio";
      var linha = document.createElement("p");
      escrever(linha, "Você ainda não guardou nada aqui.");
      vazio.appendChild(linha);
      caixa.appendChild(vazio);

      var cadastrar = document.createElement("a");
      cadastrar.className = "botao";
      cadastrar.href = "ancoras.html#nova";
      escrever(cadastrar, "Guardar a primeira");
      caixa.appendChild(cadastrar);

      var achar = document.createElement("a");
      achar.className = "botao-simples";
      achar.href = "achar.html";
      escrever(achar, "Me ajuda a achar");
      caixa.appendChild(achar);
      return;
    }

    lista.forEach(function (ancora) {
      caixa.appendChild(desenharAncora(ancora));
    });
  }

  desenhar();

  /* Abertura: aparece na primeira vez e some quando a pessoa vai para a tela
     Agora (ou toca em um dos links, que ja levam para outra tela). Sem
     animacao, sem contagem e sem data: o ajuste guarda so sim ou nao.
     Igual no navegador e no app instalado, porque os dois leem o mesmo
     localStorage do endereco. */
  var abertura = document.getElementById("abertura");
  var agora = document.getElementById("tela-agora");

  function mostrarAbertura(ligada) {
    abertura.hidden = !ligada;
    agora.hidden = ligada;
    document.body.classList.toggle("com-abertura", ligada);
  }

  function fecharAbertura() {
    guardarAjuste("boasVindasVistas", true);
  }

  if (abertura && agora && !armazem.ler().ajustes.boasVindasVistas) {
    mostrarAbertura(true);
    document.getElementById("entrar-no-app").addEventListener("click", function () {
      fecharAbertura();
      mostrarAbertura(false);
    });
    Array.prototype.forEach.call(abertura.querySelectorAll("a"), function (link) {
      link.addEventListener("click", fecharAbertura);
    });
  }
}());
