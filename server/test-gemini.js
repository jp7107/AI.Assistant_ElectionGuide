import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyC0xI0sfHL64E9vii0q0XyHvPnhz2RugI4');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function run() {
  try {
    const result = await model.generateContent('Hello');
    console.log(result.response.text());
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
