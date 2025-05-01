import AccountDAO from "../database/AccountDAO";

export class Deposit {
    constructor(readonly accountDAO: AccountDAO) {

    }

    async execute(input: any): Promise<void> {
        await this.accountDAO.saveAccountAsset(input.accountId, input.assetId, input.quantity);
    }
}