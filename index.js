exports.handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  // Aquí puedes implementar la lógica específica de tu proyecto.
  // Por ejemplo, puedes procesar el evento y publicar en SNS o almacenar en una base de datos.

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Lambda executed successfully!" }),
  };
};