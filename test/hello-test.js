import test from 'ava';
import { handler as Skill } from '..';
import { Request } from 'alexa-annotations';

test('Hello intent', t => {
  const event = Request.intent('hello', { name: 'world' }).build();

  return Skill(event).then(response => {
    t.deepEqual(response, {
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText', text: 'Hello world' },
        card: { type: 'Simple', title: 'Meezan', content: 'Hello world' }
      }
    });
  });
});