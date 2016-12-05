import test from 'ava';
import Request from 'alexa-request';
import uuid from 'node-uuid';

import PlayHeadManager from '../../../src/audioPlayer/playHeadManager';
import { AudioFilesUri } from '../../definitions.json';
import getTestAccessToken from '../../helpers/getTestAccessToken';
import Skill from '../../../src/index';

let TestAccountAccessToken;

// Get a test access token before running tests in this file
test.before(async t => {
  TestAccountAccessToken = await getTestAccessToken();
  t.truthy(TestAccountAccessToken);
});

test('PlayVerseNumberByChapterNameIntent called by a non signed-in user', async t => {
  const AnonymousRequest = new Request();
  const event = AnonymousRequest.intent('PlayVerseNumberByChapterNameIntent', { chapterName: 'Faatiha', verseNumber: '3' }).build();

  const response = await Skill(event);
  const expectedResponse = {
    version: '1.0',
    response: {
      shouldEndSession: true,
      outputSpeech: {
        type: 'PlainText',
        text: 'To start using this skill, please use the Alexa companion app to sign in.',
      },
      card: {
        type: 'LinkAccount',
      },
    },
  };

  // Test structure and version of response.
  t.deepEqual(response, expectedResponse);
});

test('PlayVerseNumberByChapterNameIntent', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflict with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayVerseNumberByChapterNameIntent', { chapterName: 'Faatiha', verseNumber: '3' }).build();

  const response = await Skill(event);
  const expectedText = 'Reciting ';

  // Test structure and version of response.
  t.is(response.version, '1.0');
  t.truthy(response.response);
  t.truthy(response.response.shouldEndSession);
  t.truthy(response.response.outputSpeech);
  t.is(response.response.outputSpeech.type, 'PlainText');

  // audio directive should exist
  t.truthy(response.response.directives);
  t.is(response.response.directives.length, 1);

  // Test audio directive properties
  const audioDirective = response.response.directives[0];
  t.is(audioDirective.type, 'AudioPlayer.Play');
  t.is(audioDirective.playBehavior, 'REPLACE_ALL');
  t.truthy(audioDirective.audioItem);
  t.truthy(audioDirective.audioItem.stream);

  // Test audio item URI
  const expectedUrl = `${AudioFilesUri}/001003.mp3`;
  t.is(audioDirective.audioItem.stream.url, expectedUrl);

  // Test current item token is valid
  const token = JSON.parse(audioDirective.audioItem.stream.token);
  t.truthy(token);
  t.is(token.chapterNumber, 1);
  t.is(token.verseNumber, 3);

  // Test playHead is valid for the random user generated for this test.
  const nextPlayHead = await PlayHeadManager.getPlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
  t.truthy(nextPlayHead);
  t.is(nextPlayHead.chapterNumber, 1);
  t.is(nextPlayHead.verseNumber, 4);
  // Test content is well formed.
  t.truthy(response.response.outputSpeech.text.startsWith(expectedText));

  // clean up
  return await PlayHeadManager.deletePlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
});

test('PlayVerseNumberByChapterNameIntent with case insensitive comparison', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflict with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayVerseNumberByChapterNameIntent', { chapterName: 'yaseen', verseNumber: '3' }).build();

  const response = await Skill(event);
  const expectedText = 'Reciting ';

  // Test structure and version of response.
  t.is(response.version, '1.0');
  t.truthy(response.response);
  t.truthy(response.response.shouldEndSession);
  t.truthy(response.response.outputSpeech);
  t.is(response.response.outputSpeech.type, 'PlainText');

  // audio directive should exist
  t.truthy(response.response.directives);
  t.is(response.response.directives.length, 1);

  // Test audio directive properties
  const audioDirective = response.response.directives[0];
  t.is(audioDirective.type, 'AudioPlayer.Play');
  t.is(audioDirective.playBehavior, 'REPLACE_ALL');
  t.truthy(audioDirective.audioItem);
  t.truthy(audioDirective.audioItem.stream);

  // Test audio item URI
  const expectedUrl = `${AudioFilesUri}/036003.mp3`;
  t.is(audioDirective.audioItem.stream.url, expectedUrl);

  // Test current item token is valid
  const token = JSON.parse(audioDirective.audioItem.stream.token);
  t.truthy(token);
  t.is(token.chapterNumber, 36);
  t.is(token.verseNumber, 3);

  // Test playHead is valid for the random user generated for this test.
  const nextPlayHead = await PlayHeadManager.getPlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
  t.truthy(nextPlayHead);
  t.is(nextPlayHead.chapterNumber, 36);
  t.is(nextPlayHead.verseNumber, 4);

  // Test content is well formed.
  t.truthy(response.response.outputSpeech.text.startsWith(expectedText));

  // clean up
  return await PlayHeadManager.deletePlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
});

test('PlayVerseNumberByChapterNameIntent with Invalid Parameters', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflict with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayVerseNumberByChapterNameIntent', { chapterName: 'Invalid', verseNumber: '200' }).build();

  const response = await Skill(event);
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
