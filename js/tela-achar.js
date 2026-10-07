/* Enseada - a tela do roteiro.
   Uma pergunta por vez, botão de pular sempre disponível, pode parar no meio
   e voltar depois. Sem número de pergunta, sem barra de progresso e sem nota.

   O app não interpreta nenhuma resposta. No fim ele repete as palavras dela
   e para aí. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var tela = document.getElementById("tela");

  var estado = armazem.ler().roteiro || iniciar();

  function salvar() {
    armazem.mudar(function (d) { d.roteiro = estado; return d; });
  }

  function escrever(elemento, texto) {
    elemento.appendChild(document.createTextNode(texto));
  }

  function titulo(texto) {
    var p = document.createElement("p");
    p.className = "pergunta";
    escrever(p, texto);
    return p;
  }

  function explicacao(texto) {
    var p = document.createElement("p");
    p.className = "explica";
    escrever(p, texto);
    return p;
  }

  function botao(texto, classe, aoApertar) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = classe;
    escrever(b, texto);
    b.addEventListener("click", aoApertar);
    return b;
  }

  function fileira(botoes) {
    var caixa = document.createElement("div");
    caixa.className = "botao-fileira";
    botoes.forEach(function (b) { caixa.appendChild(b); });
    return caixa;
  }

  function campoTexto(valor, muitasLinhas) {
    var campo = document.createElement(muitasLinhas ? "textarea" : "input");
    if (!muitasLinhas) { campo.type = "text"; }
    campo.id = "resposta";
    campo.value = valor || "";
    return campo;
  }

  function perguntaComCampo(pergunta, ajuda, valor, muitasLinhas) {
    tela.appendChild(titulo(pergunta));
    if (ajuda) { tela.appendChild(explicacao(ajuda)); }

    var campo = campoTexto(valor, muitasLinhas);
    var rotulo = document.createElement("label");
    rotulo.setAttribute("for", "resposta");
    rotulo.className = "ajuda-campo";
    escrever(rotulo, "Sua resposta");
    tela.appendChild(rotulo);
    tela.appendChild(campo);

    var continuar = botao("Continuar", "botao", function () {
      estado = responder(estado, campo.value);
      salvar();
      desenhar();
    });
    continuar.style.marginTop = "16px";
    tela.appendChild(continuar);

    tela.appendChild(fileira([
      botao("Pular esta", "botao-simples", function () {
        estado = pular(estado);
        salvar();
        desenhar();
      }),
      botao("Voltar", "botao-simples", function () {
        estado = voltar(estado);
        salvar();
        desenhar();
      })
    ]));

    campo.focus();
  }

  function telaEscolher() {
    if (estado.itens.length === 0) {
      tela.appendChild(titulo("Você não escreveu nada ainda."));
      tela.appendChild(explicacao("Dá para voltar e escrever, ou sair e tentar outro dia."));
      tela.appendChild(fileira([
        botao("Voltar", "botao-simples", function () {
          estado = voltar(estado);
          salvar();
          desenhar();
        }),
        botao("Começar de novo", "botao-simples", recomecar)
      ]));
      return;
    }

    tela.appendChild(titulo(ESCOLHER_ITEM));
    tela.appendChild(explicacao(AJUDA_ESCOLHER_ITEM));

    estado.itens.forEach(function (item) {
      tela.appendChild(botao(item, "botao", function () {
        estado = responder(estado, item);
        salvar();
        desenhar();
      }));
    });

    tela.appendChild(botao("Voltar", "botao-simples", function () {
      estado = voltar(estado);
      salvar();
      desenhar();
    }));
  }

  function telaFim() {
    var devolutiva = montarDevolutiva(estado);

    if (!devolutiva) {
      tela.appendChild(titulo("Você pulou todas as perguntas."));
      tela.appendChild(explicacao("Sem resposta sua, não há nada para o app repetir. Pode começar de novo quando quiser."));
      tela.appendChild(fileira([
        botao("Começar de novo", "botao-simples", recomecar),
        botao("Sair", "botao-simples", function () { window.location.href = "index.html"; })
      ]));
      return;
    }

    tela.appendChild(titulo("Pelo que você respondeu:"));

    if (devolutiva.item) {
      var sobre = document.createElement("p");
      sobre.className = "explica";
      escrever(sobre, "Sobre " + devolutiva.item + ".");
      tela.appendChild(sobre);
    }

    devolutiva.palavras.forEach(function (palavra) {
      var bloco = document.createElement("p");
      bloco.className = "resposta-anotada";
      escrever(bloco, palavra);
      tela.appendChild(bloco);
    });

    tela.appendChild(explicacao("São as suas palavras, do jeito que você escreveu. Quer guardar isso como âncora?"));

    tela.appendChild(botao("Guardar como âncora", "botao", function () {
      var rascunho = rascunhoDeAncora(estado);
      armazem.mudar(function (d) {
        d.rascunho = rascunho;
        d.roteiro = null;
        return d;
      });
      window.location.href = "ancoras.html";
    }));

    tela.appendChild(fileira([
      botao("Olhar outro item", "botao-simples", function () {
        estado.etapa = "escolher";
        estado.indice = 0;
        estado.mecanismo = [];
        estado.itemEscolhido = "";
        salvar();
        desenhar();
      }),
      botao("Começar de novo", "botao-simples", recomecar)
    ]));
  }

  function recomecar() {
    estado = iniciar();
    armazem.mudar(function (d) { d.roteiro = null; return d; });
    desenhar();
  }

  function desenhar() {
    tela.textContent = "";

    if (estado.etapa === "abertura1") {
      perguntaComCampo(ABERTURA_UM, AJUDA_ABERTURA_UM, estado.abertura1, true);
    } else if (estado.etapa === "abertura2") {
      perguntaComCampo(ABERTURA_DOIS, AJUDA_ABERTURA_DOIS, estado.abertura2, true);
    } else if (estado.etapa === "memoria") {
      perguntaComCampo(MEMORIA_UNICA, AJUDA_MEMORIA_UNICA, estado.memoria, true);
    } else if (estado.etapa === "escolher") {
      telaEscolher();
    } else if (estado.etapa === "mecanismo") {
      perguntaComCampo(MECANISMO[estado.indice], "", estado.mecanismo[estado.indice], false);
    } else {
      telaFim();
    }
  }

  desenhar();
}());
