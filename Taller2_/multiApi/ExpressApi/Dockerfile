FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
# el proyecto Express usa prisma y ts-node en devDependencies, necesarios para la construcción.
RUN npm install

COPY . .

RUN npm run build || echo "Asumiendo que 'npm run build' compila y genera 'dist'"

FROM node:20-alpine AS production

WORKDIR /app

COPY package.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

#se usa schema prisma
COPY prisma ./prisma
RUN npx prisma generate
#puerto que usa api en docker
EXPOSE 3000

CMD ["node", "dist/main.js"]