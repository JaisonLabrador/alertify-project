
# Sistema de Notificación en Tiempo Real - Alertify Inc.

Este proyecto implementa una solución de notificación en tiempo real para Alertify Inc., utilizando AWS SNS, SQS, Lambda y CI/CD mediante GitHub Actions. El sistema permite recibir y procesar eventos de monitoreo en tiempo real y notificar a los usuarios sobre incidentes críticos.

## Tabla de Contenidos
1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Requisitos](#requisitos)
3. [Instalación](#instalación)
4. [Despliegue](#despliegue)
5. [Pruebas](#pruebas)
6. [Monitoreo y Logs](#monitoreo-y-logs)
7. [Contribuciones](#contribuciones)
8. [Licencia](#licencia)

## Arquitectura del Proyecto

El sistema utiliza una arquitectura basada en microservicios, diseñada para ser escalable y eficiente. Los componentes principales son:

- **SNS (Simple Notification Service)**: Publica los eventos críticos.
- **SQS (Simple Queue Service)**: Almacena los eventos hasta ser procesados.
- **Lambda**: Procesa los eventos desde la cola de SQS y envía notificaciones por medio de SNS.
- **CI/CD**: GitHub Actions automatiza el despliegue de Lambda y otros recursos.
  
### Diagrama de Arquitectura

(Adjuntar aquí un diagrama visual de la arquitectura).

## Requisitos

- **AWS CLI** instalado y configurado con acceso adecuado.
- **Node.js 20.x** para ejecutar Lambda localmente o en el entorno de AWS.
- **GitHub Actions** configurado para CI/CD.
- **AWS Account** para crear y gestionar los recursos.

## Instalación

Para instalar el proyecto en tu entorno local:

1. Clona este repositorio:

   ```bash
   git clone https://github.com/tu_usuario/alertify-project.git
   ```

2. Instala las dependencias de Node.js (si deseas ejecutar funciones Lambda localmente):

   ```bash
   cd alertify-project
   npm install
   ```

## Despliegue

Este proyecto utiliza **AWS CloudFormation** para crear y gestionar los recursos. Para desplegar la infraestructura, sigue estos pasos:

1. Asegúrate de tener las credenciales de AWS configuradas correctamente con permisos adecuados.

2. Ejecuta el siguiente comando para desplegar el stack de CloudFormation:

   ```bash
   aws cloudformation deploy --template-file template.yaml --stack-name alertify-stack --capabilities CAPABILITY_IAM --parameter-overrides TOEmail="tu_correo@example.com"
   ```

3. El comando creará los siguientes recursos:
   - Lambda Function
   - SQS Queue
   - SNS Topic
   - SNS Subscription
   - IAM Role para Lambda

4. Verifica el despliegue en la consola de AWS, asegurándote de que todos los recursos estén activos.

## Pruebas

Para probar el sistema de notificación:

1. Publica un mensaje en el **SNS Topic**:

   ```bash
   aws sns publish --topic-arn arn:aws:sns:us-east-1:590183865524:Alertify-Inc-CriticalEvents-Unique --message "Test Message" --subject "Test Notification"
   ```

2. Si todo está configurado correctamente, deberías recibir el correo electrónico de notificación en la dirección configurada en el parámetro `TOEmail`.

3. Revisa los logs de **CloudWatch** para obtener detalles sobre el procesamiento de los mensajes.

## Monitoreo y Logs

1. **CloudWatch** está configurado para monitorear las invocaciones de la función Lambda, la longitud de la cola SQS y las publicaciones en SNS.
2. Si hay errores, los detalles estarán disponibles en los logs de CloudWatch.

## Contribuciones

Las contribuciones son bienvenidas. Para contribuir al proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu característica:
   
   ```bash
   git checkout -b nueva-caracteristica
   ```

3. Haz tus cambios y haz commit:

   ```bash
   git commit -am 'Añadir nueva característica'
   ```

4. Push a tu fork:

   ```bash
   git push origin nueva-caracteristica
   ```

5. Crea un pull request.

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
