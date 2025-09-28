import express from "express";
import cors from "cors";
import calSystemRouter from "./routes/calSystem.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1/calculate', calSystemRouter);

export default app;