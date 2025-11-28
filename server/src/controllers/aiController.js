import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const summarize = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Summarize the following text concisely in 2-3 sentences:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    res.json({ summary });
  } catch (error) {
    console.error('AI summarize error:', error);
    res.status(500).json({ error: 'Failed to summarize text' });
  }
};

export const explain = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Explain the following in simple, easy-to-understand terms suitable for a student:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const explanation = response.text();

    res.json({ explanation });
  } catch (error) {
    console.error('AI explain error:', error);
    res.status(500).json({ error: 'Failed to explain text' });
  }
};

export const improve = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Rewrite and improve the following text to make it clearer, more professional, and well-structured:\n\n${text}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const improved = response.text();

    res.json({ improved });
  } catch (error) {
    console.error('AI improve error:', error);
    res.status(500).json({ error: 'Failed to improve text' });
  }
};
