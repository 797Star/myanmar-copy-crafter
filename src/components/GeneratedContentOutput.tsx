
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download } from "lucide-react";

interface GeneratedContentOutputProps {
  generatedContent: string[];
  copyToClipboard: (text: string, index: number) => void;
  exportAllContent: () => void;
}

const GeneratedContentOutput: React.FC<GeneratedContentOutputProps> = ({
  generatedContent,
  copyToClipboard,
  exportAllContent
}) => {
  if (generatedContent.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800 flex items-center justify-between">
          📄 ထုတ်ပေးထားသော အကြောင်းအရာ (မြန်မာ)
          <Button
            onClick={exportAllContent}
            variant="outline"
            size="sm"
            className="export-all-button"
          >
            <Download className="h-4 w-4 mr-2" />
            💾 အားလုံးကို .txt ဖိုင်ဖြင့် ထုတ်မည်
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {generatedContent.map((content, index) => (
          <div key={index} className="variation-block bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">ပုံစံကွဲ {index + 1}</h3>
              <Button
                onClick={() => copyToClipboard(content, index)}
                variant="outline"
                size="sm"
                className="copy-button"
              >
                <Copy className="h-4 w-4 mr-2" />
                📋 ပုံစံကွဲ {index + 1} ကိုကူးမည်
              </Button>
            </div>
            <div className="output-content bg-white p-4 rounded border whitespace-pre-wrap text-gray-800 leading-relaxed">
              {content}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default GeneratedContentOutput;
