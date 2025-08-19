# Frontend Dockerfile pour CESIZEN
FROM node:23-alpine

WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY src ./src
COPY public ./public
COPY index.html ./

# Déclaration des build args depuis GitHub Actions
ARG VITE_API_BASE_URL
ARG VITE_GITHUB_TOKEN
ARG VITE_GITHUB_REPO_OWNER
ARG VITE_GITHUB_REPO_NAME

# Conversion en variables d'environnement pour que Vite puisse les voir
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GITHUB_TOKEN=$VITE_GITHUB_TOKEN
ENV VITE_GITHUB_REPO_OWNER=$VITE_GITHUB_REPO_OWNER
ENV VITE_GITHUB_REPO_NAME=$VITE_GITHUB_REPO_NAME

# Build l'application avec les variables injectées
RUN npm run build

# Exposer le port
EXPOSE 5173

# Commande de démarrage en mode preview
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]