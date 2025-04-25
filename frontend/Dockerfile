FROM node:16 AS build

WORKDIR /app
COPY ./package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

# 本番用の軽量イメージ
FROM nginx:alpine

# Nginxのデフォルト設定を削除
RUN rm -rf /usr/share/nginx/html/*

# ビルド成果物をコピー
COPY --from=build /app/build /usr/share/nginx/html

# ポートを公開
EXPOSE 80

# Nginxを起動
CMD ["nginx", "-g", "daemon off;"]
