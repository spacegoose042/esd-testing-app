const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = 'YourPassword123!';  // Replace with your desired password
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        console.log('Generated hash:', hash);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateHash();