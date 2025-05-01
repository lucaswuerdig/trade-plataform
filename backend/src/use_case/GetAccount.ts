import AccountDAO from "../database/AccountDAO";

export class GetAccount {
    constructor(readonly accountDAO: AccountDAO) {

    }

    isUUID(str: any) {
        const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return regex.test(str);
    }

    async execute(accountId: string): Promise<any> {
        if (!this.isUUID(accountId)) throw new Error("Invalid account ID");
        const accountData = await this.accountDAO.getAccountById(accountId);
        if (!accountData) throw new Error("Account not found");
        const accountAssetsData = await this.accountDAO.getAccountAssets(accountId);
        accountData.assets = [];
        for (const accountAssetData of accountAssetsData) {
            accountData.assets.push({ assetId: accountAssetData.asset_id, quantity: parseFloat(accountAssetData.quantity) });
        }

        return accountData;
    }
}

