import { NextResponse } from 'next/server';
import { checkUser } from '@/lib/checkUser';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export async function POST(request) {
  try {
    // Check if user is authenticated
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // Validate required fields
    const { profile, tip_type = 'general', context } = body;
    
    if (!profile || !profile.monthly_income || !profile.monthly_expenses) {
      return NextResponse.json(
        { error: 'Missing required profile information' },
        { status: 400 }
      );
    }

    // Prepare request for AI service
    const aiRequest = {
      profile: {
        monthly_income: parseFloat(profile.monthly_income),
        monthly_expenses: parseFloat(profile.monthly_expenses),
        savings_goal: parseFloat(profile.savings_goal || 0),
        current_savings: parseFloat(profile.current_savings || 0),
        debt_amount: parseFloat(profile.debt_amount || 0),
        age: parseInt(profile.age || 25),
        financial_goals: profile.financial_goals || [],
        spending_categories: profile.spending_categories || {},
        risk_tolerance: profile.risk_tolerance || 'medium'
      },
      tip_type,
      context
    };

    // Call AI service
    const response = await fetch(`${AI_SERVICE_URL}/generate-tips`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aiRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'AI service error');
    }

    const aiResponse = await response.json();

    // Log the AI interaction (optional)
    console.log(`AI tips generated for user ${user.id}:`, {
      tip_type,
      tips_count: aiResponse.tips.length,
      priority: aiResponse.priority_level
    });

    return NextResponse.json(aiResponse);

  } catch (error) {
    console.error('AI tips generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate AI tips' },
      { status: 500 }
    );
  }
}
