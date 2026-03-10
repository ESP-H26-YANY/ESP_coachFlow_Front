# Déploiement du Front-End (React + Vite) sur Linux via Nginx

Ce guide détaille les étapes pour compiler le projet React et le servir via **Nginx** sur un serveur Ubuntu. Contrairement à l'API, le front-end n'a pas besoin de tourner en arrière-plan avec PM2 : les fichiers compilés sont purement statiques (HTML/CSS/JS) et sont servis directement par le serveur web.

## Prérequis
* Node.js et npm installés sur le serveur (voir le DEPLOYMENT.md de l'API).
* Nginx installé sur le serveur :
  ```bash
  sudo apt install nginx -y
  ```
# Clonage et Préparation
- Avec le user deploy ou root 
```bash 
su - deploy
cd /var/www

# Cloner le dépôt front-end
git clone [https://github.com/......lien_front](https://github.com/......lien_front)
cd ESP_coachFlow_Front

# Installer les dépendances
npm install
```

# Configuration de l'environnement de production
Créez un fichier .env à la racine du projet et ajoutez l'URL de votre
```bash
# Fichier .env
nano .env
# mettre cette ligne dans le fichier .env
VITE_API_URL=https://localhost:5144/api

#Compilation
npm run build
```
# Configuration de Nginx

``` bash 
sudo nano /etc/nginx/sites-available/coachflow_front
```
- mettre cette configuration **Attention** il doit être adapté à votre configuration de serveur web
```bash 
server {
    server_name coachflow.y-any.org;
location /uploads/ {
        alias /var/www/coachflow_data/uploads/;
        autoindex off;
        access_log off;
        add_header Cache-Control "public, max-age=31536000";
    }
    # Front-end
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API .NET
    location /api/ {
        proxy_pass http://localhost:5144/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/coachflow.y-any.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/coachflow.y-any.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = coachflow.y-any.org) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name coachflow.y-any.org;
    return 404; # managed by Certbot
}

```

# Activation et Droits
Activez le site dans Nginx, donnez les bons droits de lecture, et redémarrez le service web.
```bash 
# Activer la configuration
sudo ln -s /etc/nginx/sites-available/coachflow_front /etc/nginx/sites-enabled/

# Supprimer la page par défaut de Nginx (Optionnel mais recommandé)
sudo rm /etc/nginx/sites-enabled/default

# Donner les droits à Nginx (www-data) pour lire le dossier build
sudo chown -R www-data:www-data /var/www/ESP_coachFlow_Front/dist
sudo chmod -R 755 /var/www/ESP_coachFlow_Front/dist

# Tester la syntaxe Nginx
sudo nginx -t

# Redémarrer Nginx pour appliquer les changements
sudo systemctl restart nginx
```

