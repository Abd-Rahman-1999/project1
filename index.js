const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors')
const customerRegistrationRoute = require("./routes/customerRegistration");
const customerLoginRoute = require("./routes/customerLogin");
const AdminRegistrationRoute = require("./routes/adminRegistration");
const AdminLoginRoute = require("./routes/adminLogin");


dotenv.config();

mongoose.connect(process.env.MONGO_URL);


// middleware
app.use(express.json());
app.use(cors())

app.use("/registration", customerRegistrationRoute); // customer Registration initial Route
app.use("/login", customerLoginRoute); // customer login initial Route
app.use("/registration", AdminRegistrationRoute); // customer Registration initial Route
app.use("/login", AdminLoginRoute); // customer login initial Route

const PORT = 4000;
// app.get("/", function (request, response) {
//   response.send("🙋‍♂️, 🌏 🎊✨🤩");
// });

app.listen(PORT, () => console.log(`The server started in: ${PORT} ✨✨`));
