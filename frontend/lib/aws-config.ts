import { S3Client } from '@aws-sdk/client-s3';

// AWS Configuration
export const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  region: process.env.AWS_REGION || 'us-east-1',
};

// S3 Bucket Configuration
export const s3Config = {
  rawBucket: process.env.AWS_S3_RAW_BUCKET || 'debjyoti-row',
  processedBucket: process.env.AWS_S3_PROCESSED_BUCKET || 'debjyoti-prod',
};

// Initialize S3 client
export const s3Client = new S3Client({
  region: awsConfig.region,
  credentials: {
    accessKeyId: awsConfig.accessKeyId,
    secretAccessKey: awsConfig.secretAccessKey,
  },
});
