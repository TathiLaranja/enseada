/* Enseada - a tela Jogos calmos: abas e jogo da memória.
   Regras da memória em js/memoria.js. Sudoku, Tetris e palavras cruzadas vivem
   em js/tela-sudoku.js, js/tela-tetris.js e js/tela-cruzadas.js.
   Sem derrota, sem cronômetro, sem pontuação. Estado dito em palavra. */

document.addEventListener('DOMContentLoaded', () => {
    /* Abas: uma por vez. aria-selected diz qual está aberta; a classe "ativa"
       e a palavra em negrito mostram o mesmo sem depender de cor. */
    const abas = document.querySelectorAll('.abas-jogos button[role="tab"]');
    const paineis = document.querySelectorAll('.container-painel-jogos .painel-jogo');

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            const alvoId = aba.getAttribute('aria-controls');

            abas.forEach(a => {
                a.classList.remove('ativa');
                a.setAttribute('aria-selected', 'false');
            });
            aba.classList.add('ativa');
            aba.setAttribute('aria-selected', 'true');

            paineis.forEach(painel => {
                const aberto = painel.id === alvoId;
                painel.classList.toggle('ativo', aberto);
                painel.classList.toggle('oculto', !aberto);
                painel.hidden = !aberto;
            });
        });
    });

    /* Pequenos Tesouros: jogo da memoria com as fichas redondas. Cada partida usa
       fichas de uma colecao so. Sem cronometro: duas fichas diferentes ficam
       viradas ate a proxima ser tocada. */
    const areaMemoria = document.getElementById('grid-memoria');
    const recadoMemoria = document.getElementById('recado-memoria');
    const temasMemoria = document.getElementById('temas-memoria');
    let tema = FICHAS_TEMAS[0].id;
    let jogo = null;

    function novaPartida() {
        const ids = sortearItens(fichasDoTema(tema), FICHAS_PARES_POR_PARTIDA, Math.random);
        jogo = novoJogo(Math.random, ids);
        desenharMemoria();
    }

    function desenharTemas() {
        temasMemoria.textContent = '';
        FICHAS_TEMAS.forEach(t => {
            const b = document.createElement('button');
            b.type = 'button';
            b.className = 'botao-simples';
            b.textContent = t.nome;
            b.setAttribute('aria-pressed', t.id === tema ? 'true' : 'false');
            b.addEventListener('click', () => {
                tema = t.id;
                desenharTemas();
                novaPartida();
            });
            temasMemoria.appendChild(b);
        });
        const atual = FICHAS_TEMAS.filter(t => t.id === tema)[0];
        document.getElementById('tema-atual-memoria').textContent = 'Coleção agora: ' + atual.nome + '.';
    }

    function desenharMemoria() {
        areaMemoria.textContent = '';
        jogo.cartas.forEach((id, i) => {
            const ficha = fichaPorId(id);
            const achada = jogo.achadas.indexOf(i) !== -1;
            const aberta = jogo.viradas.indexOf(i) !== -1;
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'ficha';

            if (achada || aberta) {
                botao.setAttribute('data-estado', achada ? 'achada' : 'aberta');
                const estilo = fichaEstilo(ficha);
                botao.style.backgroundImage = estilo.backgroundImage;
                botao.style.backgroundSize = estilo.backgroundSize;
                botao.style.backgroundPosition = estilo.backgroundPosition;
                botao.setAttribute('aria-label', ficha.nome + (achada ? ', par achado' : ', ficha virada'));
                botao.disabled = achada;
            } else {
                botao.setAttribute('data-estado', 'fechada');
                botao.setAttribute('aria-label', 'Ficha fechada, tocar para virar');
            }

            botao.addEventListener('click', () => {
                jogo = tocar(jogo, i);
                desenharMemoria();
                const atual = areaMemoria.children[i];
                if (atual && !atual.disabled) { atual.focus(); }
            });
            areaMemoria.appendChild(botao);
        });

        if (terminou(jogo)) {
            recadoMemoria.textContent = 'Todos os pares foram achados.';
        } else if (jogo.viradas.length === 2) {
            recadoMemoria.textContent = 'Não são iguais. Toque em outra ficha quando quiser.';
        } else {
            recadoMemoria.textContent = '';
        }
    }

    document.getElementById('reiniciar-memoria').addEventListener('click', novaPartida);

    desenharTemas();
    novaPartida();

    /* Modo Mini: esconder Sudoku e Palavras Cruzadas (so para criancas). */
    var modoMini = typeof criarArmazenamento === "function" &&
      criarArmazenamento(window.localStorage).ler().ajustes.modo === "mini";
    if (modoMini) {
      ["aba-sudoku", "aba-palavras"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) { el.hidden = true; el.setAttribute("aria-selected", "false"); el.classList.remove("ativa"); }
      });
      ["painel-sudoku", "painel-palavras"].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) { el.hidden = true; el.classList.remove("ativo"); el.classList.add("oculto"); }
      });
    }
});
