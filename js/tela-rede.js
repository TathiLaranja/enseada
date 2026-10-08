/* Enseada - a tela Minha rede: nome e rotulo, escritos pela pessoa.
   Regras em js/rede.js. Nada de telefone, e-mail ou envio: a lista so existe
   neste aparelho. A lista comeca vazia e sem sugestao. */

(function () {
  var armazem = criarArmazenamento(window.localStorage);
  var campoNome = document.getElementById("campo-nome");
  var campoRotulo = document.getElementById("campo-rotulo");
  var botaoGuardar = document.getElementById("botao-guardar");
  var botaoCancelar = document.getElementById("botao-cancelar");
  var titulo = document.getElementById("titulo-formulario");
  var recado = document.getElementById("recado-rede");
  var lista = document.getElementById("lista-rede");

  var editando = null;
  var apagando = null;

  function novoId() {
    return "r" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function limparFormulario() {
    editando = null;
    campoNome.value = "";
    campoRotulo.value = "";
    titulo.textContent = "Guardar uma pessoa";
    botaoCancelar.hidden = true;
  }

  function botao(texto, aoTocar) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "botao-simples";
    b.textContent = texto;
    b.addEventListener("click", aoTocar);
    return b;
  }

  function desenharLista() {
    var rede = armazem.ler().rede;
    lista.textContent = "";

    if (rede.length === 0) {
      var vazio = document.createElement("p");
      vazio.className = "vazio";
      vazio.textContent = "A lista está vazia.";
      lista.appendChild(vazio);
      return;
    }

    rede.forEach(function (c) {
      var item = document.createElement("div");
      item.className = "item";

      var nome = document.createElement("h3");
      nome.textContent = c.nome;
      item.appendChild(nome);

      if (c.rotulo !== "") {
        var rotulo = document.createElement("p");
        rotulo.className = "rotulo";
        rotulo.textContent = c.rotulo;
        item.appendChild(rotulo);
      }

      item.appendChild(botao("Editar", function () {
        editando = c.id;
        campoNome.value = c.nome;
        campoRotulo.value = c.rotulo;
        titulo.textContent = "Editar uma pessoa";
        botaoCancelar.hidden = false;
        recado.textContent = "";
        campoNome.focus();
      }));

      item.appendChild(botao(apagando === c.id ? "Tirar mesmo" : "Tirar da rede", function () {
        if (apagando === c.id) {
          armazem.mudar(function (d) {
            d.rede = tirarContato(d.rede, c.id);
            return d;
          });
          if (editando === c.id) { limparFormulario(); }
          apagando = null;
          recado.textContent = "Tirado da rede.";
        } else {
          apagando = c.id;
          recado.textContent = "Isso tira " + c.nome + " da lista. Não dá para desfazer.";
        }
        desenharLista();
      }));

      lista.appendChild(item);
    });
  }

  botaoGuardar.addEventListener("click", function () {
    var entrada = { nome: campoNome.value, rotulo: campoRotulo.value };
    var v = validarContato(entrada);
    if (!v.ok) {
      recado.textContent = v.motivo;
      campoNome.focus();
      return;
    }
    armazem.mudar(function (d) {
      if (editando) {
        d.rede = trocarContato(d.rede, editando, entrada);
      } else {
        d.rede.push(novoContato(entrada, novoId()));
      }
      return d;
    });
    limparFormulario();
    apagando = null;
    recado.textContent = "Guardado.";
    desenharLista();
  });

  botaoCancelar.addEventListener("click", function () {
    limparFormulario();
    recado.textContent = "";
  });

  desenharLista();
}());
