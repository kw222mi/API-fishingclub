# API Documentation

This document provides information about the endpoints available in the API.

The base URL for this API is https://cscloud8-26.lnu.se/api/fishing-club

## Catch Endpoints

### GET /catch

- Description: Retrieve a list of catches with pagination support.
- Authentication: Requires authentication.
- Query Parameters:
  - `page` (optional): Specifies the page number for pagination (default: 1).
  - `perPage` (optional): Specifies the number of items per page (default: 50).
- Example: Get a list of catches with pagination:
  - Request: `GET /catch?page=2&perPage=20`
  - Response: Retrieves a paginated list of catches where each page contains 20 catches, and this request fetches the second page.


### GET /catch/:id

- Description: Retrieve a specific catch by ID.
- Authentication: Requires authentication.
- Example: Get a specific catch by ID.

### POST /catch

- Description: Create a new catch.
- Authentication: Requires authentication.
- Example: Create a new catch.

### PUT /catch/:id

- Description: Update a specific catch by ID.
- Authentication: Requires authentication.
- Example: Update a specific catch by ID.

### DELETE /catch/:id

- Description: Delete a specific catch by ID.
- Authentication: Requires authentication.
- Example: Delete a specific catch by ID.
- Response: 204 No Content

### POST /catch/addWebhookEvent/:userId

- Description: Add a webhook event to a get data sent when a new catch is added. 
- Authentication: Requires authentication.
- Example: Add a webhook event to a user.
- Request: `POST /catch/addWebhookEvent/{userId}`
```json
{
    "eventName" : "newCatch",
    "endpointUrl" : "https://examplepage/webhook"
}
```
### DELETE DELETE /catch/removeWebhookEvent/:userId/:eventName

- Description: This endpoint allows users to remove a webhook event from their account.
- Authentication: Requires authentication.
- Parameters:
 - `userId` (required): The unique identifier of the user whose webhook event should be removed.
 - `eventName` (required): The name of the webhook event to be removed.
- Response: 204 No Content


## Member Endpoints

### GET /member

- Description: Retrieve a list of members.
- Authentication: None required.
- Query Parameters:
  - `page` (optional): Specifies the page number for pagination (default: 1).
  - `perPage` (optional): Specifies the number of items per page (default: 50).
- Example: Get a list of members with pagination:
  - Request: `GET /member?page=2&perPage=20`
  - Response: Retrieves a paginated list of members where each page contains 20 catches, and this request fetches the second page.

### GET /member/:id

- Description: Retrieve a specific member by ID.
- Authentication: Requires authentication.
- Example: Get a specific member by ID.

### POST /member

- Description: Create a new member.
- Authentication: Requires authentication.
- Example: Create a new member.

### PUT /member/:id

- Description: Update a specific member by ID.
- Authentication: Requires authentication.
- Example: Update a specific member by ID.

### DELETE /member/:id

- Description: Delete a specific member by ID.
- Authentication: Requires authentication.
- Example: Delete a specific member by ID.
- Response: 204 No Content
