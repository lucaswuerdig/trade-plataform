import axios from "axios";

axios.defaults.validateStatus = () => true;

test.only("Depositar ativos em uma conta.", async () => {
    const inputSignup = {
        name: "John Doe",
        email: "john.doe@gmail.com",
        document: "97456321558",
        password: "asdQWE123"
    }
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup);
    const outputSignup = responseSignup.data;

    const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
    const outputGetAccount = responseGetAccount.data;

    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.account_id).toBeDefined();

    console.log(outputGetAccount, 'outputGetAccount');
    const depositInput = {
        account_id: outputGetAccount.account_id, 
        asset_id: "BTC", 
        quantity: 10
    }

    const responseDeposit = await axios.post("http://localhost:3000/deposit", depositInput);
    const outputDeposit = responseDeposit.data;

    expect(responseDeposit.status).toBe(201);
});