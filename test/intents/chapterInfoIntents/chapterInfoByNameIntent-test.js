import test from 'ava';
import Request from 'alexa-request';
import Skill from '../../../src/index';

test('ChapterInfoByNameIntent for Surah Al-Faatiha', t => {
  const event = Request.intent('ChapterInfoByNameIntent', { chapterName: 'Al-Faatiha' }).build();

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

test('ChapterInfoByNameIntent for Surah Yusuf ', t => {
  const event = Request.intent('ChapterInfoByNameIntent', { chapterName: 'Yusuf' }).build();

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

test('ChapterInfoByNameIntent for Surah Yaseen with case insensitive comparison', t => {
  const event = Request.intent('ChapterInfoByNameIntent', { chapterName: 'yaseen' }).build();

  return Skill(event).then(response => {
    const expectedText = 'Chapter 36, Surah Yaseen, which means Yaseen, has 83 verses. It is a Meccan revelation.';
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

