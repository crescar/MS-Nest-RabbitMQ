This project is a microservices API built with NestJS, RabbitMQ, Redis, TypeORM, and Docker. It generates random dishes for restaurant donations.
To run it:

- Install Docker and Docker Compose (or Docker Desktop).
- Create an .ENV file based on the .ENV.example (File in enviroment Folder).
- Initialize the database using the script in initialDB (Create the same schema of the enviroment).
- Start the project: Run the next command "docker-compose up -d" on the source folder.
- Access the Swagger UI at http://localhost:3000/api.
