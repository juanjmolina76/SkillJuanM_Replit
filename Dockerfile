FROM node:20

# crea directorio de trabajo
RUN mkdir -p /home/app

# establece el directorio de trabajo dentro del contenedor
WORKDIR /home/app


# CREA DIRECOTRIO DE TRABAJO
COPY . . 

# instala dependencias
RUN npm install

# expone el puerto que usa la app
EXPOSE 3000

# comando por defecto en produccion
CMD ["node", "--watch", "app.js"]