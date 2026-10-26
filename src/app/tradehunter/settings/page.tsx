
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Shield, Wallet, Bell, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function TradeHunterSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Settings Saved", description: "Your risk profile has been updated." });
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2">TRADING PARAMETERS</h1>
        <p className="text-zinc-500">Configure your capital, risk thresholds, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#121212] border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
              <CardTitle className="text-lg">Risk & Capital</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">Set your trading limits to manage drawdowns.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase">Trading Capital (₹)</Label>
              <Input className="bg-zinc-900 border-zinc-800" placeholder="100000" type="number" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase">Risk Per Trade (%)</Label>
              <Input className="bg-zinc-900 border-zinc-800" placeholder="1" type="number" />
            </div>
             <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase">Max Active Trades</Label>
              <Input className="bg-zinc-900 border-zinc-800" placeholder="3" type="number" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#121212] border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Bell className="h-5 w-5 text-amber-500" />
              </div>
              <CardTitle className="text-lg">Alert Integration</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">Connect to Telegram or Browser alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase">Telegram Bot Token</Label>
              <Input className="bg-zinc-900 border-zinc-800" placeholder="Enter token..." type="password" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-zinc-500 uppercase">Chat ID</Label>
              <Input className="bg-zinc-900 border-zinc-800" placeholder="e.g. 12345678" />
            </div>
            <div className="pt-4">
              <Button variant="outline" className="w-full border-zinc-800 hover:bg-zinc-800 text-zinc-400">
                TEST TELEGRAM CONNECTION
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 px-10 rounded-full">
           <Save className="mr-2 h-4 w-4" /> SAVE CONFIGURATION
        </Button>
      </div>
    </div>
  );
}
