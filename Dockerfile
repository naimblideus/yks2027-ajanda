# Coolify: uygulama dosyalarını ve sunucuyu bu depodan alır. Güncellemek için yalnız Redeploy.
FROM node:22-alpine
WORKDIR /app
ADD https://codeload.github.com/naimblideus/yks2027-ajanda/tar.gz/refs/heads/main /tmp/site.tgz
RUN tar -xzf /tmp/site.tgz -C /app --strip-components=1 && rm /tmp/site.tgz
ENV PORT=3000 VERI_DIR=/veri SITE_DIR=/app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s CMD wget -qO- http://127.0.0.1:3000/saglik || exit 1
CMD ["node", "sunucu/sunucu.mjs"]
