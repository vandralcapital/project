require('dotenv').config();

module.exports = {
    // LDAP Configuration
    ldap: {
        url: process.env.LDAP_URL || 'ldap://10.91.50.11:389',
        timeout: 10000
    },
    
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '1h'
    },
    
    // MongoDB Configuration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://restrict_user:random@localhost:27017/restrict_app'
    }
}; 