
'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  Cell,
} from 'recharts';

const barChartData = [
  { name: 'Jan', revenue: 4500, expenses: 2400 },
  { name: 'Feb', revenue: 2890, expenses: 1398 },
  { name: 'Mar', revenue: 5890, expenses: 9800 },
  { name: 'Apr', revenue: 4780, expenses: 3908 },
  { name: 'May', revenue: 6189, expenses: 4800 },
  { name: 'Jun', revenue: 5390, expenses: 3800 },
];

const lineChartData = [
  { date: '2024-01', users: 400 },
  { date: '2024-02', users: 300 },
  { date: '2024-03', users: 500 },
  { date: '2024-04', users: 450 },
  { date: '2024-05', users: 600 },
  { date: '2024-06', users: 800 },
];

const pieChartData = [
  { name: 'North', value: 400 },
  { name: 'South', value: 300 },
  { name: 'East', value: 300 },
  { name: 'West', value: 200 },
];

const radarChartData = [
  { subject: 'Marketing', A: 120, B: 110, fullMark: 150 },
  { subject: 'Sales', A: 98, B: 130, fullMark: 150 },
  { subject: 'Customer Support', A: 86, B: 130, fullMark: 150 },
  { subject: 'Engineering', A: 99, B: 100, fullMark: 150 },
  { subject: 'Design', A: 85, B: 90, fullMark: 150 },
];

const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartCard = ({
  title,
  description,
  children,
  chartId,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  chartId: string;
}) => {
  const chartRef = useRef<HTMLDivElement>(null);

  const downloadChart = async () => {
    const chartNode = chartRef.current;
    if (!chartNode) return;

    const svgElement = chartNode.querySelector('svg');
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Create an image to draw the SVG onto the canvas
    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
        // Set canvas dimensions to match the SVG
        canvas.width = svgElement.width.baseVal.value;
        canvas.height = svgElement.height.baseVal.value;
        
        // Fill background
        ctx.fillStyle = 'hsl(var(--card))'; // Use card background color
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the SVG image
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        
        // Trigger download
        const a = document.createElement('a');
        a.download = `${title.toLowerCase().replace(/\s/g, '-')}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
    };
    img.src = url;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent ref={chartRef} id={chartId}>
        {children}
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={downloadChart}>
          <Download className="mr-2 h-4 w-4" /> Download as PNG
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function InfographicsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
      <div className="w-full max-w-7xl">
        <div className="relative mb-6 text-center">
            <Link href="/" className="absolute top-1/2 -translate-y-1/2 left-0 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Back to Home</span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Infographics & Charts</h1>
            <p className="text-muted-foreground">A gallery of sample charts for your projects.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Revenue vs Expenses" description="A bar chart comparing monthly revenue and expenses." chartId="bar-chart">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barChartData}>
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                    <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
                    </BarChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="User Growth" description="A line chart showing user acquisition over time." chartId="line-chart">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={lineChartData}>
                    <XAxis dataKey="date" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                     <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" name="Active Users" />
                    </LineChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Sales by Region" description="A pie chart showing the distribution of sales across regions." chartId="pie-chart">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                    <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Team Skill Comparison" description="A radar chart comparing the skills of two teams." chartId="radar-chart">
                <ResponsiveContainer width="100%" height={300}>
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}/>
                    <Legend />
                    <Radar name="Team A" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Radar name="Team B" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                    </RadarChart>
                </ResponsiveContainer>
            </ChartCard>
        </div>
      </div>
    </div>
  );
}
