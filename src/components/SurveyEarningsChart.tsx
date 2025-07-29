import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, TrendingUp } from 'lucide-react';
import { useSurveyData } from '@/hooks/useSurveyData';
import { supabase } from '@/lib/supabaseClient';

interface SurveyEarningsChartProps {
  className?: string;
}

interface ChartData {
  date: string;
  surveys: number;
  earnings: number;
}

interface SurveyRecord {
  id: string;
  completedAt: string;
  amount: number;
  surveyName: string;
}

const SurveyEarningsChart: React.FC<SurveyEarningsChartProps> = ({ className }) => {
  const { surveyData, getCurrentPlan } = useSurveyData();
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRealSurveyData();
  }, [timeRange]);

  const loadRealSurveyData = async () => {
    try {
      setLoading(true);
      
      // Get user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Load survey completion data from localStorage
      const storageKey = `surveyHistory_${user.id}`;
      const storedData = localStorage.getItem(storageKey);
      
      let surveyRecords: SurveyRecord[] = [];
      if (storedData) {
        surveyRecords = JSON.parse(storedData);
      }

      // Generate date range
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const today = new Date();
      const data: ChartData[] = [];

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Filter surveys for this date
        const daySurveys = surveyRecords.filter(record => 
          record.completedAt.startsWith(dateStr)
        );
        
        const surveysCount = daySurveys.length;
        const earnings = daySurveys.reduce((sum, record) => sum + record.amount, 0);
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          surveys: surveysCount,
          earnings: earnings
        });
      }

      setChartData(data);
    } catch (error) {
      console.error('Error loading survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalSurveys = chartData.reduce((sum, day) => sum + day.surveys, 0);
  const totalEarnings = chartData.reduce((sum, day) => sum + day.earnings, 0);
  const avgDailyEarnings = totalEarnings / (chartData.length || 1);

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Survey Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading survey data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Survey Performance
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === '7d' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === '30d' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === '90d' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              90 Days
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{totalSurveys}</p>
            <p className="text-sm text-muted-foreground">Total Surveys</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">KSh {totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">Total Earnings</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">KSh {Math.round(avgDailyEarnings)}</p>
            <p className="text-sm text-muted-foreground">Avg Daily</p>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="surveys" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Surveys Completed"
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                name="Daily Earnings (KSh)"
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurveyEarningsChart;
