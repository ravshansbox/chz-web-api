FROM node:18-alpine AS base
WORKDIR /app
COPY package.json package-lock.json schema.prisma tsconfig.json ./

FROM base AS dev
RUN npm ci
COPY . ./
RUN npm run build

FROM base AS prod
RUN npm ci --omit=dev

FROM base
COPY --from=prod /app/node_modules ./node_modules
COPY --from=dev /app/dist ./
CMD npm run migrate && node ./src/index.js
