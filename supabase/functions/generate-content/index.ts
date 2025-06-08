
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface RequestBody {
  platform: string;
  contentType: string;
  contentLength: string;
  objective: string;
  style: string;
  contentCategory: string;
  productName: string;
  keyMessage: string;
  targetAudience: string;
  keywords: string;
  facebookPageLink: string;
  includeCTA: boolean;
  includeEmojis: boolean;
  includeHashtags: boolean;
  numVariations: number;
  userId: string;
}

// Input validation function
function validateInput(body: RequestBody): string | null {
  // Check required fields
  if (!body.contentType || typeof body.contentType !== 'string') {
    return 'Content type is required';
  }
  
  if (!body.contentLength || typeof body.contentLength !== 'string') {
    return 'Content length is required';
  }
  
  if (!body.style || typeof body.style !== 'string') {
    return 'Style is required';
  }
  
  if (!body.userId || typeof body.userId !== 'string') {
    return 'User authentication required';
  }
  
  // Validate numVariations
  if (body.numVariations < 1 || body.numVariations > 3) {
    return 'Number of variations must be between 1 and 3';
  }
  
  // Validate content lengths
  const maxLengths = {
    productName: 200,
    keyMessage: 2000,
    targetAudience: 1000,
    keywords: 500,
    facebookPageLink: 300
  };
  
  if (body.productName && body.productName.length > maxLengths.productName) {
    return `Product name too long (max ${maxLengths.productName} characters)`;
  }
  
  if (body.keyMessage && body.keyMessage.length > maxLengths.keyMessage) {
    return `Key message too long (max ${maxLengths.keyMessage} characters)`;
  }
  
  if (body.targetAudience && body.targetAudience.length > maxLengths.targetAudience) {
    return `Target audience too long (max ${maxLengths.targetAudience} characters)`;
  }
  
  if (body.keywords && body.keywords.length > maxLengths.keywords) {
    return `Keywords too long (max ${maxLengths.keywords} characters)`;
  }
  
  if (body.facebookPageLink && body.facebookPageLink.length > maxLengths.facebookPageLink) {
    return `Facebook page link too long (max ${maxLengths.facebookPageLink} characters)`;
  }
  
  return null;
}

// Sanitize input function
function sanitizeInput(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .trim();
}

// Determine target audience age and content style guidelines
function getContentGuidelines(targetAudience: string, numVariations: number): string {
  const isAdultAudience = targetAudience.toLowerCase().includes('18') || 
                         targetAudience.toLowerCase().includes('လူကြီး') ||
                         targetAudience.toLowerCase().includes('အရွယ်ရောက်');

  const styleVariations = [
    {
      name: "50% ကုန်ပစ္စည်းမြှင့်တင်မှု + 50% အသိပညာ ဝေမျှမှု",
      description: "ထုတ်ကုန်အကြောင်း အတူတူ နှင့် ဗဟုသုတ အတူတူ ပေါင်းစပ်ပြီး ဟန်ချက်ညီညီ ရေးသားပါ"
    },
    {
      name: "30% ကုန်ပစ္စည်းမြှင့်တင်မှု + 70% အသိပညာ ဝေမျှမှု", 
      description: "အသိပညာနှင့် အချက်အလက်များကို အဓိကထား၍ ထုတ်ကုန်ကို သဘာဝကျကျ ထည့်သွင်းရေးသားပါ"
    },
    {
      name: "70% ကုန်ပစ္စည်းမြှင့်တင်မှု + 30% အသိပညာ ဝေမျှမှု",
      description: "ထုတ်ကုန်အရောင်းကို အဓိကထား၍ အနည်းငယ်သော ဗဟုသုတဖြင့် ပံ့ပိုးရေးသားပါ"
    }
  ];

  let guidelines = `
သင်သည် ပရော်ဖက်ရှင်နယ် မြန်မာဘာသာ Social Media Content Writer ဖြစ်သည်။

အောက်ပါ ရေးသားမှုပုံစံ ${numVariations} မျိုးဖြင့် content များရေးပေးပါ:

`;

  // Add style variations based on number requested
  for (let i = 0; i < numVariations; i++) {
    guidelines += `
${i + 1}. ${styleVariations[i].name}:
   ${styleVariations[i].description}

`;
  }

  guidelines += `
တွေ့ဆုံမှု နည်းလမ်းများ:

🎯 Creative Elements (ဖန်တီးမှုဆိုင်ရာ အင်္ဂါရပ်များ):
- စွဲမှတ်ဖွယ်ကောင်းသော စကားလုံးများ အသုံးပြုပါ
- တစ်ခါတစ်ရံ ရယ်စရာကောင်းသော စကားလုံးများ သုံးပါ
- သင့်လျော်သော နာမည်ကြီး ကိုးကားချက်များ ထည့်သွင်းပါ
- လက်ရှိခေတ် လူကြိုက်များသော အကြောင်းအရာများနှင့် ချိတ်ဆက်ပါ (သင့်လျော်မှုရှိလျှင်)
- မြန်မာ့ယဉ်ကျေးမှုနှင့် ညီညွတ်သော ပုံပြင်များ အသုံးပြုပါ
- စိတ်လှုပ်ရှားမှုဖြစ်စေသော အကြောင်းအရာများ ထည့်သွင်းပါ

`;

  if (isAdultAudience) {
    guidelines += `
💕 အရွယ်ရောက်ပြီးသူများအတွက် အပိုအကြောင်းအရာများ:
- ချစ်ခြင်းမေတ္တာ နှင့် အိမ်ထောင်ရေး ဘဝနှင့် သက်ဆိုင်သော အကြောင်းအရာများ
- ထုတ်ကုန်/ဝန်ဆောင်မှုကို အချစ်ရေး သို့မဟုတ် မိသားစုဘဝနှင့် ချိတ်ဆက်ပြီး ရေးသားပါ
- ရင့်ကျက်သော ချစ်ခြင်းမေတ္တာ အကြောင်းအရာများ

`;
  }

  guidelines += `
🎨 နောက်ထပ် အခြေအနေများ:
- ပွဲတော်များနှင့် အထူးနေ့များ (သင့်လျော်မှုရှိလျှင်)
- လူ့အဖွဲ့အစည်း ကိစ္စရပ်များနှင့် ချိတ်ဆက်မှု
- နည်းပညာ တိုးတက်မှုများနှင့် ကိုက်ညီမှု
- ပတ်ဝန်းကျင် ထိန်းသိမ်းမှု အကြောင်းအရာများ
- ကျန်းမာရေး နှင့် အားကစား အကြောင်းအရာများ
- ပညာရေး နှင့် ကျွမ်းကျင်မှု ဖွံ့ဖြိုးတိုးတက်မှု
- စီးပွားရေး နှင့် အလုပ်အကိုင် ဆိုင်ရာ အကြောင်းအရာများ

📝 အရေးကြီးသော ညွှန်ကြားချက်များ:
1. သဘာဝကျကျ မြန်မာဘာသာ အသုံးပြုပါ
2. Cultural context နှင့် သင့်လျော်အောင် ရေးပါ
3. Platform နှင့် သင့်လျော်သော format ဖြစ်အောင် ရေးပါ
4. ပရိသတ်ကို ဆွဲဆောင်ရန် နှင့် ပါဝင်လိုစိတ်ဖြစ်စေရန်
5. အကြောင်းအရာများကို မြန်မာ့ယဉ်ကျေးမှုနှင့် ညီညွတ်အောင် ရေးပါ

`;

  return guidelines;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Verify user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const body: RequestBody = await req.json();
    
    // Validate user ID matches authenticated user
    if (body.userId !== user.id) {
      throw new Error('User ID mismatch');
    }
    
    // Validate input
    const validationError = validateInput(body);
    if (validationError) {
      throw new Error(validationError);
    }

    // Sanitize text inputs
    const sanitizedBody = {
      ...body,
      productName: body.productName ? sanitizeInput(body.productName) : '',
      keyMessage: body.keyMessage ? sanitizeInput(body.keyMessage) : '',
      targetAudience: body.targetAudience ? sanitizeInput(body.targetAudience) : '',
      keywords: body.keywords ? sanitizeInput(body.keywords) : '',
      facebookPageLink: body.facebookPageLink ? sanitizeInput(body.facebookPageLink) : '',
    };

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Get content guidelines based on audience and variations
    const contentGuidelines = getContentGuidelines(sanitizedBody.targetAudience, sanitizedBody.numVariations);

    // Construct detailed prompt with professional ad content structure
    const prompt = `${contentGuidelines}

လက်ရှိ တောင်းဆိုမှု အချက်အလက်များ:

Platform: ${sanitizedBody.platform || 'မသတ်မှတ်ထားပါ'}
Content Type: ${sanitizedBody.contentType}
Content Length: ${sanitizedBody.contentLength}
Objective: ${sanitizedBody.objective || 'မသတ်မှတ်ထားပါ'}
Style/Tone: ${sanitizedBody.style}
Content Category: ${sanitizedBody.contentCategory}
Product/Service Name: ${sanitizedBody.productName || 'မရှိပါ'}
Key Message/Details: ${sanitizedBody.keyMessage || 'မရှိပါ'}
Target Audience: ${sanitizedBody.targetAudience || 'ယေဘုယျ လူထု'}
Keywords: ${sanitizedBody.keywords || 'မရှိပါ'}
Facebook Page Link: ${sanitizedBody.facebookPageLink || 'မရှိပါ'}
Include CTA: ${sanitizedBody.includeCTA ? 'ပါဝင်မည်' : 'မပါဝင်ပါ'}
Include Emojis: ${sanitizedBody.includeEmojis ? 'ပါဝင်မည်' : 'မပါဝင်ပါ'}
Include Hashtags: ${sanitizedBody.includeHashtags ? 'ပါဝင်မည်' : 'မပါဝင်ပါ'}
Number of Variations: ${sanitizedBody.numVariations}

ကျေးဇူးပြု၍ ${sanitizedBody.numVariations} ခုသော မတူညီသော content variations များကို အထက်ပါ ပရော်ဖက်ရှင်နယ် ရေးသားမှုပုံစံများဖြင့် ရေးပေးပါ။ 

တစ်ခုစီကို "===VARIATION_START===" နှင့် "===VARIATION_END===" ဖြင့် ပိုင်းခြားပေးပါ။

မြန်မာဘာသာဖြင့်သာ response ပေးပါ။`;

    console.log('Sending request to Gemini API with enhanced professional prompt...');
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received response from Gemini API');
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Parse variations
    const variations: string[] = [];
    const variationRegex = /===VARIATION_START===([\s\S]*?)===VARIATION_END===/g;
    let match;
    
    while ((match = variationRegex.exec(generatedText)) !== null) {
      variations.push(match[1].trim());
    }
    
    // If no variations found, split by common separators or use the full text
    if (variations.length === 0) {
      const fallbackSeparators = ['---', '***', '###', '\n\n\n'];
      let splitText = [generatedText];
      
      for (const separator of fallbackSeparators) {
        if (generatedText.includes(separator)) {
          splitText = generatedText.split(separator).map(v => v.trim()).filter(v => v.length > 10);
          break;
        }
      }
      
      variations.push(...splitText.slice(0, sanitizedBody.numVariations));
    }
    
    // Ensure we have the requested number of variations
    while (variations.length < sanitizedBody.numVariations && variations.length > 0) {
      variations.push(variations[0]); // Duplicate the first if needed
    }
    
    const finalVariations = variations.slice(0, sanitizedBody.numVariations);

    console.log(`Generated ${finalVariations.length} professional ad content variations`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        variations: finalVariations,
        userId: user.id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'An unexpected error occurred' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 400 
      }
    );
  }
});
