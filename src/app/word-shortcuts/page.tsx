
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const shortcutCategories = [
    {
        category: "Most Common Shortcuts",
        shortcuts: [
            { name: "Ctrl + N", description: "Create a new document." },
            { name: "Ctrl + O", description: "Open an existing document." },
            { name: "Ctrl + S", description: "Save the current document." },
            { name: "F12", description: "Open the Save As dialog box." },
            { name: "Ctrl + W", description: "Close the current document." },
            { name: "Ctrl + C", description: "Copy selected content." },
            { name: "Ctrl + X", description: "Cut selected content." },
            { name: "Ctrl + V", description: "Paste content." },
            { name: "Ctrl + A", description: "Select all document content." },
            { name: "Ctrl + B", description: "Apply bold formatting." },
            { name: "Ctrl + I", description: "Apply italic formatting." },
            { name: "Ctrl + U", description: "Apply underline formatting." },
            { name: "Ctrl + Z", description: "Undo the last action." },
            { name: "Ctrl + Y", description: "Redo the last action." },
        ]
    },
    {
        category: "Navigating the Document",
        shortcuts: [
            { name: "Ctrl + Home", description: "Move to the beginning of the document." },
            { name: "Ctrl + End", description: "Move to the end of the document." },
            { name: "Ctrl + Left Arrow", description: "Move one word to the left." },
            { name: "Ctrl + Right Arrow", description: "Move one word to the right." },
            { name: "Ctrl + Up Arrow", description: "Move one paragraph up." },
            { name: "Ctrl + Down Arrow", description: "Move one paragraph down." },
            { name: "Shift + F5", description: "Move to the last edit location." },
        ]
    },
    {
        category: "Selecting Text",
        shortcuts: [
            { name: "Shift + Right Arrow", description: "Select one character to the right." },
            { name: "Shift + Left Arrow", description: "Select one character to the left." },
            { name: "Ctrl + Shift + Right Arrow", description: "Select one word to the right." },
            { name: "Ctrl + Shift + Left Arrow", description: "Select one word to the left." },
            { name: "Shift + End", description: "Select to the end of the line." },
            { name: "Shift + Home", description: "Select to the beginning of the line." },
            { name: "Ctrl + Shift + Down Arrow", description: "Select to the end of the paragraph." },
            { name: "Ctrl + Shift + Up Arrow", description: "Select to the beginning of the paragraph." },
        ]
    },
    {
        category: "Editing Text",
        shortcuts: [
            { name: "Backspace", description: "Delete one character to the left." },
            { name: "Delete", description: "Delete one character to the right." },
            { name: "Ctrl + Backspace", description: "Delete one word to the left." },
            { name: "Ctrl + Delete", description: "Delete one word to the right." },
            { name: "Ctrl + K", description: "Insert a hyperlink." },
            { name: "F7", description: "Run a spelling and grammar check." },
        ]
    },
    {
        category: "Formatting Text and Paragraphs",
        shortcuts: [
            { name: "Ctrl + ]", description: "Increase font size by 1 point." },
            { name: "Ctrl + [", description: "Decrease font size by 1 point." },
            { name: "Ctrl + Shift + >", description: "Increase font size." },
            { name: "Ctrl + Shift + <", description: "Decrease font size." },
            { name: "Ctrl + D", description: "Open the Font dialog box." },
            { name: "Ctrl + E", description: "Center a paragraph." },
            { name: "Ctrl + L", description: "Left-align a paragraph." },
            { name: "Ctrl + R", description: "Right-align a paragraph." },
            { name: "Ctrl + J", description: "Justify a paragraph." },
            { name: "Ctrl + 1", description: "Set single-line spacing." },
            { name: "Ctrl + 2", description: "Set double-line spacing." },
            { name: "Ctrl + 5", description: "Set 1.5-line spacing." },
        ]
    },
    {
        category: "Working with Tables",
        shortcuts: [
            { name: "Tab", description: "Move to the next cell in a row." },
            { name: "Shift + Tab", description: "Move to the previous cell in a row." },
            { name: "Alt + Home", description: "Go to the first cell in a row." },
            { name: "Alt + End", description: "Go to the last cell in a row." },
            { name: "Alt + Page Up", description: "Go to the first cell in a column." },
            { name: "Alt + Page Down", description: "Go to the last cell in a column." },
        ]
    },
    {
        category: "General Program Shortcuts",
        shortcuts: [
            { name: "Ctrl + P", description: "Print a document." },
            { name: "Ctrl + F", description: "Open the Find box." },
            { name: "Ctrl + H", description: "Open the Replace dialog box." },
            { name: "F1", description: "Open the Help pane." },
            { name: "Alt + Q", description: "Go to the 'Tell me what you want to do' box." },
        ]
    }
];

const ShortcutRow = ({ shortcut }: { shortcut: { name: string; description: string } }) => {
    return (
        <div className="flex items-center justify-between gap-2 p-3 border-t">
            <p className="text-sm text-muted-foreground">{shortcut.description}</p>
            <code className="text-sm bg-muted px-2 py-1 rounded-sm font-semibold whitespace-nowrap">{shortcut.name}</code>
        </div>
    )
}

export default function WordShortcutsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative">
            <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Back to Home</span>
            </Link>
          <div className="text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">MS Word Shortcuts Guide</CardTitle>
            <CardDescription>A quick reference for common Microsoft Word keyboard shortcuts.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
            <Separator />
            <Accordion type="single" collapsible className="w-full" defaultValue={shortcutCategories[0].category}>
                {shortcutCategories.map(category => (
                    <AccordionItem value={category.category} key={category.category}>
                        <AccordionTrigger className="text-lg font-medium">{category.category}</AccordionTrigger>
                        <AccordionContent className="p-0">
                            <div className="flex flex-col">
                                {category.shortcuts.map(shortcut => (
                                    <ShortcutRow key={shortcut.name} shortcut={shortcut} />
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
