const https = require('https');
const p = require('./package.json');

const PROJECT_NAME = '@rmr/use-dropdown';
const WEBHOOK_URL = 'hooks.slack.com';
const path = '/services/T02AFEJJV/B015SMUG04R/anZaOW8Q8Bebu6EIYStNRWPE';

const message = {
  text: `A new version of ${PROJECT_NAME} has been published`,
  attachments: [
    {
      color: '#97ef32',
      fields: [
        {
          title: 'Package',
          value: PROJECT_NAME,
          short: true,
        },
        {
          title: 'Version',
          value: p.version,
          short: true
        }
      ]
    }
  ]
};

function sendMessage() {
  const messageBody = JSON.stringify(message);

  return new Promise((resolve, reject) => {
    const requestOptions = {
      host: WEBHOOK_URL,
      path,
      method: 'POST',
      header: {
        'Content-Type': 'application/json'
      }
    };

    const request = https.request(requestOptions, (res) => {
      res.on('end', () => {
        resolve(res);
      });
    });

    request.on('error', (e) => {
      reject(e);
    });

    request.write(messageBody);
    request.end();
  })
}

(async function () {
  console.log('Sending slack message');
  try {
    const response = await sendMessage();
    console.log('Message response:', response);
  } catch (e) {
    console.error('Error:', e);
  }
})();
