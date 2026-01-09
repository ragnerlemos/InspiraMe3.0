#!/bin/bash
# Script para salvar e enviar as alterações para o GitHub

# A URL correta do seu repositório
GITHUB_URL="https://github.com/ragnerlemos/InspiraMe.git"

# Verifica se o diretório atual é um repositório Git
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "---"
  echo "⚠️ Este não é um repositório Git ainda."
  echo "Inicializando o Git e conectando ao seu repositório..."
  git init -b main
  git remote add origin "$GITHUB_URL"
  echo "✅ Repositório remoto adicionado com sucesso!"
  echo "---"
fi

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
  echo "❌ Falha ao enviar para o GitHub. Verifique suas credenciais de acesso."
fi
