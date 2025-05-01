
import crypto from "crypto";
import { validateCpf } from "./validateCpf";
import AccountDAO from "../database/AccountDAO";

export class Signup  {

    constructor(readonly accountDAO: AccountDAO) {

    }

    isValidName (name: string) {
        return name.match(/[a-zA-Z] [a-zA-Z]+/);
    }
    
    isValidEmail (email: string) {
        return email.match(/^(.+)\@(.+)$/);
    }
    
    isValidPassword (password: string) {
        if (password.length < 8) return false;
        if (!password.match(/\d+/)) return false;
        if (!password.match(/[a-z]+/)) return false;
        if (!password.match(/[A-Z]+/)) return false;
        return true;
    }

    async execute(input: any): Promise<any> {
        if (!this.isValidName(input.name)) throw new Error("Invalid name");
        if (!this.isValidEmail(input.email)) throw new Error("Invalid email");
        if (await this.accountDAO.checkEmailExists(input.email)) throw new Error("Email already exists");
        if (!validateCpf(input.document)) throw new Error("Invalid document");
        if (!this.isValidPassword(input.password)) throw new Error("Invalid password");
        
        const accountId = crypto.randomUUID();
        const account = {
            accountId,
            name: input.name,
            email: input.email,
            document: input.document,
            password: input.password
        }
        await this.accountDAO.saveAccount(account);
        return {
            accountId
        };
    }
}