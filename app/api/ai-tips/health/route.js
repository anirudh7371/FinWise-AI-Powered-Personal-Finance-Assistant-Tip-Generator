export async function GET() {
  try {
    const response = await fetch(`${AI_SERVICE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('AI service health check failed');
    }

    const healthData = await response.json();
    return NextResponse.json(healthData);

  } catch (error) {
    console.error('AI service health check error:', error);
    return NextResponse.json(
      { error: 'AI service unavailable' },
      { status: 503 }
    );
  }
}