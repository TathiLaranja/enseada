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

    /* Jogo da memória. */
    const areaMemoria = document.getElementById('grid-memoria');
    const recadoMemoria = document.getElementById('recado-memoria');
    let jogo = novoJogo(Math.random);

    function desenharMemoria() {
        areaMemoria.textContent = '';
        jogo.cartas.forEach((palavra, i) => {
            const achada = jogo.achadas.indexOf(i) !== -1;
            const aberta = jogo.viradas.indexOf(i) !== -1;
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'carta';

            if (achada) {
                botao.setAttribute('data-estado', 'achada');
                botao.textContent = palavra + ' (par)';
                botao.setAttribute('aria-label', palavra + ', par achado');
                botao.disabled = true;
            } else if (aberta) {
                botao.setAttribute('data-estado', 'aberta');
                botao.textContent = palavra;
                botao.setAttribute('aria-label', palavra + ', carta virada');
            } else {
                botao.textContent = 'Virar';
                botao.setAttribute('aria-label', 'Carta fechada, tocar para virar');
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
            recadoMemoria.textContent = 'Não são iguais. Toque em outra carta quando quiser.';
        } else {
            recadoMemoria.textContent = '';
        }
    }

    document.getElementById('reiniciar-memoria').addEventListener('click', () => {
        jogo = novoJogo(Math.random);
        desenharMemoria();
    });

    desenharMemoria();
});
