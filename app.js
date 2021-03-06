/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'); // app server
var bodyParser = require('body-parser'); // parser for post requests
var AssistantV1 = require('watson-developer-cloud/assistant/v1'); // watson sdk
const Cloudant = require('@cloudant/cloudant'); // cloudant db



const app = express();

// Bootstrap application settings
app.use(express.static('./public')); // load UI from public folder
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Bootstrap database
const username = process.env.cloudant_username;
const password = process.env.cloudant_password;
const cloudant = Cloudant({ account: username, password: password }); // Database Connection

cloudant.db.list((err, dbs) => {
  console.log(`All my databases: ${dbs.join(',')}`);
})

const mydb = cloudant.db.use('images');
app.get('/data', (req, res) => {
  let data = []
 
  mydb.get('_design/all_images/_view/all', (err, d) => {
    d.rows.forEach((e) => {
      //console.log(e.value.name);
      data.push({"name":e.value.name, "link": e.value.link});
    })
    res.send(data);
  });
})

// Create the service wrapper

var assistant;

if (process.env.ASSISTANT_IAM_APIKEY !== undefined && process.env.ASSISTANT_IAM_APIKEY.length > 0) {
  assistant = new AssistantV1({
    'version': '2018-07-10',
    'url': process.env.ASSISTANT_IAM_URL || '<url>',
    'iam_apikey': process.env.ASSISTANT_IAM_APIKEY || '<iam_apikey>',
    'iam_url': 'https://iam.bluemix.net/identity/token'
  });
} else {
  assistant = new AssistantV1({
    'version': '2018-07-10',
    'username': process.env.ASSISTANT_USERNAME || '<username>',
    'password': process.env.ASSISTANT_PASSWORD || '<password>'
  });
}

// Endpoint to be call from the client side
app.post('/api/message', function (req, res) {
  var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
  if (!workspace || workspace === '<workspace-id>') {
    return res.json({
      'output': {
        'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/assistant-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
      }
    });
  }
  var payload = {
    workspace_id: workspace,
    context: req.body.context || {},
    input: req.body.input || {}
  };

  // Send the input to the assistant service
  assistant.message(payload, function (err, data) {
    if (err) {
      return res.status(err.code || 500).json(err);
    }
    return res.json(updateMessage(payload, data));
  });
});

/**
 * Updates the response text using the intent confidence
 * @param  {Object} input The request to the Assistant service
 * @param  {Object} response The response from the Assistant service
 * @return {Object}          The response with the updated message
 */
function updateMessage(input, response) {
  var responseText = null;
  if (!response.output) {
    response.output = {};
  } else {
    return response;
  }
  if (response.intents && response.intents[0]) {
    var intent = response.intents[0];
    // Depending on the confidence of the response the app can return different messages.
    // The confidence will vary depending on how well the system is trained. The service will always try to assign
    // a class/intent to the input. If the confidence is low, then it suggests the service is unsure of the
    // user's intent . In these cases it is usually best to return a disambiguation message
    // ('I did not understand your intent, please rephrase your question', etc..)
    if (intent.confidence >= 0.75) {
      responseText = 'I understood your intent was ' + intent.intent;
    } else if (intent.confidence >= 0.5) {
      responseText = 'I think your intent was ' + intent.intent;
    } else {
      responseText = 'I did not understand your intent';
    }
  }
  response.output.text = responseText;
  return response;
}

module.exports = {app, mydb};