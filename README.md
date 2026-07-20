------------------------------------------------------------------------
TABLE OF CONTENTS
------------------------------------------------------------------------
1. Overview
2. User Operations
3. Contract Operations
4. Usage Examples
5. Error Handling


------------------------------------------------------------------------
1. OVERVIEW
------------------------------------------------------------------------
This module wraps JavaScript's native fetch API to handle asynchronous 
HTTP requests to backend endpoints.

NOTE: User endpoints use relative paths (e.g., ./api/users/), while 
Contract endpoints point to http://localhost:3000/api/contracts/. Ensure 
your CORS policy and base URLs are configured appropriately for production.


------------------------------------------------------------------------
2. USER OPERATIONS
------------------------------------------------------------------------

createUser(user)
  - Description: Registers a new user account.
  - Parameter:   user (Object) - User details for registration.
  - Method:      POST
  - Endpoint:    ./api/users/
  - Returns:     Promise<Response>

checkUser(user)
  - Description: Authenticates user login credentials.
  - Parameter:   user (Object) - Login credentials (e.g., email/password).
  - Method:      POST
  - Endpoint:    ./api/users/login
  - Returns:     Promise<Object> - Parsed JSON object response.


------------------------------------------------------------------------
3. CONTRACT OPERATIONS
------------------------------------------------------------------------

getContract(user_id)
  - Description: Fetches contracts associated with a specific user ID.
  - Parameter:   user_id (string | number) - Unique identifier of the user.
  - Method:      GET
  - Endpoint:    http://localhost:3000/api/contracts/{user_id}
  - Returns:     Promise<Object> - Parsed JSON contract data.

createContract(contract)
  - Description: Creates a new contract entry.
  - Parameter:   contract (Object) - Contract details.
  - Method:      POST
  - Endpoint:    http://localhost:3000/api/contracts/
  - Returns:     Promise<Response>

getContractById(contract_id)
  - Description: Retrieves a specific contract using its unique ID.
  - Parameter:   contract_id (string | number) - Unique contract ID.
  - Method:      GET
  - Endpoint:    http://localhost:3000/api/contracts/{contract_id}
  - Returns:     Promise<Object> - Parsed JSON contract data.

updateContractById(contract)
  - Description: Updates an existing contract. Requires CONTRACT_ID key.
  - Parameter:   contract (Object) - Must include CONTRACT_ID property.
  - Method:      PUT
  - Endpoint:    http://localhost:3000/api/contracts/{CONTRACT_ID}
  - Returns:     Promise<Object> - Parsed JSON response or { success: true }.

deleteContractById(contract_id, user_id)
  - Description: Deletes a contract by ID after validating user ownership.
  - Parameters:  contract_id (string | number) - ID of contract to delete.
                 user_id (string | number) - User ID sending request.
  - Method:      DELETE
  - Endpoint:    http://localhost:3000/api/contracts/{contract_id}
  - Body:        { userId: user_id }
  - Returns:     Promise<Object> - Parsed status or { success: true }.


------------------------------------------------------------------------
4. USAGE EXAMPLES
------------------------------------------------------------------------

-- Login Example --
import { checkUser } from './apiService.js';

async function handleLogin() {
  try {
    const result = await checkUser({ email: 'user@example.com', password: 'password123' });
    console.log('Login success:', result);
  } catch (error) {
    console.error('Login failed:', error.message);
  }
}

-- Delete Contract Example --
import { deleteContractById } from './apiService.js';

async function removeContract(contractId, currentUserId) {
  try {
    const result = await deleteContractById(contractId, currentUserId);
    console.log('Contract deleted:', result);
  } catch (error) {
    console.error('Failed to delete contract:', error.message);
  }
}


------------------------------------------------------------------------
5. ERROR HANDLING
------------------------------------------------------------------------
Functions in this module throw standard JavaScript Error objects whenever:
  1. Required parameters (e.g., CONTRACT_ID) are missing.
  2. The HTTP response status code falls outside the 200-299 range.
  3. Network requests fail.

Tip: Always wrap API calls in try...catch blocks or chain .catch() to 
handle exceptions cleanly in your application UI.
