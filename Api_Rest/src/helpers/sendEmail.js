const mailchimpTx = require('mailchimp_transactional')('md-EzShQeAbtCt7txm3Ubeqsw');

// https://mailchimp.com/developer/transactional/guides/send-first-email/

async function run() {
  const response = await mailchimpTx.users.ping();
  console.log(response);
}

run();