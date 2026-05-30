# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build React frontend
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY frontend/ .

# When frontend and backend run on the same origin (single container),
# API calls use a relative path — no hostname needed.
ARG REACT_APP_BACKEND_URL=""
ARG REACT_APP_SITE_URL=https://sparshpehla.com
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
ENV REACT_APP_SITE_URL=$REACT_APP_SITE_URL

RUN yarn build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Install Python dependencies (cached separately)
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.12-slim AS python-deps

WORKDIR /deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — Final image: Python + nginx + React build
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.12-slim

# Install nginx
RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages
COPY --from=python-deps /usr/local/lib/python3.12 /usr/local/lib/python3.12
COPY --from=python-deps /usr/local/bin /usr/local/bin

# Backend source
WORKDIR /app
COPY backend/ .

# React build → nginx web root
COPY --from=frontend-builder /frontend/build /app/frontend_build

# nginx config
COPY nginx.prod.conf /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/sites-enabled/default \
    && ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default

# Startup script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Media uploads volume
VOLUME ["/app/media"]

EXPOSE 80

CMD ["/start.sh"]
