"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, Sparkles, TrendingUp, Target, AlertCircle, CheckCircle } from 'lucide-react';

export default function AITipsComponent({ userProfile }) {
  const [loading, setLoading] = useState(false);
  const [tips, setTips] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    monthly_income: userProfile?.monthly_income || '',
    monthly_expenses: userProfile?.monthly_expenses || '',
    savings_goal: userProfile?.savings_goal || '',
    current_savings: userProfile?.current_savings || '',
    debt_amount: userProfile?.debt_amount || '',
    age: userProfile?.age || '',
    financial_goals: userProfile?.financial_goals || [],
    risk_tolerance: userProfile?.risk_tolerance || 'medium'
  });
  const [tipType, setTipType] = useState('general');
  const [context, setContext] = useState('');

  const tipTypes = [
    { value: 'general', label: 'General Advice' },
    { value: 'budgeting', label: 'Budgeting' },
    { value: 'saving', label: 'Saving Money' },
    { value: 'investing', label: 'Investment' },
    { value: 'debt', label: 'Debt Management' },
    { value: 'emergency', label: 'Emergency Fund' }
  ];

  const riskToleranceOptions = [
    { value: 'low', label: 'Conservative' },
    { value: 'medium', label: 'Moderate' },
    { value: 'high', label: 'Aggressive' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateTips = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai-tips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: formData,
          tip_type: tipType,
          context: context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate tips');
      }

      const data = await response.json();
      setTips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <TrendingUp className="w-4 h-4" />;
      case 'low': return <CheckCircle className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Tips Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI-Powered Financial Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Financial Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Income</label>
              <Input
                type="number"
                placeholder="Enter monthly income"
                value={formData.monthly_income}
                onChange={(e) => handleInputChange('monthly_income', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Monthly Expenses</label>
              <Input
                type="number"
                placeholder="Enter monthly expenses"
                value={formData.monthly_expenses}
                onChange={(e) => handleInputChange('monthly_expenses', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Savings Goal</label>
              <Input
                type="number"
                placeholder="Monthly savings goal"
                value={formData.savings_goal}
                onChange={(e) => handleInputChange('savings_goal', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Current Savings</label>
              <Input
                type="number"
                placeholder="Current savings amount"
                value={formData.current_savings}
                onChange={(e) => handleInputChange('current_savings', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Debt Amount</label>
              <Input
                type="number"
                placeholder="Total debt amount"
                value={formData.debt_amount}
                onChange={(e) => handleInputChange('debt_amount', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age</label>
              <Input
                type="number"
                placeholder="Your age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tip Type</label>
              <Select value={tipType} onValueChange={setTipType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tip type" />
                </SelectTrigger>
                <SelectContent>
                  {tipTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Risk Tolerance</label>
              <Select value={formData.risk_tolerance} onValueChange={(value) => handleInputChange('risk_tolerance', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select risk tolerance" />
                </SelectTrigger>
                <SelectContent>
                  {riskToleranceOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Context Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Additional Context (Optional)</label>
            <Input
              placeholder="Any specific financial concerns or questions?"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <Button 
            onClick={generateTips} 
            disabled={loading || !formData.monthly_income || !formData.monthly_expenses}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating AI Tips...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Personalized Tips
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Tips Results */}
      {tips && (
        <div className="space-y-4">
          {/* Tips Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Personalized Financial Tips</span>
                <Badge className={getPriorityColor(tips.priority_level)}>
                  {getPriorityIcon(tips.priority_level)}
                  {tips.priority_level} Priority
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 font-medium">{tips.personalized_message}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>Expected Impact: {tips.estimated_impact}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips List */}
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tips.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          {tips.action_items && tips.action_items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Action Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tips.action_items.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 p-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}