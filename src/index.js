/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

/**
 * This simple sample has no external dependencies or session management, and shows the most basic
 * example of how to create a Lambda function for handling Alexa Skill requests.
 *
 * Examples:
 * One-shot model:
 *  User: "Alexa, ask Space Geek for a space fact"
 *  Alexa: "Here's your space fact: ..."
 */

/**
 * App ID for the skill
 */
var APP_ID = undefined; //OPTIONAL: replace with "amzn1.echo-sdk-ams.app.[your-unique-value-here]";

/**
 * Array containing Riddles.
 */
var Riddles = [
  "You play with me at night before going to sleep. You can’t get caught fiddling with me at work. You only let a select few people touch me. What am I?",
  "What’s a four-letter word that ends in K and means the same as intercourse?",
  "I start with a V and every woman has one. She can even use me to get what she wants. What am I?",
  "I come in a lot of different sizes. Sometimes, I drip a little. If you blow me, it feels really good. What am I?",
  "What’s in a man’s pants that you won’t find in a girl’s dress?",
  "You stick your poles inside me. You tie me down to get me up. I get wet before you do. What am I?",
  "What’s long and hard and has cum in it?",
  "If I miss, I might hit your bush. It’s my job to stuff your box. When I come, it’s news. What am I?",
  "What four-letter word begins with “f” and ends with “k,” and if you can’t get it you can always just use your hands?",
  "All day long it’s in and out. I discharge loads from my shaft. Both men and women go down on me. What am I?",
  "I’m spread out before being eaten. Your tongue gets me off. People sometimes lick my nuts. What am I?",
  "Arnold Schwarzenegger’s is really long. Michael J. Fox’s is short. Daffy Duck’s isn’t human. Madonna doesn’t have one. What am I?",
  "What is hard and hairy on the outside, soft and wet on the inside? The word begins with C, ends in T, and there’s a U and an N between them.",
  "I start with a “p” and ends with “o-r-n,” and I’m a major player in the film industry. What am I?",
  "My business is briefs. I’m a cunning linguist. I plead and plead for it regularly. What am I?",
  "You get a lot of it if you’re powerful and successful, but significantly less when you’re just starting out. You sometimes do it with yourself, but it’s a lot better when you do it with another person. What am I talking about?",
  "Name a word that starts with “f” and ends with “u-c-k”?",
  "I have a stiff shaft. My tip penetrates. I come with a quiver. What am I?",
  "I go in hard but come out soft, and I never mind if you want to blow me. What am I?",
  "What does a dog do that a man steps into?",
  "I’m great for protection. You use your fingers to get me off. What am I?",
  "What gets longer if pulled, fits snugly between breasts, slides neatly into a hole, chokes people when used incorrectly, and works well when jerked?",
  "What’s beautiful and natural, but gets prickly if it isn’t trimmed regularly?",
  "All men have one, but it’s longer on some than others. The Pope never uses his, and a man gives it to his wife once they’re married.",
  "I assist with erections. Sometimes, giant balls hang from me. I’m known as a big swinger. What am I?",
  "You find me in a guy’s pants. I’m about six inches long, I have a head, and some women love to blow me. What am I?",
  "When I go in, I can cause some pain. I’ll fill your holes when you ask me to. I also ask that you spit, and not swallow. What am I?",
  "Why do women pay more attention to their appearance than improving their minds?",
  "I grow in a bed, first white then red, and the plumper I get, the better women like me. What am I?",
  "I’m the highlight of many dates. I’m especially responsive when you put your fingers deep inside me. What am I?"

];

/**
 * The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * SpaceGeek is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Fact = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
DirtyRiddle.prototype = Object.create(AlexaSkill.prototype);
DirtyRiddle.prototype.constructor = DirtyRiddle;

DirtyRiddle.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    //console.log("onSessionStarted requestId: " + sessionStartedRequest.requestId + ", sessionId: " + session.sessionId);
    // any initialization logic goes here
};

DirtyRiddle.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    //console.log("onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    handleNewDirtyRiddleRequest(response);
};

/**
 * Overridden to show that a subclass can override this function to teardown session state.
 */
DirtyRiddle.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    //console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId + ", sessionId: " + session.sessionId);
    // any cleanup logic goes here
};

DirtyRiddle.prototype.intentHandlers = {
    "GetNewDirtyRiddleIntent": function (intent, session, response) {
        handleNewDirtyRiddleRequest(response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can say tell me a riddle, or, you can say exit... What can I help you with?", "What can I help you with?");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

/**
 * Gets a random new DirtyRiddle from the list and returns to the user.
 */
function handleNewDirtyRiddleRequest(response) {
    // Get a random space fact from the space Riddles list
    var riddleIndex = Math.floor(Math.random() * Riddles.length);
    var randomRiddle = Riddles[riddleIndex];

    // Create speech output
    var speechOutput = "Here's your riddle: " + randomRiddle;
    var cardTitle = "Your Riddle";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the SpaceGeek skill.
    var riddle = new DirtyRiddle();
    riddle.execute(event, context);
};
