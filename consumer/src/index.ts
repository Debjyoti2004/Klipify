import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { ECSClient, RunTaskCommand } from "@aws-sdk/client-ecs";
import dotenv from "dotenv";

dotenv.config();

// Initialize AWS clients without hardcoded credentials.
// The SDK will automatically get permissions from the IAM Role of the environment.
const sqsClient = new SQSClient({ region: "ap-south-1" });
const ecsClient = new ECSClient({ region: "ap-south-1" });

async function main() {
  console.log("Consumer service started. Polling for messages...");

  const receiveCommand = new ReceiveMessageCommand({
    QueueUrl: process.env.QUEUE_URL,
    MaxNumberOfMessages: 1,
    WaitTimeSeconds: 20, // Use long polling for efficiency
  });

  while (true) {
    try {
      const { Messages } = await sqsClient.send(receiveCommand);

      if (!Messages || Messages.length === 0) {
        continue;
      }

      for (const message of Messages) {
        console.log(`Processing MessageId: ${message.MessageId}`);

        if (!message.Body) {
          console.warn("Message has no body, skipping and deleting.");
          await deleteMessage(message.ReceiptHandle!);
          continue;
        }

        const event = JSON.parse(message.Body);

        // check if this is a test event. Test events do NOT have a "Records" array.
        if (event.Service === "Amazon S3" && event.Event === "s3:TestEvent") {
          console.log("S3 Test Event received, deleting message.");
          await deleteMessage(message.ReceiptHandle!);
          continue; // Skip to the next message
        }

        if (!event.Records || event.Records.length === 0) {
          console.warn(
            "Message is not a test event and has no records, skipping and deleting."
          );
          await deleteMessage(message.ReceiptHandle!);
          continue;
        }

        for (const record of event.Records) {
          const {
            bucket: { name: bucketName },
            object: { key },
          } = record.s3;

          console.log(`Extracted Bucket: ${bucketName}, Key: ${key}`);

          const runTaskCommand = new RunTaskCommand({
            cluster: process.env.CLUSTER_NAME,
            taskDefinition: process.env.TASK_DEFINITION,
            launchType: "FARGATE",
            networkConfiguration: {
              awsvpcConfiguration: {
                assignPublicIp: "ENABLED",
                subnets: [
                  "subnet-0caf6f9282bd66a92",
                  "subnet-094fb205767277743",
                  "subnet-0553bacd9689804db",
                ],
                securityGroups: ["sg-07852b8722c95d882"],
              },
            },
            overrides: {
              containerOverrides: [
                {
                  name: process.env.CONTAINER_NAME,
                  // The transcoder task will get its own AWS permissions from its Task Role.
                  environment: [
                    { name: "BUCKET_NAME", value: bucketName },
                    { name: "KEY", value: key },
                  ],
                },
              ],
            },
          });

          await ecsClient.send(runTaskCommand);
          console.log(`Successfully launched task for object: ${key}`);
        }

        await deleteMessage(message.ReceiptHandle!);
      }
    } catch (error) {
      console.error("An error occurred while processing messages:", error);
    }
  }
}

async function deleteMessage(receiptHandle: string) {
  await sqsClient.send(
    new DeleteMessageCommand({
      QueueUrl: process.env.QUEUE_URL,
      ReceiptHandle: receiptHandle,
    })
  );
  console.log("Message deleted from queue.");
}

main();
