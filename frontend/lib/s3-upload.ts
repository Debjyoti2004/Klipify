import { PutObjectCommand, GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, s3Config } from './aws-config';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  success: boolean;
  fileId: string;
  rawUrl: string;
  fileName: string;
  fileSize: number;
  error?: string;
}

export class S3UploadService {
  static async generatePresignedUrl(fileName: string, fileType: string): Promise<string> {
    const fileId = uuidv4();
    const key = `raw-videos/${fileId}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: s3Config.rawBucket,
      Key: key,
      ContentType: fileType,
      Metadata: {
        originalFileName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    try {
      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
      return presignedUrl;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw new Error('Failed to generate upload URL');
    }
  }

  static async uploadToS3(file: Buffer, fileName: string, fileType: string): Promise<UploadResult> {
    console.log('Starting S3 upload process...');
    console.log('File details:', { fileName, fileType, fileSize: file.length });
    console.log('S3 Config:', { 
      rawBucket: s3Config.rawBucket, 
      region: process.env.AWS_REGION,
      hasCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
    });

    const key = fileName;
    
    console.log('Upload key (original filename):', key);

    const command = new PutObjectCommand({
      Bucket: s3Config.rawBucket,
      Key: key,
      Body: file,
      ContentType: fileType,
      Metadata: {
        originalFileName: fileName,
        uploadedAt: new Date().toISOString(),
      },
    });

    try {
      console.log('Sending upload command to S3...');
      const result = await s3Client.send(command);
      console.log('S3 upload successful:', result);

      const rawUrl = `https://${s3Config.rawBucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      console.log('Generated URL:', rawUrl);

      return {
        success: true,
        fileId: fileName,
        rawUrl,
        fileName,
        fileSize: file.length,
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        code: (error as any)?.Code,
        statusCode: (error as any)?.$metadata?.httpStatusCode,
        requestId: (error as any)?.$metadata?.requestId,
      });
      
      return {
        success: false,
        fileId: '',
        rawUrl: '',
        fileName,
        fileSize: 0,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  }


  static async getViewUrl(bucket: string, key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    try {
      const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
      return presignedUrl;
    } catch (error) {
      console.error('Error generating view URL:', error);
      throw new Error('Failed to generate view URL');
    }
  }


  static async getProcessedVideoSegments(fileName: string): Promise<{
    qualities: Array<{
      quality: string;
      playlistUrl: string;
      folder: string;
    }>;
    masterPlaylist?: string;
  }> {
    try {
      console.log('Checking for processed segments for:', fileName);
      
      // Your Docker creates folders like: hls-240p-test.mov/, hls-360p-test.mov/, etc.
      const qualities = ['240p', '360p', '480p', '720p', '1080p'];
      const baseUrl = `https://${s3Config.processedBucket}.s3.${process.env.AWS_REGION}.amazonaws.com`;
      
      // Check which qualities actually exist in S3 
      const availableQualities = [];
      
      for (const quality of qualities) {
        const key = `hls-${quality}-${fileName}/index.m3u8`;
        try {
          const headCommand = new HeadObjectCommand({
            Bucket: s3Config.processedBucket,
            Key: key,
          });
          
          await s3Client.send(headCommand);
          
          availableQualities.push({
            quality,
            folder: `hls-${quality}-${fileName}`,
            playlistUrl: `${baseUrl}/hls-${quality}-${fileName}/index.m3u8`,
          });
          
          console.log(`Found ${quality} quality for ${fileName}`);
        } catch (error) {
          console.log(`${quality} quality not found for ${fileName}`);
        }
      }

      // Check if master playlist exists
      let masterPlaylist;
      try {
        const masterKey = `master-${fileName}.m3u8`;
        const masterCommand = new HeadObjectCommand({
          Bucket: s3Config.processedBucket,
          Key: masterKey,
        });
        
        await s3Client.send(masterCommand);
        masterPlaylist = `${baseUrl}/master-${fileName}.m3u8`;
        console.log('Master playlist found:', masterPlaylist);
      } catch (error) {
        console.log('Master playlist not found for:', fileName);
      }

      console.log('Available qualities for', fileName, ':', availableQualities.map(q => q.quality));

      return {
        qualities: availableQualities,
        masterPlaylist,
      };
    } catch (error) {
      console.error('Error checking processed segments:', error);
      return { qualities: [] };
    }
  }
}
