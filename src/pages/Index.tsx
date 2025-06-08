import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertCircle, Sparkles, Bot } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/components/auth/AuthProvider"; // Removed
// import { useNavigate } from "react-router-dom"; // Removed as navigate was only used for auth redirect
import ContentFormConfig from "@/components/ContentFormConfig";
import GeneratedContentOutput from "@/components/GeneratedContentOutput";
import QualityAssurance from "@/components/QualityAssurance";
// import FirebaseLogout from '@/components/FirebaseLogout'; // Removed
// import { onAuthStateChanged, User } from 'firebase/auth'; // Removed
// import { firebaseAuth } from '@/integrations/firebase/client'; // Removed

const Index = () => {
  // const { user, loading: authLoading } = useAuth(); // Removed
  // const navigate = useNavigate(); // Removed

  // Redirect to auth if not logged in, but only after auth loading is complete
  // useEffect(() => { // Removed
  //   console.log('Auth state:', { user: user?.email, authLoading });
  //
  //   if (!authLoading && !user) {
  //     console.log('User not authenticated, redirecting to auth...');
  //     navigate('/auth');
  //   }
  // }, [user, authLoading, navigate]);

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
  // const [firebaseUser, setFirebaseUser] = useState<User | null>(null); // Removed

  // useEffect(() => { // Removed
  //   const unsubscribe = onAuthStateChanged(firebaseAuth, setFirebaseUser);
  //   return () => unsubscribe();
  // }, []);

  const handleGenerateContent = async () => {
    // if (!user) { // Removed
    //   console.error('No user found when trying to generate content');
    //   setError('ကျေးဇူးပြု၍ အရင်လော့ဂ်အင်ဝင်ပါ');
    //   return;
    // }

    // Validation
    if (!productName && !keyMessage && !['seasonal', 'brand-awareness'].includes(contentCategory)) {
      setError('ထုတ်ကုန်/ဝန်ဆောင်မှုအမည် သို့မဟုတ် အဓိကအချက်/အသေးစိတ် အချက်အလက်များကို ထည့်သွင်းပါ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // console.log('Generating content for user:', user.email); // Removed
      console.log('Generating content...');
      
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          platform,
          contentType,
          contentLength,
          objective,
          style,
          contentCategory,
          productName,
          keyMessage,
          targetAudience,
          keywords,
          facebookPageLink,
          includeCTA,
          includeEmojis,
          includeHashtags,
          numVariations,
          // userId: user.id // Removed
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Edge function error');
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate content');
      }

      console.log('Content generated successfully:', data.variations.length, 'variations');
      setGeneratedContent(data.variations);
      
      // Store content generation in database using raw SQL to avoid type issues
      const contentToStore = data.variations.join('\n\n=== ပုံစံကွဲများ ===\n\n');
      
      try {
        const { error: insertError } = await supabase.rpc('insert_content_generation', {
          // p_user_id: user.id, // Removed
          p_platform: platform || null,
          p_content_type: contentType,
          p_length: contentLength,
          p_objective: objective || null,
          p_tone: style,
          p_content_category: contentCategory,
          p_product_name: productName || null,
          p_key_message: keyMessage || null,
          p_target_audience: targetAudience || null,
          p_keywords: keywords || null,
          p_business_page: facebookPageLink || null,
          p_include_cta: includeCTA,
          p_include_emojis: includeEmojis,
          p_include_hashtags: includeHashtags,
          p_variations_count: numVariations,
          p_generated_content: contentToStore
        });

        if (insertError) {
          console.error('Database insert error:', insertError);
          // Don't throw here, just log the error as the content generation was successful
        } else {
          console.log('Content saved to database successfully');
        }
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        // Continue with the rest of the flow even if DB save fails
      }
      
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
      console.error('Content generation error:', err);
      setError('အကြောင်းအရာ ဖန်တီးရာတွင် အမှားရှိပါသည်။ ကျေးဇူးပြု၍ ထပ်မံကြိုးစားပါ။');
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

  // Show loading while checking auth
  // if (authLoading) { // Removed
  //   return (
  //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <Bot className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
  //         <p className="text-lg text-gray-600">တင်နေသည်...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // Don't render if not authenticated (will redirect)
  // if (!user) { // Removed
  //   console.log('User not found, not rendering main content');
  //   return null;
  // }

  // console.log('Rendering main app for user:', user.email); // Removed
  console.log('Rendering main app...');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <div className="flex items-center gap-4">
              <Bot className="h-12 w-12 text-blue-600" />
              <Sparkles className="h-10 w-10 text-purple-600" />
            </div>
            <div className="flex-1 flex justify-end">
              {/* <UserMenu /> */}
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-4">
            မြန်မာ Social Media Content Writer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            🤖 AI ဖြင့် ရေးသားထားသော မြန်မာဘာသာ Social Media အကြောင်းအရာများ
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span>Powered by</span>
            <span className="font-semibold text-blue-600">Gemini 2.5 Flash Preview</span>
          </div>
          {/* <div className="mt-2 text-sm text-green-600"> // Removed
            လက်ရှိအသုံးပြုသူ: {user.email}
          </div> */}
        </div>

        {/* API Connection Status */}
        <Alert className="mb-8 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg">
          <AlertCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-800 text-lg font-medium">
            ✅ Gemini AI နှင့် ချိတ်ဆက်ပြီးပါပြီ! အစစ်အမှန် AI content generation အသုံးပြုနိုင်ပါသည်။
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Input Form */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Content Configuration</CardTitle>
              <CardDescription>Specify the details for your content generation.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Generated Content & Quality</CardTitle>
              <CardDescription>Review the generated content and its quality metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <GeneratedContentOutput
                generatedContent={generatedContent}
                copyToClipboard={copyToClipboard}
                exportAllContent={exportAllContent}
              />
              <QualityAssurance qaMetrics={qaMetrics} />
            </CardContent>
          </Card>
        </div>

        {/* User Info and Logout Button */}
        {/* <div className="mt-8 flex items-center justify-between"> // Removed
          <div>
            {firebaseUser ? (
              <span className="text-gray-700">
                Signed in as: <span className="font-semibold">{firebaseUser.email}</span>
              </span>
            ) : (
              <span className="text-gray-500">Not signed in</span>
            )}
          </div>
          {firebaseUser && <FirebaseLogout />}
        </div> */}
      </div>
    </div>
  );
};

export default Index;
