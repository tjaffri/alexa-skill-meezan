import test from 'ava';
import { Request } from 'alexa-annotations';
import { handler as Skill } from '..';

test('PlayChapterByNumberIntent for Chapter 1', t => {
  const event = Request.intent('PlayChapterByNumberIntent', { ChapterNumber: '1' }).build();

  return Skill(event).then(response => {
    const expectedText = 'Reciting ';

    // Test structure and version of response.
    t.is(response.version, '1.0');
    t.truthy(response.response);
    t.truthy(response.response.shouldEndSession);
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');

    // audio directives should exist
    t.truthy(response.response.directives);
    t.is(response.response.directives.length, 7);

    // audio directives should be well-formed
    for (let i = 0; i < 7; i++) {
      // Test the first audio directive should be RECPLACE_ALL play, while the rest should be queued
      if (i === 0) {
        t.is(response.response.directives[i].playBehavior, 'REPLACE_ALL');
      } else {
        t.is(response.response.directives[i].playBehavior, 'ENQUEUE');
      }

      // Test audio item properties
      t.is(response.response.directives[i].type, 'AudioPlayer.Play');
      t.truthy(response.response.directives[i].audioItem);
      t.truthy(response.response.directives[i].audioItem.stream);

      // Test audio URI
      const paddedVerseString = (i + 1).toString().padStart(3, '0');
      const expectedUrl = `https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/001${paddedVerseString}.mp3`;
      t.is(response.response.directives[i].audioItem.stream.url, expectedUrl);

      // audio directive should contain a valid token.
      t.truthy(response.response.directives[i].audioItem.stream.token);
      const parsedToken = JSON.parse(response.response.directives[i].audioItem.stream.token);
      t.is(parsedToken.ChapterNumber, '1');
      t.is(parsedToken.VerseNumber, (i + 1).toString());
    }

    // Test content is well formed.
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  });
});

test('PlayChapterByNumberIntent for Chapter 9', t => {
  const event = Request.intent('PlayChapterByNumberIntent', { ChapterNumber: '9' }).build();

  return Skill(event).then(response => {
    const expectedText = 'Reciting ';

    // Test structure and version of response.
    t.is(response.version, '1.0');
    t.truthy(response.response);
    t.truthy(response.response.shouldEndSession);
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');

    // audio directives should exist
    t.truthy(response.response.directives);
    t.is(response.response.directives.length, 129);

    // audio directives should be well-formed
    for (let i = 0; i < 129; i++) {
      // Test the first audio directive should be RECPLACE_ALL play, while the rest should be queued
      if (i === 0) {
        t.is(response.response.directives[i].playBehavior, 'REPLACE_ALL');
      } else {
        t.is(response.response.directives[i].playBehavior, 'ENQUEUE');
      }

      // Test audio item properties
      t.is(response.response.directives[i].type, 'AudioPlayer.Play');
      t.truthy(response.response.directives[i].audioItem);
      t.truthy(response.response.directives[i].audioItem.stream);

      // Test audio URI (there is no Bismillah for Chapter 9)
      const paddedVerseString = (i + 1).toString().padStart(3, '0');
      const expectedUrl = `https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/009${paddedVerseString}.mp3`;
      t.is(response.response.directives[i].audioItem.stream.url, expectedUrl);

      // audio directive should contain a valid token.
      t.truthy(response.response.directives[i].audioItem.stream.token);
      const parsedToken = JSON.parse(response.response.directives[i].audioItem.stream.token);
      t.is(parsedToken.ChapterNumber, '9');
      t.is(parsedToken.VerseNumber, (i + 1).toString());
    }

    // Test content is well formed.
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  });
});

test('PlayChapterByNumberIntent for Chapter 12', t => {
  const event = Request.intent('PlayChapterByNumberIntent', { ChapterNumber: '12' }).build();

  return Skill(event).then(response => {
    const expectedText = 'Reciting ';

    // Test structure and version of response.
    t.is(response.version, '1.0');
    t.truthy(response.response);
    t.truthy(response.response.shouldEndSession);
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');

    // audio directives should exist
    t.truthy(response.response.directives);
    t.is(response.response.directives.length, 112);

    // audio directives should be well-formed
    for (let i = 0; i < 112; i++) {
      // Test the first audio directive should be RECPLACE_ALL play, while the rest should be queued
      if (i === 0) {
        t.is(response.response.directives[i].playBehavior, 'REPLACE_ALL');
      } else {
        t.is(response.response.directives[i].playBehavior, 'ENQUEUE');
      }

      // Test audio item properties
      t.is(response.response.directives[i].type, 'AudioPlayer.Play');
      t.truthy(response.response.directives[i].audioItem);
      t.truthy(response.response.directives[i].audioItem.stream);

      // Test audio URI
      if (i === 0) {
        const bismillahUri = 'https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/001001.mp3';
        t.is(response.response.directives[i].audioItem.stream.url, bismillahUri);
      } else {
        const paddedVerseString = (i).toString().padStart(3, '0');
        const expectedUrl = `https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/012${paddedVerseString}.mp3`;
        t.is(response.response.directives[i].audioItem.stream.url, expectedUrl);
      }

      // audio directive should contain a valid token
      // (ignore the first verse for these tests since that is usually bismillah)
      if (i !== 0) {
        t.truthy(response.response.directives[i].audioItem.stream.token);
        const parsedToken = JSON.parse(response.response.directives[i].audioItem.stream.token);
        t.is(parsedToken.ChapterNumber, '12');
        t.is(parsedToken.VerseNumber, i.toString());
      }
    }

    // Test content is well formed.
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  });
});
