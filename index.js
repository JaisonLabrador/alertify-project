const AWS = require('aws-sdk');
const sns = new AWS.SNS();
const sqs = new AWS.SQS();
const MAX_MESSAGE_SIZE = 256 * 1024; // 256 KB, el límite de SNS

exports.handler = async (event) => {
  try {
    const message = JSON.parse(event.Records[0].body);

    // Filtro: Verificar si el mensaje ya fue procesado
    if (message.alreadyProcessed) {
      console.log('Mensaje ya procesado, no enviando a SNS');
      return;
    }

    // Marcar el mensaje como procesado
    message.alreadyProcessed = true;

    const snsParams = {
      Message: JSON.stringify(message),
      TopicArn: 'arn:aws:sns:us-east-1:590183865524:Alertify-Inc-CriticalEvents-Unique',
    };

    await sns.publish(snsParams).promise();
    console.log('Mensaje enviado a SNS');

    return { statusCode: 200, body: JSON.stringify({ message: 'Exitoso' }) };

  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: JSON.stringify({ message: 'Error' }) };
  }
};