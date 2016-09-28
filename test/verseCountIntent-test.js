import test from 'ava';
import { Request } from 'alexa-annotations';
import { handler as Skill } from '..';

test('VerseCountIntent', t => {
  const event = Request.intent('VerseCountIntent', { Chapter: '1' }).build();

  return Skill(event).then(response => {
    const expectedText = 'Chapter 1, Surah Al-Faatiha, which means The Opening has 7 verses.';
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: expectedText },
        card: { type: 'Simple', title: 'Meezan', content: expectedText },
      },
    });
  });
});
