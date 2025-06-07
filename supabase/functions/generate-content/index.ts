
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
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

    // Construct detailed prompt
    const prompt = `သင်သည် မြန်မာဘာသာ Social Media Content ရေးသားဘို့ အတွက် ကျွမ်းကျင်သူ ဖြစ်သည်။ အောက်ပါ လိုအပ်ချက်များအတိုင်း မြန်မာဘာသာဖြင့် content ရေးပေးပါ...

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

ကျေးဇူးပြု၍ ${sanitizedBody.numVariations} ခုသော မတူညီသော content variations များကို ရေးပေးပါ။ တစ်ခုစီကို "===VARIATION_START===" နှင့် "===VARIATION_END===" ဖြင့် ပိုင်းခြားပေးပါ။

အရေးကြီးသော စည်းမျဉ်းများ:
1. သာယာသောမြန်မာဘာသာ အသုံးပြုပါ
2. Cultural context နှင့် သင့်လျော်အောင် ရေးပါ
3. Platform နှင့် သင့်လျော်သော format နှင့် length ဖြစ်အောင် ရေးပါ
4. Creative နှင့် engaging ဖြစ်အောင် ရေးပါ
5. အကြောင်းအရာများကို မြန်မာ့ယဉ်ကျေးမှုနှင့် ညီညွတ်အောင် ရေးပါ

မြန်မာဘာသာဖြင့်သာ response ပေးပါ။`;

    console.log('Sending request to Gemini API...');
    
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

    console.log(`Generated ${finalVariations.length} variations`);

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
