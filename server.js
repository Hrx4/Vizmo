const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const blogRoutes = require('./Routes/blogRoutes');
const userRoutes = require('./Routes/userRoutes')
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

dotenv.config();


app.get("/", (req, res) => {
  res.send("Hello, World! This is my Express server!");
});
app.use("/blog" , blogRoutes );
app.use("/user" , userRoutes );


app.listen(8080, () => {
  console.log(`Server is running on Port 8080`);
});