import AccountDAO from "../database/AccountDAO";

export class Withdraw {

    constructor(readonly accountDAO: AccountDAO) {

    }

    async execute(input: any) {
        const accountAssetsData = await this.accountDAO.getAccountAsset(input.accountId, input.assetId);
        const currentQuantity = parseFloat(accountAssetsData.quantity)
        if (!accountAssetsData || currentQuantity < input.quantity) throw new Error("Insufficient funds");
        let quantity = currentQuantity - input.quantity;
        await this.accountDAO.updateAccountAsset(quantity.toString(), input.accountId, input.assetId);
    }
}