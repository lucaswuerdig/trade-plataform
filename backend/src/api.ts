import express, { Request, Response } from "express";
let morgan = require("morgan");
import cors from "cors";
import { AccountDAODatabase } from "./database/AccountDAO";
import { Signup } from "./use_case/Signup";
import { Deposit } from "./use_case/Deposit";
import { GetAccount } from "./use_case/GetAccount";
import { Withdraw } from "./use_case/Withdraw";
import { OrderDAODatabase } from "./database/OrderDAO";
import { PlaceOrder } from "./use_case/PlaceOrder";
import { GetOrder } from "./use_case/GetOrder";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

const accountDAO = new AccountDAODatabase();
const orderDAO = new OrderDAODatabase();
const signup = new Signup(accountDAO);
const getAccount = new GetAccount(accountDAO);
const deposit = new Deposit(accountDAO);
const withdraw = new Withdraw(accountDAO);
const placeOrder = new PlaceOrder(orderDAO);
const getOrder = new GetOrder(orderDAO);

app.post("/signup", async (req: Request, res: Response) => {
    try {
        const input = req.body;
        const output = await signup.execute(input);
        res.status(200).json(output);
    } catch (error: any) {
        res.status(422).json({
            error: error.message
        })
    }
});
app.post("/deposit", async (req: Request, res: Response) => {
    try {
        const input = req.body;
        await deposit.execute(input);
        res.status(200).end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
app.get("/accounts/:accountId", async (req: Request, res: Response) => {
    try {
        const accountId = req.params.accountId;
        const output = await getAccount.execute(accountId);
        res.status(200).json(output);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
app.post("/withdraw", async (req: Request, res: Response) => {
    try {
        const input = req.body;
        await withdraw.execute(input);
        res.status(200).end();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/place_order", async (req: Request, res: Response) => {
    const input = req.body;
    const output = await placeOrder.execute(input);
    res.json(output);
});

app.get("/orders/:orderId", async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const output = await getOrder.execute(orderId);
    res.json(output);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
