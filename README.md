**Assumptions:**  
- Server IP: `10.91.41.16`  
- MongoDB runs locally  
- Internal-only deployment  
- You want to use MongoDB Compass for DB management  
- Your repo is private and you have access

---

# **Step-by-Step Deployment Guide (with Real Values)**

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

## **3. Install MongoDB Community Edition**

```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl enable mongod
sudo systemctl start mongod
```
- **Check status:**  
  `sudo systemctl status mongod`

---

## **4. Create MongoDB User for Your App**

Open the MongoDB shell:
```bash
mongosh
```
Run the following commands:
```js
use restrict_app
db.createUser({
  user: "restrict_user",
  pwd: "random",
  roles: [ { role: "readWrite", db: "restrict_app" } ]
})
exit
```

---

## **5. Allow MongoDB Remote Access for Compass (Optional, Internal Only)**

Edit MongoDB config:
```bash
sudo nano /etc/mongod.conf
```
- Find `bindIp: 127.0.0.1` and change to:
  ```
  bindIp: 0.0.0.0
  ```
- Save and exit, then restart MongoDB:
  ```bash
  sudo systemctl restart mongod
  ```

**(Security Note: Only do this if your server is firewalled and only accessible internally!)**

---

## **6. Set Up Firewall**

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 27017    # For MongoDB Compass (internal only)
sudo ufw enable
```

---

## **7. Install Nginx**

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

---

## **8. Clone Your Project**

```bash
cd /opt
sudo git clone <your-repo-url> ER_Linux
sudo chown -R $USER:$USER ER_Linux
cd ER_Linux
```

---

## **9. Place Your .env Files**

**/opt/ER_Linux/server/.env**
```env
MONGODB_URI=mongodb://restrict_user:random@localhost:27017/restrict_app
JWT_SECRET=your-very-secret-key
LDAP_URL=ldap://10.91.50.11:389
SMTP_HOST=mail.religare.com
SMTP_PORT=25
SMTP_SECURE=false
EMAIL_USER=your-email@yourdomain.com
EMAIL_PASSWORD=your-email-password
PORT=3000
```

**/opt/ER_Linux/frontend/.env**
```env
REACT_APP_API_URL=/api
```

---

## **10. Install Backend Dependencies and Start Backend**

```bash
cd /opt/ER_Linux/server
npm install
pm2 start index.js --name er-backend
pm2 save
```
- **Check logs:** `pm2 logs er-backend`

---

## **11. Install Frontend Dependencies and Build**

```bash
cd /opt/ER_Linux/frontend
npm install
npm run build
```
- The build output will be in `/opt/ER_Linux/frontend/build`

---

## **12. Configure Nginx as a Reverse Proxy**

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

## **13. (Optional) Set Up PM2 Startup Script**

```bash
pm2 startup
# Follow the instructions printed to run the command as root
pm2 save
```

---

## **14. Access Your App**

- **App:**  
  Open a browser on your internal network:  
  `http://10.91.41.16`

- **MongoDB Compass:**  
  - Connection string:  
    ```
    mongodb://restrict_user:random@10.91.41.16:27017/restrict_app
    ```
  - Use this in MongoDB Compass from your workstation (must be on the same internal network).

---

## **15. (Optional) Secure MongoDB**

- If you only want Compass access from certain IPs, restrict port 27017 in your firewall:
  ```bash
  sudo ufw allow from <your-workstation-ip> to any port 27017
  sudo ufw deny 27017
  ```

---

## **16. (Optional) Enable HTTPS**

- For internal use, you can use a self-signed certificate or your organization’s internal CA.
- Update Nginx config to listen on 443 and use SSL.

---

# **You’re Done!**

- App is live at: `http://10.91.41.16`
- MongoDB Compass can connect at: `mongodb://restrict_user:random@10.91.41.16:27017/restrict_app`
- Backend runs on PM2, frontend is served by Nginx, and all traffic is internal.

---
Shukriya 😊
