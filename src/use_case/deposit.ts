import express, { Request, Response, Router } from "express";
import { db } from "./db";

const router = Router();

function getAccount(accountId: string) {
    return db.query("select * from ccca.account where account_id = $1", [accountId]);
}

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;
    
    const account = await getAccount(input.account_id);
    
    if (account.length == 0) {
        return res.status(422).json({
            error: "Account not found",
        });
    }

    if (input.asset_id !== "BTC" && input.asset_id !== "USD") {
        return res.status(422).json({
            error: "Invalid asset",
        });
    }
    
    if (input.quantity <= 0) {
        return res.status(422).json({
            error: "Invalid quantity",
        });
    }

    await db.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)",[input.account_id, input.asset_id, input.quantity]);

    return res.status(201).json({
        message: "Deposit successful",
    });
});

export default router;