exports.handler = async (event) => {
  console.log("Event received:", JSON.stringify(event, null, 2));

  // Aquí puedes implementar la lógica específica de tu proyecto
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Lambda executed successfully!" }),
  };
};
