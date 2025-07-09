
---

# **Step-by-Step Deployment Guide (Ubuntu 22.04.5)**

---

## **1. Update and Install System Packages**

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

## **3. (If Needed) Install MongoDB**

If you are running MongoDB on this server:
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```
- **Check status:** `sudo systemctl status mongod`

---

## **4. Clone Your Project**

```bash
cd /opt
sudo git clone <your-repo-url> ER_Linux
sudo chown -R $USER:$USER ER_Linux
cd ER_Linux
```

---

## **5. Place Your `.env` Files**

- Copy your **perfect** `.env` files into:
  - `/opt/ER_Linux/server/.env`
  - `/opt/ER_Linux/frontend/.env`

---

## **6. Install Backend Dependencies and Start Backend**

```bash
cd /opt/ER_Linux/server
npm install
pm2 start index.js --name er-backend
pm2 save
```
- **Check logs:** `pm2 logs er-backend`

---

## **7. Install Frontend Dependencies and Build**

```bash
cd /opt/ER_Linux/frontend
npm install
npm run build
```
- The build output will be in `/opt/ER_Linux/frontend/build`

---

## **8. Configure Nginx as a Reverse Proxy**

**Create Nginx config:**
```bash
sudo nano /etc/nginx/sites-available/er_linux
```

**Paste this (replace IP as needed):**
```nginx
server {
    listen 80;
    server_name 10.91.41.16;  # Use your server's internal IP

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

**Enable the config:**
```bash
sudo ln -s /etc/nginx/sites-available/er_linux /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## **9. Set Up Firewall**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```
- **Port 3000 does NOT need to be open externally.**

---

## **10. Test Your App**

- Open a browser on your internal network:  
  `http://10.91.41.16`
- Log in and test all features.

---

## **11. (Optional) Set Up PM2 Startup Script**

```bash
pm2 startup
# Follow the instructions printed to run the command as root
pm2 save
```
- This ensures your backend restarts on server reboot.

---

## **12. (Optional) Enable HTTPS (Recommended for Security)**

- Obtain a certificate (internal CA or self-signed for internal use).
- Update Nginx config to listen on 443 and use SSL.

---

# **Summary Table**

| Step                | Command/Action                                      |
|---------------------|-----------------------------------------------------|
| Update server       | `sudo apt update && sudo apt upgrade -y`            |
| Install Node/PM2    | `sudo apt install -y nodejs npm` + `npm i -g pm2`   |
| Install MongoDB     | See above                                           |
| Install Nginx       | `sudo apt install -y nginx`                         |
| Clone repo          | `git clone <repo-url>`                              |
| Place .env files    | Copy to `/server` and `/frontend`                   |
| Backend build/start | `npm install` + `pm2 start index.js`                |
| Frontend build      | `npm install` + `npm run build`                     |
| Nginx config        | See above                                           |
| Firewall            | `sudo ufw allow 80 443`                             |
| Test app            | Visit `http://<server-ip>`                          |

---

Shukriya 😊
