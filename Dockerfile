#FROM node:20

# crea directorio de trabajo
#RUN mkdir -p /home/app

# establece el directorio de trabajo dentro del contenedor
#WORKDIR /home/app

# Copia el package.json y package-lock.json primero (mejora el cacheo de capas)
#COPY package*.json ./


# CREA DIRECOTRIO DE TRABAJO
#COPY . . 

# Instala sharp correctamente con sus dependencias en Linux
#RUN apt-get update && apt-get install -y libvips-dev && npm install --include=optional

# expone el puerto que usa la app
#EXPOSE 3000

# comando por defecto en produccion
#CMD ["node", "--watch", "app.js"]


FROM node:20

# Instala dependencias del sistema necesarias para sharp
RUN apt-get update && apt-get install -y libvips-dev

# Crea directorio de trabajo
WORKDIR /home/app

# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install --include=optional

# Ahora copia el resto del código fuente
COPY . .

# Expone el puerto que usa la app
EXPOSE 3000

# Comando por defecto en producción
CMD ["node", "--watch", "app.js"]
