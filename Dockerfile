# Используем официальный Node.js образ
FROM node:20

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем всё остальное
COPY . .

# Собираем приложение
RUN npm run build

# Устанавливаем порт
EXPOSE 3000

# Стартуем приложение
CMD ["npm", "run", "start:prod"]
