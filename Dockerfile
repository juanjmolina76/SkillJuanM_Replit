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

# Crea directorio de trabajo
WORKDIR /home/app
# Instala dependencias del sistema necesarias para sharp
RUN apt-get update && apt-get install -y libvips-dev



# Copia solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install --include=optional

# Ahora copia el resto del código fuente
COPY . .

# Expone el puerto que usa la app
EXPOSE 4000

# Comando por defecto en PRODUCCION (ver en package.json era:  "start": "node --watch app.js") y uso "npm run dev" cuando programo
# CMD ["node", "--watch", "app.js"]
# Comando para DESARROLLO para optimizar el uso en docker (ver en package.json:  "start": "node app.js" Y "dev": "node --watch app.js")
CMD ["npm", "start"]
