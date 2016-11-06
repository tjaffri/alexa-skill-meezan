import test from 'ava';
import Request from 'alexa-request';
import Skill from '../../../src/index';

test('LaunchRequest', t => {
  const event = Request.launchRequest().build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'Meezan launched!' },
      },
    });
  });
});

test('SessionEndedRequest', t => {
  const event = Request.sessionEndedRequest().build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'Goodbye!' },
      },
    });
  });
});

test('CancelIntent', t => {
  const event = Request.intent('AMAZON.CancelIntent').build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'Goodbye!' },
      },
    });
  });
});

test('StopIntent', t => {
  const event = Request.intent('AMAZON.StopIntent').build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'Goodbye!' },
      },
    });
  });
});

test('HelpIntent', t => {
  const event = Request.intent('AMAZON.HelpIntent').build();

  return Skill(event).then(response => {

    const expectedText = 'Here are some things you can say';

    // Test structure and version of response.
    t.is(response.version, '1.0');
    t.truthy(response.response);
    t.falsy(response.response.shouldEndSession);
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');
    t.falsy(response.response.card);

    // Test help content is well formed.
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  });
});
