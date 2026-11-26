/* Enseada - o som do app. Tudo gerado no proprio aparelho com Web Audio:
   nenhum arquivo de audio, nenhuma rede, nenhuma chave.

   Duas regras que mandam aqui:
   1. Som NUNCA informa sozinho. Todo aviso tem o texto equivalente na tela.
      Quem nao ouve, ou esta no mudo, nao pode perder nada do funcionamento
      do app por causa disso.
   2. Volume com teto e com aviso. O app nunca toca sozinho ao abrir: so
      depois de a pessoa tocar num botao. */

/* Teto de volume. Nada no app pode passar disto, por mais que se peca. */
var SOM_VOLUME_MAXIMO = 0.18;
var SOM_VOLUME_PADRAO = 0.12;

/* Oito notas de uma escala, da mais grave para a mais aguda. Separadas o
   bastante para serem distinguidas por quem nao tem ouvido treinado. */
var SOM_NOTAS = [
  { id: "do", nome: "Dó", hz: 261.63 },
  { id: "re", nome: "Ré", hz: 293.66 },
  { id: "mi", nome: "Mi", hz: 329.63 },
  { id: "fa", nome: "Fá", hz: 349.23 },
  { id: "sol", nome: "Sol", hz: 392.00 },
  { id: "la", nome: "Lá", hz: 440.00 },
  { id: "si", nome: "Si", hz: 493.88 },
  { id: "do2", nome: "Dó agudo", hz: 523.25 }
];

function somLimitarVolume(v) {
  var n = typeof v === "number" && isFinite(v) ? v : SOM_VOLUME_PADRAO;
  return Math.min(SOM_VOLUME_MAXIMO, Math.max(0, n));
}

function somNotaPorId(id) {
  for (var i = 0; i < SOM_NOTAS.length; i++) {
    if (SOM_NOTAS[i].id === id) { return SOM_NOTAS[i]; }
  }
  return null;
}

/* Liga o Web Audio na primeira vez que a pessoa pede som. Nunca antes:
   navegador nenhum deixa tocar sem toque, e o app nao quer mesmo. */
function somContexto(janela) {
  var w = janela || (typeof window !== "undefined" ? window : null);
  if (!w) { return null; }
  var Classe = w.AudioContext || w.webkitAudioContext;
  if (!Classe) { return null; }
  if (!w.__enseadaAudio) { w.__enseadaAudio = new Classe(); }
  if (w.__enseadaAudio.state === "suspended" && w.__enseadaAudio.resume) {
    w.__enseadaAudio.resume();
  }
  return w.__enseadaAudio;
}

/* Uma nota, com subida e descida suaves: som que entra seco assusta. */
function somTocarNota(contexto, hz, segundos, volume) {
  if (!contexto) { return false; }
  var dur = typeof segundos === "number" && segundos > 0 ? Math.min(segundos, 2) : 0.6;
  var vol = somLimitarVolume(volume);
  var agora = contexto.currentTime;
  var osc = contexto.createOscillator();
  var ganho = contexto.createGain();
  osc.type = "sine";
  osc.frequency.value = hz;
  ganho.gain.setValueAtTime(0.0001, agora);
  ganho.gain.exponentialRampToValueAtTime(Math.max(vol, 0.0002), agora + 0.06);
  ganho.gain.exponentialRampToValueAtTime(0.0001, agora + dur);
  osc.connect(ganho);
  ganho.connect(contexto.destination);
  osc.start(agora);
  osc.stop(agora + dur + 0.05);
  return true;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SOM_VOLUME_MAXIMO: SOM_VOLUME_MAXIMO,
    SOM_VOLUME_PADRAO: SOM_VOLUME_PADRAO,
    SOM_NOTAS: SOM_NOTAS,
    somLimitarVolume: somLimitarVolume,
    somNotaPorId: somNotaPorId,
    somContexto: somContexto,
    somTocarNota: somTocarNota
  };
}
