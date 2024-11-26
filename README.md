This project is a microservices API built with NestJS, RabbitMQ, Redis, TypeORM, and Docker. It generates random dishes for restaurant donations.
To run it:

- Install Docker and Docker Compose (or Docker Desktop).
- Create an .ENV file based on the .ENV.example.
- Initialize the database using the script in initialDB.
- Start the project: docker-compose up -d.
- Access the Swagger UI at http://localhost:3000/api.
