/*
**
** Copyright (c) 2024, Oracle and/or its affiliates.
** All rights reserved
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
/* eslint-env node */
const express = require( 'express' );
const router = express.Router();

// Require controller module
const connectionController = require( '../utils/rest-services/connection.cjs' );

router.post('/',async (req,res,next) => {
    try {
        const binds = req.body;
        const user = await connectionController.saveUser(binds);
        res.send(user.rows);
        next();
    } catch(error) {
        next(error);
    }
})
router.post('/login', async (req, res, next) => {
    try {
        const binds = req.body;
        // 1. Capture the returned ID (or null) instead of a boolean
        const userId = await connectionController.verifyUserCredentials(binds);
        
        // 2. If userId is null, the credentials were invalid
        if (!userId) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid email or password." 
            });
        }
        
        // 3. Return the captured userId in the JSON response
        return res.status(200).json({
            id: userId, // Fixed: Use the 'userId' variable here
            success: true, 
            message: "Login successful!" 
        });

    } catch (error) {
        next(error); 
    }
});
router.get('/:email',async (req,res,next)=> {
    try {
        const binds = {
            email: req.params.email
        }
        const users = await connectionController.getUserByEmail(binds);
        if (users && users.rows && users.rows.length > 0) {
            res.send(users.rows);
        } else {
            res.status(404).json({ message: "No data found for this email." });
        }
        next();
    } catch(error) {
        next(error);
    }
})
module.exports = router;
