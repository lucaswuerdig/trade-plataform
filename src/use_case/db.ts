import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");

export { db };