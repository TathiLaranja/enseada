document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas-desenho');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function redimensionarCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 16;
        canvas.height = 400;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#4A5568';
    }

    redimensionarCanvas();
    window.addEventListener('resize', redimensionarCanvas);

    let desenhando = false;
    let ultimaX = 0;
    let ultimaY = 0;

    function obterPosicao(e) {
        const rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches[0]) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function iniciarDesenho(e) {
        desenhando = true;
        const pos = obterPosicao(e);
        ultimaX = pos.x;
        ultimaY = pos.y;
    }

    function desenhar(e) {
        if (!desenhando) return;
        e.preventDefault();
        const pos = obterPosicao(e);

        ctx.beginPath();
        ctx.moveTo(ultimaX, ultimaY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        ultimaX = pos.x;
        ultimaY = pos.y;
    }

    function pararDesenho() {
        desenhando = false;
    }

    canvas.addEventListener('mousedown', iniciarDesenho);
    canvas.addEventListener('mousemove', desenhar);
    canvas.addEventListener('mouseup', pararDesenho);
    canvas.addEventListener('mouseleave', pararDesenho);

    canvas.addEventListener('touchstart', iniciarDesenho, { passive: false });
    canvas.addEventListener('touchmove', desenhar, { passive: false });
    canvas.addEventListener('touchend', pararDesenho);

    const botoesCor = document.querySelectorAll('.botao-cor');
    botoesCor.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesCor.forEach(b => {
                b.classList.remove('ativa');
                b.setAttribute('aria-pressed', 'false');
            });
            botao.classList.add('ativa');
            botao.setAttribute('aria-pressed', 'true');
            ctx.strokeStyle = botao.getAttribute('data-cor');
        });
    });

    const btnLimpar = document.getElementById('btn-limpar');
    if (btnLimpar) {
        btnLimpar.addEventListener('click', () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        });
    }

    const btnSalvar = document.getElementById('btn-salvar');
    if (btnSalvar) {
        btnSalvar.addEventListener('click', () => {
            const dataURL = canvas.toDataURL('image/png');
            if (typeof salvarNoArmazenamento === 'function') {
                salvarNoArmazenamento('enseada_ultimo_desenho', dataURL);
            }
            btnSalvar.textContent = 'Salvo com Sucesso!';
            setTimeout(() => {
                btnSalvar.textContent = 'Salvar Traço';
            }, 2000);
        });
    }
});
