/*
**
** Copyright (c) 2024, Oracle and/or its affiliates.
** All rights reserved
** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl/
*/
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const cron = require('node-cron'); // Added node-cron
const oracledb = require('oracledb');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectString: process.env.CONNECT_STRING
};

const emailConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
};

// --- FUNCTIONS ---

// 1. Fetch contracts expiring TODAY (or standard dynamic date)
async function getExpiringContracts() {
  let connection;
  try {
    connection = await oracledb.getConnection(dbConfig);

    // Uses TRUNC(SYSDATE) to match contracts expiring today dynamically
    const query = `
      SELECT 
          u.user_id, 
          u.name, 
          u.email, 
          TO_CHAR(c.contract_end_date, 'YYYY-MM-DD') AS contract_end_date,
          c.contract_id
      FROM 
          users u
      INNER JOIN 
          contracts c ON u.user_id = c.user_id
      WHERE 
          TRUNC(c.contract_end_date) = TRUNC(SYSDATE)
    `;

    const result = await connection.execute(query, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    return result.rows;

  } catch (err) {
    console.error('Database connection or query error:', err);
    return [];
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
}

// 2. Send the email notification
async function sendEmail(toEmail, userName, contractId, expirationDate) {
  const transporter = nodemailer.createTransport(emailConfig);

  const mailOptions = {
    from: `"Contract Management Team" <${emailConfig.auth.user}>`,
    to: toEmail,
    subject: `URGENT: Contract ${contractId} Expires on ${expirationDate}`,
    text: `Hello ${userName},\n\nThis is an automated reminder that your contract (ID: ${contractId}) is expiring on ${expirationDate}.\n\nPlease take immediate action to renew or review.\n\nBest regards,\nContract Management Team`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${toEmail} (Contract ID: ${contractId})`);
  } catch (err) {
    console.error(`Failed to send email to ${toEmail}:`, err);
  }
}

// --- MAIN EXECUTION ---
async function run() {
  console.log(`[${new Date().toISOString()}] Checking for expiring contracts...`);
  
  const expiringContracts = await getExpiringContracts();
  if (expiringContracts.length === 0) {
    console.log('No contracts expiring today.');
    return;
  }

  for (const contract of expiringContracts) {
    if (contract.EMAIL) {
      await sendEmail(
        contract.EMAIL, 
        contract.NAME, 
        contract.CONTRACT_ID, 
        contract.CONTRACT_END_DATE
      );
    }
  }
}

// --- SCHEDULE CRON JOB ---
// Runs daily at 09:00 AM ('0 9 * * *')
cron.schedule('0 9 * * *', () => {
  run();
});

// --- EXPRESS SETUP ---
app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

// Routes
const routes = require('./routes/connection.cjs');
const contractRoutes = require('./routes/contractRoutes.cjs');
app.use('/api/users', routes);
app.use('/api/contracts', contractRoutes);
app.use(express.static('public'));

// Error handling
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).send({
        errorCode: err.code,
        errorMessage: err.message
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});