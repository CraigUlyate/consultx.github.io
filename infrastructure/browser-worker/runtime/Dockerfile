FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY session-agent.mjs operator-session.mjs ./
USER node
CMD ["node", "session-agent.mjs"]
