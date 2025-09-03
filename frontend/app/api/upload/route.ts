import { NextRequest, NextResponse } from 'next/server';
import { S3UploadService } from '@/lib/s3-upload';

export async function POST(request: NextRequest) {
  console.log('Upload API called');
  
  try {
    console.log('Parsing form data...');
    const formData = await request.formData();
    const file = formData.get('file') as File;

    console.log('📁 File received:', {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      exists: !!file
    });

    if (!file) {
      console.error('No file provided in request');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Only video files are allowed' },
        { status: 400 }
      );
    }

    console.log('File validation passed');

    // Convert file to buffer
    console.log('Converting file to buffer...');
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer created, size:', buffer.length, 'bytes');

    // Check environment variables
    console.log('Environment check:', {
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
      rawBucket: process.env.AWS_S3_RAW_BUCKET,
    });

    console.log('Starting S3 upload...');
    const uploadResult = await S3UploadService.uploadToS3(
      buffer,
      file.name,
      file.type
    );

    console.log('Upload result:', {
      success: uploadResult.success,
      fileId: uploadResult.fileId,
      fileName: uploadResult.fileName,
      error: uploadResult.error
    });

    if (!uploadResult.success) {
      console.error('S3 upload failed:', uploadResult.error);
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      );
    }

    console.log('Upload successful, returning response');
    return NextResponse.json({
      success: true,
      video: {
        id: uploadResult.fileId,
        name: uploadResult.fileName,
        size: uploadResult.fileSize,
        originalUrl: uploadResult.rawUrl,
        status: 'processing',
        progress: 0,
      },
    });
  } catch (error) {
    console.error('Upload API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get('fileName');
    const fileType = searchParams.get('fileType');

    if (!fileName || !fileType) {
      return NextResponse.json(
        { error: 'fileName and fileType are required' },
        { status: 400 }
      );
    }

    const presignedUrl = await S3UploadService.generatePresignedUrl(fileName, fileType);

    return NextResponse.json({
      success: true,
      uploadUrl: presignedUrl,
    });
  } catch (error) {
    console.error('Presigned URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    );
  }
}
