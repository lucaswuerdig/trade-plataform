import express, { Router,Request, Response } from "express";
import { db } from "./db";

const router = Router();

router.get("/:accountId", async (req: Request, res: Response) => {
    const accountId = req.params.accountId;
    // const account = accounts.find((account: any) => account.accountId === accountId);
    const [accountData] = await db.query("select * from ccca.account where account_id = $1", [accountId]);
    
    res.json(accountData);
});

export default router;