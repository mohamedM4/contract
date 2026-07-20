const express = require('express');
// Changed from require() to import
const connectionController = require('../utils/rest-services/connection.cjs');

const router = express.Router();

// This handles POST requests to exactly "/api/contracts/"
router.post('/', async (req, res, next) => {
    try {
        const binds = req.body;
        const contract = await connectionController.saveContract(binds);
        res.send(contract.rows);
        
        // Note: You usually don't need next() after sending a response 
        // unless you have subsequent middleware executing for this same route.
        next(); 
    } catch (error) {
        next(error);
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;      
        // Pass the user ID down to your database query method
        const contracts = await connectionController.getContractByUserId({ user_id: id });
        
        res.send(contracts.rows);
        
    } catch (error) {
        next(error); 
    }
});
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;      
        const userId = req.body.userId; 

        const result = await connectionController.deleteContract({ 
            contractId: id, 
            userId: userId 
        });
        if (result.rowsAffected === 0) {
            return res.status(404).json({ message: 'Contract not found or unauthorized' });
        }
        res.send(result.rows);
        
    } catch (error) {
        next(error); 
    }
});
// ASSUMPTION: You have auth middleware that populates req.user
router.put('/:id', async (req, res, next) => {
    try {        
        // Combine URL parameters, request body, and authenticated user info
        const binds = {
            ...req.body,
            CONTRACT_ID: req.params.id, // Grab ID from /api/contracts/2
            USER_ID: req.user ? req.user.id : req.body.USER_ID // Fallback to body for testing if auth middleware isn't setup yet
        };

        console.log("Incoming Payload:", req.body);
        console.log("BINDS:", binds);
        
        const result = await connectionController.updateContractByUserId(binds);
        
        // Oracle returns rowsAffected for UPDATE queries
        if (result.rowsAffected && result.rowsAffected > 0) {
            res.status(200).json({ 
                success: true, 
                message: "Contract updated successfully.",
                rowsAffected: result.rowsAffected 
            });
        } else {
            // If 0 rows were affected, either the contract doesn't exist or doesn't belong to this USER_ID
            res.status(404).json({ 
                success: false, 
                message: "Contract not found or unauthorized." 
            });
        }
    } catch (error) {
        next(error); 
    }
});
module.exports = router;
