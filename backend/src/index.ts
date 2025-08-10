import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import cors from 'cors';
import openaiPlanRoute from './routes/openaiPlan';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api",openaiPlanRoute);

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
