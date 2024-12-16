const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const sqs = new AWS.SQS();

exports.handler = async (event) => {
  try {
    console.log("Event received:", JSON.stringify(event, null, 2));

    // Iterar sobre los mensajes de SQS
    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      console.log("Processing message:", message);

      // Publicar el mensaje en el SNS Topic
      const snsParams = {
        Message: JSON.stringify(message),
        TopicArn: 'arn:aws:sns:us-east-1:590183865524:Alertify-Inc-CriticalEvents-Unique', // ARN del SNS Topic
      };

      await sns.publish(snsParams).promise();
      console.log('Message sent to SNS:', snsParams.Message);

      // Eliminar el mensaje de la cola SQS después de procesarlo
      const deleteParams = {
        QueueUrl: 'https://sqs.us-east-1.amazonaws.com/590183865524/Alertify-Inc-EventQueue-Unique',  // URL de la SQS Queue
        ReceiptHandle: record.receiptHandle,
      };

      await sqs.deleteMessage(deleteParams).promise();
      console.log('Message deleted from SQS');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Processing completed successfully!' }),
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error processing event' }),
    };
  }
};