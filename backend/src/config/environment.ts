import dotenv from "dotenv";
dotenv.config();

export const environment = {
    databaseURL: process.env.DATABASE_URL,
}