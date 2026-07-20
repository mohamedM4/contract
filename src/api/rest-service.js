const URL = './api/users/'


export const createUser = async (user) => {
    const response = await fetch(URL,{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body:JSON.stringify(user)
    })
    if(!response.ok) {
        throw new Error('failed to create user');
    }
    return response;
};
export const checkUser = async (user) => {
    const response = await fetch('./api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    // 1. Parse the JSON response regardless of status, so we can access error details if they exist
    const data = await response.json();

    // 2. If the response is NOT in the 200-299 range (e.g., 401 Unauthorized)
    if (!response.ok) {
        // Throw an error with the actual message returned by your backend, or fall back to a default
        const errorMessage = data.message || 'Failed to authenticate user';
        throw new Error(errorMessage);
    }

    // 3. Return the parsed data (e.g., { success: true, message: "Login successful!" })
    return data;
};
export const getContract = async (user_id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/contracts/${encodeURIComponent(user_id)}`, {
            method: 'GET',
        })
        if(!response.ok) {
            throw new Error('failed to get contract')
        }
        return response.json();
    } catch (error) {
        console.error("Fetch error:", error);
    }
};
export const createContract = async (contract) => {
    const response = await fetch('http://localhost:3000/api/contracts/',{
        method: 'POST',
        headers: {'Content-type':'application/json'},
        body:JSON.stringify(contract)
    })
    if(!response.ok) {
        throw new Error('failed to create user');
    }
    return response;
};
export const updateContractById = async (contract) => {
    if (!contract?.CONTRACT_ID) {
        throw new Error("Cannot update contract: Missing CONTRACT_ID");
    }

    const response = await fetch(`http://localhost:3000/api/contracts/${encodeURIComponent(contract.CONTRACT_ID)}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contract)
    });

    // Handle HTTP errors cleanly
    if (!response.ok) {
        let errorMessage = `Failed to update contract with ID: ${contract.CONTRACT_ID}`;
        try {
            const errorData = await response.json();
            if (errorData?.message) errorMessage = errorData.message;
        } catch (e) {
            // Fallback if the error response isn't valid JSON
                    throw new Error(errorMessage);
        }
    }

    // Safely parse JSON in case backend returns a 204 No Content empty response
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : { success: true };
};
export const getContractById = async (contract_id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/contracts/${encodeURIComponent(contract_id)}`, {
            method: 'GET',
        })
        if(!response.ok) {
            throw new Error('failed to get contract')
        }
        return response.json();
    } catch (error) {
        console.error("Fetch error:", error);
    }
};
export const deleteContractById = async (contract_id, user_id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/contracts/${encodeURIComponent(contract_id)}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            // CRITICAL FIX: Send userId here so the backend can verify ownership
            body: JSON.stringify({ userId: user_id }) 
        });
        
        if (!response.ok) {
            // Try to extract backend error message if available, otherwise fallback
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to delete contract');
        }
        
        // Safe parsing: Check if there's actual content to parse
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        }
        
        return { success: true }; 
    } catch (error) {
        console.error("Delete error:", error);
        throw error; 
    }
};