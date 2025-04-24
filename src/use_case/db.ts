import pgPromise from "pg-promise";

const pgp = pgPromise();
const db = pgPromise()("postgres://postgres:123456@localhost:5432/app");

export { db, pgp };