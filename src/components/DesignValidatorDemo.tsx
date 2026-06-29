/**
 * Design Validator Demo Component
 * Demonstrates the design validation system with live examples
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, XCircle, Loader2, Download } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface QACheck {
  check: string;
  result: 'pass' | 'fail' | 'warning';
  details?: string;
}

interface DesignOutput {
  status: 'success' | 'warning' | 'error';
  design_version: string;
  files: Array<{
    type: string;
    path: string;
    size_bytes: number;
  }>;
  qa: QACheck[];
  warnings: string[];
  errors: any[];
  computed: {
    title_font_size: number;
    title_line_height: number;
    title_truncated: boolean;
    contrast_ratios: Record<string, number>;
    total_asset_size: number;
    performance_grade: 'excellent' | 'good' | 'poor';
  };
}

export function DesignValidatorDemo() {
  const [titleText, setTitleText] = useState('ORNAMIS');
  const [primaryColor, setPrimaryColor] = useState('#1a0f08');
  const [accentColor, setAccentColor] = useState('#d4af37');
  const [bgColor, setBgColor] = useState('#faf8f5');
  const [viewport, setViewport] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DesignOutput | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-75af7cc1/design/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            screen: 'home',
            title_text: titleText,
            title_max_px: 72,
            theme: {
              primary: primaryColor,
              accent: accentColor,
              bg: bgColor,
            },
            loading_duration_ms: 300,
            stores: [
              { name: 'Tanishq', logo_url: null },
              { name: 'Giva', logo_url: null },
              { name: 'Malabar', logo_url: null },
            ],
            output_format: 'png',
            viewport: viewport,
          }),
        }
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Design generation error:', error);
      setResult({
        status: 'error',
        design_version: 'error',
        files: [],
        qa: [],
        warnings: [],
        errors: [{ error_code: 'NETWORK_ERROR', message: 'Failed to connect to design service' }],
        computed: {
          title_font_size: 0,
          title_line_height: 0,
          title_truncated: false,
          contrast_ratios: {},
          total_asset_size: 0,
          performance_grade: 'poor',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle2 className="size-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="size-5 text-yellow-600" />;
      case 'fail':
        return <XCircle className="size-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getPerformanceColor = (grade: string) => {
    switch (grade) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f3f0] to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-['Cinzel_Decorative',serif] text-[#492f0e] mb-4">
            Design Validator Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Test the ORNAMIS design validation system with automatic accessibility checks, performance budgeting,
            and WCAG AA compliance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <h3 className="text-[#492f0e] mb-6">Design Input</h3>

              <div className="space-y-4">
                {/* Title Text */}
                <div>
                  <Label htmlFor="title">Title Text</Label>
                  <Input
                    id="title"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    placeholder="Enter title text"
                  />
                </div>

                {/* Theme Colors */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primary">Primary</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary"
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="flex-1 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent">Accent</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent"
                        type="color"
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={accentColor}
                        onChange={(e) => setAccentColor(e.target.value)}
                        className="flex-1 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bg">Background</Label>
                    <div className="flex gap-2">
                      <Input
                        id="bg"
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Viewport */}
                <div>
                  <Label>Viewport</Label>
                  <div className="flex gap-2 mt-2">
                    {(['mobile', 'tablet', 'desktop'] as const).map((vp) => (
                      <Button
                        key={vp}
                        variant={viewport === vp ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewport(vp)}
                        className="capitalize"
                      >
                        {vp}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#b39978] to-[#492f0e] hover:from-[#9a8567] hover:to-[#362312] text-white"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Validating & Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 size-5" />
                      Generate & Validate
                    </>
                  )}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 h-full">
              <h3 className="text-[#492f0e] mb-6">Validation Results</h3>

              {!result && !loading && (
                <div className="flex items-center justify-center h-96 text-center">
                  <div>
                    <CheckCircle2 className="size-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No results yet</p>
                    <p className="text-sm text-gray-500">
                      Configure your design and click "Generate & Validate"
                    </p>
                  </div>
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="size-16 text-[#b39978] animate-spin" />
                </div>
              )}

              {result && (
                <div className="space-y-6">
                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        result.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'warning'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }
                    >
                      {result.status.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-gray-500">v{result.design_version.slice(0, 8)}</span>
                  </div>

                  {/* Computed Values */}
                  <div className="p-4 bg-[#f5f1ed] rounded-lg">
                    <h4 className="text-sm font-medium text-[#492f0e] mb-3">Computed Values</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-600">Font Size:</span>
                        <span className="ml-2 font-medium">{result.computed.title_font_size}px</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Line Height:</span>
                        <span className="ml-2 font-medium">{result.computed.title_line_height.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Truncated:</span>
                        <span className="ml-2 font-medium">{result.computed.title_truncated ? 'Yes' : 'No'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Asset Size:</span>
                        <span className="ml-2 font-medium">
                          {(result.computed.total_asset_size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-600">Performance:</span>
                      <Badge className={getPerformanceColor(result.computed.performance_grade)}>
                        {result.computed.performance_grade}
                      </Badge>
                    </div>
                  </div>

                  {/* QA Checks */}
                  <div>
                    <h4 className="text-sm font-medium text-[#492f0e] mb-3">QA Checks</h4>
                    <div className="space-y-2">
                      {result.qa.map((check, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                          {getStatusIcon(check.result)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{check.check}</p>
                            {check.details && <p className="text-xs text-gray-600 mt-1">{check.details}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warnings */}
                  {result.warnings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 mb-3">Warnings</h4>
                      <div className="space-y-2">
                        {result.warnings.map((warning, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                            <AlertCircle className="size-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-800">{warning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {result.errors.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-red-800 mb-3">Errors</h4>
                      <div className="space-y-2">
                        {result.errors.map((error, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
                            <XCircle className="size-4 text-red-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-red-800">
                                {error.error_code || 'Error'}
                              </p>
                              <p className="text-xs text-red-700 mt-1">{error.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files Generated */}
                  {result.files.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-[#492f0e] mb-3">
                        Generated Files ({result.files.length})
                      </h4>
                      <div className="space-y-2">
                        {result.files.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
                            <span className="text-gray-700 truncate flex-1">{file.path}</span>
                            <span className="text-gray-500 ml-2">
                              {(file.size_bytes / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Card className="p-6 text-center">
            <CheckCircle2 className="size-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-medium mb-2">WCAG AA Compliance</h4>
            <p className="text-sm text-gray-600">
              Automatic contrast checking ensures 4.5:1 ratio for normal text
            </p>
          </Card>

          <Card className="p-6 text-center">
            <AlertCircle className="size-12 text-blue-600 mx-auto mb-3" />
            <h4 className="font-medium mb-2">Performance Budget</h4>
            <p className="text-sm text-gray-600">Total asset size kept under 300 KB for fast loading</p>
          </Card>

          <Card className="p-6 text-center">
            <Download className="size-12 text-purple-600 mx-auto mb-3" />
            <h4 className="font-medium mb-2">Multi-Format Export</h4>
            <p className="text-sm text-gray-600">Generates Figma, SVG, PNG with fallback images</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
