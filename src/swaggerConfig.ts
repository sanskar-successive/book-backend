import swaggerJsdoc from 'swagger-jsdoc';

const options : any = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API documentation for your Node.js app',
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
        ],
    },
    apis: ['src/**/*.ts'], // Path to the file with your API documentation
};

const swaggerSpec: any = swaggerJsdoc(options);
export default swaggerSpec;