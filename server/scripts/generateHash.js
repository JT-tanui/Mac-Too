const bcrypt = require('bcrypt');

async function generateHash() {
    const password = 'MacToo@2024'; // Super admin password
    const hash = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hash);
}

generateHash();