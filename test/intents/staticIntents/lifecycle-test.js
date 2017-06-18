import test from 'ava';
import Request from 'alexa-request';
import Skill from '../../../src/index';
import verifyAudioDirective from '../../helpers/verifyAudioDirective';

test('LaunchRequest', async t => {
  const event = Request.launchRequest().build();
  const launchResponse = await Skill(event);

  t.deepEqual(launchResponse, {
    version: '1.0',
    response: {
      shouldEndSession: true,
      outputSpeech: { type: 'PlainText', text: 'Meezan launched!' },
    },
  });
});

test('SessionEndedRequest', async t => {
  const event = Request.sessionEndedRequest().build();
  const sessionEndedResponse = await Skill(event);

  verifyAudioDirective(t, sessionEndedResponse, 'Goodbye!', null, null);
  const firstAudioDirective = sessionEndedResponse.response.directives[0];
  t.is(firstAudioDirective.type, 'AudioPlayer.ClearQueue');
  t.is(firstAudioDirective.clearBehavior, 'CLEAR_ALL');
});

test('CancelIntent', async t => {
  const event = Request.intent('AMAZON.CancelIntent').build();
  const cancelResponse = await Skill(event);

  verifyAudioDirective(t, cancelResponse, 'Goodbye!', null, null);
  const firstAudioDirective = cancelResponse.response.directives[0];
  t.is(firstAudioDirective.type, 'AudioPlayer.ClearQueue');
  t.is(firstAudioDirective.clearBehavior, 'CLEAR_ALL');
});

test('StopIntent', async t => {
  const event = Request.intent('AMAZON.StopIntent').build();

  const stopResponse = await Skill(event);
  verifyAudioDirective(t, stopResponse, 'Goodbye!', null, null);
  const firstAudioDirective = stopResponse.response.directives[0];
  t.is(firstAudioDirective.type, 'AudioPlayer.ClearQueue');
  t.is(firstAudioDirective.clearBehavior, 'CLEAR_ALL');
});

test('HelpIntent', async t => {
  const event = Request.intent('AMAZON.HelpIntent').build();
  const helpResponse = await Skill(event);

  const expectedText = 'Here are some things you can say';

  // Test structure and version of response.
  t.is(helpResponse.version, '1.0');
  t.truthy(helpResponse.response);
  t.falsy(helpResponse.response.shouldEndSession);
  t.truthy(helpResponse.response.outputSpeech);
  t.is(helpResponse.response.outputSpeech.type, 'PlainText');
  t.falsy(helpResponse.response.card);

  // Test help content is well formed.
  t.truthy(helpResponse.response.outputSpeech.text.startsWith(expectedText));
});
