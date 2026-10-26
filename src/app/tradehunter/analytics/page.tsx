
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3, 
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const equityData = [
  { day: 'Mon', equity: 100000 },
  { day: 'Tue', equity: 102500 },
  { day: 'Wed', equity: 101800 },
  { day: 'Thu', equity: 105600 },
  { day: 'Fri', equity: 108400 },
  { day: 'Mon', equity: 112000 },
  { day: 'Tue', equity: 110500 },
];

const winLossData = [
  { name: 'Wins', value: 42, color: '#10b981' },
  { name: 'Losses', value: 18, color: '#f43f5e' },
  { name: 'Breakeven', value: 5, color: '#f59e0b' },
];

const strategyPerformance = [
  { name: 'Breakout', roi: 12.5 },
  { name: 'RSI Reversal', roi: 8.2 },
  { name: 'VWAP Bounce', roi: 15.1 },
  { name: 'MACD Cross', roi: 5.4 },
];

export default function TradeHunterAnalytics() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2 uppercase italic">PERFORMANCE ANALYTICS</h1>
          <p className="text-zinc-500">Quantitative breakdown of your execution edge and strategy ROI.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-full border border-emerald-500/20">
          <Activity className="h-4 w-4" />
          <span className="text-xs font-black">EDGE VERIFIED: +12.4% ROI</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equity Curve */}
        <Card className="lg:col-span-2 bg-[#121212] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-black text-zinc-500 uppercase flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Equity Growth (Session Based)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData}>
                <defs>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="day" stroke="#71717a" fontSize={12} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="equity" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEquity)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Win Rate Pie */}
        <Card className="bg-[#121212] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-black text-zinc-500 uppercase">Win Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winLossData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {winLossData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black">72%</span>
              <span className="text-[10px] font-bold text-zinc-500">STRIKE</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strategy Performance */}
        <Card className="bg-[#121212] border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-black text-zinc-500 uppercase flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-500" /> ROI per Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                />
                <Bar dataKey="roi" radius={[4, 4, 0, 0]}>
                  {strategyPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.roi > 10 ? '#10b981' : '#3f3f46'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatMiniCard title="AVG DRAWDOWN" value="-1.2%" color="text-rose-500" />
          <StatMiniCard title="PROFIT FACTOR" value="2.41" color="text-emerald-500" />
          <StatMiniCard title="SHARPE RATIO" value="1.85" color="text-amber-500" />
          <StatMiniCard title="EXPECTANCY" value="₹2,450" color="text-zinc-100" />
        </div>
      </div>
    </div>
  );
}

function StatMiniCard({ title, value, color }: { title: string, value: string, color: string }) {
  return (
    <Card className="bg-[#121212] border-zinc-800">
      <CardContent className="p-6 flex flex-col justify-center h-full">
        <p className="text-[10px] font-black text-zinc-600 uppercase mb-2">{title}</p>
        <p className={cn("text-2xl font-black", color)}>{value}</p>
      </CardContent>
    </Card>
  )
}
