#!/bin/sh
# Roda os tres testes. Nao precisa instalar nada: so o Node.
#   sh teste/executar.sh
falhou=0
for arquivo in teste/ancoras.test.js teste/roteiro.test.js teste/armazenamento.test.js; do
  node "$arquivo" || falhou=1
done
if [ "$falhou" = "1" ]; then
  echo "Algum teste falhou."
  exit 1
fi
echo "Tudo passou."
