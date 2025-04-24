import express from "express";
import signup from "./use_case/signup";
import account from "./use_case/account";
import deposit from "./use_case/deposit";

const app = express();
app.use(express.json());

app.use("/signup", signup);
app.use("/deposit", deposit);
app.use("/accounts", account);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});