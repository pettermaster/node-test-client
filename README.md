# node-test-client

## Install dependencies
```
$ npm install
```

## Setup
1. [Configure JWT](#configuring-jwt)
2. [Run the test](#running-the-test)
3. [Read the results](#reading-the-results)
### Configuring JWT
1. [Register a user](#registering-a-user)
2. [Get a token](#getting-a-token)
3. [Configure the client](#configure-the-client)

#### Registering a user
POST to ```http://localhost:8080/users``` with username and password in the body.

#### Getting a token
POST to ```http://localhost:8080/login``` with username and password in the body (same values as when registering). 

#### Configure the client
Copy the *access_token* in the login response, and replace USER_ACCESS_TOKEN in index.ts with the new value.

### Running the test
```
$ npm start
```

### Reading the results
The results are printed with console.log
