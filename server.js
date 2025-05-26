import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { OpenAIApi, Configuration } from 'openai';

config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

app.post('/api/beneficios', async (req, res) => {
  try {
    const { produto } = req.body;
    if (!produto) return res.status(400).json
