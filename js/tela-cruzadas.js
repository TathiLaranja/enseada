/* Enseada - a tela das palavras cruzadas.
   Regras em js/cruzadas.js. Aqui so desenha a grade e escuta a digitacao.
   Nada aponta erro, nada conta tempo e nada pontua. Conferir responde em
   palavra; a dica poe a letra certa. */

document.addEventListener('DOMContentLoaded', () => {
    const area = document.getElementById('container-cruzadas');
    if (!area) return;
    const recado = document.getElementById('recado-cruzadas');
    let jogo = null;
    let direcaoAtiva = 'h';

    function entradasDaCelula(r, c) {
        return jogo.entradas.filter(function(e) {
            if (e.direcao === 'h') {
                return e.linha === r && c >= e.coluna && c < e.coluna + e.resposta.length;
            }
            return e.coluna === c && r >= e.linha && r < e.linha + e.resposta.length;
        });
    }

    function palavraErrada(r, c, dir) {
        var entrada = entradasDaCelula(r, c).filter(function(e) { return e.direcao === dir; })[0];
        if (!entrada) return null;
        var cheio = true;
        for (var i = 0; i < entrada.resposta.length; i++) {
            var er = dir === 'v' ? entrada.linha + i : entrada.linha;
            var ec = dir === 'h' ? entrada.coluna + i : entrada.coluna;
            if (!jogo.atual[er][ec]) { cheio = false; break; }
        }
        if (!cheio) return null;
        for (i = 0; i < entrada.resposta.length; i++) {
            er = dir === 'v' ? entrada.linha + i : entrada.linha;
            ec = dir === 'h' ? entrada.coluna + i : entrada.coluna;
            if (jogo.atual[er][ec] !== entrada.resposta[i]) return entrada.numero;
        }
        return null;
    }

    function avancarFoco(r, c, dir) {
        var nr = dir === 'v' ? r + 1 : r;
        var nc = dir === 'h' ? c + 1 : c;
        var alvo = area.querySelector('[data-casa="' + nr + ',' + nc + '"]');
        if (alvo) { alvo.focus(); }
    }

    function comecar() {
        jogo = cruzadasNovo(Math.random);
        recado.textContent = '';
        desenhar();
    }

    function desenhar() {
        area.textContent = '';

        const grade = document.createElement('div');
        grade.className = 'grade-cruzada';
        grade.style.gridTemplateColumns = 'repeat(' + jogo.colunas + ', 1fr)';
        grade.setAttribute('role', 'group');
        grade.setAttribute('aria-label', 'Grade das palavras cruzadas');

        for (let r = 0; r < jogo.linhas; r++) {
            for (let c = 0; c < jogo.colunas; c++) {
                grade.appendChild(criarCelula(r, c));
            }
        }
        area.appendChild(grade);
        area.appendChild(listaDeDicas('h', 'Na horizontal'));
        area.appendChild(listaDeDicas('v', 'Na vertical'));
    }

    function criarCelula(r, c) {
        const celula = document.createElement('div');
        if (jogo.grade[r][c] === '') {
            celula.className = 'celula-cruz sem-letra';
            return celula;
        }
        celula.className = 'celula-cruz';

        const numero = jogo.numeros[r + ',' + c];
        const campo = document.createElement('input');
        campo.type = 'text';
        campo.maxLength = 2;
        campo.autocomplete = 'off';
        campo.autocapitalize = 'characters';
        campo.spellcheck = false;
        campo.className = 'letra-input';
        campo.setAttribute('data-casa', r + ',' + c);
        campo.value = jogo.atual[r][c];
        campo.setAttribute('aria-label',
            'Linha ' + (r + 1) + ', coluna ' + (c + 1) + (numero ? ', número ' + numero : ''));

        campo.addEventListener('focus', function() {
            var dirs = entradasDaCelula(r, c).map(function(e) { return e.direcao; });
            if (dirs.length === 1) { direcaoAtiva = dirs[0]; }
            else if (dirs.length > 1 && dirs.indexOf(direcaoAtiva) === -1) { direcaoAtiva = dirs[0]; }
        });

        campo.addEventListener('input', () => {
            const letra = cruzadasLerDigitacao(jogo.atual[r][c], campo.value);
            jogo = cruzadasColocar(jogo, r, c, letra);
            campo.value = jogo.atual[r][c];
            if (letra) {
                const numErrada = palavraErrada(r, c, direcaoAtiva);
                if (numErrada !== null) {
                    recado.textContent = 'Palavra ' + numErrada + ' completa, mas tem uma letra errada.';
                } else {
                    recado.textContent = '';
                }
                avancarFoco(r, c, direcaoAtiva);
            } else {
                recado.textContent = '';
            }
        });

        if (numero) {
            const marca = document.createElement('span');
            marca.className = 'numero-cruz';
            marca.setAttribute('aria-hidden', 'true');
            marca.textContent = String(numero);
            celula.appendChild(marca);
        }
        celula.appendChild(campo);
        return celula;
    }

    function listaDeDicas(direcao, titulo) {
        const bloco = document.createElement('div');
        bloco.className = 'dicas-cruzada';
        const h = document.createElement('h3');
        h.textContent = titulo;
        bloco.appendChild(h);
        const lista = document.createElement('ul');
        jogo.entradas.filter(e => e.direcao === direcao).forEach(e => {
            const item = document.createElement('li');
            item.textContent = e.numero + '. ' + e.dica + ' (' + e.resposta.length + ' letras)';
            lista.appendChild(item);
        });
        bloco.appendChild(lista);
        return bloco;
    }

    document.getElementById('verificar-cruzadas').addEventListener('click', () => {
        if (cruzadasCerto(jogo)) {
            recado.textContent = 'Todas as letras estão no lugar.';
        } else if (cruzadasCheio(jogo)) {
            recado.textContent = 'Todas as casas têm letra, mas alguma está fora do lugar. Peça uma dica ou troque uma letra.';
        } else {
            recado.textContent = 'Ainda há casas vazias. Continue no seu ritmo ou peça uma dica.';
        }
    });

    document.getElementById('dica-cruzadas').addEventListener('click', () => {
        const resultado = cruzadasDica(jogo, Math.random);
        if (!resultado.casa) {
            recado.textContent = 'Não há mais o que ajudar: tudo está no lugar.';
            return;
        }
        jogo = resultado.jogo;
        const r = resultado.casa[0];
        const c = resultado.casa[1];
        desenhar();
        const alvo = area.querySelector('[data-casa="' + r + ',' + c + '"]');
        if (alvo) { alvo.focus(); }
        recado.textContent = 'Dica: pus a letra ' + jogo.atual[r][c] +
            ' na linha ' + (r + 1) + ', coluna ' + (c + 1) + '.';
    });

    document.getElementById('reiniciar-cruzadas').addEventListener('click', comecar);

    comecar();
});
