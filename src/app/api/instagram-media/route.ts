import { NextRequest, NextResponse } from 'next/server';

// Instagram Basic Display API for fetching user's own posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('media_id');
    
    // Instagram Basic Display API requires user access token
    const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
    
    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 }
      );
    }

    if (mediaId) {
      // Fetch specific media by ID
      const mediaUrl = `https://graph.instagram.com/${mediaId}?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&access_token=${ACCESS_TOKEN}`;
      
      const response = await fetch(mediaUrl);
      const data = await response.json();
      
      if (response.ok) {
        return NextResponse.json(data);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch media');
      }
    } else {
      // Fetch user's recent media
      const userMediaUrl = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&limit=10&access_token=${ACCESS_TOKEN}`;
      
      const response = await fetch(userMediaUrl);
      const data = await response.json();
      
      if (response.ok) {
        return NextResponse.json(data);
      } else {
        throw new Error(data.error?.message || 'Failed to fetch user media');
      }
    }

  } catch (error) {
    console.error('Instagram API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram data' },
      { status: 500 }
    );
  }
}
