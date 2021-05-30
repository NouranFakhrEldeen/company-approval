
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export default (app) => {
    const document = SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('Approving Suppliers API')
        .setDescription('API Documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addBasicAuth()
        .build(),
        );
    SwaggerModule.setup('swagger-api/', app, document);
};
