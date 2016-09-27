import { Skill, Launch, Intent } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import { ssml } from 'alexa-ssml';

@Skill
export default class Meezan {

  @Intent('AboutIntent')
  about() {
    const aboutText = 'Meezan is a Quran skill for Alexa.';
    return say(aboutText).card({ title: 'Meezan', content: aboutText });
  }

  @Intent('VerseCountIntent')
  verseCount({ Chapter = 1 }) {

    let speechOutput = `Sorry, I don\'t know anything about chapter ${Chapter}... check back later, I\'m always learning!`;
    if (Chapter === 1) {
      speechOutput = 'Surah Fatiha has 7 verses.';
    }

    return say(speechOutput).card({ title: 'Meezan', content: speechOutput });
  }

  @Launch
  launch() {
    return say('Meezan launched!');
  }

  @Intent('AMAZON.HelpIntent')
  help() {

    let speechOutput = '';
    speechOutput += 'Here are some things you can say: ';
    speechOutput += 'Tell me how many verses are in chapter 1 of the Holy Quran. ';
    speechOutput += 'Tell me about the skill developer. ';
    speechOutput += 'You can also say stop if you\'re done. ';
    speechOutput += 'So, how can I help?';

    return ask(speechOutput).reprompt('So, how can I help?');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say(<speak>Goodbye!</speak>);
  }
}
