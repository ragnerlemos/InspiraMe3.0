#!/bin/bash
# Deploy automático do InspireMe no Vercel

# Token Vercel (certifique-se de ter exportado e configurado no seu ambiente)
# export VERCEL_TOKEN=SEU_TOKEN_AQUI

echo "Iniciando deploy do projeto InspireMe..."
vercel --prod --token $VERCEL_TOKEN --yes
echo "Deploy finalizado!"
