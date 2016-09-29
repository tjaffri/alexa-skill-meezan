import test from 'ava';
import { Request } from 'alexa-annotations';
import { handler as Skill } from '..';

test('ChapterCountIntent', t => {
  const event = Request.intent('ChapterCountIntent').build();

  return Skill(event).then(response => {
    const expectedText = 'The Holy Quran contains 114 chapters';

    // Test structure and version of response.
    t.is(response.version, '1.0');
    t.truthy(response.response);
    t.truthy(response.response.shouldEndSession);
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');
    t.truthy(response.response.card);
    t.is(response.response.card.type, 'Simple');

    // Test response content is well formed.
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  });
});
