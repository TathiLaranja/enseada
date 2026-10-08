/* Enseada - a tela Jogos calmos: abas e jogo da memória.
   Regras da memória em js/memoria.js; o sudoku vive em js/tela-sudoku.js.
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

    /* Tetris Calmo e Palavras Cruzadas: ainda são protótipo, como estavam. */
    const btnIniciarTetris = document.getElementById('iniciar-tetris');
    const canvasTetris = document.getElementById('canvas-tetris');
    if (btnIniciarTetris && canvasTetris) {
        const ctxT = canvasTetris.getContext('2d');
        btnIniciarTetris.addEventListener('click', () => {
            ctxT.fillStyle = '#EDF2F7';
            ctxT.fillRect(0, 0, canvasTetris.width, canvasTetris.height);
            ctxT.fillStyle = '#319795';
            ctxT.fillRect(80, 50, 40, 40);
            ctxT.fillRect(80, 90, 40, 40);
            btnIniciarTetris.textContent = 'Modo Calmo Ativo';
        });
    }

    const containerCruzadas = document.getElementById('container-cruzadas');
    if (containerCruzadas) {
        containerCruzadas.innerHTML = `
            <div class="dica-cruzada">
                <p><strong>Dica 1:</strong> Estado de espírito tranquilo e pacífico.</p>
                <div class="palavra-inputs">
                    <input type="text" maxlength="1" class="letra-input" value="P" readonly>
                    <input type="text" maxlength="1" class="letra-input" value="A" readonly>
                    <input type="text" maxlength="1" class="letra-input" value="Z" readonly>
                </div>
            </div>
            <div class="dica-cruzada">
                <p><strong>Dica 2:</strong> Elemento essencial para a vida, fluido e cristalino.</p>
                <div class="palavra-inputs">
                    <input type="text" maxlength="1" class="letra-input">
                    <input type="text" maxlength="1" class="letra-input">
                    <input type="text" maxlength="1" class="letra-input">
                    <input type="text" maxlength="1" class="letra-input">
                </div>
            </div>
        `;
    }
});
