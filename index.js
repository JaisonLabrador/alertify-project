const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const sqs = new AWS.SQS();
const MAX_MESSAGE_SIZE = 256 * 1024; // 256 KB, el límite de SNS

exports.handler = async (event) => {
  try {
    console.log("Event received:", JSON.stringify(event, null, 2));

    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      console.log("Processing message:", message);

      // Filtrar solo el mensaje original
      const originalMessage = message.Message;

      // Verificar el tamaño del mensaje
      const messageString = JSON.stringify(originalMessage);
      if (Buffer.byteLength(messageString, 'utf8') > MAX_MESSAGE_SIZE) {
        console.log('Message is too large, truncating...');
        originalMessage = originalMessage.substring(0, MAX_MESSAGE_SIZE); // O cualquier lógica para reducir el mensaje
      }

      // Publicar solo el mensaje original
      const snsParams = {
        Message: originalMessage,
        TopicArn: 'arn:aws:sns:us-east-1:590183865524:Alertify-Inc-CriticalEvents-Unique',
      };

      await sns.publish(snsParams).promise();
      console.log('Message sent to SNS:', snsParams.Message);
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