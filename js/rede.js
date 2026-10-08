/* Enseada - regras da Minha rede (funcoes puras, sem tela e sem gravacao).
   Cada pessoa da rede tem so um nome e um rotulo, os dois escritos por quem
   usa o app. O app nao sugere nome, nao sugere rotulo e nao guarda telefone,
   e-mail ou qualquer outro dado. */

function validarContato(entrada) {
  var nome = (entrada && typeof entrada.nome === "string") ? entrada.nome.trim() : "";
  var rotulo = (entrada && typeof entrada.rotulo === "string") ? entrada.rotulo.trim() : "";
  if (nome === "") {
    return { ok: false, motivo: "Escreva um nome para guardar." };
  }
  return { ok: true, nome: nome, rotulo: rotulo };
}

function novoContato(entrada, id) {
  var v = validarContato(entrada);
  if (!v.ok) { return null; }
  return { id: id, nome: v.nome, rotulo: v.rotulo };
}

function trocarContato(lista, id, entrada) {
  var v = validarContato(entrada);
  if (!v.ok) { return lista; }
  return lista.map(function (c) {
    return c.id === id ? { id: c.id, nome: v.nome, rotulo: v.rotulo } : c;
  });
}

function tirarContato(lista, id) {
  return lista.filter(function (c) { return c.id !== id; });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validarContato: validarContato,
    novoContato: novoContato,
    trocarContato: trocarContato,
    tirarContato: tirarContato
  };
}
