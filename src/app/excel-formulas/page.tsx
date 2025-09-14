
'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft, Copy } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const formulaCategories = [
    {
        category: "Math & Statistical Formulas",
        formulas: [
            { name: "SUM", syntax: "=SUM(number1, [number2], ...)", description: "Adds all the numbers in a range of cells.", example: "=SUM(A1:A10)" },
            { name: "AVERAGE", syntax: "=AVERAGE(number1, [number2], ...)", description: "Returns the average (arithmetic mean) of the arguments.", example: "=AVERAGE(B1:B10)" },
            { name: "COUNT", syntax: "=COUNT(value1, [value2], ...)", description: "Counts the number of cells that contain numbers.", example: "=COUNT(A1:A10)" },
            { name: "MAX", syntax: "=MAX(number1, [number2], ...)", description: "Returns the largest value in a set of values.", example: "=MAX(A1:A10)" },
            { name: "MIN", syntax: "=MIN(number1, [number2], ...)", description: "Returns the smallest number in a set of values.", example: "=MIN(A1:A10)" },
            { name: "ROUND", syntax: "=ROUND(number, num_digits)", description: "Rounds a number to a specified number of digits.", example: "=ROUND(A1, 2)" },
        ]
    },
    {
        category: "Text Formulas",
        formulas: [
            { name: "CONCATENATE", syntax: "=CONCATENATE(text1, [text2], ...)", description: "Joins several text items into one text item.", example: "=CONCATENATE(A1, \" \", B1)" },
            { name: "LEFT", syntax: "=LEFT(text, [num_chars])", description: "Returns the specified number of characters from the start of a text string.", example: "=LEFT(A1, 5)" },
            { name: "RIGHT", syntax: "=RIGHT(text, [num_chars])", description: "Returns the specified number of characters from the end of a text string.", example: "=RIGHT(A1, 5)" },
            { name: "LEN", syntax: "=LEN(text)", description: "Returns the number of characters in a text string.", example: "=LEN(A1)" },
            { name: "TRIM", syntax: "=TRIM(text)", description: "Removes extra spaces from text.", example: "=TRIM(A1)" },
            { name: "UPPER", syntax: "=UPPER(text)", description: "Converts text to uppercase.", example: "=UPPER(A1)" },
        ]
    },
    {
        category: "Date & Time Formulas",
        formulas: [
            { name: "TODAY", syntax: "=TODAY()", description: "Returns the current date.", example: "=TODAY()" },
            { name: "NOW", syntax: "=NOW()", description: "Returns the current date and time.", example: "=NOW()" },
            { name: "DATE", syntax: "=DATE(year, month, day)", description: "Returns the serial number of a particular date.", example: "=DATE(2024, 8, 26)" },
            { name: "DATEDIF", syntax: "=DATEDIF(start_date, end_date, unit)", description: "Calculates the number of days, months, or years between two dates.", example: "=DATEDIF(A1, B1, \"Y\")" },
            { name: "EOMONTH", syntax: "=EOMONTH(start_date, months)", description: "Returns the last day of the month, a specified number of months in the future or past.", example: "=EOMONTH(A1, 1)" },
        ]
    },
    {
        category: "Logical Formulas",
        formulas: [
            { name: "IF", syntax: "=IF(logical_test, value_if_true, [value_if_false])", description: "Checks whether a condition is met, and returns one value if TRUE, and another value if FALSE.", example: "=IF(A1>50, \"Pass\", \"Fail\")" },
            { name: "AND", syntax: "=AND(logical1, [logical2], ...)", description: "Returns TRUE if all of its arguments are TRUE.", example: "=AND(A1>50, B1>50)" },
            { name: "OR", syntax: "=OR(logical1, [logical2], ...)", description: "Returns TRUE if any argument is TRUE.", example: "=OR(A1>50, B1>50)" },
            { name: "NOT", syntax: "=NOT(logical)", description: "Reverses the logic of its argument.", example: "=NOT(A1>50)" },
            { name: "IFERROR", syntax: "=IFERROR(value, value_if_error)", description: "Returns a value you specify if a formula evaluates to an error; otherwise, returns the result of the formula.", example: "=IFERROR(A1/B1, \"Error in calculation\")" },
        ]
    },
    {
        category: "Lookup & Reference Formulas",
        formulas: [
            { name: "VLOOKUP", syntax: "=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])", description: "Looks for a value in the leftmost column of a table, and then returns a value in the same row from a column you specify.", example: "=VLOOKUP(A1, C1:E10, 3, FALSE)" },
            { name: "HLOOKUP", syntax: "=HLOOKUP(lookup_value, table_array, row_index_num, [range_lookup])", description: "Looks for a value in the top row of a table or an array of values, and then returns a value in the same column from a row you specify.", example: "=HLOOKUP(A1, C1:E10, 3, FALSE)" },
            { name: "INDEX", syntax: "=INDEX(array, row_num, [column_num])", description: "Returns a value or reference of the cell at the intersection of a particular row and column, in a given range.", example: "=INDEX(A1:C10, 2, 3)" },
            { name: "MATCH", syntax: "=MATCH(lookup_value, lookup_array, [match_type])", description: "Searches for a specified item in a range of cells, and then returns the relative position of that item in the range.", example: "=MATCH(\"Apple\", A1:A10, 0)" },
        ]
    }
];

const shortcutCategories = [
    {
        category: "General Shortcuts",
        shortcuts: [
            { name: "Ctrl + C", description: "Copy selected cells." },
            { name: "Ctrl + V", description: "Paste content from clipboard." },
            { name: "Ctrl + X", description: "Cut selected cells." },
            { name: "Ctrl + Z", description: "Undo the last action." },
            { name: "Ctrl + Y", description: "Redo the last action." },
            { name: "Ctrl + S", description: "Save the workbook." },
            { name: "Ctrl + O", description: "Open a workbook." },
            { name: "Ctrl + N", description: "Create a new workbook." },
            { name: "Ctrl + P", description: "Print the current sheet." },
            { name: "F1", description: "Open the Help pane." },
        ]
    },
    {
        category: "Navigation Shortcuts",
        shortcuts: [
            { name: "Arrow Keys", description: "Move one cell up, down, left, or right." },
            { name: "Ctrl + Arrow Keys", description: "Move to the edge of the current data region." },
            { name: "Ctrl + Home", description: "Move to the beginning of the worksheet (cell A1)." },
            { name: "Ctrl + End", description: "Move to the last cell with content on the worksheet." },
            { name: "Ctrl + PageDown", description: "Move to the next sheet in the workbook." },
            { name: "Ctrl + PageUp", description: "Move to the previous sheet in the workbook." },
        ]
    },
    {
        category: "Formatting Shortcuts",
        shortcuts: [
            { name: "Ctrl + B", description: "Apply or remove bold formatting." },
            { name: "Ctrl + I", description: "Apply or remove italic formatting." },
            { name: "Ctrl + U", description: "Apply or remove an underline." },
            { name: "Ctrl + 1", description: "Open the Format Cells dialog box." },
            { name: "Ctrl + 5", description: "Apply or remove strikethrough formatting." },
            { name: "Alt + H + H", description: "Select a fill color." },
        ]
    },
    {
        category: "Selection Shortcuts",
        shortcuts: [
            { name: "Ctrl + A", description: "Select the entire worksheet or current region." },
            { name: "Shift + Space", description: "Select the entire row." },
            { name: "Ctrl + Space", description: "Select the entire column." },
            { name: "Shift + Arrow Keys", description: "Extend the selection by one cell." },
            { name: "Ctrl + Shift + Arrow Keys", description: "Extend the selection to the last nonblank cell." },
        ]
    },
    {
        category: "Data Entry Shortcuts",
        shortcuts: [
            { name: "Ctrl + ;", description: "Enter the current date." },
            { name: "Ctrl + Shift + ;", description: "Enter the current time." },
            { name: "Ctrl + '", description: "Copy the formula from the cell above." },
            { name: "Ctrl + D", description: "Fill down from the cell above." },
            { name: "Ctrl + R", description: "Fill right from the cell to the left." },
            { name: "Alt + Enter", description: "Start a new line in the same cell." },
        ]
    },
    {
        category: "Formula Shortcuts",
        shortcuts: [
            { name: "F2", description: "Edit the active cell." },
            { name: "Shift + F3", description: "Open the Insert Function dialog box." },
            { name: "Ctrl + Shift + Enter", description: "Enter a formula as an array formula." },
            { name: "F4", description: "Toggle between absolute, relative, and mixed references." },
            { name: "Ctrl + `", description: "Toggle displaying formulas and their results." },
        ]
    },
    {
        category: "Macros & VBA Shortcuts",
        shortcuts: [
            { name: "Alt + F11", description: "Open the Visual Basic for Applications (VBA) Editor." },
            { name: "Alt + F8", description: "Display the Macro dialog box to run, edit, or delete a macro." },
            { name: "F5", description: "Run the current procedure or macro in the VBA Editor." },
            { name: "F8", description: "Step through code one line at a time in the VBA Editor." },
            { name: "Ctrl + Break", description: "Stop the execution of a running macro." },
        ]
    }
];

const FormulaRow = ({ formula }: { formula: (typeof formulaCategories)[0]['formulas'][0] }) => {
    const { toast } = useToast();

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Formula Copied",
            description: `${text} copied to your clipboard.`,
        });
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 border-t">
            <div className="flex-1">
                <p className="font-semibold text-foreground">{formula.name}</p>
                <p className="text-sm text-muted-foreground">{formula.description}</p>
                <code className="text-xs bg-muted p-1 rounded-sm block mt-1 font-mono">{formula.example}</code>
            </div>
            <Button variant="ghost" size="sm" onClick={() => handleCopy(formula.example)}>
                <Copy className="mr-2 h-4 w-4" /> Copy Example
            </Button>
        </div>
    )
}

const ShortcutRow = ({ shortcut }: { shortcut: { name: string; description: string } }) => {
    return (
        <div className="flex items-center justify-between gap-2 p-3 border-t">
            <p className="text-sm text-muted-foreground">{shortcut.description}</p>
            <code className="text-sm bg-muted px-2 py-1 rounded-sm font-semibold">{shortcut.name}</code>
        </div>
    )
}

export default function ExcelFormulasPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background items-center p-4 md:p-8">
      <Card className="w-full max-w-4xl">
        <CardHeader className="relative">
            <Link href="/" className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted">
                <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                <span className="sr-only">Back to Home</span>
            </Link>
          <div className="text-center pt-8">
            <CardTitle className="text-3xl font-bold tracking-tight">Excel Formula & Shortcut Guide</CardTitle>
            <CardDescription>A quick reference for common Excel functions and keyboard shortcuts.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
            <Separator />
            <Accordion type="multiple" className="w-full" defaultValue={["formulas-main"]}>
                <AccordionItem value="formulas-main">
                    <AccordionTrigger className="text-xl font-semibold">Formulas</AccordionTrigger>
                    <AccordionContent className="p-0 pl-4">
                        <Accordion type="single" collapsible className="w-full" defaultValue={formulaCategories[0].category}>
                            {formulaCategories.map(category => (
                                <AccordionItem value={category.category} key={category.category}>
                                    <AccordionTrigger className="text-lg font-medium">{category.category}</AccordionTrigger>
                                    <AccordionContent className="p-0">
                                        <div className="flex flex-col">
                                            {category.formulas.map(formula => (
                                                <FormulaRow key={formula.name} formula={formula} />
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="shortcuts-main">
                     <AccordionTrigger className="text-xl font-semibold">Shortcuts</AccordionTrigger>
                     <AccordionContent className="p-0 pl-4">
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
                     </AccordionContent>
                </AccordionItem>
            </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

    

    
