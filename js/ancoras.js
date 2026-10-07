/* Enseada - regras de ancora.
   Funcoes puras: recebem a lista, devolvem uma lista nova. Nao gravam nada.
   Nao existe data, nao existe contador e nao existe historico: por decisao,
   nao por esquecimento. Sem isso, nao da para o app dizer "voce nao faz isso
   ha 40 dias" nem por engano. */

var PESOS = ["leve", "pesada"];
var ESTADOS = ["ativa", "dormente"];

function textoLimpo(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

/* Link so entra se abrir no navegador. Qualquer outra coisa (javascript:,
   data:, esquema de aplicativo) e recusada. */
function linkAceito(valor) {
  var t = textoLimpo(valor);
  if (t === "") { return ""; }
  if (/\s/.test(t)) { return null; }
  if (!/^https?:\/\/[^/]+/i.test(t)) { return null; }
  return t;
}

function validarAncora(dados) {
  var erros = [];
  var oQueE = textoLimpo(dados && dados.oQueE);
  var peso = textoLimpo(dados && dados.peso);
  var link = dados && dados.link;

  if (oQueE === "") {
    erros.push("Falta o primeiro campo: o que é.");
  }
  if (PESOS.indexOf(peso) === -1) {
    erros.push("Falta escolher o peso: leve ou pesada.");
  }
  if (linkAceito(link) === null) {
    erros.push("O link precisa começar com http:// ou https://.");
  }
  return { ok: erros.length === 0, erros: erros };
}

function criarAncora(dados, id) {
  var checagem = validarAncora(dados);
  if (!checagem.ok) {
    throw new Error(checagem.erros.join(" "));
  }
  return {
    id: id,
    oQueE: textoLimpo(dados.oQueE),
    oQueFaz: textoLimpo(dados.oQueFaz),
    link: linkAceito(dados.link),
    peso: textoLimpo(dados.peso),
    estado: "ativa"
  };
}

function acrescentar(lista, dados, id) {
  return lista.concat([criarAncora(dados, id)]);
}

function editar(lista, id, dados) {
  var checagem = validarAncora(dados);
  if (!checagem.ok) {
    throw new Error(checagem.erros.join(" "));
  }
  return lista.map(function (a) {
    if (a.id !== id) { return a; }
    return {
      id: a.id,
      oQueE: textoLimpo(dados.oQueE),
      oQueFaz: textoLimpo(dados.oQueFaz),
      link: linkAceito(dados.link),
      peso: textoLimpo(dados.peso),
      estado: a.estado
    };
  });
}

function trocarEstado(lista, id, estado) {
  if (ESTADOS.indexOf(estado) === -1) {
    throw new Error("Estado desconhecido: " + estado);
  }
  return lista.map(function (a) {
    if (a.id !== id) { return a; }
    var copia = {};
    for (var chave in a) {
      if (Object.prototype.hasOwnProperty.call(a, chave)) { copia[chave] = a[chave]; }
    }
    copia.estado = estado;
    return copia;
  });
}

function adormecer(lista, id) {
  return trocarEstado(lista, id, "dormente");
}

function acordar(lista, id) {
  return trocarEstado(lista, id, "ativa");
}

function apagar(lista, id) {
  return lista.filter(function (a) { return a.id !== id; });
}

function ativas(lista) {
  return lista.filter(function (a) { return a.estado === "ativa"; });
}

function dormentes(lista) {
  return lista.filter(function (a) { return a.estado === "dormente"; });
}

function porId(lista, id) {
  var achadas = lista.filter(function (a) { return a.id === id; });
  return achadas.length > 0 ? achadas[0] : null;
}

/* Um id que nao depende de relogio nem de contador. */
function novoId(sorteio) {
  var r = typeof sorteio === "function" ? sorteio : Math.random;
  var saida = "";
  for (var i = 0; i < 16; i++) {
    saida += Math.floor(r() * 16).toString(16);
  }
  return saida;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PESOS: PESOS,
    ESTADOS: ESTADOS,
    linkAceito: linkAceito,
    validarAncora: validarAncora,
    criarAncora: criarAncora,
    acrescentar: acrescentar,
    editar: editar,
    adormecer: adormecer,
    acordar: acordar,
    apagar: apagar,
    ativas: ativas,
    dormentes: dormentes,
    porId: porId,
    novoId: novoId
  };
}
