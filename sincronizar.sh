#!/bin/bash
# Script para sincronizar (puxar) as últimas alterações do GitHub

echo "📡 Sincronizando com o repositório 'main' no GitHub..."

# Define o fuso horário para Brasília (UTC-3)
export TZ="America/Sao_Paulo"

# Puxa as últimas alterações do branch 'main' do remoto 'origin'
# --tags também busca as etiquetas (tags) mais recentes
if git pull origin main --tags; then
  echo "✅ Sincronização concluída com sucesso em $(date +'%Y-%m-%d %H:%M:%S')!"
  echo "Seu ambiente está atualizado com a versão mais recente do GitHub."
else
  echo "❌ Falha ao sincronizar. Verifique sua conexão com a internet e se há conflitos de arquivo."
fi
