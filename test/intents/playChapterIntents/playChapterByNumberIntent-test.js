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

test('PlayChapterByNumberIntent for Chapter 1 (Special Case: Bismillah Included)', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflit with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayChapterByNumberIntent', { chapterNumber: '1' }).build();

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
  t.is(audioDirective.playBehavior, 'REPLACE_ALL');
  t.is(audioDirective.type, 'AudioPlayer.Play');
  t.truthy(audioDirective.audioItem);
  t.truthy(audioDirective.audioItem.stream);

  // Test audio item URI
  const expectedUrl = `${AudioFilesUri}/001001.mp3`;
  t.is(audioDirective.audioItem.stream.url, expectedUrl);

  // Test current item token is valid
  const token = JSON.parse(audioDirective.audioItem.stream.token);
  t.truthy(token);
  t.is(token.chapterNumber, 1);
  t.is(token.verseNumber, 1);

  // Test playHead is valid for the random user generated for this test.
  const nextPlayHead = await PlayHeadManager.getPlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
  t.truthy(nextPlayHead);
  t.is(nextPlayHead.chapterNumber, 1);
  t.is(nextPlayHead.verseNumber, 2);

  // Test content is well formed.
  t.truthy(response.response.outputSpeech.text.startsWith(expectedText));

  // clean up
  return await PlayHeadManager.deletePlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
});

test('PlayChapterByNumberIntent for Chapter 9 (Special Case, no Bismillah)', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflit with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayChapterByNumberIntent', { chapterNumber: '9' }).build();

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
  t.is(audioDirective.playBehavior, 'REPLACE_ALL');
  t.is(audioDirective.type, 'AudioPlayer.Play');
  t.truthy(audioDirective.audioItem);
  t.truthy(audioDirective.audioItem.stream);

  // Test audio item URI
  const expectedUrl = `${AudioFilesUri}/009001.mp3`;
  t.is(audioDirective.audioItem.stream.url, expectedUrl);

  // Test current item token is valid
  const token = JSON.parse(audioDirective.audioItem.stream.token);
  t.truthy(token);
  t.is(token.chapterNumber, 9);
  t.is(token.verseNumber, 1);

  // Test playHead is valid for the random user generated for this test.
  const nextPlayHead = await PlayHeadManager.getPlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
  t.truthy(nextPlayHead);
  t.is(nextPlayHead.chapterNumber, 9);
  t.is(nextPlayHead.verseNumber, 2);

  // Test content is well formed.
  t.truthy(response.response.outputSpeech.text.startsWith(expectedText));

  // clean up
  return await PlayHeadManager.deletePlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
});

test('PlayChapterByNumberIntent for Chapter 12 (Start with Bismillah)', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflit with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayChapterByNumberIntent', { chapterNumber: '12' }).build();

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
  t.is(audioDirective.playBehavior, 'REPLACE_ALL');
  t.is(audioDirective.type, 'AudioPlayer.Play');
  t.truthy(audioDirective.audioItem);
  t.truthy(audioDirective.audioItem.stream);

  // Test audio item URI
  const expectedUrl = `${AudioFilesUri}/001001.mp3`;
  t.is(audioDirective.audioItem.stream.url, expectedUrl);

  // Test current item token is valid
  const token = JSON.parse(audioDirective.audioItem.stream.token);
  t.truthy(token);
  t.is(token.chapterNumber, 1);
  t.is(token.verseNumber, 1);

  // Test playHead is valid for the random user generated for this test.
  const nextPlayHead = await PlayHeadManager.getPlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
  t.truthy(nextPlayHead);
  t.is(nextPlayHead.chapterNumber, 12);
  t.is(nextPlayHead.verseNumber, 1);

  // Test content is well formed.
  t.truthy(response.response.outputSpeech.text.startsWith(expectedText));

  // clean up
  return await PlayHeadManager.deletePlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
});
