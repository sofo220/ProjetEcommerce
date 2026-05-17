# Shoppex Ecommerce

Application ecommerce avec frontend React et API Laravel.

## Prerequis

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL ou SQLite

## Installation backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --host=127.0.0.1 --port=8000
```

## Installation frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Compte de test:

- Email: `admin@shoppex.ma`
- Mot de passe: `password123`

## Publication

Ce dossier est pret pour GitHub: les dependances installees, les fichiers `.env`, les builds generes, les bases locales et les caches Laravel ne sont pas inclus.
