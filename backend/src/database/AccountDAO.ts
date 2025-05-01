import pgPromise from "pg-promise";

export default interface AccountDAO {
    checkEmailExists(email: string): Promise<boolean>;
    saveAccount(account: any): Promise<void>;
    getAccountById(accountId: string): Promise<any>;
    saveAccountAsset(accountId: string, assetId: string, quantity: number): Promise<void>;
    getAccountAssets(accountId: string): Promise<any[]>;
    getAccountAsset(accountId: string, assetId: string): Promise<any>;
    updateAccountAsset(quantity: string, accountId: string, assetId: string): Promise<void>;
}

export class AccountDAODatabase implements AccountDAO {
    
    async checkEmailExists(email: string): Promise<boolean> {
        const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");
        const account = await db.query("select * from ccca.account where email = $1", [email]);
        await db.$pool.end();
        return account.length > 0;
    }
    async saveAccount(account: any): Promise<void> {
        const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");
        await db.query("insert into ccca.account (account_id, name, email, document, password) values ($1, $2, $3, $4, $5)", [account.accountId, account.name, account.email, account.document, account.password]);
        await db.$pool.end();
    }

    async getAccountById(accountId: string): Promise<any> {
        const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");
        const [account] = await db.query("select * from ccca.account where account_id = $1", [accountId]);
        await db.$pool.end();
        return account;
    }

    async saveAccountAsset(accountId: string, assetId: string, quantity: number): Promise<void> {
        const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");
        await db.query("insert into ccca.account_asset (account_id, asset_id, quantity) values ($1, $2, $3)", [accountId, assetId, quantity]);
        await db.$pool.end();
    }

    async getAccountAssets(accountId: string): Promise<any[]> {
        const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");
        const assets = await db.query("select * from ccca.account_asset where account_id = $1", [accountId]);
        await db.$pool.end();
        return assets;
    }

    async getAccountAsset(accountId: string, assetId: string): Promise<any> {
        const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");
        const asset = await db.oneOrNone("select * from ccca.account_asset where account_id = $1 and asset_id = $2", [accountId, assetId]);
        await db.$pool.end();
        return asset;
    }

    async updateAccountAsset(quantity: string, accountId: string, assetId: string): Promise<void> {
        const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");
        await db.none("update ccca.account_asset set quantity = $1 where account_id = $2 and asset_id = $3", [quantity, accountId, assetId]);
        await db.$pool.end();
    }

}