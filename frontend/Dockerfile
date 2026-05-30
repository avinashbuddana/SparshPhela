# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Pass build-time env vars (set via docker build --build-arg or docker-compose)
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_SITE_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_SITE_URL=$REACT_APP_SITE_URL

RUN yarn build

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.25-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
