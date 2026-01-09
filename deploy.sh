#!/bin/bash
# Script para salvar e enviar as alterações para o GitHub

echo "Adicionando todos os arquivos..."
git add .

# Cria um commit com data e hora
COMMIT_MESSAGE="Salvo em $(date +'%Y-%m-%d %H:%M:%S')"
echo "Criando commit com a mensagem: $COMMIT_MESSAGE"
# O || true evita que o script pare se não houver nada para commitar
git commit -m "$COMMIT_MESSAGE" || true

echo "Enviando alterações para o repositório no GitHub..."
# Usa 'origin', que foi configurado pelo 'iniciar_git.sh'
# A flag --force é usada para sobrescrever o histórico remoto, útil na configuração inicial.
if git push --force origin main; then
  echo "✅ Versão salva no GitHub com sucesso!"
else
  echo "❌ Falha ao enviar para o GitHub. Verifique suas credenciais de acesso (use o Personal Access Token como senha)."
fi
