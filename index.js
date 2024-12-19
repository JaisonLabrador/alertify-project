const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  const deleteParams = {
    Entries: [],
    QueueUrl: process.env.SQS_QUEUE_URL,
  };

  try {
    for (const record of event.Records || []) {
      const messageId = record.messageId;
      const body = JSON.parse(record.body);
      
      console.log(`Processing message: ${messageId}`);

      // Publicar mensaje en SNS
      const params = {
        Message: body.Message || "No Message",
        Subject: body.Subject || "Alert Notification",
        TopicArn: process.env.SNS_TOPIC_ARN,
        MessageAttributes: {
          "EventType": {
            DataType: "String",
            StringValue: body.EventType || "Critical"  // Aquí se define el atributo
          }
        }
      };

      await sns.publish(params).promise();
      console.log(`Message sent to SNS: ${messageId}`);

      // Agregar a la lista de eliminación para SQS
      deleteParams.Entries.push({
        Id: messageId,
        ReceiptHandle: record.receiptHandle,
      });
    }

    // Eliminar mensajes procesados de SQS
    if (deleteParams.Entries.length > 0) {
      await sqs.deleteMessageBatch(deleteParams).promise();
      console.log("Messages deleted from SQS");
    }
  } catch (error) {
    console.error("Error processing messages:", error);
    throw error;
  }

  return { statusCode: 200, body: "Messages processed and deleted successfully" };
};