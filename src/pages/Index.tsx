
import React, { useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import ContentFormConfig from "@/components/ContentFormConfig";
import GeneratedContentOutput from "@/components/GeneratedContentOutput";
import QualityAssurance from "@/components/QualityAssurance";

const Index = () => {
  // State management
  const [platform, setPlatform] = useState('');
  const [contentType, setContentType] = useState('');
  const [contentLength, setContentLength] = useState('');
  const [objective, setObjective] = useState('');
  const [style, setStyle] = useState('');
  const [contentCategory, setContentCategory] = useState('');
  const [productName, setProductName] = useState('');
  const [keyMessage, setKeyMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keywords, setKeywords] = useState('');
  const [facebookPageLink, setFacebookPageLink] = useState('');
  const [includeCTA, setIncludeCTA] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(false);
  const [numVariations, setNumVariations] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [qaMetrics, setQaMetrics] = useState<any>(null);

  const handleGenerateContent = async () => {
    // Validation
    if (!productName && !keyMessage && !['seasonal', 'brand-awareness'].includes(contentCategory)) {
      setError('ထုတ်ကုန်/ဝန်ဆောင်မှုအမည် သို့မဟုတ် အဓိကအချက်/အသေးစိတ် အချက်အလက်များကို ထည့်သွင်းပါ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // For demo purposes, generate sample content
      const variations = Array.from({ length: numVariations }, (_, index) => {
        return `[ပုံစံကွဲ ${index + 1}]

${productName ? `🌟 ${productName} 🌟` : ''}

${keyMessage || 'သင်၏ ထုတ်ကုန်နှင့် ဝန်ဆောင်မှုများကို မိတ်ဆက်ပေးလိုပါသည်။'}

${targetAudience ? `🎯 ဦးတည်အုပ်စု: ${targetAudience}` : ''}

${includeEmojis ? '✨ အထူးကမ်းလှမ်းချက်များ ရရှိနိုင်ပါသည်! ✨' : 'အထူးကမ်းလှမ်းချက်များ ရရှိနိုင်ပါသည်!'}

${includeCTA ? '📞 ယခုပင် ဆက်သွယ်ပါ!' : ''}

${includeHashtags ? '#Myanmar #Business #Quality #Service' : ''}`;
      });

      setGeneratedContent(variations);
      
      // Generate mock QA metrics
      setQaMetrics({
        grammar: Math.floor(Math.random() * 20) + 80,
        narrativeFlow: Math.floor(Math.random() * 20) + 80,
        culturalContext: Math.floor(Math.random() * 20) + 85,
        optimization: 'ပိုမိုကောင်းမွန်အောင် ပြုလုပ်နိုင်သည်',
        engagement: Math.floor(Math.random() * 30) + 70
      });

      toast.success('အကြောင်းအရာ ဖန်တီးပြီးပါပြီ!');
    } catch (err) {
      setError('အကြောင်းအရာ ဖန်တီးရာတွင် အမှားရှိပါသည်။');
      toast.error('ဖန်တီးရာတွင် အမှားရှိပါသည်။');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`ပုံစံကွဲ ${index + 1} ကို ကူးယူပြီးပါပြီ!`);
    } catch (err) {
      toast.error('ကူးယူရာတွင် အမှားရှိပါသည်။');
    }
  };

  const exportAllContent = () => {
    if (generatedContent.length === 0) return;
    
    const content = generatedContent.map((text, index) => 
      `=== ပုံစံကွဲ ${index + 1} ===\n\n${text}\n\n`
    ).join('');
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'burmese_social_media_content.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('ဖိုင် ထုတ်ယူပြီးပါပြီ!');
  };

  // Checkbox handlers to properly handle CheckedState type
  const handleCTAChange = (checked: boolean | "indeterminate") => {
    setIncludeCTA(checked === true);
  };

  const handleEmojisChange = (checked: boolean | "indeterminate") => {
    setIncludeEmojis(checked === true);
  };

  const handleHashtagsChange = (checked: boolean | "indeterminate") => {
    setIncludeHashtags(checked === true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            မြန်မာ Social Media Content Writer
          </h1>
          <p className="text-lg text-gray-600">
            AI ဖြင့် ရေးသားထားသော မြန်မာဘာသာ Social Media အကြောင်းအရာများ
          </p>
        </div>

        {/* API Key Warning */}
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-amber-800">
            လက်ရှိတွင် Demo mode တွင် အလုပ်လုပ်နေပါသည်။ အစစ်အမှန် API integration အတွက် Gemini API key လိုအပ်ပါသည်။
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <ContentFormConfig
            platform={platform}
            setPlatform={setPlatform}
            contentType={contentType}
            setContentType={setContentType}
            contentLength={contentLength}
            setContentLength={setContentLength}
            objective={objective}
            setObjective={setObjective}
            style={style}
            setStyle={setStyle}
            contentCategory={contentCategory}
            setContentCategory={setContentCategory}
            productName={productName}
            setProductName={setProductName}
            keyMessage={keyMessage}
            setKeyMessage={setKeyMessage}
            targetAudience={targetAudience}
            setTargetAudience={setTargetAudience}
            keywords={keywords}
            setKeywords={setKeywords}
            facebookPageLink={facebookPageLink}
            setFacebookPageLink={setFacebookPageLink}
            includeCTA={includeCTA}
            includeEmojis={includeEmojis}
            includeHashtags={includeHashtags}
            handleCTAChange={handleCTAChange}
            handleEmojisChange={handleEmojisChange}
            handleHashtagsChange={handleHashtagsChange}
            numVariations={numVariations}
            setNumVariations={setNumVariations}
            handleGenerateContent={handleGenerateContent}
            loading={loading}
            error={error}
          />

          {/* Output Section */}
          <div className="space-y-6">
            <GeneratedContentOutput
              generatedContent={generatedContent}
              copyToClipboard={copyToClipboard}
              exportAllContent={exportAllContent}
            />

            <QualityAssurance qaMetrics={qaMetrics} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
