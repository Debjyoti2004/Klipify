const { S3Client, GetObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");

const RESOLUTIONS = [
    { name: "240p", width: 426, height: 240, bitrate: "400k" },

    { name: "360p", width: 640, height: 360, bitrate: "800k" },
    { name: "480p", width: 854, height: 480, bitrate: "1400k" },
    { name: "720p", width: 1280, height: 720, bitrate: "2800k" },
    
    { name: "1080p", width: 1920, height: 1080, bitrate: "5000k" },
];

// Initialize AWS clients without credentials.
const s3Client = new S3Client({ region: "ap-south-1" });
const dynamoDBClient = new DynamoDBClient({ region: "ap-south-1" });

// Read all configuration from environment variables provided by the ECS Task Definition
const BUCKET_NAME = process.env.BUCKET_NAME;
const KEY = process.env.KEY;
const PRODUCTION_BUCKET = process.env.PRODUCTION_BUCKET;
const DYNAMODB_TABLE = process.env.DYNAMODB_TABLE;

async function updateTranscodingStatus(jobId, status) {
    const command = new PutItemCommand({
        TableName: DYNAMODB_TABLE,
        Item: {
            jobId: { S: jobId },
            status: { S: status },
            timestamp: { S: new Date().toISOString() }
        }
    });
    await dynamoDBClient.send(command);
}

async function downloadVideo() {
    console.log(`Downloading video: ${KEY} from bucket: ${BUCKET_NAME}`);
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: KEY,
    });

    const response = await s3Client.send(command);
    if (!response.Body) {
        throw new Error("Failed to download file from S3");
    }

    const originalFilePath = path.join('/tmp', `original-${KEY}`);
    const writableStream = fs.createWriteStream(originalFilePath);
    
    await new Promise((resolve, reject) => {
        response.Body.pipe(writableStream)
            .on('finish', resolve)
            .on('error', reject);
    });

    console.log("Video downloaded successfully.");
    return path.resolve(originalFilePath);
}

async function transcodeToHLS(originalVideoPath, jobId) {
    await updateTranscodingStatus(jobId, "Your video is being transcoded");
    const masterPlaylist = [];

    const promises = RESOLUTIONS.map(resolution => {
        return new Promise(async (resolve, reject) => {
            const outputDir = path.join('/tmp', `hls-${resolution.name}-${KEY}`);
            const outputM3U8 = path.join(outputDir, 'index.m3u8');

            await fs.promises.mkdir(outputDir, { recursive: true });

            ffmpeg(originalVideoPath)
                .outputOptions([
                    '-c:v libx264',
                    '-c:a aac',
                    `-b:v ${resolution.bitrate}`,
                    '-b:a 128k',
                    `-vf scale=${resolution.width}:${resolution.height}`,
                    '-start_number 0',
                    '-hls_time 10',
                    '-hls_list_size 0',
                    '-f hls'
                ])
                .output(outputM3U8)
                .on('start', commandLine => console.log(`Spawned Ffmpeg with command: ${commandLine}`))
                .on('progress', progress => {
                    process.stdout.write(`Transcoding ${resolution.name}: ${progress.percent ? progress.percent.toFixed(2) : '0'}% done\r`);
                })
                .on('end', async () => {
                    try {
                        console.log(`\nHLS transcoding completed for ${resolution.name}`);
                        const s3OutputDir = `hls-${resolution.name}-${KEY}`;
                        masterPlaylist.push(`#EXT-X-STREAM-INF:BANDWIDTH=${parseInt(resolution.bitrate) * 1000},RESOLUTION=${resolution.width}x${resolution.height}\n${s3OutputDir}/index.m3u8`);

                        const files = await fs.promises.readdir(outputDir);
                        for (const file of files) {
                            const filePath = path.join(outputDir, file);
                            const fileStream = fs.createReadStream(filePath);
                            const putCommand = new PutObjectCommand({
                                Bucket: PRODUCTION_BUCKET,
                                Key: `${s3OutputDir}/${file}`,
                                Body: fileStream
                            });
                            await s3Client.send(putCommand);
                        }
                        console.log(`Uploaded all files for ${resolution.name} to S3`);
                        await updateTranscodingStatus(jobId, `Transcoded ${resolution.name}`);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                })
                .on('error', (error, stdout, stderr) => {
                    console.error(`Error transcoding ${resolution.name}:`, error.message);
                    console.error('ffmpeg stderr:', stderr);
                    reject(error);
                })
                .run();
        });
    });

    await Promise.all(promises);
    await updateTranscodingStatus(jobId, "Your video is ready to be played");

    const masterPlaylistContent = '#EXTM3U\n' + masterPlaylist.join('\n');
    const masterPlaylistPath = `master-${KEY}.m3u8`;
    const localMasterPlaylistPath = path.join('/tmp', masterPlaylistPath);

    fs.writeFileSync(localMasterPlaylistPath, masterPlaylistContent);

    const masterPlaylistStream = fs.createReadStream(localMasterPlaylistPath);
    const putMasterCommand = new PutObjectCommand({
        Bucket: PRODUCTION_BUCKET,
        Key: masterPlaylistPath,
        Body: masterPlaylistStream
    });
    await s3Client.send(putMasterCommand);
    console.log(`Uploaded master playlist to S3: ${masterPlaylistPath}`);
}

async function main() {
    if (!BUCKET_NAME || !KEY || !PRODUCTION_BUCKET || !DYNAMODB_TABLE) {
        throw new Error("Missing required environment variables.");
    }
    const jobId = KEY;
    let originalVideoPath = '';
    try {
        originalVideoPath = await downloadVideo();
        await transcodeToHLS(originalVideoPath, jobId);
    } catch (error) {
        console.error("An error occurred in the main process:", error);
        await updateTranscodingStatus(jobId, `Error: ${error.message}`);
        process.exit(1);
    } finally {
        // Clean up the downloaded file and transcoded segments from the container
        if (originalVideoPath && fs.existsSync(originalVideoPath)) {
            fs.unlinkSync(originalVideoPath);
            console.log("Cleaned up original video file.");
        }
        RESOLUTIONS.forEach(async (resolution) => {
            const outputDir = path.join('/tmp', `hls-${resolution.name}-${KEY}`);
            if (fs.existsSync(outputDir)) {
                await fs.promises.rm(outputDir, { recursive: true, force: true });
                console.log(`Cleaned up temporary directory: ${outputDir}`);
            }
        });
    }
}

main().then(() => {
    console.log("All transcoding jobs completed successfully.");
    process.exit(0);
}).catch(error => {
    console.error("Fatal error in main execution:", error);
    process.exit(1);
});