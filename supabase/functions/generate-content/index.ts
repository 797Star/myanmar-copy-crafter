import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://deno.land/x/supabase_js@2.39.7/mod.ts";

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
  userId?: string; // Made optional
}

function validateInput(body: RequestBody): string | null {
  if (!body.contentType || typeof body.contentType !== 'string') return 'Content type is required';
  if (!body.contentLength || typeof body.contentLength !== 'string') return 'Content length is required';
  if (!body.style || typeof body.style !== 'string') return 'Style is required';
  // if (!body.userId || typeof body.userId !== 'string') return 'User authentication required'; // Removed
  if (body.numVariations < 1 || body.numVariations > 3) return 'Number of variations must be between 1 and 3';
  const maxLengths = { productName: 200, keyMessage: 2000, targetAudience: 1000, keywords: 500, facebookPageLink: 300 };
  if (body.productName && body.productName.length > maxLengths.productName) return `Product name too long (max ${maxLengths.productName} characters)`;
  if (body.keyMessage && body.keyMessage.length > maxLengths.keyMessage) return `Key message too long (max ${maxLengths.keyMessage} characters)`;
  if (body.targetAudience && body.targetAudience.length > maxLengths.targetAudience) return `Target audience too long (max ${maxLengths.targetAudience} characters)`;
  if (body.keywords && body.keywords.length > maxLengths.keywords) return `Keywords too long (max ${maxLengths.keywords} characters)`;
  if (body.facebookPageLink && body.facebookPageLink.length > maxLengths.facebookPageLink) return `Facebook page link too long (max ${maxLengths.facebookPageLink} characters)`;
  return null;
}

function sanitizeInput(text: string): string {
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').replace(/<[^>]+>/g, '').trim();
}

function getContentGuidelines(targetAudience: string, numVariations: number): string {
  const isAdultAudience = targetAudience.toLowerCase().includes('18') || targetAudience.toLowerCase().includes('လူကြီး') || targetAudience.toLowerCase().includes('အရွယ်ရောက်');
  const styleVariations = [
    { name: "50% ကုန်ပစ္စည်းမြှင့်တင်မှု + 50% အသိပညာ ဝေမျှမှု", description: "ထုတ်ကုန်အကြောင်း အတူတူ နှင့် ဗဟုသုတ အတူတူ ပေါင်းစပ်ပြီး ဟန်ချက်ညီညီ ရေးသားပါ" },
    { name: "30% ကုန်ပစ္စည်းမြှင့်တင်မှု + 70% အသိပညာ ဝေမျှမှု", description: "အသိပညာနှင့် အချက်အလက်များကို အဓိကထား၍ ထုတ်ကုန်ကို သဘာဝကျကျ ထည့်သွင်းရေးသားပါ" },
    { name: "70% ကုန်ပစ္စည်းမြှင့်တင်မှု + 30% အသိပညာ ဝေမျှမှု", description: "ထုတ်ကုန်အရောင်းကို အဓိကထား၍ အနည်းငယ်သော ဗဟုသုတဖြင့် ပံ့ပိုးရေးသားပါ" }
  ];
  let guidelines = `\nသင်သည် ပရော်ဖက်ရှင်နယ် မြန်မာဘာသာ Social Media Content Writer ဖြစ်သည်။\n\nအောက်ပါ ရေးသားမှုပုံစံ ${numVariations} မျိုးဖြင့် content များရေးပေးပါ:\n`;
  for (let i = 0; i < numVariations; i++) {
    guidelines += `\n${i + 1}. ${styleVariations[i].name}:\n   ${styleVariations[i].description}\n`;
  }
  guidelines += `\nတွေ့ဆုံမှု နည်းလမ်းများ:\n\n🎯 Creative Elements (ဖန်တီးမှုဆိုင်ရာ အင်္ဂါရပ်များ):\n- စွဲမှတ်ဖွယ်ကောင်းသော စကားလုံးများ အသုံးပြုပါ\n- တစ်ခါတစ်ရံ ရယ်စရာကောင်းသော စကားလုံးများ သုံးပါ\n- သင့်လျော်သော နာမည်ကြီး ကိုးကားချက်များ ထည့်သွင်းပါ\n- လက်ရှိခေတ် လူကြိုက်များသော အကြောင်းအရာများနှင့် ချိတ်ဆက်ပါ (သင့်လျော်မှုရှိလျှင်)\n- မြန်မာ့ယဉ်ကျေးမှုနှင့် ညီညွတ်သော ပုံပြင်များ အသုံးပြုပါ\n- စိတ်လှုပ်ရှားမှုဖြစ်စေသော အကြောင်းအရာများ ထည့်သွင်းပါ\n`;
  if (isAdultAudience) {
    guidelines += `\n💕 အရွယ်ရောက်ပြီးသူများအတွက် အပိုအကြောင်းအရာများ:\n- ချစ်ခြင်းမေတ္တာ နှင့် အိမ်ထောင်ရေး ဘဝနှင့် သက်ဆိုင်သော အကြောင်းအရာများ\n- ထုတ်ကုန်/ဝန်ဆောင်မှုကို အချစ်ရေး သို့မဟုတ် မိသားစုဘဝနှင့် ချိတ်ဆက်ပြီး ရေးသားပါ\n- ရင့်ကျက်သော ချစ်ခြင်းမေတ္တာ အကြောင်းအရာများ\n`;
  }
  guidelines += `\n🎨 နောက်ထပ် အခြေအနေနှင့်:\n- ပွဲတော်များနှင့် အထူးနေ့များ (သင့်လျော်မှုရှိလျှင်)\n- လူ့အဖွဲ့အစည်း ကိစ္စရပ်များနှင့် ချိတ်ဆက်မှု\n- နည်းပညာ တိုးတက်မှုများနှင့် ကိုက်ညီမှု\n- ပတ်ဝန်းကျင် ထိန်းသိမ်းမှု အကြောင်းအရာများ\n- ကျန်းမာရေး နှင့် အားကစား အကြောင်းအရာများ\n- ပညာရေး နှင့် ကျွမ်းကျင်မှု ဖွံ့ဖြိုးတိုးတက်မှု\n- စီးပွားရေး နှင့် အလုပ်အကိုင် ဆိုင်ရာ အကြောင်းအရာများ\n\n📝 အရေးကြီးသော ညွှန်ကြားချက်များ:\n1. သဘာဝကျကျ မြန်မာဘာသာ အသုံးပြုပါ\n2. Cultural context နှင့် သင့်လျော်အောင် ရေးပါ\n3. Platform နှင့် သင့်လျော်သော format ဖြစ်အောင် ရေးပါ\n4. ပရိသတ်ကို ဆွဲဆောင်ရန် နှင့် ပါဝင်လိုစိတ်ဖြစ်စေရန်\n5. အကြောင်းအရာများကို မြန်မာ့ယဉ်ကျေးမှုနှင့် ညီညွတ်အောင် ရေးပါ\n`;
  return guidelines;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }
  try {
    const GEMINI_TIMEOUT_MS = 12000; // 12 seconds

    // Auth check - REMOVED BLOCK
    // const authHeader = req.headers.get('Authorization') || req.headers.get('authorization');
    // if (!authHeader) throw new Error('Authorization header required');
    // const supabaseClient = createClient(
    //   (typeof globalThis !== "undefined" && typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno.env.get('SUPABASE_URL')) || process.env.SUPABASE_URL || '',
    //   (typeof globalThis !== "undefined" && typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno.env.get('SUPABASE_ANON_KEY')) || process.env.SUPABASE_ANON_KEY || '',
    //   { global: { headers: { Authorization: authHeader } } }
    // );
    // const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    // if (authError || !user) throw new Error('User not authenticated');

    const body: RequestBody = await req.json();
    // if (body.userId !== user.id) throw new Error('User ID mismatch'); // Removed, user object no longer exists here
    const validationError = validateInput(body);
    if (validationError) throw new Error(validationError);
    const sanitizedBody = {
      ...body,
      productName: body.productName ? sanitizeInput(body.productName) : '',
      keyMessage: body.keyMessage ? sanitizeInput(body.keyMessage) : '',
      targetAudience: body.targetAudience ? sanitizeInput(body.targetAudience) : '',
      keywords: body.keywords ? sanitizeInput(body.keywords) : '',
      facebookPageLink: body.facebookPageLink ? sanitizeInput(body.facebookPageLink) : '',
    };
    const GEMINI_API_KEY = (typeof globalThis !== "undefined" && typeof (globalThis as any).Deno !== "undefined" && (globalThis as any).Deno.env.get('GEMINI_API_KEY')) || process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error('Gemini API key not configured');
    const contentGuidelines = getContentGuidelines(sanitizedBody.targetAudience, sanitizedBody.numVariations);
    const prompt = `${contentGuidelines}\n\nလက်ရှိ တောင်းဆိုမှု အချက်အလက်များ:\n\nPlatform: ${sanitizedBody.platform || 'မသတ်မှတ်ထားပါ'}\nContent Type: ${sanitizedBody.contentType}\nContent Length: ${sanitizedBody.contentLength}\nObjective: ${sanitizedBody.objective || 'မသတ်မှတ်ထားပါ'}\nStyle/Tone: ${sanitizedBody.style}\nContent Category: ${sanitizedBody.contentCategory}\nProduct/Service Name: ${sanitizedBody.productName || 'မရှိပါ'}\nKey Message/Details: ${sanitizedBody.keyMessage || 'မရှိပါ'}\nTarget Audience: ${sanitizedBody.targetAudience || 'ယေဘုယျ လူထု'}\nKeywords: ${sanitizedBody.keywords || 'မရှိပါ'}\nFacebook Page Link: ${sanitizedBody.facebookPageLink || 'မရှိပါ'}\nInclude CTA: ${sanitizedBody.includeCTA ? 'ပါဝင်မည်' : 'မပါဝင်ပါ'}\nInclude Emojis: ${sanitizedBody.includeEmojis ? 'ပါဝင်မည်' : 'မပါဝင်ပါ'}\nInclude Hashtags: ${sanitizedBody.includeHashtags ? 'ပါဝင်မည်' : 'မပါဝင်ပါ'}\nNumber of Variations: ${sanitizedBody.numVariations}\n\nကျေးဇူးပြု၍ ${sanitizedBody.numVariations} ခုသော မတူညီသော content variations များကို အထက်ပါ ပရော်ဖက်ရှင်နယ် ရေးသားမှုပုံစံများဖြင့် ရေးပေးပါ။ \n\nတစ်ခုစီကို "===VARIATION_START===" နှင့် "===VARIATION_END===" ဖြင့် ပိုင်းခြားပေးပါ။\n\nမြန်မာဘာသာဖြင့်သာ response ပေးပါ။`;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Gemini API call timed out')), GEMINI_TIMEOUT_MS)
    );

    const fetchPromise = fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, topK: 40, topP: 0.95, maxOutputTokens: 2048 }
      })
    });

    // Typecasting response to 'any' initially because Promise.race returns Promise<any>
    // and then we'll check its properties. Or ensure timeoutPromise resolves to a Response-like error structure.
    // However, since timeoutPromise rejects, 'response' will be the actual Response if fetch wins.
    const response: Response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      let errorDetail = `Gemini API error: ${response.status}`;
      try {
        // Only try to read text if response is a Response object and not an error from timeout
        if (response instanceof Response) {
          const errorText = await response.text();
          errorDetail += ` - ${errorText}`;
        }
      } catch (textError) {
        // Ignore if cannot read text, primary error is status or timeout message
      }
      throw new Error(errorDetail);
    }

    const data = await response.json();
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) throw new Error('Invalid response from Gemini API');
    const generatedText = data.candidates[0].content.parts[0].text;
    // Parse variations
    const variations: string[] = [];
    const variationRegex = /===VARIATION_START===([\s\S]*?)===VARIATION_END===/g;
    let match;
    while ((match = variationRegex.exec(generatedText)) !== null) {
      variations.push(match[1].trim());
    }
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
    while (variations.length < sanitizedBody.numVariations && variations.length > 0) {
      variations.push(variations[0]);
    }
    const finalVariations = variations.slice(0, sanitizedBody.numVariations);
    return new Response(
      JSON.stringify({ success: true, variations: finalVariations }), // Removed userId from response
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});

interface ContentRequest {
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
  includeCTA: boolean;
  includeEmojis: boolean;
  includeHashtags: boolean;
  numVariations: number;
}

function buildPrompt(request: ContentRequest): string {
  const {
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
    includeCTA,
    includeEmojis,
    includeHashtags,
    numVariations
  } = request

  return `သင်သည် မြန်မာဘာသာ Social Media Content Writer ဖြစ်သည်။ အောက်ပါ အချက်အလက်များအရ ${numVariations} ခု ပုံစံကွဲများ ဖန်တီးပါ:

Platform: ${platform}
Content Type: ${contentType}
အလျား: ${contentLength}
ရည်ရွယ်ချက်: ${objective}
ရေးသားမှုပုံစံ: ${style}
အမျိုးအစားခွဲ: ${contentCategory}
${productName ? `ထုတ်ကုန်/ဝန်ဆောင်မှု: ${productName}` : ''}
${keyMessage ? `အဓိကအချက်: ${keyMessage}` : ''}
${targetAudience ? `ဦးတည်ပရိသတ်: ${targetAudience}` : ''}
${keywords ? `သော့ချက်စကားလုံးများ: ${keywords}` : ''}

လိုအပ်ချက်များ:
- ${includeCTA ? 'Call To Action ပါဝင်ရမည်' : 'Call To Action မလိုအပ်'}
- ${includeEmojis ? 'Emoji များ အသုံးပြုရမည်' : 'Emoji များ မအသုံးပြု'}
- ${includeHashtags ? 'Hashtag များ ထည့်ရမည်' : 'Hashtag များ မထည့်'}

ညွှန်ကြားချက်များ:
1. မြန်မာဘာသာဖြင့်သာ ရေးသားပါ
2. ${platform} platform အတွက် သင့်လျော်သော format ဖြင့် ရေးသားပါ
3. ယဉ်ကျေးမှုဆိုင်ရာ အခြေအနေနှင့် ကိုက်ညီအောင် ရေးသားပါ
4. ပြတ်သားပြီး ဆွဲဆောင်မှုရှိအောန် ရေးသားပါ
5. တစ်ခုစီကို "=== ပုံစံကွဲ X ===" ဖြင့် ခွဲခြားပါ

${numVariations} ခု ပုံစံကွဲများ ဖန်တီးပါ။`
}

function parseVariations(text: string, numVariations: number): string[] {
  // Split by variation markers
  const parts = text.split(/===\s*ပုံစံကွဲ\s*\d+\s*===/i)
  
  // Remove empty first part if exists
  const variations = parts.filter(part => part.trim().length > 0)
  
  // If we don't have enough variations, split by double newlines as fallback
  if (variations.length < numVariations) {
    const fallbackParts = text.split(/\n\s*\n\s*\n/)
    return fallbackParts.slice(0, numVariations).map(part => part.trim()).filter(part => part.length > 0)
  }
  
  return variations.slice(0, numVariations).map(variation => variation.trim())
}
