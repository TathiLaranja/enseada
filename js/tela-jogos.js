/* Enseada - a tela Jogos calmos. */

document.addEventListener('DOMContentLoaded', () => {
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

    const areaMemoria = document.getElementById('grid-memoria');
    const recadoMemoria = document.getElementById('recado-memoria');
    const botoesColecao = document.getElementById('colecoes-memoria');
    let colecaoAtual = COLECOES_MEMORIA[0].id;
    let jogo = novoJogo(Math.random, colecaoAtual);

    function desenharColecoes() {
        botoesColecao.textContent = '';
        COLECOES_MEMORIA.forEach(colecao => {
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'botao-secundario';
            botao.textContent = colecao.nome;
            botao.setAttribute('aria-pressed', String(colecao.id === colecaoAtual));
            botao.addEventListener('click', () => {
                colecaoAtual = colecao.id;
                jogo = novoJogo(Math.random, colecaoAtual);
                recadoMemoria.textContent = '';
                desenharColecoes();
                desenharMemoria();
            });
            botoesColecao.appendChild(botao);
        });
    }

    function desenharMemoria() {
        areaMemoria.textContent = '';
        jogo.cartas.forEach((ficha, i) => {
            const achada = jogo.achadas.indexOf(i) !== -1;
            const aberta = jogo.viradas.indexOf(i) !== -1;
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'carta';
            botao.setAttribute('aria-label', achada || aberta
                ? ficha.nome + (achada ? ', par encontrado' : ', ficha virada')
                : 'Ficha fechada. Toque para virar.');

            if (achada || aberta) {
                botao.setAttribute('data-estado', achada ? 'achada' : 'aberta');
                const imagem = document.createElement('span');
                imagem.className = 'ficha-icone';
                imagem.setAttribute('aria-hidden', 'true');
                imagem.style.backgroundPosition = (ficha.coluna * 25) + '% ' + (ficha.linha * 25) + '%';
                botao.appendChild(imagem);
                if (achada) { botao.disabled = true; }
            } else {
                botao.textContent = 'Virar';
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
            recadoMemoria.textContent = 'Todos os pares foram encontrados.';
        } else if (jogo.viradas.length === 2) {
            recadoMemoria.textContent = 'As fichas são diferentes. Toque em outra quando quiser.';
        } else {
            recadoMemoria.textContent = '';
        }
    }

    document.getElementById('reiniciar-memoria').addEventListener('click', () => {
        jogo = novoJogo(Math.random, colecaoAtual);
        recadoMemoria.textContent = '';
        desenharMemoria();
    });

    desenharColecoes();
    desenharMemoria();
});
