
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  History, 
  TrendingUp, 
  TrendingDown,
  PieChart as ChartIcon,
  Filter
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockTrades = [
  { id: '1', symbol: 'RELIANCE', entry: 1284, exit: 1310, pnl: 2600, result: 'WIN', date: '2025-08-25', rr: 2.1 },
  { id: '2', symbol: 'HDFCBANK', entry: 1650, exit: 1640, pnl: -1000, result: 'LOSS', date: '2025-08-24', rr: 1.5 },
  { id: '3', symbol: 'TCS', entry: 4200, exit: 4350, pnl: 15000, result: 'WIN', date: '2025-08-23', rr: 3.2 },
];

export default function TradeJournalPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-2">TRADE JOURNAL</h1>
          <p className="text-zinc-500">Record your intraday executions and analyze strategy leakage.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-full">
          <PlusCircle className="mr-2 h-4 w-4" /> LOG NEW TRADE
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="WIN RATE" value="66.7%" icon={<ChartIcon className="text-emerald-500" />} />
        <StatCard label="TOTAL P&L" value="₹16,600" valueColor="text-emerald-500" icon={<TrendingUp className="text-emerald-500" />} />
        <StatCard label="AVG R:R" value="2.2" icon={<History className="text-amber-500" />} />
        <StatCard label="MAX LOSS" value="₹1,000" icon={<TrendingDown className="text-rose-500" />} />
      </div>

      <Card className="bg-[#121212] border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 pb-4">
          <CardTitle className="text-lg">Recent Executions</CardTitle>
          <Button variant="ghost" size="sm" className="text-zinc-500">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-900/50 text-zinc-500 text-[10px] font-black uppercase">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Symbol</th>
                  <th className="px-6 py-4">Entry</th>
                  <th className="px-6 py-4">Exit</th>
                  <th className="px-6 py-4">P&L</th>
                  <th className="px-6 py-4">R:R</th>
                  <th className="px-6 py-4 text-right">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {mockTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-zinc-400">{trade.date}</td>
                    <td className="px-6 py-4 font-bold">{trade.symbol}</td>
                    <td className="px-6 py-4 font-mono text-sm">₹{trade.entry}</td>
                    <td className="px-6 py-4 font-mono text-sm text-zinc-400">₹{trade.exit}</td>
                    <td className={cn(
                      "px-6 py-4 font-bold font-mono",
                      trade.pnl > 0 ? "text-emerald-500" : "text-rose-500"
                    )}>
                      {trade.pnl > 0 ? '+' : ''}₹{trade.pnl.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-zinc-500">1:{trade.rr}</td>
                    <td className="px-6 py-4 text-right">
                      <Badge variant={trade.result === 'WIN' ? 'default' : 'destructive'} className="font-black text-[10px]">
                        {trade.result}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, icon, valueColor = "text-white" }: any) {
  return (
    <Card className="bg-[#121212] border-zinc-800">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
          <div className="p-2 bg-zinc-900 rounded-lg">{icon}</div>
        </div>
        <p className={cn("text-3xl font-black", valueColor)}>{value}</p>
      </CardContent>
    </Card>
  );
}
