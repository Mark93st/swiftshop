import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  Clock, 
  Code, 
  Lightbulb, 
  Search,
  CheckCircle2,
  AlertTriangle,
  Activity
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// This is a server component by default
export default async function SystemHealthPage() {
  const errors = await prisma.systemError.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-slate-500">Monitor system errors and AI-powered diagnoses.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 rounded-lg text-green-700">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-semibold text-sm">All systems operational</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errors.length}</div>
            <p className="text-xs text-slate-500 mt-1">Last 50 recorded incidents</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">AI Diagnosed</CardTitle>
            <Lightbulb className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {errors.filter(e => e.diagnosis).length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Automatic fixes suggested</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Stripe Events</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {errors.filter(e => e.source?.includes('STRIPE')).length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Payment related errors</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-red-100">
        <CardHeader className="bg-red-50/50">
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            Error Logs
          </CardTitle>
          <CardDescription>
            Detailed logs of system exceptions with AI analyst insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {errors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
              <p className="font-medium">No errors recorded yet!</p>
              <p className="text-sm text-slate-400">Your system is running smoothly.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {errors.map((error, index) => (
                <AccordionItem key={error.id} value={error.id} className={cn(
                  "px-6 border-b hover:bg-slate-50/50 transition-colors",
                  index === errors.length - 1 && "border-0"
                )}>
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 text-left w-full">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-slate-100 font-mono text-[10px]">
                            {error.source || 'SYSTEM'}
                          </Badge>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(error.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 truncate pr-4">
                          {error.message}
                        </h3>
                      </div>
                      {error.diagnosis && (
                        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded border border-yellow-100">
                          <Lightbulb className="h-3 w-3" />
                          AI ANALYST READY
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                      {/* Left Side: Technical Details */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                            <Code className="h-4 w-4" />
                            Stack Trace
                          </h4>
                          <div className="bg-slate-900 text-slate-300 p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-[300px] leading-relaxed">
                            <pre>{error.stack || 'No stack trace available for this error.'}</pre>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: AI Diagnosis */}
                      <div className="space-y-6">
                        <div className="bg-yellow-50/50 border border-yellow-100 rounded-2xl p-6">
                          <div className="flex items-center gap-3 mb-6">
                             <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700">
                                <Lightbulb className="h-6 w-6" />
                             </div>
                             <div>
                                <h4 className="font-bold text-yellow-900">AI Analyst Diagnosis</h4>
                                <p className="text-xs text-yellow-700 font-medium">Llama 3 (Groq) Free Intelligence</p>
                             </div>
                          </div>

                          {error.diagnosis ? (
                            <div className="space-y-6">
                              <div>
                                <h5 className="text-sm font-bold text-yellow-900 mb-2">Explanation</h5>
                                <p className="text-sm text-yellow-800 leading-relaxed">
                                  {error.diagnosis}
                                </p>
                              </div>
                              {error.suggestedFix && (
                                <div>
                                  <h5 className="text-sm font-bold text-yellow-900 mb-2">Suggested Fix</h5>
                                  <div className="bg-white/60 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-900 font-medium leading-relaxed">
                                    {error.suggestedFix}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center py-6 text-yellow-600/60 italic">
                               <Search className="h-8 w-8 mb-2 animate-pulse" />
                               <p className="text-sm">AI is analyzing this incident...</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper icons
