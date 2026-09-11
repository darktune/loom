import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.post('/generate-concept', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Placeholder endpoint for Backend Engineers to hook up Google Gemini (Primary) & Groq Llama 3 (Fallback)
  res.status(200).json({
    success: true,
    provider: process.env.PRIMARY_AI_API_KEY ? 'Google Gemini 1.5 Pro' : 'Fallback Engine',
    prompt,
    concept: {
      title: 'Custom Imperial Bespoke Concept',
      description: `Synthesized bespoke native garment for: "${prompt}"`,
      garmentType: 'Senator',
      fabric: 'Aso-Oke Burgundy',
      accentColor: '#C9A96E',
      estimatedCraftTime: '7 Days'
    }
  });
});

export default router;
