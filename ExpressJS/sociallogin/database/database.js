const mongoose = require('mongoose');

const connectWithDB = async () => {
    try {
        const connectionInstance = await mongoose.connect("mongodb://127.0.0.1/sociallogin")
        
        console.log(`CONNECTED WITH MONGOdb!!
            host:${connectionInstance.connection.host} 
            port:${connectionInstance.connection.port} 
            name:${connectionInstance.connection.name}
        `);

    }
    catch (e) {
        console.log(`FAILED TO CONNECT WITH MONGODB: ${e}`)
        process.exit(1);
    }
}

module.exports = {connectWithDB}