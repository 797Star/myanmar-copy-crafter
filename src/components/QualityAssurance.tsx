
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QualityAssuranceProps {
  qaMetrics: {
    grammar: number;
    narrativeFlow: number;
    culturalContext: number;
    optimization: string;
    engagement: number;
  } | null;
}

const QualityAssurance: React.FC<QualityAssuranceProps> = ({ qaMetrics }) => {
  if (!qaMetrics) {
    return null;
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">
          🔍 အကြောင်းအရာ အရည်အသွေး စစ်ဆေးမှု (ပုံစံကွဲ ၁ အတွက် ပုံစံတူ)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="qa-metrics space-y-3">
          <li className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-medium">သဒ္ဒါ (Grammar):</span>
            <span className="text-green-600 font-bold">{qaMetrics.grammar}%</span>
          </li>
          <li className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-medium">ဇာတ်ကြောင်း စီးဆင်းမှု (Narrative Flow):</span>
            <span className="text-blue-600 font-bold">{qaMetrics.narrativeFlow}%</span>
          </li>
          <li className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <span className="font-medium">ယဉ်ကျေးမှု ဆိုင်ရာ အခြေအနေ (Cultural Context):</span>
            <span className="text-purple-600 font-bold">{qaMetrics.culturalContext}%</span>
          </li>
          <li className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <span className="font-medium">ပိုမိုကောင်းမွန်အောင်ပြုလုပ်ရန် အကြံပြုချက်:</span>
            <span className="text-amber-600 font-medium">{qaMetrics.optimization}</span>
          </li>
          <li className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
            <span className="font-medium">ထိတွေ့ဆက်ဆံမှု ခန့်မှန်းချက် (Engagement Score):</span>
            <span className="text-rose-600 font-bold">{qaMetrics.engagement}%</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default QualityAssurance;
