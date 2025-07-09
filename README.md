
---

# **Production Deployment Guide (Ubuntu 22.04.5)**

---

## **1. Update and Install Essentials**

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl build-essential ufw nginx
```

---

## **2. Install Node.js, npm, and PM2**

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

---

## **3. Install MongoDB**

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```

---

## **4. Create MongoDB Users and Enable Auth**

```bash
mongosh
```
In the shell:
```js
use admin
db.createUser({
  user: "admin",
  pwd: "your-admin-password",
  roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})

use restrict_app
db.createUser({
  user: "restrict_user",
  pwd: "random",
  roles: [ { role: "readWrite", db: "restrict_app" } ]
})
exit
```

Edit MongoDB config:
```bash
sudo nano /etc/mongod.conf
```
Add or edit:
```yaml
security:
  authorization: enabled
net:
  port: 27017
  bindIp: 0.0.0.0
```
Save and exit, then restart:
```bash
sudo systemctl restart mongod
```

---

## **5. Set Up Firewall**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 27017
sudo ufw enable
```

---

## **6. Clone Your Project**

```bash
cd /opt
sudo git clone <your-repo-url> ER_Linux
sudo chown -R $USER:$USER ER_Linux
cd ER_Linux
```

---

## **7. Place Your .env Files**

- Copy your `.env` files to:
  - `/opt/ER_Linux/server/.env`
  - `/opt/ER_Linux/frontend/.env`

---

## **8. Install and Start Backend**

```bash
cd /opt/ER_Linux/server
npm install
pm2 start index.js --name er-backend
pm2 save
```

---

## **9. Build Frontend**

```bash
cd /opt/ER_Linux/frontend
npm install
npm run build
```

---

## **10. Configure Nginx Reverse Proxy**

```bash
sudo nano /etc/nginx/sites-available/er_linux
```
Paste:
```nginx
server {
    listen 80;
    server_name 10.91.41.16;

    root /opt/ER_Linux/frontend/build;
    index index.html;

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
Enable and reload:
```bash
sudo ln -s /etc/nginx/sites-available/er_linux /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## **11. Test Everything**

- **App:** Open `http://10.91.41.16` in your browser.
- **Backend:** Check with `pm2 logs er-backend`
- **MongoDB Compass:**  
  Use:  
  ```
  mongodb://restrict_user:random@10.91.41.16:27017/restrict_app
  ```

---

## **12. (Optional) PM2 Startup on Boot**

```bash
pm2 startup
# Follow the instructions printed to run the command as root
pm2 save
```

---

# **You’re Done!**

- App is live at `http://10.91.41.16`
- Backend is running and protected with MongoDB auth
- MongoDB Compass can connect using the credentials above

---
