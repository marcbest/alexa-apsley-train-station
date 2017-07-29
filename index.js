'use strict';
var Alexa = require('alexa-sdk');
var Rail = require('national-rail-darwin');
// Load http://lite.realtime.nationalrail.co.uk/openldbws/ token from env variable
var client = new Rail(process.env.DARWIN_TOKEN);

var APP_ID = process.env.APP_ID;

var SKILL_NAME = "Apsley Train Station Information";
var LAUNCH_MESSAGE = "Welcone to Apsley train station information, ask when the next train to london or home is, how can I help?"
var HELP_MESSAGE = "Aplsey train station information, ask me when the next train to London is or if there are delays... What can I help you with?";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "Bye!";
var ERROR_MESSAGE = "Sorry no train information was able to be retrieved at this time, this could be that there are no trains scheduled for the next two hours";


exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', LAUNCH_MESSAGE, HELP_REPROMPT);
    },
    'NextTrainToEuston': function () {
        var self = this;
        client.getDepartureBoardWithDetails('APS', {filter: 'EUS'}, function(err, result) {
            if (err || result === 'undefined' || result.trainServices.length === 0) {
                self.emit(':tellWithCard', ERROR_MESSAGE, SKILL_NAME, ERROR_MESSAGE);
            } else {
                var info = "The next train to London Euston is scheduled at " + result.trainServices[0].std + " and is expected " + result.trainServices[0].etd;
                self.emit(':tellWithCard', info, SKILL_NAME, info);
            }
        });
    },
    'NextTrainToApsley': function () {
        var self = this;
        client.getDepartureBoardWithDetails('EUS', {filter: 'APS'}, function(err, result) {
            if (err || result === 'undefined' || result.trainServices.length === 0) {
                self.emit(':tellWithCard', ERROR_MESSAGE, SKILL_NAME, ERROR_MESSAGE);
            } else {
                var info = "The next train to Apsley is scheduled at " + result.trainServices[0].std + " and is expected " + result.trainServices[0].etd;
                self.emit(':tellWithCard', info, SKILL_NAME, info);
            }
        });
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', HELP_MESSAGE, HELP_REPROMPT);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', STOP_MESSAGE);
    }
};
