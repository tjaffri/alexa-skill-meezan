import test from 'ava';
import { Request } from 'alexa-annotations';
import { handler as Skill } from '..';

test('ChapterInfoByNumberIntent for Chapter 1', t => {
  const event = Request.intent('ChapterInfoByNumberIntent', { ChapterNumber: '1' }).build();

  return Skill(event).then(response => {
    const expectedText = 'Chapter 1, Surah Al-Faatiha, which means The Opening, has 7 verses. It is a Meccan revelation.';
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

test('ChapterInfoByNumberIntent for Chapter 12', t => {
  const event = Request.intent('ChapterInfoByNumberIntent', { ChapterNumber: '12' }).build();

  return Skill(event).then(response => {
    const expectedText = 'Chapter 12, Surah Yusuf, which means Joseph, has 111 verses. It is a Meccan revelation.';
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
