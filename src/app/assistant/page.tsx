'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Bot, User, Sparkles } from 'lucide-react';
import { shoppingAssistant } from '@/ai/flows/assistant-flow';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const assistantResponse = await shoppingAssistant(currentInput);
      const assistantMessage: Message = { role: 'assistant', content: assistantResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting assistant response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b flex items-center gap-4">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight">AI Deal Finder</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && (
                <Avatar>
                  <AvatarFallback><Sparkles /></AvatarFallback>
                </Avatar>
              )}
              <div className={`rounded-lg p-4 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === 'user' && (
                 <Avatar>
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           {isLoading && (
            <div className="flex items-start gap-4">
              <Avatar>
                  <AvatarFallback><Sparkles /></AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-4 bg-muted">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-foreground animate-pulse delay-0"></div>
                  <div className="w-2 h-2 rounded-full bg-foreground animate-pulse delay-200"></div>
                  <div className="w-2 h-2 rounded-full bg-foreground animate-pulse delay-400"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="p-4 border-t bg-background">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g., 'Find me a deal on noise-cancelling headphones...'"
              className="flex-1 h-12 text-base"
              disabled={isLoading}
            />
            <Button type="submit" size="icon" className="h-12 w-12" disabled={isLoading}>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </footer>
    </div>
  );
}
