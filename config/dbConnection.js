const mongoose = require("mongoose");

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.CONNECTION_URL, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
          });
        console.log(
            "Database Connected: ", 
            connect.connection.host,
            connect.connection.name
        );
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

module.exports = connectDb;