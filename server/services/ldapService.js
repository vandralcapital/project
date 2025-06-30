const ldap = require('ldapjs');
const config = require('../config/config');

// LDAP Configuration - Hardcoded values
const LDAP_URL = 'ldap://10.91.50.11:389';  // Replace with your actual LDAP server
// ldap://religare.in -> Try Using This As LDAP URL
const LDAP_TIMEOUT = 10000; // 10 seconds timeout - Lower It 

async function testLDAPConnection() {
    return new Promise((resolve, reject) => {
        console.log('Testing LDAP connection to:', LDAP_URL);
        
        const client = ldap.createClient({
            url: LDAP_URL,
            timeout: LDAP_TIMEOUT,
            connectTimeout: LDAP_TIMEOUT,
            reconnect: false,
            tlsOptions: {
                rejectUnauthorized: false
            }
        });

        client.on('error', (err) => {
            console.error('LDAP connection test error:', {
                code: err.code,
                name: err.name,
                message: err.message,
                url: LDAP_URL
            });
            client.unbind();
            reject(err);
        });

        const timeout = setTimeout(() => {
            console.error('LDAP connection test timeout for URL:', LDAP_URL);
            client.unbind();
            reject(new Error(`LDAP connection test timeout for ${LDAP_URL}. Please check if the LDAP server is reachable and the IP address is correct.`));
        }, LDAP_TIMEOUT);

        // Try anonymous bind first
        client.bind('', '', (err) => {
            clearTimeout(timeout);
            if (err) {
                console.error('LDAP connection test bind error:', {
                    code: err.code,
                    name: err.name,
                    message: err.message,
                    url: LDAP_URL
                });
                client.unbind();
                reject(err);
                return;
            }
            console.log('LDAP connection test successful for URL:', LDAP_URL);
            client.unbind();
            resolve(true);
        });
    });
}

async function verifyLDAPCredentials(email, password) {
    try {
        // First test the connection
        await testLDAPConnection();
        
        return new Promise((resolve, reject) => {
            console.log('Attempting LDAP connection to:', LDAP_URL);
            
            const client = ldap.createClient({
                url: LDAP_URL,
                timeout: LDAP_TIMEOUT,
                connectTimeout: LDAP_TIMEOUT,
                reconnect: false,
                tlsOptions: {
                    rejectUnauthorized: false
                }
            });

            client.on('error', (err) => {
                console.error('LDAP client error:', {
                    code: err.code,
                    name: err.name,
                    message: err.message,
                    url: LDAP_URL,
                    stack: err.stack
                });
                client.unbind();
                reject(err);
            });

            const timeout = setTimeout(() => {
                console.error('LDAP connection timeout for URL:', LDAP_URL);
                client.unbind();
                reject(new Error(`LDAP connection timeout for ${LDAP_URL}. Please check if the LDAP server is reachable and the IP address is correct.`));
            }, LDAP_TIMEOUT);

            console.log('Attempting LDAP bind with:', email);
            client.bind(email, password, (err) => {
                clearTimeout(timeout);
                
                if (err) {
                    console.error('LDAP bind error details:', {
                        code: err.code,
                        name: err.name,
                        message: err.message,
                        url: LDAP_URL,
                        stack: err.stack
                    });
                    client.unbind();
                    reject(err);
                    return;
                }

                console.log('LDAP bind successful for:', email);
                client.unbind();
                resolve(true);
            });
        });
    } catch (error) {
        console.error('LDAP verification error:', {
            code: error.code,
            name: error.name,
            message: error.message,
            url: LDAP_URL,
            stack: error.stack
        });
        throw error;
    }
}

module.exports = {
    verifyLDAPCredentials,
    testLDAPConnection
};