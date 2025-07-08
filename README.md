---

## **1. Update and Install Dependencies**

```sh
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential
```

---

## **2. Install Node.js (LTS) and npm**

```sh
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## **3. Install PM2 Globally**

```sh
sudo npm install -g pm2
```

---

## **4. Install MongoDB**

If you want the official MongoDB Community Edition:

```sh
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

**Check status:**
```sh
sudo systemctl status mongod
```

---

## **5. (Optional) Install MongoDB Compass**

If you want Compass on the server, download the .deb from [MongoDB Compass Download](https://www.mongodb.com/try/download/compass) and install:

```sh
wget https://downloads.mongodb.com/compass/mongodb-compass_1.42.3_amd64.deb
sudo dpkg -i mongodb-compass_1.42.3_amd64.deb
```

---

## **6. Clone Your Project and Install Dependencies**

```sh
git clone https://github.com/SomethingForWork/ER_Linux.git
cd ER_Linux/server
npm install
cd ../frontend
npm install
```

---

## **7. Build the React Frontend**

```sh
npm run build
```
This will create a `build/` directory in `frontend/`.

---

## **8. Configure Backend Environment**

- Set up your `.env` or `config.js` in `server/config/` as needed (DB connection, JWT secret, etc.).
- Make sure MongoDB credentials in `server/index.js` match your MongoDB setup.

---

## **9. Start the Backend with PM2**

```sh
cd /path/to/ER_Linux/server
pm2 start index.js --name er-backend
pm2 save
pm2 startup
```

---

## **10. Serve the React Build with Nginx**

### **Install Nginx:**
```sh
sudo apt install -y nginx
```

### **Configure Nginx:**
Edit or create a config file, e.g., `/etc/nginx/sites-available/er_linux`:

```nginx
server {
    listen 80;
    server_name your_domain_or_ip;

    root /path/to/ER_Linux/frontend/build;
    index index.html index.htm;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable the config:**
```sh
sudo ln -s /etc/nginx/sites-available/er_linux /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## **11. (Optional) Secure with SSL (Let's Encrypt)**

```sh
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain
```

---

## **12. Check Everything**

- **Frontend:** http://your_domain or http://your_server_ip
- **Backend API:** http://your_domain/api/ (proxied)
- **MongoDB:** `mongo` shell or Compass

---

## **13. PM2 Management**

- View logs: `pm2 logs er-backend`
- Restart: `pm2 restart er-backend`
- Stop: `pm2 stop er-backend`
- List: `pm2 list`

---
