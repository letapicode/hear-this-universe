
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { mood, activity, preferences, context } = await req.json();

    // Mock AI recommendation logic (replace with actual OpenAI call)
    const mockRecommendations = await generateMockRecommendations(mood, activity, preferences, context);

    // Store recommendations in database
    const { data: recommendations, error: insertError } = await supabaseClient
      .from('ai_recommendations')
      .insert(mockRecommendations.map(rec => ({
        user_id: user.id,
        series_id: rec.series_id,
        recommendation_type: rec.type,
        confidence_score: rec.confidence,
        reasoning: rec.reasoning,
        context_data: { mood, activity, ...context }
      })))
      .select();

    if (insertError) throw insertError;

    return new Response(JSON.stringify({ recommendations }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-recommendations function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateMockRecommendations(mood: string, activity: string, preferences: any, context: any) {
  // Mock AI logic - replace with actual OpenAI API call
  const recommendations = [];
  
  const moodMappings = {
    'energetic': ['business', 'self-help', 'science'],
    'calm': ['fiction', 'history', 'mystery'],
    'focused': ['business', 'science', 'self-help'],
    'creative': ['fiction', 'mystery', 'history'],
    'relaxed': ['fiction', 'history']
  };

  const categories = moodMappings[mood] || ['fiction'];
  
  // Generate 3-5 recommendations
  for (let i = 0; i < 3; i++) {
    recommendations.push({
      series_id: `mock-${i + 1}`, // This would be actual series IDs from your database
      type: mood === 'focused' ? 'productivity' : 'mood',
      confidence: 0.7 + Math.random() * 0.3,
      reasoning: `Perfect for ${mood} mood while ${activity}. This ${categories[i % categories.length]} content matches your listening patterns and current context.`
    });
  }

  return recommendations;
}
