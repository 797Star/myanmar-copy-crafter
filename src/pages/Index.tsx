
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Copy, Download, Sparkles, AlertCircle } from "lucide-react";

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

  // Platform-specific content types
  const contentTypes: Record<string, string[]> = {
    facebook: ['Post (စာသား၊ မာလ်တီမီဒီယာ)', 'Event အကြောင်းကြားစာ', 'ကုန်ပစ္စည်း မိတ်ဆက်မှု'],
    tiktok: ['ဗီဒီယို ဇာတ်ညွှန်း', 'Challenge အကြောင်းအရာ', 'Trending အကြောင်းအရာ'],
    youtube: ['ဗီဒီယို ခေါင်းစဉ်နှင့် ဖော်ပြချက်', 'Shorts အကြောင်းအရာ', 'Tutorial ဇာတ်ညွှန်း'],
    telegram: ['Channel Post', 'အုပ်စု မက်ဆေ့ချ်', 'သတင်းအချက်အလက်'],
    instagram: ['Post Caption', 'Story အကြောင်းအရာ', 'Reel ဇာတ်ညွှန်း']
  };

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

${includeEmojis ? '✨ အထူးကမ်းလှမ်းချက်များ ရရှိနိုင်ပါသည်! ✨' : 'အထူးကမ်းလှမ်းချက်များ ရရှိနိوင်ပါသည်!'}

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
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                📝 အကြောင်းအရာ ပြင်ဆင်ချက်များ
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Platform Selection */}
                <div>
                  <Label htmlFor="platform">Platform ရွေးချယ်ပါ</Label>
                  <Select value={platform} onValueChange={(value) => {
                    setPlatform(value);
                    setContentType('');
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Platform ရွေးချယ်ပါ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Type */}
                <div>
                  <Label htmlFor="contentType">အကြောင်းအရာ အမျိုးအစား</Label>
                  <Select value={contentType} onValueChange={setContentType} disabled={!platform}>
                    <SelectTrigger>
                      <SelectValue placeholder="အမျိုးအစား ရွေးချယ်ပါ" />
                    </SelectTrigger>
                    <SelectContent>
                      {platform && contentTypes[platform]?.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Length */}
                <div>
                  <Label htmlFor="contentLength">အလျား/ပမာဏ</Label>
                  <Select value={contentLength} onValueChange={setContentLength}>
                    <SelectTrigger>
                      <SelectValue placeholder="အလျား ရွေးချယ်ပါ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concise">အတိုချုပ် / တို</SelectItem>
                      <SelectItem value="standard">ပုံမှန် / အလယ်အလတ်</SelectItem>
                      <SelectItem value="detailed">အသေးစိတ် / ရှည်</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Objective */}
                <div>
                  <Label htmlFor="objective">ရည်ရွယ်ချက်/ရည်မှန်းချက်</Label>
                  <Select value={objective} onValueChange={setObjective}>
                    <SelectTrigger>
                      <SelectValue placeholder="ရည်ရွယ်ချက် ရွေးချယ်ပါ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand-awareness">ကုန်အမှတ်တံဆိပ် သိရှိစေခြင်း</SelectItem>
                      <SelectItem value="lead-generation">ဖောက်သည် ရှာဖွေခြင်း</SelectItem>
                      <SelectItem value="sales">ရောင်းချခြင်း</SelectItem>
                      <SelectItem value="engagement">ထိတွေ့ဆက်ဆံမှု တိုးမြင့်ခြင်း</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Style */}
                <div>
                  <Label htmlFor="style">ရေးသားမှု ပုံစံ</Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="ပုံစံ ရွေးချယ်ပါ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="polite">ယဉ်ကျေးသော (တရားဝင် မြန်မာစကား)</SelectItem>
                      <SelectItem value="friendly">ဖော်ရွေသော (သူငယ်ချင်းကဲ့သို့)</SelectItem>
                      <SelectItem value="professional">ပရော်ဖက်ရှင်နယ် (လုပ်ငန်းသုံး)</SelectItem>
                      <SelectItem value="humorous">ဟာသရည်ရွယ်သော</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Content Category */}
                <div>
                  <Label htmlFor="contentCategory">အကြောင်းအရာ အမျိုးအစားခွဲ</Label>
                  <Select value={contentCategory} onValueChange={setContentCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="အမျိုးအစားခွဲ ရွေးချယ်ပါ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promotion">ထုတ်ကုန်/ဝန်ဆောင်မှု အရောင်းမြှင့်တင်ခြင်းများ</SelectItem>
                      <SelectItem value="info">သတင်းအချက်အလက် ပေးခြင်း</SelectItem>
                      <SelectItem value="seasonal">ရာသီအလိုက် အကြောင်းအရာများ</SelectItem>
                      <SelectItem value="explainer">ရှင်းပြသော အကြောင်းအရာများ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Product/Service Name */}
              <div>
                <Label htmlFor="productName">ထုတ်ကုန်/ဝန်ဆောင်မှု အမည်</Label>
                <Input
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="ဥပမာ: Golden Restaurant, ABC Technology"
                />
              </div>

              {/* Key Message */}
              <div>
                <Label htmlFor="keyMessage">အဓိကအချက်/အသေးစိတ် အချက်အလက်များ/ခေါင်းစဉ်</Label>
                <Textarea
                  id="keyMessage"
                  value={keyMessage}
                  onChange={(e) => setKeyMessage(e.target.value)}
                  placeholder="ဥပမာ: နံနက် ၆ နာရီမှ ည ၁၀ နာရီ ဖွင့်သည်, အရည်အသွေးမြင့် ဝန်ဆောင်မှု"
                  className="min-h-[100px]"
                />
              </div>

              {/* Target Audience */}
              <div>
                <Label htmlFor="targetAudience">ဦးတည်သော ပရိသတ်</Label>
                <Textarea
                  id="targetAudience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="ဥပမာ: အသက် ၂၀-၄၀ အရွယ် လူငယ်များ, လူလတ်တန်းစား မိသားစုများ"
                />
              </div>

              {/* Keywords */}
              <div>
                <Label htmlFor="keywords">သော့ချက်စကားလုံးများ</Label>
                <Input
                  id="keywords"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="ဥပမာ: အရည်အသွေးမြင့်, စျေးနှုန်းချိုသာ, အမှန်တကယ်"
                />
              </div>

              {/* Facebook Page Link */}
              <div>
                <Label htmlFor="facebookPageLink">လုပ်ငန်း Facebook Page လင့်ခ် (ရေးသားမှုပုံစံ ကိုးကားရန်)</Label>
                <Input
                  id="facebookPageLink"
                  type="url"
                  value={facebookPageLink}
                  onChange={(e) => setFacebookPageLink(e.target.value)}
                  placeholder="https://facebook.com/yourbusinesspage"
                />
              </div>

              {/* Output Controls */}
              <div className="checkbox-group space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeCTA" 
                    checked={includeCTA}
                    onCheckedChange={setIncludeCTA}
                  />
                  <Label htmlFor="includeCTA">Call To Action ထည့်မည်</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeEmojis" 
                    checked={includeEmojis}
                    onCheckedChange={setIncludeEmojis}
                  />
                  <Label htmlFor="includeEmojis">Emoji များ ထည့်မည်</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="includeHashtags" 
                    checked={includeHashtags}
                    onCheckedChange={setIncludeHashtags}
                  />
                  <Label htmlFor="includeHashtags">Hashtag များ ထည့်မည်</Label>
                </div>
              </div>

              {/* Number of Variations */}
              <div>
                <Label htmlFor="numVariations">ပုံစံကွဲ အရေအတွက် (၁-၃)</Label>
                <Input
                  id="numVariations"
                  type="number"
                  min="1"
                  max="3"
                  value={numVariations}
                  onChange={(e) => setNumVariations(Math.max(1, Math.min(3, parseInt(e.target.value) || 1)))}
                />
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerateContent}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-lg"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>ထုတ်ပေးနေသည်...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>✨ ပုံစံကွဲ {numVariations} ခု ဖန်တီးမည်</span>
                  </div>
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}

              {/* Loading Message */}
              {loading && (
                <div className="loading-message text-center text-blue-600 p-4 bg-blue-50 rounded-lg">
                  မြန်မာဘာသာ အကြောင်းအရာများကို ထုတ်ပေးနေပါသည်၊ ကျေးဇူးပြု၍ စောင့်ဆိုင်းပါ။
                </div>
              )}
            </CardContent>
          </Card>

          {/* Output Section */}
          <div className="space-y-6">
            {generatedContent.length > 0 && (
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
            )}

            {/* Quality Assurance Section */}
            {qaMetrics && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
