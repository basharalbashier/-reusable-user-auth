const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const user_router = require("./routes/user_router");
const invoiceRouter = require("./routes/invoiceRouter");
const mongoLocalConnectionString = "mongodb://localhost:27017/React_admin";
const message = "Your Server is running";
const port = 5555;

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use("/user", user_router);
app.use("/invoice", invoiceRouter);
mongoose
  .connect(mongoLocalConnectionString)
  .then(() => {
    app.listen(port, () => {
      console.log(message + "  " + port.toString());
    });
  })
  .catch((e) => console.log(e));
