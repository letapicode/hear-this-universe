
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

    const { videoId, title, description, tags, privacy, thumbnail } = await req.json()

    // Get YouTube connection
    const { data: connection, error: connError } = await supabase
      .from('youtube_connections')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (connError || !connection) {
      throw new Error('No YouTube connection found')
    }

    // Get video details
    const { data: video, error: videoError } = await supabase
      .from('generated_videos')
      .select('*')
      .eq('id', videoId)
      .eq('user_id', user.id)
      .single()

    if (videoError || !video) {
      throw new Error('Video not found')
    }

    // Create upload record
    const { data: uploadRecord, error: uploadError } = await supabase
      .from('youtube_uploads')
      .insert({
        user_id: user.id,
        video_id: videoId,
        upload_status: 'uploading'
      })
      .select()
      .single()

    if (uploadError) {
      throw new Error('Failed to create upload record')
    }

    // Simulate video upload (in real implementation, you'd upload the actual video file)
    const videoMetadata = {
      snippet: {
        title,
        description,
        tags: tags || [],
        categoryId: '22', // People & Blogs
      },
      status: {
        privacyStatus: privacy || 'private',
      },
    }

    // For demo purposes, we'll simulate a successful upload
    // In real implementation, you'd use the YouTube Data API v3 to upload the video
    const mockYouTubeVideoId = `video_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const mockYouTubeUrl = `https://www.youtube.com/watch?v=${mockYouTubeVideoId}`

    // Update upload record with success
    const { error: updateError } = await supabase
      .from('youtube_uploads')
      .update({
        youtube_video_id: mockYouTubeVideoId,
        youtube_url: mockYouTubeUrl,
        upload_status: 'completed',
        uploaded_at: new Date().toISOString(),
      })
      .eq('id', uploadRecord.id)

    if (updateError) {
      console.error('Failed to update upload record:', updateError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        youtubeUrl: mockYouTubeUrl,
        videoId: mockYouTubeVideoId 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('YouTube upload error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
