import test from 'ava';
import { Request } from 'alexa-annotations';
import { handler as Skill } from '..';

test('AboutIntent', t => {
  const event = Request.intent('AboutIntent').build();

  return Skill(event).then(response => {

    const expectedText = 'Meezan is a Quran skill for Alexa. An audio file follows.';

    // Test structure and version of response.
    t.is(response.version, '1.0');
    t.truthy(response.response);
    t.truthy(response.response.shouldEndSession);
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');

    // Test about content is well formed.
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  });
});
