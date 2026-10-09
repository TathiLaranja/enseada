#!/bin/sh
# Roda os testes. Nao precisa instalar nada: so o Node.
#   sh teste/executar.sh
falhou=0
for arquivo in teste/ancoras.test.js teste/roteiro.test.js teste/armazenamento.test.js teste/rede.test.js teste/memoria.test.js teste/sudoku.test.js teste/tetris.test.js teste/cruzadas.test.js teste/menu.test.js teste/abertura.test.js teste/paleta.test.js teste/compartilhar.test.js teste/icone.test.js teste/fotos.test.js teste/mini.test.js teste/album.test.js; do
  node "$arquivo" || falhou=1
done
if [ "$falhou" = "1" ]; then
  echo "Algum teste falhou."
  exit 1
fi
echo "Tudo passou."
