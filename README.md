# Email Scheduler Service

## Description

The service sends out randomized motivational messages via email to users every minute.

## Requirements
- Users can be added via an API endpoint by providing their emails.
- There should be ten hardcoded messages.
- Every minute, every user should receive one of these messages at random, but never the same one twice.
- Once a user has received all messages, they shouldn't receive any more.


### Prerequisites

This service is built with the following tools and may require that they are installed on your environment before it can run successfully. The most important tool amongst the following is Docker. If docker is available on your environment, you do not need to have Node.js or Redis to run this application.

- Docker (Required)
- Nodejs (Optional)
- Redis (loaded with Redis search Module)(Optional)



#### Environment Variables
The following environment variables are required to run this application. Once they have been determined, add a .env file to the root folder of the project.

- API_KEY - Used to validate API requests made to the server (The API KEY most be encoded to base 64).
- REDIS_URL - The url of a redis server.
- SENDGRID_API_KEY - An API key obtained from sendgrid for sending out emails
- SENDGRID_EMAIL - The sender email account registered on sendgrid.


### Initialization Steps
To get the app up and running on a local environment, do the following:

- clone the repository with the following command:
```bash
# get app
$ git clone https://github.com/daylay92/email_scheduler.git
```
- Open the folder of the cloned repository
- Add a file named `.env` at the root of the project.
- Add the environment variables listed in the section above to the `.env` file.
- Run the following command at the root of the project:
```bash
# Starts app with docker-compose
$ make up
```
- The app should now be running on port 4500
- Navigate to the browser and visit `http://localhost:4500`


###### Command Summary

```bash
# get app
$ git clone https://github.com/daylay92/email_scheduler.git

# navigate to working directory and add environment variables
$ cd email_scheduler

# build and run services with docker-compose
$ make up
```

### API Endpoints
There are a couple of REST API endpoints that has been created for managing users. Once the application is up, visit `http://localhost:4500/docs` on your browser and you should see the OpenAPI documentation containing all the endpoints.
Please note that you would need to provide a `API-KEY` as a header parameter with the field; `X-API-KEY` to access the endpoints. The 
`API-KEY` must be a string equivalent of the `API_KEY` variable described in the environment variable section.