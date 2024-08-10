const express=require("express")
const errorHandler = require("./middleware/error");
const connectDB = require("./config/dbConnection");
const dotenv = require("dotenv")


dotenv.config()

const app=express()

const port=process.env.PORT||4000

connectDB()

// Middleware
app.use(express.json());

//routes
app.use('/api/users', require("./routes/userRoutes"));

// Error Handler Middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});