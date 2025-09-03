import { NextRequest, NextResponse } from 'next/server';
import { S3UploadService } from '@/lib/s3-upload';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fileName = id; 

    console.log('🔍 Status check for video:', fileName);

    if (!fileName) {
      console.error('No filename provided');
      return NextResponse.json(
        { error: 'Video filename is required' },
        { status: 400 }
      );   
    }

    // Check if processed segments exist in klipify-debjyoti-prod bucket
    console.log('Checking for processed segments...');
    const segmentInfo = await S3UploadService.getProcessedVideoSegments(fileName);

    // Check if any quality segments are available (your Docker process creates them)
    const hasProcessedSegments = segmentInfo.qualities.length > 0;

    let status: 'uploading' | 'processing' | 'completed' | 'error' = 'processing';
    let progress = 0;
    let processedUrl = '';

    console.log('Processing status:', {
      hasProcessedSegments,
      qualitiesCount: segmentInfo.qualities.length,
      masterPlaylist: segmentInfo.masterPlaylist
    });

    if (hasProcessedSegments) {
      // Use master playlist if available, otherwise use highest quality
      processedUrl = segmentInfo.masterPlaylist || segmentInfo.qualities[segmentInfo.qualities.length - 1]?.playlistUrl || '';
      status = 'completed';
      progress = 100;
      console.log('Video processing completed, using URL:', processedUrl);
    } else {
      // Still processing - simulate progress
      progress = Math.min(20 + Math.random() * 60, 80); // Random progress between 20-80%
      status = 'processing';
      console.log('Video still processing, progress:', progress + '%');
    }

    const response = {
      success: true,
      video: {
        id: fileName,
        status,
        progress,
        processedUrl,
        availableQualities: segmentInfo.qualities,
        masterPlaylist: segmentInfo.masterPlaylist,
      },
    };

    console.log('Sending status response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
