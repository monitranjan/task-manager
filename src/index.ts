import express from "express";
import UserRouter from "./router/userRouter";
import TaskRouter from "./router/taskRouter";
import bcrypt from "bcryptjs"
require("./db/mongoose");


const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(UserRouter);
app.use(TaskRouter);

app.get('/', (req, res) => {
    res.send("hello");
})

app.listen(port, () => {
    console.log("server started on " + port);
})