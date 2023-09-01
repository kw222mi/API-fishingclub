# API Documentation

This document provides information about the endpoints available in the API.

The base URL for this API is https://cscloud8-26.lnu.se/api

## Catch Endpoints

### GET /fishing-club/catch

- Description: Retrieve a list of catches with pagination support.
- Authentication: Requires authentication.
- Query Parameters:
  - `page` (optional): Specifies the page number for pagination (default: 1).
  - `perPage` (optional): Specifies the number of items per page (default: 50).
- Example: Get a list of catches with pagination:
  - Request: `GET /fishing-club/catch?page=2&perPage=20`
  - Response: Retrieves a paginated list of catches where each page contains 20 catches, and this request fetches the second page.


### GET /fishing-club/catch/:id

- Description: Retrieve a specific catch by ID.
- Authentication: Requires authentication.
- Example: `GET /fishing-club/catch/{catchId}`

### POST /fishing-club/catch

- Description: Create a new catch.
- Authentication: Requires authentication.
- Parameters:
  - `memberId` (required): The id of the member who caught the fish.
  - `lakeName` (optional): The name of the lake or river.
  - `cityName`(required): The name of the area or nearest city.
  - `species` (required): The species of the fish.
  - `coordinates`(optional): Coordinates for the catch, should be an array with 2 numbers.
  - `weight` (optional): The weight of the fish in gram.
  - `length` (optional): The length of the fish in cm.

  - Example:
   `POST /fishing-club/catch`
  ```json
  {
    "memberId": "64f1dd72bccd21fc58b8fb2d",
    "lakeName":"ExampleLake",
    "cityName": "Bigcity",
    "species": "Salmon",
    "coordinates": [55, 105.4444],
    "weight": 1005,
    "length": 120
  }
  ``` 
  ```
  

### PUT /fishing-club/catch/:id

- Description: Update a specific catch by ID.
- Authentication: Requires authentication.
- Example: `PUT /fishing-club/catch/{catchId}`

### DELETE /fishing-club/catch/:id

- Description: Delete a specific catch by ID.
- Authentication: Requires authentication.
- Example: `DELETE /fishing-club/catch/{catchId}`
- Response: 204 No Content

### POST /fishing-club/catch/addWebhookEvent/:userId

- Description: Add a webhook event to a get data sent when a new catch is added. 
- Authentication: Requires authentication.
- Parameters:
- `eventName` (required): The name of the webhook event. 
   - Possible events:  `newCatch` : a new catch is added.
- `endpointUrl`(required): The URL where the data should be sent.

- Example:
`POST /fishing-club/catch/addWebhookEvent/{userId}`

```json
  {
    "eventName": "newCatch",
    "endpointUrl":"http://example/webhook",
  } ``` 
  ```


### DELETE DELETE /fishing-club/catch/removeWebhookEvent/:userId/:eventName

- Description: This endpoint allows users to remove a webhook event from their account.
- Authentication: Requires authentication.
- Query parameters:
 - `userId` (required): The unique identifier of the user whose webhook event should be removed.
 - `eventName` (required): The name of the webhook event to be removed.
   - Possible events:  `newCatch`
 - Example: `DELETE /fishing-club/catch/removeWebhookEvent/{userId}/newCatch`
- Response: 204 No Content


## Member Endpoints

### GET /fishing-club/member

- Description: Retrieve a list of members.
- Authentication: None required.
- Query Parameters:
  - `page` (optional): Specifies the page number for pagination (default: 1).
  - `perPage` (optional): Specifies the number of items per page (default: 50).
- Example: Get a list of members with pagination:
  - Request: `GET /fishing-club/member?page=2&perPage=20`
  - Response: Retrieves a paginated list of members where each page contains 20 catches, and this request fetches the second page.

### GET /fishing-club/member/:id

- Description: Retrieve a specific member by ID.
- Authentication: Requires authentication.
- Example: `GET /fishing-club/member/{memberId}`.

### POST /fishing-club/member

- Description: Create a new member.
- Authentication: Requires authentication.
- Parameters:
  - `firstName` (required): The first name of the member.
  - `lastName` (required): The last name of the member.
  - `email` (required): The email (has to be unique)
  - Example: `POST /fishing-club/member`
  ```json
  {
    "firstName": "Anna",
    "lastName":"Svensson",
    "email": "example@mail.com
  } ``` 
  ```


### PUT /fishing-club/member/:id

- Description: Update a specific member by ID.
- Authentication: Requires authentication.
- Example: `PUT /fishing-club/member/{memberId}`

### DELETE /fishing-club/member/:id

- Description: Delete a specific member by ID.
- Authentication: Requires authentication.
- Example:`DELETE /fishing-club/member/{memberId}`
- Response: 204 No Content
