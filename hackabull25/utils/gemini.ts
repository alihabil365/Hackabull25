import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface PriceAnalysis {
  min: number;
  max: number;
  justification: string;
}

export async function analyzeProductImage(imageBase64: string): Promise<PriceAnalysis> {
  try {
    // Get the model - using Gemini 2.0 Flash for better performance
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Analyze this product image and provide ONLY a price estimate in the following exact format:

Minimum price: $X
Maximum price: $Y
Justification: Brief explanation of the price range

Please ensure the prices are in USD and are numbers only. Do not include any other information.`;

    // Extract the base64 data from the data URL format
    const base64Data = imageBase64.split(';base64,').pop() || '';
    
    if (!base64Data) {
      throw new Error('Invalid image data format');
    }

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: imageBase64.split(';')[0].split(':')[1]
      }
    };

    // Generate content
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    console.log('=== Raw Gemini API Response ===');
    console.log(text);
    console.log('==============================');

    // Extract price information using regex
    const minPriceMatch = text.match(/Minimum price:\s*\$?\s*([0-9,.]+)/i);
    const maxPriceMatch = text.match(/Maximum price:\s*\$?\s*([0-9,.]+)/i);
    const justificationMatch = text.match(/Justification:\s*(.+)(?:\n|$)/i);

    if (!minPriceMatch || !maxPriceMatch) {
      throw new Error('Failed to extract price information from response');
    }

    // Parse the prices, removing any commas
    const minPrice = parseFloat(minPriceMatch[1].replace(/,/g, ''));
    const maxPrice = parseFloat(maxPriceMatch[1].replace(/,/g, ''));
    const justification = justificationMatch ? justificationMatch[1].trim() : '';

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      throw new Error('Invalid price values extracted');
    }

    const analysis: PriceAnalysis = {
      min: minPrice,
      max: maxPrice,
      justification: justification
    };

    console.log('Parsed price analysis:', analysis);
    return analysis;
  } catch (error) {
    console.error('Error in analyzeProductImage:', error);
    throw error;
  }
} 