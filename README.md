# demo-dpp-app
This is a demo for a complete java app.

## Introduction
The `demo-dpp-app` is a sample Java application designed to demonstrate the implementation of a complete software solution. It showcases some practices in Java development. This project serves as a learning resource and a foundation for building more complex applications.

The project demonstrates the integration between a Java backend application exposing a REST API and a frontend implemented in React. The React frontend provides a dashboard that allows users to interact with the backend seamlessly.

## Backend Technologies
The backend of the `demo-dpp-app` is built using the following technologies:

- **Spring Boot**: A framework for building Java-based applications with ease, used for creating REST APIs and managing application configuration.
- **Spring Data JPA**: Simplifies database access and ORM (Object-Relational Mapping) with JPA (Java Persistence API).
- **H2 Database**: An in-memory database used for development and testing purposes.
- **PostgreSQL**: A robust and scalable relational database used for production.
- **Spring Boot Actuator**: Provides production-ready features such as monitoring and metrics.
- **Docker Compose Integration**: Simplifies the deployment of multi-container applications.
- **Maven**: A build automation tool used for managing dependencies and building the project.

## Backend Requirements
To run the backend application, ensure the following requirements are met:

1. **Java Development Kit (JDK)**: Install JDK 17 or higher. You can download it from [Oracle](https://www.oracle.com/java/technologies/javase-downloads.html) or [OpenJDK](https://openjdk.org/).
2. **Maven**: Install Apache Maven for building and managing the project dependencies. You can download it from [Maven official website](https://maven.apache.org/).
3. **Database**:
   - For development and testing, the application uses an in-memory H2 database (no additional setup required).
   - For production, ensure a PostgreSQL database is installed and configured. Update the `application.properties` file with the appropriate database connection details (if needed).
4. **Docker (Optional)**: If using Docker Compose for deployment, ensure Docker is installed and running. You can download it from [Docker official website](https://www.docker.com/).

### Steps to Run the Backend
1. Clone the repository and navigate to the backend project directory.
2. Build the project using Maven:
   ```
   mvn clean install
   ```
3. Run the application:
   ```
   mvn spring-boot:run
   ```
4. The backend application will start on `http://localhost:8081` by default.

These steps will allow you to run and interact with the backend application.

### Provided API
The backend application exposes a REST API to manage Digital Product Passports and their associated repair entries. Below are the main endpoints:

- `GET /api/dpp/{id}`: Retrieve a Digital Product Passport by its ID.
- `GET /api/dpp/serial/{serialNumber}`: Retrieve a Digital Product Passport by its serial number.
- `GET /api/dpp`: Retrieve all Digital Product Passports.
- `POST /api/dpp`: Create a new Digital Product Passport.
- `POST /api/dpp/{passportId}/repairs`: Add a repair entry to a specific Digital Product Passport.

These endpoints allow interaction with the backend for managing and updating Digital Product Passports.

## Steps to Run the Fronend
The frontend of the `demo-dpp-app` is implemented using React. To run the frontend application, ensure the following requirements are met:

1. **Node.js**: Install Node.js (version 16 or higher) from [Node.js official website](https://nodejs.org/).
2. **npm or Yarn**: Ensure you have `npm` (comes with Node.js) or `Yarn` installed for managing dependencies.
3. **Dependencies**: Run `npm install` or `yarn install` in the frontend project directory to install all required dependencies.
4. **Development Server**: Use `npm start` or `yarn start` to start the development server. The application will typically run on `http://localhost:3000`.


