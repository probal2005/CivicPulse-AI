import { useState, useRef } from 'react';
import {
  Brain,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  AlertTriangle,
  Info,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PriorityBadge } from '@/components/ui/Badge';
import {
  CATEGORY_LABELS,
  type AIDetectionResult,
  type ComplaintCategory,
} from '@/types/complaint';
import { categoryColors } from '@/data/mockComplaints';

const simulatedResults: AIDetectionResult[] = [
  {
    category: 'pothole',
    confidence: null,
    priority: 'high',
    explanation:
      'The image appears to show surface damage consistent with a pothole. A real model would estimate severity based on size and depth.',
    isSimulated: true,
  },
  {
    category: 'garbage',
    confidence: null,
    priority: 'medium',
    explanation:
      'The image may show accumulated waste. A real model would classify the waste type and estimate volume for dispatch prioritization.',
    isSimulated: true,
  },
  {
    category: 'waterlogging',
    confidence: null,
    priority: 'critical',
    explanation:
      'The image may indicate standing water. A real model would assess water depth and identify potential drainage failures.',
    isSimulated: true,
  },
  {
    category: 'streetlight',
    confidence: null,
    priority: 'low',
    explanation:
      'The image may show a non-functional streetlight in a low-light setting. A real model would confirm the fixture type and fault.',
    isSimulated: true,
  },
];

export function AIIntelligencePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AIDetectionResult | null>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  }

  function clearImage() {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function runAnalysis() {
    if (!imagePreview) return;
    setAnalyzing(true);
    setResult(null);

    await new Promise((r) => setTimeout(r, 1800));

    const random = simulatedResults[Math.floor(Math.random() * simulatedResults.length)];
    setResult(random);
    setAnalyzing(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200 mb-4">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span className="text-teal-700 text-sm font-medium">Demo Mode — No Real Model Connected</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900">AI Intelligence</h1>
        <p className="mt-2 text-slate-500">
          Upload an image of a civic issue to see how the AI analysis pipeline would work. Results below are simulated for demonstration.
        </p>
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 mb-8">
        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Real AI model not connected</p>
          <p className="text-sm text-amber-700 mt-1">
            This page shows a simulated analysis flow. Confidence scores are hidden because no real prediction model is running.
            When a FastAPI <code className="text-xs font-mono bg-amber-100 px-1.5 py-0.5 rounded">/predict</code> endpoint is connected,
            this page will display real category predictions, confidence values, and severity assessments.
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload */}
        <Card className="p-6">
          <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-teal-600" />
            Upload Image
          </h2>

          {imagePreview ? (
            <div className="relative">
              <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-xl border border-slate-200" />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 shadow hover:bg-white text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-3">
                <ImageIcon className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm font-medium text-slate-600">Click to upload an image</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5 MB</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

          {imagePreview && (
            <Button onClick={runAnalysis} disabled={analyzing} className="w-full mt-4">
              {analyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing image...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  Run Demo Analysis
                </>
              )}
            </Button>
          )}
        </Card>

        {/* Results */}
        <Card className="p-6">
          <h2 className="font-bold text-navy-900 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-teal-600" />
            Detection Result
          </h2>

          {analyzing && (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100" />
                <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
              </div>
              <p className="text-sm text-slate-500 font-medium">Simulating analysis...</p>
            </div>
          )}

          {!analyzing && !result && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Brain className="w-12 h-12 text-slate-200" />
              <p className="text-sm text-slate-400 mt-3 max-w-xs">
                Upload an image and run the demo analysis to see a simulated detection result here.
              </p>
            </div>
          )}

          {!analyzing && result && (
            <div className="space-y-4 animate-slide-in">
              <div className={`p-4 rounded-xl ${categoryColors[result.category].bg}`}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Detected Category</p>
                <p className={`text-2xl font-bold mt-1 ${categoryColors[result.category].text}`}>
                  {CATEGORY_LABELS[result.category]}
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested Priority</p>
                  <div className="mt-1.5"><PriorityBadge priority={result.priority} /></div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confidence</p>
                  <p className="text-sm text-slate-400 mt-1.5 italic">Hidden — no model</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Priority Explanation</p>
                <p className="text-sm text-slate-600 leading-relaxed">{result.explanation}</p>
              </div>

              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  This is a simulated result. No real AI model analyzed this image. Do not use this for actual dispatch decisions.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Integration note */}
      <Card className="mt-6 p-6">
        <h3 className="font-bold text-navy-900 mb-3">How a Real Model Would Connect</h3>
        <p className="text-sm text-slate-500 leading-relaxed">
          The code is structured to accept a FastAPI <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">/predict</code> endpoint.
          When connected, the upload flow would send the image to the server, receive a category prediction with a confidence score,
          and display real severity-based priority recommendations. The service layer in <code className="text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">complaintService.ts</code>
          is designed to be swapped with real API calls without changing the UI.
        </p>
      </Card>
    </div>
  );
}
