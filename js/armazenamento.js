/* Pouso - a unica porta dos dados.
   Tudo fica no aparelho, em localStorage. Nenhuma outra parte do app
   conversa com o deposito direto.
   Recebe o deposito por parametro para o teste poder rodar em Node sem
   navegador. */

var CHAVE = "pouso.v1";

function depositoVazio() {
  return {
    versao: 1,
    ancoras: [],
    ajustes: { tema: "sistema", fonte: "normal" },
    rascunho: null,
    roteiro: null
  };
}

/* Se o conteudo estiver estragado ou de uma versao antiga, o app nao pode
   quebrar na tela Agora. Entao tudo que nao reconhecer vira o valor de fabrica. */
function normalizar(bruto) {
  var limpo = depositoVazio();
  if (!bruto || typeof bruto !== "object") { return limpo; }

  if (Array.isArray(bruto.ancoras)) {
    limpo.ancoras = bruto.ancoras.filter(function (a) {
      return a && typeof a === "object" &&
        typeof a.id === "string" &&
        typeof a.oQueE === "string" &&
        a.oQueE.trim() !== "";
    }).map(function (a) {
      return {
        id: a.id,
        oQueE: a.oQueE,
        oQueFaz: typeof a.oQueFaz === "string" ? a.oQueFaz : "",
        link: typeof a.link === "string" ? a.link : "",
        peso: a.peso === "pesada" ? "pesada" : "leve",
        estado: a.estado === "dormente" ? "dormente" : "ativa"
      };
    });
  }

  if (bruto.ajustes && typeof bruto.ajustes === "object") {
    var t = bruto.ajustes.tema;
    var f = bruto.ajustes.fonte;
    limpo.ajustes.tema = (t === "claro" || t === "escuro") ? t : "sistema";
    limpo.ajustes.fonte = (f === "grande" || f === "maior") ? f : "normal";
  }

  if (bruto.rascunho && typeof bruto.rascunho === "object") {
    limpo.rascunho = {
      oQueE: typeof bruto.rascunho.oQueE === "string" ? bruto.rascunho.oQueE : "",
      oQueFaz: typeof bruto.rascunho.oQueFaz === "string" ? bruto.rascunho.oQueFaz : ""
    };
  }

  /* O roteiro guarda onde ela parou, para poder voltar depois.
     E so o texto dela e a posicao; nada e interpretado aqui. */
  if (bruto.roteiro && typeof bruto.roteiro === "object" &&
      typeof bruto.roteiro.etapa === "string") {
    limpo.roteiro = {
      etapa: bruto.roteiro.etapa,
      indice: typeof bruto.roteiro.indice === "number" ? bruto.roteiro.indice : 0,
      abertura1: typeof bruto.roteiro.abertura1 === "string" ? bruto.roteiro.abertura1 : "",
      abertura2: typeof bruto.roteiro.abertura2 === "string" ? bruto.roteiro.abertura2 : "",
      memoria: typeof bruto.roteiro.memoria === "string" ? bruto.roteiro.memoria : "",
      itens: Array.isArray(bruto.roteiro.itens) ? bruto.roteiro.itens.filter(function (i) {
        return typeof i === "string";
      }) : [],
      itemEscolhido: typeof bruto.roteiro.itemEscolhido === "string" ? bruto.roteiro.itemEscolhido : "",
      mecanismo: Array.isArray(bruto.roteiro.mecanismo) ? bruto.roteiro.mecanismo.map(function (m) {
        return typeof m === "string" ? m : "";
      }) : []
    };
  }

  return limpo;
}

function criarArmazenamento(deposito) {
  function ler() {
    try {
      var bruto = deposito.getItem(CHAVE);
      if (!bruto) { return depositoVazio(); }
      return normalizar(JSON.parse(bruto));
    } catch (erro) {
      return depositoVazio();
    }
  }

  function gravar(dados) {
    try {
      deposito.setItem(CHAVE, JSON.stringify(normalizar(dados)));
      return true;
    } catch (erro) {
      return false;
    }
  }

  function mudar(funcao) {
    var dados = ler();
    var novos = funcao(dados);
    gravar(novos);
    return novos;
  }

  function apagarTudo() {
    try {
      deposito.removeItem(CHAVE);
      return true;
    } catch (erro) {
      return false;
    }
  }

  function exportar() {
    return JSON.stringify(ler(), null, 2);
  }

  return {
    chave: CHAVE,
    ler: ler,
    gravar: gravar,
    mudar: mudar,
    apagarTudo: apagarTudo,
    exportar: exportar
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    CHAVE: CHAVE,
    depositoVazio: depositoVazio,
    normalizar: normalizar,
    criarArmazenamento: criarArmazenamento
  };
}
