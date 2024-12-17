const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const sqs = new AWS.SQS();
const processedMessages = new Set();

exports.handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  const deleteParams = {
    Entries: [],
    QueueUrl: process.env.SQS_QUEUE_URL,
  };

  try {
    for (const record of event.Records || []) {
      const messageId = record.messageId;

      // Si el mensaje ya fue procesado, lo ignoramos
      if (processedMessages.has(messageId)) {
        console.log(`Duplicate message ignored: ${messageId}`);
        continue;
      }

      // Agregar mensaje a la lista de procesados
      processedMessages.add(messageId);
      console.log(`Processing message: ${record.body}`);

      // Publicar mensaje en SNS
      const body = JSON.parse(record.body);
      const params = {
        Message: body.Message || "No Message",
        Subject: body.Subject || "Alert Notification",
        TopicArn: process.env.SNS_TOPIC_ARN,
        MessageAttributes: {
          "EventType": {
            DataType: "String",
            StringValue: body.EventType || "Critical"  // Aquí defines el atributo
          }
        }
      };

      // Enviar el mensaje procesado
      await sns.publish(params).promise();
      console.log(`Message sent to SNS: ${messageId}`);

      // Eliminar el mensaje de SQS
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
    console.error("Error processing messages:", error.message);
    throw error;
  }

  return { statusCode: 200, body: "Messages processed and deleted successfully" };
};