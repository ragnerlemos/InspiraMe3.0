#!/bin/bash
# Script para salvar e enviar as alterações para o GitHub

echo "Adicionando todos os arquivos..."
git add .

# Cria um commit com data e hora
COMMIT_MESSAGE="Salvo em $(date +'%Y-%m-%d %H:%M:%S')"
echo "Criando commit com a mensagem: $COMMIT_MESSAGE"
git commit -m "$COMMIT_MESSAGE"

echo "Enviando alterações para o repositório no GitHub..."
if git push -u origin main; then
  echo "✅ Versão salva no GitHub com sucesso!"
else
  echo "❌ Falha ao enviar para o GitHub. Verifique suas credenciais de acesso (use o Personal Access Token como senha)."
fi
