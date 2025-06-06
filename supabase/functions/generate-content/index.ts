
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
  facebookPageLink: string;
  includeCTA: boolean;
  includeEmojis: boolean;
  includeHashtags: boolean;
  numVariations: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const contentRequest: ContentRequest = await req.json()
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    
    if (!geminiApiKey) {
      throw new Error('Gemini API key not found')
    }

    // Build the prompt for Gemini
    const prompt = buildPrompt(contentRequest)
    
    console.log('Generating content with Gemini for:', contentRequest.platform)

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`, {
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
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Gemini API error:', errorData)
      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()
    const generatedText = data.candidates[0]?.content?.parts[0]?.text || ''
    
    // Parse the variations from the generated text
    const variations = parseVariations(generatedText, contentRequest.numVariations)
    
    console.log('Successfully generated', variations.length, 'variations')

    return new Response(JSON.stringify({ 
      variations,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in generate-content function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

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
4. ပြတ်သားပြီး ဆွဲဆောင်မှုရှိအောන် ရေးသားပါ
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
