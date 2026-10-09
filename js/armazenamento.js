/* Enseada - a unica porta dos dados.
   Tudo fica no aparelho, em localStorage. Nenhuma outra parte do app
   conversa com o deposito direto.
   Recebe o deposito por parametro para o teste poder rodar em Node sem
   navegador. */

var CHAVE = "enseada.v1";

/* Teto de fotos: o localStorage do aparelho e pequeno e e dividido com o resto. */
var MAXIMO_DE_FOTOS = 12;

/* O app ja se chamou Pouso. Esta chave antiga so e LIDA, uma unica vez, para
   trazer o que a pessoa escreveu antes da troca de nome. Nunca e gravada. */
var CHAVE_ANTIGA = "pouso.v1";

/* Nomes das cores do desenho (as cores em si ficam em js/paleta.js; um teste
   confere que as duas listas dizem o mesmo). */
var CORES_DO_DESENHO = ["texto", "destaque", "detalhe", "vermelho", "laranja", "amarelo",
  "verde", "azul", "roxo", "rosa", "marrom", "grafite", "sol", "laranjapastel", "salmao",
  "rosapastel", "lilas", "azulsuave", "verdeclaro"];

function depositoVazio() {
  return {
    versao: 1,
    ancoras: [],
    ajustes: { fonte: "normal", tema: "claro", boasVindasVistas: false, modo: "adulto" },
    fotos: [],
    mini: {},
    rascunho: null,
    roteiro: null,
    escrita: "",
    desenho: [],
    rede: []
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
    var f = bruto.ajustes.fonte;
    limpo.ajustes.fonte = (f === "grande" || f === "maior") ? f : "normal";
    limpo.ajustes.tema = bruto.ajustes.tema === "baixo" ? "baixo" : "claro";
    /* Só "já fechou a mensagem de boas-vindas": sem data, sem contagem. */
    limpo.ajustes.boasVindasVistas = bruto.ajustes.boasVindasVistas === true;
    /* Modo de uso: adulto (padrao) ou mini (Enseadinha, para criancas). */
    limpo.ajustes.modo = bruto.ajustes.modo === "mini" ? "mini" : "adulto";
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

  /* Folha em branco da tela Escrever: so o texto, nada medido sobre ele. */
  if (typeof bruto.escrita === "string") { limpo.escrita = bruto.escrita; }

  /* Desenho guardado como tracos (pontos de 0 a 1), nao como imagem, para
     poder ser redesenhado nas cores do tema que estiver ligado. */
  if (Array.isArray(bruto.desenho)) {
    limpo.desenho = bruto.desenho.filter(function (t) {
      return t && typeof t === "object" && Array.isArray(t.pontos) && t.pontos.length > 0;
    }).map(function (t) {
      return {
        apagar: t.apagar === true,
        cor: CORES_DO_DESENHO.indexOf(t.cor) !== -1 ? t.cor : "texto",
        largura: (t.largura === "fino" || t.largura === "grosso") ? t.largura : "medio",
        pontos: t.pontos.filter(function (p) {
          return Array.isArray(p) && typeof p[0] === "number" && typeof p[1] === "number" &&
            isFinite(p[0]) && isFinite(p[1]);
        }).map(function (p) { return [p[0], p[1]]; })
      };
    }).filter(function (t) { return t.pontos.length > 0; });
  }

  /* Minha rede: so nome e rotulo, os dois escritos pela pessoa. */
  if (Array.isArray(bruto.rede)) {
    limpo.rede = bruto.rede.filter(function (c) {
      return c && typeof c === "object" &&
        typeof c.id === "string" &&
        typeof c.nome === "string" && c.nome.trim() !== "";
    }).map(function (c) {
      return {
        id: c.id,
        nome: c.nome,
        rotulo: typeof c.rotulo === "string" ? c.rotulo : ""
      };
    });
  }

  /* Fotos guardadas so neste aparelho. So entra imagem JPEG em data URL:
     qualquer outra coisa (outro tipo, endereco, script) e jogada fora. */
  if (Array.isArray(bruto.fotos)) {
    limpo.fotos = bruto.fotos.filter(function (f) {
      return f && typeof f === "object" && typeof f.id === "string" &&
        typeof f.dados === "string" && /^data:image\/jpeg;base64,[A-Za-z0-9+\/=]+$/.test(f.dados);
    }).slice(0, MAXIMO_DE_FOTOS).map(function (f) { return { id: f.id, dados: f.dados }; });
  }

  /* Modo Mini: o que a crianca disse, por pergunta. Sem nota e sem certo ou errado. */
  if (bruto.mini && typeof bruto.mini === "object" && !Array.isArray(bruto.mini)) {
    Object.keys(bruto.mini).forEach(function (k) {
      if (/^[a-z0-9-]{1,24}$/.test(k) && typeof bruto.mini[k] === "string") {
        limpo.mini[k] = bruto.mini[k].slice(0, 2000);
      }
    });
  }

  return limpo;
}

function criarArmazenamento(deposito) {
  function ler() {
    try {
      var bruto = deposito.getItem(CHAVE);
      if (bruto) { return normalizar(JSON.parse(bruto)); }

      var antigo = deposito.getItem(CHAVE_ANTIGA);
      if (antigo) {
        var trazido = normalizar(JSON.parse(antigo));
        gravar(trazido);
        deposito.removeItem(CHAVE_ANTIGA);
        return trazido;
      }

      return depositoVazio();
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
      deposito.removeItem(CHAVE_ANTIGA);
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
    CHAVE_ANTIGA: CHAVE_ANTIGA,
    CORES_DO_DESENHO: CORES_DO_DESENHO,
    MAXIMO_DE_FOTOS: MAXIMO_DE_FOTOS,
    depositoVazio: depositoVazio,
    normalizar: normalizar,
    criarArmazenamento: criarArmazenamento
  };
}
