
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
              onCheckedChange={handleCTAChange}
            />
            <Label htmlFor="includeCTA">Call To Action ထည့်မည်</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeEmojis" 
              checked={includeEmojis}
              onCheckedChange={handleEmojisChange}
            />
            <Label htmlFor="includeEmojis">Emoji များ ထည့်မည်</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="includeHashtags" 
              checked={includeHashtags}
              onCheckedChange={handleHashtagsChange}
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
  );
};

export default ContentFormConfig;
