const express = require("express"); 
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorhandler");
const dotenv = require("dotenv").config();

connectDb();
const app = express();

const port = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/tweets", require("./routes/tweetRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})