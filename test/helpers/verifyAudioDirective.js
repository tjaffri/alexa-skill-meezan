export default function verifyAudioDirective(t, response, expectedText, expectedUrl, expectedToken) {

  // Test structure and version of response.
  t.is(response.version, '1.0');
  t.truthy(response.response);
  t.truthy(response.response.shouldEndSession);

  if (!!expectedUrl) {
    // If a URL is expected, audio directive should exist
    t.truthy(response.response.directives);
    t.is(response.response.directives.length, 1);

    // Test audio directive properties
    const audioDirective = response.response.directives[0];
    t.is(audioDirective.playBehavior, 'REPLACE_ALL');
    t.is(audioDirective.type, 'AudioPlayer.Play');
    t.truthy(audioDirective.audioItem);
    t.truthy(audioDirective.audioItem.stream);

    // Test audio item URI
    t.is(audioDirective.audioItem.stream.url, expectedUrl);
  }

  if (!!expectedToken) {
    // If a token is expected, audio directive should exist
    t.truthy(response.response.directives);
    t.is(response.response.directives.length, 1);

    // Test current item token is valid
    const audioDirective = response.response.directives[0];
    const token = audioDirective.audioItem.stream.token;
    t.truthy(token);
    t.is(token, expectedToken);
  }

  // Test content is well formed.
  if (!!expectedText) {
    t.truthy(response.response.outputSpeech);
    t.is(response.response.outputSpeech.type, 'PlainText');
    t.truthy(response.response.outputSpeech.text.startsWith(expectedText));
  } else {
    t.falsy(response.response.outputSpeech);
  }
}
