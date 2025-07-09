
---

# **Full Secure Deployment Guide (HTTPS Only, Ubuntu 22.04.5)**

---

## **1. Prepare Your Server**

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

## **5. Set Up Firewall (Only Open 22, 443, 27017)**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 443
sudo ufw allow 27017
sudo ufw enable
```
- **Do NOT open port 80.**

---

## **6. Place Your SSL Wildcard Certificate**

Copy your wildcard certificate and key to the server:
```bash
sudo mkdir -p /etc/ssl/yourdomain
sudo cp yourdomain.com.crt /etc/ssl/yourdomain/
sudo cp yourdomain.com.key /etc/ssl/yourdomain/
# If you have a CA bundle:
sudo cp ca-bundle.crt /etc/ssl/yourdomain/
```

---

## **7. Clone Your Project**

```bash
cd /opt
sudo git clone <your-repo-url> ER_Linux
sudo chown -R $USER:$USER ER_Linux
cd ER_Linux
```

---

## **8. Place Your .env Files**

- Copy your `.env` files to:
  - `/opt/ER_Linux/server/.env`
  - `/opt/ER_Linux/frontend/.env`

---

## **9. Install and Start Backend**

```bash
cd /opt/ER_Linux/server
npm install
pm2 start index.js --name er-backend
pm2 save
```

---

## **10. Build Frontend**

```bash
cd /opt/ER_Linux/frontend
npm install
npm run build
```

---

## **11. Configure Nginx for HTTPS Only**

```bash
sudo nano /etc/nginx/sites-available/erapp
```
Paste this (replace `erapp.yourdomain.com` and cert paths as needed):

```nginx
server {
    listen 443 ssl;
    server_name erapp.yourdomain.com;

    ssl_certificate /etc/ssl/yourdomain/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/yourdomain/yourdomain.com.key;
    ssl_trusted_certificate /etc/ssl/yourdomain/ca-bundle.crt;  # If provided

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

**Enable the config and reload Nginx:**
```bash
sudo ln -s /etc/nginx/sites-available/erapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## **12. Update Backend CORS Origin**

**In `server/index.js`, set:**
```js
app.use(cors({
  origin: 'https://erapp.yourdomain.com',
  credentials: true
}));
```

---

## **13. (Optional) PM2 Startup on Boot**

```bash
pm2 startup
# Follow the instructions printed to run the command as root
pm2 save
```

---

## **14. Test Your App**

- Open a browser and go to:  
  `https://erapp.yourdomain.com`
- You should see your app, and the browser should show a secure (padlock) icon.

---

## **15. (Optional) MongoDB Compass**

- Use:  
  ```
  mongodb://restrict_user:random@erapp.yourdomain.com:27017/restrict_app
  ```
  or  
  ```
  mongodb://restrict_user:random@<server-ip>:27017/restrict_app
  ```
  (if you want to connect from your internal network)

---

# **Summary Table**

| Step                | Command/Action                                      |
|---------------------|-----------------------------------------------------|
| System prep         | `sudo apt update && sudo apt upgrade -y`            |
| Node/PM2            | Install as above                                    |
| MongoDB             | Install, create users, enable auth                  |
| Firewall            | Only open 22, 443, 27017                            |
| SSL cert            | Place in `/etc/ssl/yourdomain/`                     |
| Clone repo          | `git clone ...`                                     |
| Place .env files    | Copy to `/server` and `/frontend`                   |
| Backend             | `npm install`, `pm2 start index.js`                 |
| Frontend            | `npm install`, `npm run build`                      |
| Nginx config        | Use above, only listen on 443                       |
| Enable Nginx site   | `ln -s ...`, `nginx -t`, `systemctl reload nginx`   |
| Backend CORS        | Set to `https://erapp.yourdomain.com`               |
| Test app            | Visit `https://erapp.yourdomain.com`                |

---
