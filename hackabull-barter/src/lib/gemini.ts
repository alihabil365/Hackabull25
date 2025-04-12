import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/**
 * Estimates the value of an item using Gemini AI
 * @param title - Item title
 * @param description - Item description
 * @param imageUrl - Optional URL to item image
 * @returns Estimated value in USD
 */
export async function estimateItemValue(
  title: string,
  description: string,
  imageUrl?: string
): Promise<number> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Create prompt for valuation
    const prompt = `
      I need to estimate the market value in USD for the following item:
      
      Title: ${title}
      Description: ${description}
      ${imageUrl ? `Image: ${imageUrl}` : ''}
      
      Please analyze this information and provide a single numerical value estimation (in USD) of what this item might be worth in the current market.
      Do not include any explanations or currency symbols, just return a number.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract the numeric value
    const value = parseFloat(text.replace(/[^0-9.]/g, ''));
    
    // Return a reasonable default if parsing fails
    return isNaN(value) ? 50.0 : value;
  } catch (error) {
    console.error('Error estimating item value:', error);
    return 50.0; // Default fallback value
  }
} 