import test from 'ava';
import Request from 'alexa-request';
import uuid from 'node-uuid';

import PlayHeadManager from '../../../src/audioPlayer/playHeadManager';
import { AudioFilesUri } from '../../definitions.json';
import getTestAccessToken from '../../helpers/getTestAccessToken';
import Skill from '../../../src/index';
import verifyAudioDirective from '../../helpers/verifyAudioDirective';

let TestAccountAccessToken;

// Get a test access token before running tests in this file
test.before(async t => {
  TestAccountAccessToken = await getTestAccessToken();
  t.truthy(TestAccountAccessToken);
});


test('PlayChapterByNumberIntent called by a non signed-in user', async t => {
  const AnonymousRequest = new Request();
  const event = AnonymousRequest.intent('PlayChapterByNumberIntent', { chapterNumber: '1' }).build();

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

test('PlayChapterByNumberIntent for Chapter 1 (Special Case: Bismillah Included)', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflict with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayChapterByNumberIntent', { chapterNumber: '1' }).build();

  const response = await Skill(event);
  const expectedText = 'Reciting ';
  const expectedUrl = `${AudioFilesUri}/001001.mp3`;
  const expectedToken = JSON.stringify({ chapterNumber: 1, verseNumber: 1 });

  // Test audio directive properties
  verifyAudioDirective(t, response, expectedText, expectedUrl, expectedToken);

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
  // conflict with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayChapterByNumberIntent', { chapterNumber: '9' }).build();

  const response = await Skill(event);
  const expectedText = 'Reciting ';
  const expectedUrl = `${AudioFilesUri}/009001.mp3`;
  const expectedToken = JSON.stringify({ chapterNumber: 9, verseNumber: 1 });

  // Test audio directive properties
  verifyAudioDirective(t, response, expectedText, expectedUrl, expectedToken);

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
  // conflict with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayChapterByNumberIntent', { chapterNumber: '12' }).build();

  const response = await Skill(event);
  const expectedText = 'Reciting ';
  const expectedUrl = `${AudioFilesUri}/001001.mp3`;
  const expectedToken = JSON.stringify({ chapterNumber: 1, verseNumber: 1 });

  // Test audio directive properties
  verifyAudioDirective(t, response, expectedText, expectedUrl, expectedToken);

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
