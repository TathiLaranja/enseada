document.addEventListener('DOMContentLoaded', () => {
    const abas = document.querySelectorAll('.abas-jogos button[role="tab"]');
    const paineis = document.querySelectorAll('.container-painel-jogos .painel-jogo');

    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            const alvoId = aba.getAttribute('aria-controlspanel') || aba.id.replace('aba-', 'painel-');

            abas.forEach(a => {
                a.classList.remove('ativa');
                a.setAttribute('aria-selected', 'false');
            });
            aba.classList.add('ativa');
            aba.setAttribute('aria-selected', 'true');

            paineis.forEach(painel => {
                if (painel.id === alvoId) {
                    painel.classList.remove('oculto');
                    painel.classList.add('ativo');
                } else {
                    painel.classList.remove('ativo');
                    painel.classList.add('oculto');
                }
            });
        });
    });

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
