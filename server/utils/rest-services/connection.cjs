/*
**
** Copyright (c) 2024, Oracle and/or its affiliates.
** All rights reserved
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/

const db = require('../db/index.cjs');

exports.saveUser = async function (binds) {
    const connection = await db.getConnection();
    const sql = `
        INSERT INTO USERS (name, email, password) 
        VALUES (:name, :email, :password)
    `;
    try {
        // 1. Fixed the typo 'connnection'
        // 2. Added await so the query executes before the connection closes
        const result = await connection.execute(sql, binds);
        // Note: If autoCommit isn't globally enabled, you might need: 
        // await connection.commit();
        return result;
    } finally {
        await connection.close();
    }
};
const oracledb = require('oracledb'); // Ensure oracledb is imported to use the constant

exports.verifyUserCredentials = async function (binds) {
    const connection = await db.getConnection();
    
    // Oracle will return the column name as UPPERCASE ('USER_ID')
    const sql = `
        SELECT user_id 
        FROM USERS 
        WHERE email = :email
        AND password = :password
    `;
    
    try {
        const result = await connection.execute(
            sql, 
            binds, 
            { outFormat: oracledb.OUT_FORMAT_OBJECT } // Forces the result format to be an object
        );
        
        if (result.rows && result.rows.length > 0) {
            const firstRow = result.rows[0];
            
            // Accessing the property using Oracle's default uppercase key
            return firstRow.USER_ID; 
        }
        
        return null; 
        
    } catch (error) {
        console.error("Database query failed:", error);
        throw error;
    } finally {
        await connection.close();
    }
};

exports.updateContractByUserId = async function (binds) {
    const connection = await db.getConnection();
    const sql = `
        SELECT * FROM USERS 
        WHERE email = :email
    `;
    try {
        // Added await to ensure the query resolves before closing
        const result = await connection.execute(sql, binds);
        return result;
    } finally {
        await connection.close();
    }
};

exports.getContractByUserId = async function (binds) {
    const connection = await db.getConnection();
    const sql = `
        SELECT
            CONTRACTS.*,
            CONTRACTS.CONTRACT_ID AS "$self"
        FROM
            CONTRACTS
        WHERE
            CONTRACTS.USER_ID = :user_id
    `;
    // 1. Added await here so the execution completes before closing the connection
    const result = await connection.execute(sql, binds);
    
    await connection.close();
    return result;
};
exports.saveContract = async function (binds) {
    const connection = await db.getConnection();
    const sql = `
        INSERT INTO CONTRACTS (
            USER_ID,
            TITLE,
            CONTRACT_TYPE,
            CONTRACT_START_DATE,
            CONTRACT_END_DATE,
            COUNTERPARTY_NAME,
            STATUS
        ) VALUES (
            :user_id,
           :title,
           :contractType,
           TO_DATE(:contractStartDate, 'YYYY-MM-DD'),
           TO_DATE(:contractEndDate, 'YYYY-MM-DD'),
           :counterpartyName,
           :status
        )
    `;
    try {
        const result = await connection.execute(sql, binds);
        return result;
    } finally {
        await connection.close();
    }
};
exports.updateContractByUserId = async function (binds) {
    const connection = await db.getConnection();
    
    const sql = `
        UPDATE CONTRACTS 
        SET 
            TITLE = :TITLE,
            CONTRACT_TYPE = :CONTRACT_TYPE,
            CONTRACT_START_DATE = TO_DATE(:CONTRACT_START_DATE, 'YYYY-MM-DD HH24:MI:SS'),
            CONTRACT_END_DATE = TO_DATE(:CONTRACT_END_DATE, 'YYYY-MM-DD HH24:MI:SS'),
            COUNTERPARTY_NAME = :COUNTERPARTY_NAME,
            STATUS = :STATUS
        WHERE 
            CONTRACT_ID = :CONTRACT_ID
            AND USER_ID = :USER_ID
    `;

    try {
        const sanitizedBinds = {};
        
        for (const key in binds) {
            let val = binds[key];

            // 1. Handle undefined values
            if (val === undefined) {
                val = null;
            }
            
            // 2. Format ISO Date strings to Oracle-friendly strings ('2026-07-15 00:00:00')
            if (typeof val === 'string' && (key === 'CONTRACT_START_DATE' || key === 'CONTRACT_END_DATE')) {
                // Converts "2026-07-15T00:00:00.000Z" -> "2026-07-15 00:00:00"
                val = val.replace('T', ' ').split('.')[0];
            }

            sanitizedBinds[key] = val;
        }

        // execute takes (sql, bindParams, options)
        const result = await connection.execute(sql, sanitizedBinds, { autoCommit: true });
        return result;
        
    } finally {
        // Connection always returns to the pool even if the execution fails
        if (connection) {
            await connection.close();
        }
    }
};
exports.deleteContract = async function (binds) {
    const connection = await db.getConnection();
    const sql = `
        DELETE FROM CONTRACTS 
        WHERE 
            CONTRACT_ID = :contractId
            AND USER_ID = :userId
    `;
    try {
        // Added autoCommit so the change is permanent
        const result = await connection.execute(sql, binds, { autoCommit: true });
        return result;
    } finally {
        await connection.close();
    }
};