
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid user token')
    }

    const method = req.method

    if (method === 'POST') {
      // Save new video
      const { title, description, videoUrl, audioUrl, thumbnailUrl, videoType, durationSeconds, tags, metadata } = await req.json()

      const { data: video, error } = await supabase
        .from('generated_videos')
        .insert({
          user_id: user.id,
          title,
          description,
          video_url: videoUrl,
          audio_url: audioUrl,
          thumbnail_url: thumbnailUrl,
          video_type: videoType || 'podcast',
          duration_seconds: durationSeconds,
          tags: tags || [],
          metadata: metadata || {},
        })
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to save video: ${error.message}`)
      }

      return new Response(
        JSON.stringify({ success: true, video }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'GET') {
      // Get user's videos
      const url = new URL(req.url)
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '10')
      const videoType = url.searchParams.get('type')
      const search = url.searchParams.get('search')

      let query = supabase
        .from('generated_videos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (videoType) {
        query = query.eq('video_type', videoType)
      }

      if (search) {
        query = query.ilike('title', `%${search}%`)
      }

      const from = (page - 1) * limit
      const to = from + limit - 1

      const { data: videos, error } = await query.range(from, to)

      if (error) {
        throw new Error(`Failed to fetch videos: ${error.message}`)
      }

      return new Response(
        JSON.stringify({ videos, page, hasMore: videos.length === limit }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (method === 'DELETE') {
      // Delete video
      const url = new URL(req.url)
      const videoId = url.searchParams.get('id')

      if (!videoId) {
        throw new Error('Video ID is required')
      }

      const { error } = await supabase
        .from('generated_videos')
        .delete()
        .eq('id', videoId)
        .eq('user_id', user.id)

      if (error) {
        throw new Error(`Failed to delete video: ${error.message}`)
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Save video error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
