/* Pouso - a tela Minhas âncoras.
   Lista, guarda, edita, deixa dormente, traz de volta e apaga.
   Nenhum campo vem preenchido pelo app, e nenhum peso vem marcado:
   quem escreve é a pessoa. A única exceção é o rascunho que vem do roteiro,
   e esse também é formado só pelas palavras dela. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);

  var avisos = document.getElementById("avisos");
  var formulario = document.getElementById("formulario");
  var painel = document.getElementById("painel");
  var tituloFormulario = document.getElementById("titulo-formulario");
  var campoOQueE = document.getElementById("campo-o-que-e");
  var campoOQueFaz = document.getElementById("campo-o-que-faz");
  var campoLink = document.getElementById("campo-link");
  var caixaAtivas = document.getElementById("lista-ativas");
  var caixaDormentes = document.getElementById("lista-dormentes");

  var editando = null;

  function escrever(elemento, texto) {
    elemento.appendChild(document.createTextNode(texto));
  }

  function pesoEscolhido() {
    var marcado = document.querySelector('input[name="peso"]:checked');
    return marcado ? marcado.value : "";
  }

  function marcarPeso(valor) {
    var leve = document.getElementById("peso-leve");
    var pesada = document.getElementById("peso-pesada");
    leve.checked = valor === "leve";
    pesada.checked = valor === "pesada";
  }

  function mostrarAvisos(linhas) {
    avisos.textContent = "";
    if (!linhas || linhas.length === 0) { return; }
    var caixa = document.createElement("div");
    caixa.className = "aviso";
    linhas.forEach(function (linha) {
      var p = document.createElement("p");
      escrever(p, linha);
      caixa.appendChild(p);
    });
    avisos.appendChild(caixa);
  }

  function abrirFormulario(ancora) {
    editando = ancora ? ancora.id : null;
    tituloFormulario.textContent = ancora ? "Editar" : "Guardar uma âncora";
    campoOQueE.value = ancora ? ancora.oQueE : "";
    campoOQueFaz.value = ancora ? ancora.oQueFaz : "";
    campoLink.value = ancora ? ancora.link : "";
    marcarPeso(ancora ? ancora.peso : "");
    formulario.hidden = false;
    painel.hidden = true;
    mostrarAvisos(null);
    campoOQueE.focus();
  }

  function fecharFormulario() {
    editando = null;
    formulario.hidden = true;
    painel.hidden = false;
    mostrarAvisos(null);
  }

  function botao(texto, aoApertar) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "botao-simples";
    escrever(b, texto);
    b.addEventListener("click", aoApertar);
    return b;
  }

  function desenharItem(ancora, dormente) {
    var item = document.createElement("li");
    item.className = "item";

    var nome = document.createElement("h3");
    escrever(nome, ancora.oQueE);
    item.appendChild(nome);

    if (ancora.oQueFaz) {
      var faz = document.createElement("p");
      faz.className = "mecanismo";
      escrever(faz, ancora.oQueFaz);
      item.appendChild(faz);
    }

    var marcas = document.createElement("p");
    marcas.className = "marcas";
    escrever(marcas, "Peso: " + ancora.peso + (ancora.link ? " · tem link" : " · sem link"));
    item.appendChild(marcas);

    var fileira = document.createElement("div");
    fileira.className = "botao-fileira";

    fileira.appendChild(botao("Editar", function () { abrirFormulario(ancora); }));

    if (dormente) {
      fileira.appendChild(botao("Trazer de volta", function () {
        armazem.mudar(function (d) { d.ancoras = acordar(d.ancoras, ancora.id); return d; });
        desenhar();
      }));
    } else {
      fileira.appendChild(botao("Deixar dormente", function () {
        armazem.mudar(function (d) { d.ancoras = adormecer(d.ancoras, ancora.id); return d; });
        desenhar();
      }));
    }

    var apagarBotao = botao("Apagar", function () {
      if (apagarBotao.getAttribute("data-confirmar") === "sim") {
        armazem.mudar(function (d) { d.ancoras = apagar(d.ancoras, ancora.id); return d; });
        desenhar();
        return;
      }
      apagarBotao.setAttribute("data-confirmar", "sim");
      apagarBotao.textContent = "Apagar mesmo";
    });
    fileira.appendChild(apagarBotao);

    item.appendChild(fileira);
    return item;
  }

  function desenharLista(caixa, lista, dormente, textoVazio) {
    caixa.textContent = "";
    if (lista.length === 0) {
      var vazio = document.createElement("p");
      vazio.className = "vazio";
      escrever(vazio, textoVazio);
      caixa.appendChild(vazio);
      return;
    }
    var ul = document.createElement("ul");
    ul.className = "lista";
    lista.forEach(function (ancora) {
      ul.appendChild(desenharItem(ancora, dormente));
    });
    caixa.appendChild(ul);
  }

  function desenhar() {
    var lista = armazem.ler().ancoras;
    desenharLista(caixaAtivas, ativas(lista), false, "Nada na lista ainda.");
    desenharLista(caixaDormentes, dormentes(lista), true, "Nenhuma dormente.");
  }

  function guardar() {
    var dadosDoFormulario = {
      oQueE: campoOQueE.value,
      oQueFaz: campoOQueFaz.value,
      link: campoLink.value,
      peso: pesoEscolhido()
    };

    var checagem = validarAncora(dadosDoFormulario);
    if (!checagem.ok) {
      mostrarAvisos(checagem.erros);
      return;
    }

    var idEditado = editando;
    armazem.mudar(function (d) {
      if (idEditado) {
        d.ancoras = editar(d.ancoras, idEditado, dadosDoFormulario);
      } else {
        d.ancoras = acrescentar(d.ancoras, dadosDoFormulario, novoId());
      }
      d.rascunho = null;
      return d;
    });

    fecharFormulario();
    desenhar();
  }

  document.getElementById("botao-nova").addEventListener("click", function () {
    abrirFormulario(null);
  });
  document.getElementById("botao-guardar").addEventListener("click", guardar);
  document.getElementById("botao-cancelar").addEventListener("click", function () {
    armazem.mudar(function (d) { d.rascunho = null; return d; });
    fecharFormulario();
  });

  desenhar();

  /* Veio do roteiro com as palavras dela, ou veio da tela Agora pedindo
     para guardar a primeira. */
  var rascunho = armazem.ler().rascunho;
  if (rascunho) {
    abrirFormulario(null);
    campoOQueE.value = rascunho.oQueE;
    campoOQueFaz.value = rascunho.oQueFaz;
  } else if (window.location.hash === "#nova") {
    abrirFormulario(null);
  }
}());
