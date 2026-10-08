/* Enseada - a tela do Tetris Calmo.
   Regras em js/tetris.js. Aqui so desenha e escuta o toque e as setas.
   As cores vem do tema (claro ou Baixo Estimulo) a cada desenho; a peca que
   se mexe tem contorno, as presas nao: a diferenca nao depende so de cor. */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-tetris');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const recado = document.getElementById('recado-tetris');
    const painel = document.getElementById('painel-tetris');
    const botaoIniciar = document.getElementById('iniciar-tetris');
    const controles = ['tetris-esq', 'tetris-dir', 'tetris-girar', 'tetris-baixo', 'tetris-soltar']
        .map(id => document.getElementById(id));

    let jogo = null;

    function cor(variavel) {
        return getComputedStyle(document.documentElement).getPropertyValue(variavel).trim();
    }

    function desenhar() {
        const lado = canvas.width / TETRIS_LARGURA;
        ctx.fillStyle = cor('--fundo') || '#F8F9FA';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!jogo) return;

        ctx.fillStyle = cor('--detalhe') || '#2A9D8F';
        jogo.celulas.forEach((linha, r) => {
            linha.forEach((v, c) => {
                if (v) ctx.fillRect(c * lado + 1, r * lado + 1, lado - 2, lado - 2);
            });
        });

        const p = jogo.peca;
        ctx.fillStyle = cor('--destaque') || '#00AEEF';
        ctx.strokeStyle = cor('--texto') || '#1F7268';
        ctx.lineWidth = 3;
        p.forma.forEach(q => {
            const x = (p.coluna + q[1]) * lado;
            const y = (p.linha + q[0]) * lado;
            ctx.fillRect(x + 1, y + 1, lado - 2, lado - 2);
            ctx.strokeRect(x + 2, y + 2, lado - 4, lado - 4);
        });
    }

    function usar(novo) {
        if (!jogo || novo === jogo) return;
        jogo = novo;
        if (jogo.aviso === 'linha') {
            recado.textContent = 'Uma linha ficou completa e foi desfeita.';
        } else if (jogo.aviso === 'esvaziou') {
            recado.textContent = 'O tabuleiro estava cheio e foi esvaziado. Pode continuar.';
        } else {
            recado.textContent = '';
        }
        desenhar();
    }

    function ligar(ligados) {
        controles.forEach(b => { b.disabled = !ligados; });
    }

    const acoes = {
        'tetris-esq': () => tetrisMover(jogo, 0, -1),
        'tetris-dir': () => tetrisMover(jogo, 0, 1),
        'tetris-girar': () => tetrisGirar(jogo),
        'tetris-baixo': () => tetrisDescer(jogo, Math.random),
        'tetris-soltar': () => tetrisSoltar(jogo, Math.random)
    };

    Object.keys(acoes).forEach(id => {
        document.getElementById(id).addEventListener('click', () => usar(acoes[id]()));
    });

    document.addEventListener('keydown', evento => {
        if (!jogo || painel.hidden) return;
        const alvo = evento.target.tagName;
        if (alvo === 'INPUT' || alvo === 'TEXTAREA') return;
        const teclas = {
            ArrowLeft: 'tetris-esq',
            ArrowRight: 'tetris-dir',
            ArrowUp: 'tetris-girar',
            ArrowDown: 'tetris-baixo'
        };
        if (!teclas[evento.key]) return;
        evento.preventDefault();
        usar(acoes[teclas[evento.key]]());
    });

    botaoIniciar.addEventListener('click', () => {
        jogo = tetrisNovo(Math.random);
        recado.textContent = '';
        botaoIniciar.textContent = 'Esvaziar o tabuleiro';
        ligar(true);
        desenhar();
    });

    ligar(false);
    desenhar();
});
