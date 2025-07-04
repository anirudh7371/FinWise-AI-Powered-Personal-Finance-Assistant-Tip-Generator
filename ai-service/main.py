from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
import os
from dotenv import load_dotenv
import uvicorn
import json
import re

# LangChain imports
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# Load environment variables
load_dotenv()

app = FastAPI(title="FinWise AI Service", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-finwise-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini model
def get_gemini_model():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")

    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=api_key,
        temperature=0.7,
        max_output_tokens=1024,
    )

# Data Models
class FinancialProfile(BaseModel):
    monthly_income: float
    monthly_expenses: float
    savings_goal: float
    current_savings: float = 0
    debt_amount: float = 0
    age: int
    financial_goals: List[str] = []
    spending_categories: Dict[str, float] = {}
    risk_tolerance: str = "medium"

class FinanceTipRequest(BaseModel):
    profile: FinancialProfile
    tip_type: str = "general"
    context: Optional[str] = None

class FinanceTipResponse(BaseModel):
    tips: List[str]
    priority_level: str
    estimated_impact: str
    action_items: List[str]
    personalized_message: str

# Finance Rules
class FinanceRules:
    @staticmethod
    def calculate_savings_rate(income, expenses):
        return ((income - expenses) / income) * 100 if income > 0 else 0

    @staticmethod
    def get_emergency_fund_status(savings, expenses):
        if expenses <= 0:
            return "unknown"
        months = savings / expenses
        if months >= 6:
            return "excellent"
        elif months >= 3:
            return "good"
        elif months >= 1:
            return "fair"
        return "needs_improvement"

    @staticmethod
    def get_debt_to_income_ratio(debt, income):
        return (debt / (income * 12)) * 100 if income > 0 else 0

    @staticmethod
    def assess_financial_health(profile: FinancialProfile):
        savings_rate = FinanceRules.calculate_savings_rate(profile.monthly_income, profile.monthly_expenses)
        emergency_status = FinanceRules.get_emergency_fund_status(profile.current_savings, profile.monthly_expenses)
        debt_ratio = FinanceRules.get_debt_to_income_ratio(profile.debt_amount, profile.monthly_income)
        overall = "good" if savings_rate >= 20 and debt_ratio < 30 else "needs_improvement"
        return {
            "savings_rate": f"{savings_rate:.1f}%",
            "emergency_fund": emergency_status,
            "debt_ratio": f"{debt_ratio:.1f}%",
            "overall_health": overall
        }

# AI Service
class FinanceAIService:
    def __init__(self):
        self.llm = get_gemini_model()
        self.rules = FinanceRules()

    def create_prompt_template(self, tip_type: str) -> PromptTemplate:
        return PromptTemplate(
            input_variables=[
                "monthly_income", "monthly_expenses", "savings_goal", "current_savings",
                "debt_amount", "age", "financial_goals", "risk_tolerance",
                "health_assessment", "tip_type", "context"
            ],
            template="""
You are a professional financial advisor AI. Based on the profile and health assessment below, generate a pure JSON response with:

- tips: A list of 3-5 concise actionable financial suggestions. Each tip should be tailored using the actual numbers (e.g. income, debt, savings).
- priority_level: "High", "Medium", or "Low", based on financial urgency.
- estimated_impact: Short string explaining potential financial improvement.
- action_items: 3-5 detailed steps that apply those tips directly to the user's data. These should not be generic — use the user's income, debt, expenses, etc. All amounts must be in Indian Rupees (₹), and use the ₹ symbol in responses. Do not use dollar signs.
- personalized_message: A short motivating sentence.

⚠️ The response MUST be strictly valid JSON. Do NOT use markdown formatting or ```json. No comments. No headings.

User profile:
{{
  "monthly_income": {monthly_income},
  "monthly_expenses": {monthly_expenses},
  "savings_goal": {savings_goal},
  "current_savings": {current_savings},
  "debt_amount": {debt_amount},
  "age": {age},
  "financial_goals": "{financial_goals}",
  "risk_tolerance": "{risk_tolerance}",
  "health_assessment": "{health_assessment}",
  "tip_type": "{tip_type}",
  "context": "{context}"
}}
"""
        )

    async def generate_tips(self, request: FinanceTipRequest) -> FinanceTipResponse:
        try:
            profile = request.profile
            assessment = self.rules.assess_financial_health(profile)
            prompt = self.create_prompt_template(request.tip_type)

            variables = {
                "monthly_income": profile.monthly_income,
                "monthly_expenses": profile.monthly_expenses,
                "savings_goal": profile.savings_goal,
                "current_savings": profile.current_savings,
                "debt_amount": profile.debt_amount,
                "age": profile.age,
                "financial_goals": ", ".join(profile.financial_goals),
                "risk_tolerance": profile.risk_tolerance,
                "health_assessment": str(assessment),
                "tip_type": request.tip_type,
                "context": request.context or "General financial advice"
            }

            chain = prompt | self.llm | StrOutputParser()
            result = await chain.ainvoke(variables)

            # Clean potential markdown formatting
            cleaned = re.sub(r"^```(?:json)?\n|```$", "", result.strip(), flags=re.IGNORECASE)

            return FinanceTipResponse(**json.loads(cleaned))

        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error generating tips: {str(e)}")

# Initialize AI service
ai_service = FinanceAIService()

@app.get("/")
def root():
    return {"message": "FinWise AI Service is running"}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "FinWise AI"}

@app.post("/generate-tips", response_model=FinanceTipResponse)
async def generate_tips(request: FinanceTipRequest):
    return await ai_service.generate_tips(request)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)