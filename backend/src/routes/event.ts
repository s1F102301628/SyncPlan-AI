// backend/src/routes/events.ts
import express from 'express';
import fetch from 'node-fetch';
const router = express.Router();

router.get('/api/events', async (req, res) => {
  const { lat, lng, start, end } = req.query;
  // PredictHQ example
  const resp = await fetch(`https://api.predicthq.com/v1/events/?location_around.origin=${lat},${lng}&start.gte=${start}&start.lte=${end}`, {
    headers: { Authorization: `Bearer YOUR_PREDICTHQ_TOKEN` }
  });
  const data = await resp.json();
  res.json(data.results);
});

export default router;
