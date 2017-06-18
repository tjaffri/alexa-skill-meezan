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

test('PlayVerseByNumbersIntent called by a non signed-in user', async t => {
  const AnonymousRequest = new Request();
  const event = AnonymousRequest.intent('PlayVerseByNumbersIntent', { chapterNumber: '1', verseNumber: '3' }).build();

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

test('PlayVerseByNumbersIntent', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflict with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayVerseByNumbersIntent', { chapterNumber: '1', verseNumber: '3' }).build();

  const response = await Skill(event);
  const expectedText = 'Reciting ';
  const expectedUrl = `${AudioFilesUri}/001003.mp3`;
  const expectedToken = JSON.stringify({ chapterNumber: 1, verseNumber: 3 });

  // Test audio directive properties
  verifyAudioDirective(t, response, expectedText, expectedUrl, expectedToken);

  // Test playHead is valid for the random user generated for this test.
  const nextPlayHead = await PlayHeadManager.getPlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
  t.truthy(nextPlayHead);
  t.is(nextPlayHead.chapterNumber, 1);
  t.is(nextPlayHead.verseNumber, 4);

  // clean up
  return await PlayHeadManager.deletePlayHeadAsync(`test-user-${randomUserId}`, TestAccountAccessToken);
});

test('PlayVerseByNumbersIntent with Invalid Parameters', async t => {
  // Set up the request object used in each test with a random user name so it does not
  // conflict with any other tests.
  const randomUserId = uuid.v4();
  const SignedInRequest = new Request({ session: { user: { userId: `test-user-${randomUserId}`, accessToken: TestAccountAccessToken } } });
  const event = SignedInRequest.intent('PlayVerseByNumbersIntent', { chapterNumber: '1', verseNumber: '200' }).build();

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
