
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, AlertCircle } from "lucide-react";

interface ContentFormConfigProps {
  platform: string;
  setPlatform: (value: string) => void;
  contentType: string;
  setContentType: (value: string) => void;
  contentLength: string;
  setContentLength: (value: string) => void;
  objective: string;
  setObjective: (value: string) => void;
  style: string;
  setStyle: (value: string) => void;
  contentCategory: string;
  setContentCategory: (value: string) => void;
  productName: string;
  setProductName: (value: string) => void;
  keyMessage: string;
  setKeyMessage: (value: string) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  facebookPageLink: string;
  setFacebookPageLink: (value: string) => void;
  includeCTA: boolean;
  includeEmojis: boolean;
  includeHashtags: boolean;
  handleCTAChange: (checked: boolean | "indeterminate") => void;
  handleEmojisChange: (checked: boolean | "indeterminate") => void;
  handleHashtagsChange: (checked: boolean | "indeterminate") => void;
  numVariations: number;
  setNumVariations: (value: number) => void;
  handleGenerateContent: () => void;
  loading: boolean;
  error: string;
}

const ContentFormConfig: React.FC<ContentFormConfigProps> = ({
  platform,
  setPlatform,
  contentType,
  setContentType,
  contentLength,
  setContentLength,
  objective,
  setObjective,
  style,
  setStyle,
  contentCategory,
  setContentCategory,
  productName,
  setProductName,
  keyMessage,
  setKeyMessage,
  targetAudience,
  setTargetAudience,
  keywords,
  setKeywords,
  facebookPageLink,
  setFacebookPageLink,
  includeCTA,
  includeEmojis,
  includeHashtags,
  handleCTAChange,
  handleEmojisChange,
  handleHashtagsChange,
  numVariations,
  setNumVariations,
  handleGenerateContent,
  loading,
  error
}) => {
  // Platform-specific content types
  const contentTypes: Record<string, string[]> = {
    facebook: ['Post (စာသား၊ မာလ်တီမီဒီယာ)', 'Event အကြောင်းကြားစာ', 'ကုန်ပစ္စည်း မိတ်ဆက်မှု'],
    tiktok: ['ဗီဒီယို ဇာတ်ညွှန်း', 'Challenge အကြောင်းအရာ', 'Trending အကြောင်းအရာ'],
    youtube: ['ဗီဒီယို ခေါင်းစဉ်နှင့် ဖော်ပြချက်', 'Shorts အကြောင်းအရာ', 'Tutorial ဇာတ်ညွှန်း'],
    telegram: ['Channel Post', 'အုပ်စု မက်ဆေ့ချ်', 'သတင်းအချက်အလက်'],
    instagram: ['Post Caption', 'Story အကြောင်းအရာ', 'Reel ဇာတ်ညွှန်း']
  };

  return (
    <Card className="shadow-2xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 backdrop-blur-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold flex items-center gap-3">
          <Sparkles className="h-6 w-6" />
          အකြောင်းအရာ ပြင်ဆင်ချက်များ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <div className="form-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Selection */}
          <div className="space-y-3">
            <Label htmlFor="platform" className="text-lg font-semibold text-gray-700">Platform ရွေးချယ်ပါ</Label>
            <Select value={platform} onValueChange={(value) => {
              setPlatform(value);
              setContentType('');
            }}>
              <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80">
                <SelectValue placeholder="Platform ရွေးချယ်ပါ" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200 shadow-xl">
                <SelectItem value="facebook" className="text-lg py-3">📘 Facebook</SelectItem>
                <SelectItem value="tiktok" className="text-lg py-3">🎵 TikTok</SelectItem>
                <SelectItem value="youtube" className="text-lg py-3">📺 YouTube</SelectItem>
                <SelectItem value="telegram" className="text-lg py-3">✈️ Telegram</SelectItem>
                <SelectItem value="instagram" className="text-lg py-3">📷 Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Type */}
          <div className="space-y-3">
            <Label htmlFor="contentType" className="text-lg font-semibold text-gray-700">အကြောင်းအရာ အမျိုးအစား</Label>
            <Select value={contentType} onValueChange={setContentType} disabled={!platform}>
              <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80">
                <SelectValue placeholder="အမျိုးအစား ရွေးချယ်ပါ" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200 shadow-xl">
                {platform && contentTypes[platform]?.map((type) => (
                  <SelectItem key={type} value={type} className="text-lg py-3">{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Content Length */}
          <div className="space-y-3">
            <Label htmlFor="contentLength" className="text-lg font-semibold text-gray-700">ပိုစ့်အတို/အရှည်</Label>
            <Select value={contentLength} onValueChange={setContentLength}>
              <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80">
                <SelectValue placeholder="အလျား ရွေးချယ်ပါ" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200 shadow-xl">
                <SelectItem value="concise" className="text-lg py-3">📝 အတိုချုပ် / တို</SelectItem>
                <SelectItem value="standard" className="text-lg py-3">📄 ပုံမှန် / အလယ်အလတ်</SelectItem>
                <SelectItem value="detailed" className="text-lg py-3">📋 အသေးစိတ် / ရှည်</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Objective */}
          <div className="space-y-3">
            <Label htmlFor="objective" className="text-lg font-semibold text-gray-700">ရည်ရွယ်ချက်/ရည်မှန်းချက်</Label>
            <Select value={objective} onValueChange={setObjective}>
              <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80">
                <SelectValue placeholder="ရည်ရွယ်ချက် ရွေးချယ်ပါ" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200 shadow-xl">
                <SelectItem value="brand-awareness" className="text-lg py-3">🏢 ကုန်အမှတ်တံဆိပ် သိရှိစေခြင်း</SelectItem>
                <SelectItem value="lead-generation" className="text-lg py-3">🎯 ဖောက်သည် ရှာဖွေခြင်း</SelectItem>
                <SelectItem value="sales" className="text-lg py-3">💰 ရောင်းချခြင်း</SelectItem>
                <SelectItem value="engagement" className="text-lg py-3">❤️ ထိတွေ့ဆက်ဆံမှု တိုးမြင့်ခြင်း</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Style */}
          <div className="space-y-3">
            <Label htmlFor="style" className="text-lg font-semibold text-gray-700">ရေးသားမှု ပုံစံ</Label>
            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80">
                <SelectValue placeholder="ပုံစံ ရွေးချယ်ပါ" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200 shadow-xl">
                <SelectItem value="polite" className="text-lg py-3">🎩 ယဉ်ကျေးသော (တရားဝင် မြန်မာစကား)</SelectItem>
                <SelectItem value="friendly" className="text-lg py-3">😊 ဖော်ရွေသော (သူငယ်ချင်းကဲ့သို့)</SelectItem>
                <SelectItem value="professional" className="text-lg py-3">💼 ပရော်ဖက်ရှင်နယ် (လုပ်ငန်းသုံး)</SelectItem>
                <SelectItem value="humorous" className="text-lg py-3">😄 ဟာသရည်ရွယ်သော</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content Category */}
          <div className="space-y-3">
            <Label htmlFor="contentCategory" className="text-lg font-semibold text-gray-700">အကြောင်းအရာ အမျိုးအစားခွဲ</Label>
            <Select value={contentCategory} onValueChange={setContentCategory}>
              <SelectTrigger className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80">
                <SelectValue placeholder="အမျိုးအစားခွဲ ရွေးချယ်ပါ" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-blue-200 shadow-xl">
                <SelectItem value="promotion" className="text-lg py-3">🚀 ထုတ်ကုန်/ဝန်ဆောင်မှု အရောင်းမြှင့်တင်ခြင်းများ</SelectItem>
                <SelectItem value="info" className="text-lg py-3">📢 သတင်းအချက်အလက် ပေးခြင်း</SelectItem>
                <SelectItem value="seasonal" className="text-lg py-3">🌸 ရာသီအလိုက် အကြောင်းအရာများ</SelectItem>
                <SelectItem value="explainer" className="text-lg py-3">💡 ရှင်းပြသော အကြောင်းအရာများ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Product/Service Name */}
        <div className="space-y-3">
          <Label htmlFor="productName" className="text-lg font-semibold text-gray-700">ထုတ်ကုန်/ဝန်ဆောင်မှု အမည်</Label>
          <Input
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="ဥပမာ: Golden Restaurant, ABC Technology"
            className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80"
          />
        </div>

        {/* Key Message */}
        <div className="space-y-3">
          <Label htmlFor="keyMessage" className="text-lg font-semibold text-gray-700">အဓိကအချက်/အသေးစိတ် အချက်အလက်များ/ခေါင်းစဉ်</Label>
          <Textarea
            id="keyMessage"
            value={keyMessage}
            onChange={(e) => setKeyMessage(e.target.value)}
            placeholder="ဥပမာ: နံနက် ၆ နာရီမှ ည ၁၀ နာရီ ဖွင့်သည်, အရည်အသွေးမြင့် ဝန်ဆောင်မှု"
            className="min-h-[120px] text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80 resize-none"
          />
        </div>

        {/* Target Audience */}
        <div className="space-y-3">
          <Label htmlFor="targetAudience" className="text-lg font-semibold text-gray-700">ဦးတည်သော ပရိသတ်</Label>
          <Textarea
            id="targetAudience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            placeholder="ဥပမာ: အသက် ၂၀-၄၀ အရွယ် လူငယ်များ, လူလတ်တန်းစား မိသားစုများ"
            className="min-h-[100px] text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80 resize-none"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-3">
          <Label htmlFor="keywords" className="text-lg font-semibold text-gray-700">ပေါ်လွင်စေလိုသောစကားလုံးများ</Label>
          <Input
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="ဥပမာ: အရည်အသွေးမြင့်, စျေးနှုန်းချိုသာ, အမှန်တကယ်"
            className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80"
          />
        </div>

        {/* Facebook Page Link */}
        <div className="space-y-3">
          <Label htmlFor="facebookPageLink" className="text-lg font-semibold text-gray-700">လုပ်ငန်း Facebook Page လင့်ခ် (ရေးသားမှုပုံစံ ကိုးကားရန်)</Label>
          <Input
            id="facebookPageLink"
            type="url"
            value={facebookPageLink}
            onChange={(e) => setFacebookPageLink(e.target.value)}
            placeholder="https://facebook.com/yourbusinesspage"
            className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80"
          />
        </div>

        {/* Output Controls */}
        <div className="checkbox-group space-y-4 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-100">
          <h3 className="text-xl font-bold text-gray-700 mb-4">⚙️ အပိုဆောင်းများ</h3>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="includeCTA" 
              checked={includeCTA}
              onCheckedChange={handleCTAChange}
              className="w-5 h-5"
            />
            <Label htmlFor="includeCTA" className="text-lg font-medium">📢 Call To Action ထည့်မည်</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="includeEmojis" 
              checked={includeEmojis}
              onCheckedChange={handleEmojisChange}
              className="w-5 h-5"
            />
            <Label htmlFor="includeEmojis" className="text-lg font-medium">😊 Emoji များ ထည့်မည်</Label>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox 
              id="includeHashtags" 
              checked={includeHashtags}
              onCheckedChange={handleHashtagsChange}
              className="w-5 h-5"
            />
            <Label htmlFor="includeHashtags" className="text-lg font-medium"># Hashtag များ ထည့်မည်</Label>
          </div>
        </div>

        {/* Number of Variations */}
        <div className="space-y-3">
          <Label htmlFor="numVariations" className="text-lg font-semibold text-gray-700">🔄 ပုံစံကွဲ အရေအတွက် (၁-၃)</Label>
          <Input
            id="numVariations"
            type="number"
            min="1"
            max="3"
            value={numVariations}
            onChange={(e) => setNumVariations(Math.max(1, Math.min(3, parseInt(e.target.value) || 1)))}
            className="h-12 text-lg border-2 border-blue-200 focus:border-blue-500 bg-white/80"
          />
        </div>

        {/* Generate Button */}
        <Button 
          onClick={handleGenerateContent}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white py-6 text-xl font-bold shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              <span>ထုတ်ပေးနေသည်...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Sparkles className="h-6 w-6" />
              <span>✨ ပုံစံကွဲ {numVariations} ခု ဖန်တီးမည်</span>
            </div>
          )}
        </Button>

        {/* Error Message */}
        {error && (
          <Alert className="border-red-300 bg-red-50 shadow-lg">
            <AlertCircle className="h-5 w-5" />
            <AlertDescription className="text-red-800 text-lg">{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading Message */}
        {loading && (
          <div className="loading-message text-center text-blue-700 p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-2 border-blue-200 shadow-lg">
            <div className="text-xl font-semibold">
              🤖 မြန်မာဘာသာ အကြောင်းအရာများကို ထုတ်ပေးနေပါသည်၊ ကျေးဇူးပြု၍ စောင့်ဆိုင်းပါ။
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentFormConfig;
