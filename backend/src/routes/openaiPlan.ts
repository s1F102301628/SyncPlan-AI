import { Router } from 'express';
import { getPlanFromAI } from '../services/openaiService';

const router = Router();

router.post('/plan', async (req, res) => {
  try {
    const { location, date } = req.body;
    const plan = await getPlanFromAI(location, date);
    res.json({ plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'AIプラン生成に失敗しました' });
  }
});

export default router;
