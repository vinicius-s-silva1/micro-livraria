
# Imagem base do Node.js
FROM node

# Diretorio de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY . /app

# Instala as dependencias
RUN npm install

# Inicia o servico Shipping
CMD ["node", "/app/services/shipping/index.js"]