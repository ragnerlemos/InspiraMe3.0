#!/bin/bash
# SCRIPT DE CONFIGURAÇÃO INICIAL - EXECUTE APENAS UMA VEZ!

# URL do seu repositório
GITHUB_URL="https://github.com/ragnerlemos/InspiraMe.git"

echo "---"
echo "🔧 Iniciando a configuração do repositório Git..."
echo "---"

# 1. Inicializa o repositório Git localmente
git init -b main
echo "✅ Repositório Git local inicializado."

# 2. Adiciona a conexão com seu repositório remoto no GitHub
git remote add origin "$GITHUB_URL"
echo "✅ Conectado ao repositório remoto: $GITHUB_URL"

# 3. Adiciona todos os arquivos para o primeiro commit
git add .
echo "✅ Todos os arquivos foram preparados para o primeiro envio."

# 4. Cria o primeiro commit
git commit -m "Commit inicial do projeto InspireMe"
echo "✅ Ponto de salvamento inicial (commit) criado."

echo "---"
echo "🚀 Configuração concluída! Agora você pode usar o 'deploy.sh' para enviar suas alterações."
echo "---"
