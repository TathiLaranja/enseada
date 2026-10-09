/* Enseada - encaixe por toque, arrasto ou selecao pelo teclado. */

document.addEventListener('DOMContentLoaded', () => {
    const area = document.getElementById('tabuleiro-quebra-cabeca');
    const gaveta = document.getElementById('pecas-quebra-cabeca');
    const recado = document.getElementById('recado-quebra-cabeca');
    const botoesNivel = document.querySelectorAll('[data-nivel-quebra-cabeca]');
    let jogo = novoQuebraCabeca('chegar', Math.random);
    let pecaSelecionada = null;
    let arrastando = null;

    function estiloRecorte(elemento, peca) {
        elemento.style.backgroundImage = 'url("public/images/quebra-cabeca.jpg")';
        elemento.style.backgroundSize = (jogo.colunas * 100) + '% ' + (jogo.linhas * 100) + '%';
        elemento.style.backgroundPosition =
            (peca.coluna * 100 / (jogo.colunas - 1)) + '% ' +
            (peca.linha * 100 / (jogo.linhas - 1)) + '%';
    }

    function desenhar() {
        const encaixadas = new Set(jogo.encaixadas);
        area.textContent = '';
        area.style.gridTemplateColumns = 'repeat(' + jogo.colunas + ', minmax(0, 1fr))';
        area.style.gridTemplateRows = 'repeat(' + jogo.linhas + ', minmax(0, 1fr))';

        for (let casa = 0; casa < jogo.pecas.length; casa++) {
            const peca = jogo.pecas.find(item => item.ordem === casa);
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'casa-quebra';
            botao.dataset.casa = String(casa);
            botao.setAttribute('aria-label', encaixadas.has(casa)
                ? 'Peça encaixada'
                : 'Espaço da linha ' + (peca.linha + 1) + ', coluna ' + (peca.coluna + 1) +
                    (pecaSelecionada === null ? '' : '. Encaixar a peça selecionada'));
            if (encaixadas.has(casa)) {
                botao.classList.add('encaixada');
                estiloRecorte(botao, peca);
            }
            botao.addEventListener('click', () => {
                if (pecaSelecionada === null) { return; }
                colocarPeca(pecaSelecionada, casa);
            });
            area.appendChild(botao);
        }

        gaveta.textContent = '';
        jogo.pecas.forEach(peca => {
            if (encaixadas.has(peca.ordem)) { return; }
            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = 'peca-quebra';
            botao.setAttribute('aria-label', 'Peça ' + (peca.ordem + 1));
            botao.setAttribute('aria-pressed', String(pecaSelecionada === peca.ordem));
            botao.style.aspectRatio = jogo.linhas + ' / ' + jogo.colunas;
            if (pecaSelecionada === peca.ordem) { botao.dataset.selecionada = 'sim'; }
            estiloRecorte(botao, peca);
            botao.addEventListener('click', () => {
                pecaSelecionada = pecaSelecionada === peca.ordem ? null : peca.ordem;
                desenhar();
            });
            botao.addEventListener('pointerdown', iniciarArrasto);
            gaveta.appendChild(botao);
        });

        if (terminouQuebraCabeca(jogo)) {
            recado.textContent = 'A imagem está completa.';
        }
    }

    function colocarPeca(ordemPeca, casa) {
        const proximo = encaixarPeca(jogo, ordemPeca, casa);
        if (proximo === jogo) {
            recado.textContent = 'Essa peça não se encaixa aí. Escolha outro espaço.';
            desenhar();
            return;
        }
        jogo = proximo;
        pecaSelecionada = null;
        recado.textContent = '';
        desenhar();
    }

    function iniciarArrasto(evento) {
        if (evento.button !== 0 || !evento.isPrimary) { return; }
        evento.preventDefault();
        const botao = evento.currentTarget;
        const caixa = botao.getBoundingClientRect();
        pecaSelecionada = Number(botao.getAttribute('aria-label').replace('Peça ', '')) - 1;
        arrastando = {
            botao: botao,
            deslocamentoX: evento.clientX - caixa.left,
            deslocamentoY: evento.clientY - caixa.top
        };
        botao.style.position = 'fixed';
        botao.style.left = caixa.left + 'px';
        botao.style.top = caixa.top + 'px';
        botao.style.width = caixa.width + 'px';
        botao.style.height = caixa.height + 'px';
        botao.style.zIndex = '2';
        botao.style.pointerEvents = 'none';
        moverArrasto(evento);
    }

    function moverArrasto(evento) {
        if (!arrastando) { return; }
        evento.preventDefault();
        arrastando.botao.style.left = (evento.clientX - arrastando.deslocamentoX) + 'px';
        arrastando.botao.style.top = (evento.clientY - arrastando.deslocamentoY) + 'px';
    }

    function encerrarArrasto(evento) {
        if (!arrastando) { return; }
        const casa = document.elementFromPoint(evento.clientX, evento.clientY);
        const alvo = casa && casa.closest('[data-casa]');
        const ordemPeca = pecaSelecionada;
        arrastando = null;
        if (alvo) {
            colocarPeca(ordemPeca, Number(alvo.dataset.casa));
        } else {
            desenhar();
        }
    }

    function cancelarArrasto() {
        if (!arrastando) { return; }
        arrastando = null;
        desenhar();
    }

    botoesNivel.forEach(botao => {
        botao.addEventListener('click', () => {
            jogo = novoQuebraCabeca(botao.dataset.nivelQuebraCabeca, Math.random);
            pecaSelecionada = null;
            recado.textContent = '';
            botoesNivel.forEach(outro => {
                outro.setAttribute('aria-pressed', String(outro === botao));
            });
            desenhar();
        });
    });

    document.addEventListener('pointermove', moverArrasto);
    document.addEventListener('pointerup', encerrarArrasto);
    document.addEventListener('pointercancel', cancelarArrasto);
    document.getElementById('novo-quebra-cabeca').addEventListener('click', () => {
        jogo = novoQuebraCabeca(jogo.nivel, Math.random);
        pecaSelecionada = null;
        recado.textContent = '';
        desenhar();
    });

    desenhar();
});
