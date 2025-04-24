import axios from "axios";
import crypto from "crypto";

axios.defaults.validateStatus = () => true;

test("Depositar ativos em uma conta.", async () => {
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

    const depositInput = {
        account_id: outputGetAccount.account_id, 
        asset_id: "BTC", 
        quantity: 10
    }

    const responseDeposit = await axios.post("http://localhost:3000/deposit", depositInput);
    const outputDeposit = responseDeposit.data;

    expect(responseDeposit.status).toBe(201);
});

test("Não deve depositar ativos em uma conta inválida", async () => {
    const depositInput = {
        account_id: crypto.randomUUID(), 
        asset_id: "BTC", 
        quantity: 10
    }

    const responseDeposit = await axios.post("http://localhost:3000/deposit", depositInput);
    const outputDeposit = responseDeposit.data;

    expect(responseDeposit.status).toBe(422);
    expect(outputDeposit.error).toBe("Account not found");
});

test("Não deve depositar ativos inválidos", async () => {
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

    const depositInput = {
        account_id: outputGetAccount.account_id, 
        asset_id: "SOLANA", 
        quantity: 10
    }

    const responseDeposit = await axios.post("http://localhost:3000/deposit", depositInput);
    const outputDeposit = responseDeposit.data;

    expect(responseDeposit.status).toBe(422);
    expect(outputDeposit.error).toBe("Invalid asset");
});

test("Não deve depositar ativos com quantidade inválida", async () => {
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

    const depositInput = {
        account_id: outputGetAccount.account_id, 
        asset_id: "USD", 
        quantity: -35
    }

    const responseDeposit = await axios.post("http://localhost:3000/deposit", depositInput);
    const outputDeposit = responseDeposit.data;

    expect(responseDeposit.status).toBe(422);
    expect(outputDeposit.error).toBe("Invalid quantity");
});