FROM node:20

# crea directorio de trabajo
RUN mkdir -p /home/app

# establece el directorio de trabajo dentro del contenedor
WORKDIR /home/app

# Copia el package.json y package-lock.json primero (mejora el cacheo de capas)
COPY package*.json ./

# Instala sharp correctamente con sus dependencias en Linux
RUN apt-get update && apt-get install -y \
    libvips-dev \
 && npm install --include=optional

# CREA DIRECOTRIO DE TRABAJO
COPY . . 

# instala dependencias
RUN npm install

# expone el puerto que usa la app
EXPOSE 3000

# comando por defecto en produccion
CMD ["node", "--watch", "app.js"]