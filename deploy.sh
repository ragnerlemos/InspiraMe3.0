#!/bin/bash
# Script para salvar e enviar as alterações para o GitHub

# Verifica se o diretório atual é um repositório Git
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
  echo "---"
  echo "⚠️ Este não é um repositório Git ainda."
  echo "Inicializando o Git agora..."
  git init -b main
  
  echo ""
  echo "➡️ Por favor, cole a URL do seu repositório do GitHub e pressione Enter."
  echo "   (Exemplo: https://github.com/seu-usuario/seu-repositorio.git)"
  read -p "URL do repositório: " GITHUB_URL
  
  if [ -n "$GITHUB_URL" ]; then
    git remote add origin "$GITHUB_URL"
    echo "✅ Repositório remoto adicionado com sucesso!"
  else
    echo "❌ Nenhuma URL fornecida. Saindo. Tente novamente."
    exit 1
  fi
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
  echo "❌ Falha ao enviar para o GitHub. Verifique a URL do repositório e suas credenciais."
fi
