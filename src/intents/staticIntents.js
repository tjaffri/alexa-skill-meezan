import { say, ask } from 'alexa-response';

export async function aboutIntent() {
  const aboutText = 'Meezan is a Quran skill for Alexa.';

  return say(aboutText)
    .build();
}

export async function chapterCountIntent() {
  const speechOutput = 'The Holy Quran contains 114 chapters, called "Surahs" in Arabic';

  return say(speechOutput)
    .card({ title: 'Meezan', content: speechOutput })
    .build();
}

export async function launchIntent() {
  return say('Meezan launched!');
}

export async function helpIntent() {
  let speechOutput = '';
  speechOutput += 'Here are some things you can say: \n';
  speechOutput += '- Recite Surah Yaseen. \n';
  speechOutput += '- How many verses are in Surah Fatiha? \n';
  speechOutput += '- How many verses are in chapter 1 of the Holy Quran? \n';
  speechOutput += '- Recite chapter 1, verse 2 of the Holy Quran? \n';
  speechOutput += 'You can also say stop if you\'re done. \n';
  speechOutput += 'So, how can I help?';

  return ask(speechOutput).reprompt('So, how can I help?');
}

export async function stopIntent() {
  return say('Goodbye!');
}

export async function notImplementedIntent() {
  return say('Sorry, I don\'t know how to do that yet! Please try later');
}
