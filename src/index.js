/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This sample shows how to create a Lambda function for handling Alexa Skill requests that:
 *
 * - Session State: Handles a multi-turn dialog model.
 * - Custom slot type: demonstrates using custom slot types to handle a finite set of known values
 * - SSML: Using SSML tags to control how Alexa renders the text-to-speech.
 *
 * Examples:
 * Dialog model:
 *  User: "Alexa, ask Wise Guy to tell me a knock knock joke."
 *  Alexa: "Knock knock"
 *  User: "Who's there?"
 *  Alexa: "<phrase>"
 *  User: "<phrase> who"
 *  Alexa: "<Punchline>"
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

/**
 * Array containing knock knock jokes.
 */

var RIDDLE_LIST = [{
    setup: "You play with me at night before going to sleep. You can’t get caught fiddling with me at work. You only let a select few people touch me. What am I?",
    answer: "Your Cell Phone"
  },{
    setup: "What’s a four-letter word that ends in K and means the same as intercourse?",
    answer: "Talk."
  },{
    setup: "I start with a V and every woman has one. She can even use me to get what she wants. What am I?",
    answer: "Her Voice."
  },          {
    setup: "I come in a lot of different sizes. Sometimes, I drip a little. If you blow me, it feels really good. What am I?",
    answer: "Your Nose."
  },{
    setup: "What’s in a man’s pants that you won’t find in a girl’s dress?",
    answer: "Pockets."
  },{
    setup: "You stick your poles inside me. You tie me down to get me up. I get wet before you do. What am I?",
    answer: "A tent."
  },{
    setup: "What’s long and hard and has cum in it?",
    answer: "A Cucumber."
  },{
    setup: "If I miss, I might hit your bush. It’s my job to stuff your box. When I come, it’s news. What am I?",
    answer: "The paperboy."
  },{
    setup: "What four-letter word begins with “f” and ends with “k,” and if you can’t get it you can always just use your hands?",
    answer: "A fork."
  },{
    setup: "All day long it’s in and out. I discharge loads from my shaft. Both men and women go down on me. What am I?",
    answer: "An elevator."
  },{
    setup: "I’m spread out before being eaten. Your tongue gets me off. People sometimes lick my nuts. What am I?",
    answer: "Peanut butter."
  },{
    setup: "Arnold Schwarzenegger’s is really long. Michael J. Fox’s is short. Daffy Duck’s isn’t human. Madonna doesn’t have one. What am I?",
    answer: "A last name."
  },{
    setup: "What is hard and hairy on the outside, soft and wet on the inside? The word begins with C, ends in T, and there’s a U and an N between them.",
    answer: "A coconut."
  },{
    setup: "I start with a “p” and ends with “o-r-n,” and I’m a major player in the film industry. What am I?",
    answer: "Popcorn."
  },{
    setup: "My business is briefs. I’m a cunning linguist. I plead and plead for it regularly. What am I?",
    answer: "A lawyer."
  },{
    setup: "You get a lot of it if you’re powerful and successful, but significantly less when you’re just starting out. You sometimes do it with yourself, but it’s a lot better when you do it with another person. What am I talking about?",
    answer: "Email."
  },{
    setup: "Name a word that starts with “f” and ends with “u-c-k”?",
    answer: "Firetruck!"
  },{
    setup: "I have a stiff shaft. My tip penetrates. I come with a quiver. What am I?",
    answer: "An arrow."
  },{
    setup: "I go in hard but come out soft, and I never mind if you want to blow me. What am I?",
    answer: "Bubblegum."
  },{
    setup: "What does a dog do that a man steps into?",
    answer: "Pants."
  },{
    setup: "I’m great for protection. You use your fingers to get me off. What am I?",
    answer: "Gloves."
  },{
    setup: "What gets longer if pulled, fits snugly between breasts, slides neatly into a hole, chokes people when used incorrectly, and works well when jerked?",
    answer: "A seatbelt."
  },{
    setup: "What’s beautiful and natural, but gets prickly if it isn’t trimmed regularly?",
    answer: "The lawn."
  },{
    setup: "All men have one, but it’s longer on some than others. The Pope never uses his, and a man gives it to his wife once they’re married.",
    answer: "His last name."
  },{
    setup: "I assist with erections. Sometimes, giant balls hang from me. I’m known as a big swinger. What am I?",
    answer: "A crane."
  },{
    setup: "You find me in a guy’s pants. I’m about six inches long, I have a head, and some women love to blow me. What am I?",
    answer: "A twenty dollar bill."
  },{
    setup: "When I go in, I can cause some pain. I’ll fill your holes when you ask me to. I also ask that you spit, and not swallow. What am I?",
    answer: "Your dentist."
  },{
    setup: "Why do women pay more attention to their appearance than improving their minds?",
    answer: "Because most men are stupid, but few are blind."
  },{
    setup: "I grow in a bed, first white then red, and the plumper I get, the better women like me. What am I?",
    answer: "A strawberry."
  },{
    setup: "I’m the highlight of many dates. I’m especially responsive when you put your fingers deep inside me. What am I?",
    answer: "A bowling ball."
  },
];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * DirtyRiddleSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var DirtyRiddleSkill = function() {
  AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
DirtyRiddleSkill.prototype = Object.create(AlexaSkill.prototype);
DirtyRiddleSkill.prototype.constructor = DirtyRiddleSkill;

/**
 * Overriden to show that a subclass can override this function to initialize session state.
 */
DirtyRiddleSkill.prototype.eventHandlers.onSessionStarted = function(sessionStartedRequest, session) {
  console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId +
    ", sessionId: " + session.sessionId);

  // Any session init logic would go here.
};

/**
 * If the user launches without specifying an intent, route to the correct function.
 */
DirtyRiddleSkill.prototype.eventHandlers.onLaunch = function(launchRequest, session, response) {
  console.log("DirtyRiddleSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);

  handleTellMeRiddleIntent(session, response);
};

/**
 * Overriden to show that a subclass can override this function to teardown session state.
 */
DirtyRiddleSkill.prototype.eventHandlers.onSessionEnded = function(sessionEndedRequest, session) {
  console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId +
    ", sessionId: " + session.sessionId);

  //Any session cleanup logic would go here.
};

DirtyRiddleSkill.prototype.intentHandlers = {
  "TellMeRiddleIntent": function(intent, session, response) {
    handleTellMeRiddleIntent(session, response);
  },

  "HintIntent": function(intent, session, response) {
    handleWhosThereIntent(session, response);
  },

  "AnswerIntent": function(intent, session, response) {
    handleSetupNameWhoIntent(session, response);
  },

  "AMAZON.HelpIntent": function(intent, session, response) {
    var speechText = "";

    var speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    var repromptOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    // For the repromptText, play the speechOutput again
    response.ask(speechOutput, repromptOutput);
  },

  "AMAZON.StopIntent": function(intent, session, response) {
    var speechOutput = "Goodbye";
    response.tell(speechOutput);
  },

  "AMAZON.CancelIntent": function(intent, session, response) {
    var speechOutput = "Goodbye";
    response.tell(speechOutput);
  }
};

/**
 * Selects a joke randomly and starts it off by saying "Knock knock".
 */
function handleTellMeRiddleIntent(session, response) {
  var speechText = "";

  //Reprompt speech will be triggered if the user doesn't respond.
  var repromptText = "You can ask, tell me a riddle.";

  //Select a random joke and store it in the session variables.
  var jokeID = Math.floor(Math.random() * RIDDLE_LIST.length);

  //The stage variable tracks the phase of the dialogue.
  //When this function completes, it will be on stage 1.
  session.attributes.stage = 1;
  session.attributes.setup = RIDDLE_LIST[jokeID].setup;
  session.attributes.answer = RIDDLE_LIST[jokeID].answer;

  speechText = "Knock knock!";
}

var speechOutput = {
  speech: speechText,
  type: AlexaSkill.speechOutputType.PLAIN_TEXT
};
var repromptOutput = {
  speech: repromptText,
  type: AlexaSkill.speechOutputType.PLAIN_TEXT
};
response.askWithCard(speechOutput, repromptOutput, "Dirty Riddle", speechText);
}

/**
 * Responds to the user saying "Who's there".
 */
function handleHintIntent(session, response) {
  var speechText = "";
  var repromptText = "";

  if (session.attributes.stage) {
    if (session.attributes.stage === 1) {
      //Retrieve the joke's setup text.
      speechText = session.attributes.setup;

      //Advance the stage of the dialogue.
      session.attributes.stage = 2;

      repromptText = "You can ask, " + speechText + " ?";
    } else {
      session.attributes.stage = 1;
      speechText = "That's not how knock knock jokes work! <break time=\"0.3s\" /> " +
        "knock knock";

      repromptText = "You can ask, who's there."
    }
  } else {

    //If the session attributes are not found, the joke must restart.
    speechText = "Sorry, I couldn't correctly retrieve the joke. " +
      "You can say, tell me a riddle";

    repromptText = "You can say, tell me a riddle";
  }

  var speechOutput = {
    speech: '<speak>' + speechText + '</speak>',
    type: AlexaSkill.speechOutputType.SSML
  };
  var repromptOutput = {
    speech: '<speak>' + repromptText + '</speak>',
    type: AlexaSkill.speechOutputType.SSML
  };
  response.ask(speechOutput, repromptOutput);
}

/**
 * Delivers the punchline of the joke after the user responds to the setup.
 */
function handleSetupNameWhoIntent(session, response) {
  var speechText = "",
    repromptText = "",
    speechOutput,
    repromptOutput,
    cardOutput;

  if (session.attributes.stage) {
    if (session.attributes.stage === 2) {
      speechText = session.attributes.speechPunchline;
      cardOutput = session.attributes.answer;
      speechOutput = {
        speech: '<speak>' + speechText + '</speak>',
        type: AlexaSkill.speechOutputType.SSML
      };
      //If the joke completes successfully, this function uses a "tell" response.
      response.tellWithCard(speechOutput, "Wise Guy", cardOutput);
    } else {

      session.attributes.stage = 1;
      speechText = "That's not how knock knock jokes work! <break time=\"0.3s\" /> " +
        "Knock knock!";
      cardOutput = "That's not how knock knock jokes work! " +
        "Knock knock!";

      repromptText = "You can ask who's there.";

      speechOutput = {
        speech: speechText,
        type: AlexaSkill.speechOutputType.SSML
      };
      repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
      };
      //If the joke has to be restarted, this function uses an "ask" response.
      response.askWithCard(speechOutput, repromptOutput, "Wise Guy", cardOutput);
    }
  } else {
    speechText = "Sorry, I couldn't correctly retrieve the joke. " +
      "You can say, tell me a joke";

    repromptText = "You can say, tell me a joke";

    speechOutput = {
      speech: speechText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    repromptOutput = {
      speech: repromptText,
      type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, "Wise Guy", speechOutput);
  }
}

// Create the handler that responds to the Alexa Request.
exports.handler = function(event, context) {
  // Create an instance of the WiseGuy Skill.
  var skill = new DirtyRiddleSkill();
  skill.execute(event, context);
};
