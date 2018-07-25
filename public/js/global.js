
/* global ConversationPanel: true, PayloadPanel: true*/
/* eslint no-unused-vars: "off" */

// Other JS files required to be loaded first: apis.js, conversation.js, payload.js

import { PayloadPanel } from './payload';
import { ConversationPanel } from './conversation';

export const Global = (function() {
  // Initialize all modules
  ConversationPanel.init();
  PayloadPanel.init();
})();
