const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const sqs = new AWS.SQS();
const Redis = require('ioredis'); // Install ioredis package

// Redis client configuration
const redisClient = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD, // Optional if Redis auth is enabled
});

const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

exports.handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  const deleteParams = {
    Entries: [],
    QueueUrl: SQS_QUEUE_URL,
  };

  try {
    for (const record of event.Records || []) {
      const messageId = record.messageId;

      // Check Redis if the message has already been processed
      const isDuplicate = await redisClient.get(messageId);
      if (isDuplicate) {
        console.log(⁠ Duplicate message ignored: ${messageId} ⁠);
        continue;
      }

      console.log(⁠ Processing message: ${record.body} ⁠);

      try {
        // Parse the message body
        const body = JSON.parse(record.body);

        const snsParams = {
          Message: body.Message || "No Message",
          Subject: body.Subject || "Alert Notification",
          TopicArn: SNS_TOPIC_ARN,
          MessageAttributes: {
            EventType: {
              DataType: "String",
              StringValue: body.EventType || "Critical",
            },
          },
        };

        // Publish to SNS
        await sns.publish(snsParams).promise();
        console.log(⁠ Message sent to SNS: ${messageId} ⁠);

        // Mark message as processed in Redis with a TTL (e.g., 1 hour)
        await redisClient.set(messageId, "processed", "EX", 3600);

        // Prepare for message deletion
        deleteParams.Entries.push({
          Id: messageId,
          ReceiptHandle: record.receiptHandle,
        });
      } catch (err) {
        console.error(⁠ Failed to process message ${messageId}: ⁠, err);
        // Do not delete the message; SQS will retry
      }
    }

    // Batch delete processed messages
    if (deleteParams.Entries.length > 0) {
      const deleteResponse = await sqs.deleteMessageBatch(deleteParams).promise();
      console.log("Messages deleted from SQS:", JSON.stringify(deleteResponse));
    }
  } catch (error) {
    console.error("Error processing messages:", error);
    throw error; // Trigger retry by SQS
  }

  return { statusCode: 200, body: "Messages processed successfully" };
};