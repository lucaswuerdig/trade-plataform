import express, { Router, Request, Response } from "express";
import crypto from "crypto";
import { db } from "./db";
import { validateCpf } from "./validateCpf";

const router = Router();

// const accounts: any = [];

function isValidName (name: string) {
    return name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isValidEmail (email: string) {
    return email.match(/^(.+)\@(.+)$/);
}

function isValidPassword (password: string) {
    if (password.length < 8) return false;
    if (!password.match(/\d+/)) return false;
    if (!password.match(/[a-z]+/)) return false;
    if (!password.match(/[A-Z]+/)) return false;
    return true;
}

async function checkEmailExists (email: string) {
    const account = await db.query("select * from ccca.account where email = $1", [email]);
    return account.length > 0;
}

router.post("/", async (req: Request, res: Response) => {
    const input = req.body;
    if (!isValidName(input.name)) {
        return res.status(422).json({
            error: "Invalid name"
        });
    }
    if (!isValidEmail(input.email)) {
        return res.status(422).json({
            error: "Invalid email"
        });
    }
    //TODO:: Stack de testes verar o banco antes dos testes ou usar mocks
    // if (await checkEmailExists(input.email)) {
    //     return res.status(422).json({
    //         error: "Email already exists"
    //     });
    // }

    if (!validateCpf(input.document)) {
        return res.status(422).json({
            error: "Invalid document"
        });
    }
    if (!isValidPassword(input.password)) {
        return res.status(422).json({
            error: "Invalid password"
        });
    }
    
    const accountId = crypto.randomUUID();
    const account = {
        accountId,
        name: input.name,
        email: input.email,
        document: input.document,
        password: input.password
    }
    // accounts.push(account);
    await db.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
    
    res.json({
        accountId
    });
});

export default router;