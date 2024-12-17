exports.handler = async (event) => {
  // Los mensajes llegan como un lote
  const records = event.Records;

  // Filtro de mensajes basado en contenido
  const filteredMessages = records.filter((record) => {
      const body = JSON.parse(record.body);
      const messageAttributes = body.MessageAttributes;

      // Asegúrate de verificar las claves según tu implementación
      return messageAttributes.Type && messageAttributes.Type.StringValue === 'Warning' &&
             messageAttributes.Priority && parseInt(messageAttributes.Priority.StringValue) < 3;
  });

  // Procesar los mensajes filtrados
  for (const message of filteredMessages) {
      console.log('Mensaje filtrado:', message.body);
      // Aquí puedes realizar la lógica de negocio que necesites
  }

  return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Mensajes procesados exitosamente' }),
  };
};