import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

interface ProductAnalysis {
  productType: string;
  brand: string | null;
  model: string | null;
  features: string[];
  condition: {
    rating: string;
    details: string[];
  };
  priceEstimate: {
    min: number;
    max: number;
    justification: string;
  };
}

export async function analyzeProductImage(imageBase64: string): Promise<ProductAnalysis> {
  try {
    // Get the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

    const prompt = `You are provided with an image of a product. Please analyze it and provide a structured response with the following information:

1. Product Identification:
   - Type of product
   - Brand (if visible)
   - Model (if visible)
   - Main features or specifications

2. Condition Assessment:
   - Overall condition rating (Like New, Good, Fair, Poor)
   - Detailed observations about visible condition (wear, damage, etc.)

3. Market Value Estimation:
   - Minimum price estimate in USD
   - Maximum price estimate in USD
   - Brief justification for the price range

Please provide your response in a clear, structured format that can be easily parsed.`;

    // Convert base64 to Uint8Array
    const imageData = Buffer.from(imageBase64.split(',')[1], 'base64');

    // Prepare the image part
    const imagePart = {
      inlineData: {
        data: Buffer.from(imageData).toString('base64'),
        mimeType: "image/jpeg"
      }
    };

    // Generate content
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the response into structured data
    // Note: This is a simplified parsing. You might need to adjust based on actual response format
    const analysis: ProductAnalysis = {
      productType: "",
      brand: null,
      model: null,
      features: [],
      condition: {
        rating: "",
        details: []
      },
      priceEstimate: {
        min: 0,
        max: 0,
        justification: ""
      }
    };

    // Extract information from the text response
    // You might need to adjust this parsing logic based on the actual response format
    const lines = text.split('\n');
    let currentSection = '';

    for (const line of lines) {
      if (line.includes('Type of product:')) {
        analysis.productType = line.split(':')[1].trim();
      } else if (line.includes('Brand:')) {
        analysis.brand = line.split(':')[1].trim();
      } else if (line.includes('Model:')) {
        analysis.model = line.split(':')[1].trim();
      } else if (line.includes('condition rating:')) {
        analysis.condition.rating = line.split(':')[1].trim();
      } else if (line.includes('Minimum price estimate:')) {
        analysis.priceEstimate.min = parseFloat(line.split(':')[1].trim().replace('$', ''));
      } else if (line.includes('Maximum price estimate:')) {
        analysis.priceEstimate.max = parseFloat(line.split(':')[1].trim().replace('$', ''));
      } else if (line.includes('justification:')) {
        analysis.priceEstimate.justification = line.split(':')[1].trim();
      }
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing product image:', error);
    throw error;
  }
} 