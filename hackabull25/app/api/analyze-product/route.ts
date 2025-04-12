import { NextResponse } from 'next/server';
import { analyzeProductImage } from '../../../utils/gemini';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeProductImage(image);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Error in analyze-product route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze product' },
      { status: 500 }
    );
  }
} 