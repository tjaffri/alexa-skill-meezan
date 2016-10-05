import test from 'ava';
import { Request } from 'alexa-annotations';
import { handler as Skill } from '..';

test('PlayVerseNumberByChapterNameIntent', t => {
  const event = Request.intent('PlayVerseNumberByChapterNameIntent', { ChapterName: 'Faatiha', VerseNumber: '3' }).build();

  return Skill(event).then(response => {

    const expectedText = 'Reciting ';
    const expectedUrl = 'https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/001003.mp3';

    // Test structure and version of response.
    t.is(response.version, '1.0');
    t.truthy(response.response);
    t.truthy(response.response.shouldEndSession);
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');

    // audio directive should point to the correct mp3 file.
    t.truthy(response.response.directives);
    t.is(response.response.directives.length, 1);
    t.is(response.response.directives[0].type, 'AudioPlayer.Play');
    t.is(response.response.directives[0].playBehavior, 'REPLACE_ALL');
    t.truthy(response.response.directives[0].audioItem);
    t.truthy(response.response.directives[0].audioItem.stream);
    t.is(response.response.directives[0].audioItem.stream.url, expectedUrl);

    // audio directive should contain a valid token.
    t.truthy(response.response.directives[0].audioItem.stream.token);
    const parsedToken = JSON.parse(response.response.directives[0].audioItem.stream.token);
    t.is(parsedToken.ChapterNumber, '1');
    t.is(parsedToken.VerseNumber, '3');

    // Test content is well formed.
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  });
});

test('PlayVerseByNumbersIntent with Invalid Parameters', t => {
  const event = Request.intent('PlayVerseByNumbersIntent', { ChapterNumber: '1', VerseNumber: '200' }).build();

  return Skill(event).then(response => {

    const expectedText = 'Hmm, I ran into a problem';

    // Test structure and version of response.
    t.is(response.version, '1.0');
    t.truthy(response.response);
    t.truthy(response.response.shouldEndSession);
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');

    // audio directive should not exist for invalid parameters
    t.falsy(response.response.directives);

    // Test content is well formed.
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  });
});
