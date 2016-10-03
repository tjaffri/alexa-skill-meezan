import { Skill, Launch, Intent } from 'alexa-annotations';
import { ssml } from 'alexa-ssml';
import request from 'request-promise';
import { say, ask, AudioPlayer } from 'alexa-response';

@Skill
export default class Meezan {

  @Intent('AboutIntent')
  async about() {
    const aboutText = 'Meezan is a Quran skill for Alexa.';
    return say(aboutText);
  }

  @Intent('VerseCountIntent')
  async verseCount({ Chapter }) {
    let speechOutput = `Sorry, I don\'t know anything about chapter ${Chapter}... check back later, I\'m always learning!`;

    try {
      // Fetch info about requested chapter and build dynamic response.
      const response = await request.get(`http://meezanapi.azurewebsites.net/chapters/${Chapter}`);
      const chapterInfo = JSON.parse(response);
      speechOutput = `Chapter ${chapterInfo.id}, Surah ${chapterInfo.name.arroman}, which means ${chapterInfo.name.en}, has ${chapterInfo.ayas} verses.`;
    } catch (err) {
      speechOutput = `Hmm, I ran into a problem and could not process your request. Please try again later. More information: ${err}`;
    }

    return say(speechOutput).card({ title: 'Meezan', content: speechOutput });
  }

  @Intent('ChapterCountIntent')
  async chapterCount() {
    const speechOutput = 'The Holy Quran contains 114 chapters, called "Surahs" in Arabic';

    return say(speechOutput).card({ title: 'Meezan', content: speechOutput });
  }

  @Intent('PlayVerseIntent')
  async playVerse({ Chapter, Verse }) {
    const speechOutput = `Reciting chapter ${Chapter}, verse ${Verse} in Arabic.`;
    const paddedChapterString = Chapter.padStart(3, '0');
    const paddedVerseString = Verse.padStart(3, '0');
    const token = { Chapter, Verse };

    return say(speechOutput)
      .directives(AudioPlayer.play(
        {
          url: `https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/${paddedChapterString}${paddedVerseString}.mp3`,
          token: JSON.stringify(token),
          offsetInMilliseconds: 0,
        }));
  }

  @Launch
  async launch() {
    return say('Meezan launched!');
  }

  @Intent('AMAZON.HelpIntent')
  async help() {
    let speechOutput = '';
    speechOutput += 'Here are some things you can say: \n';
    speechOutput += '- Tell me how many verses are in chapter 1 of the Holy Quran. \n';
    speechOutput += '- Recite chapter 1, verse 2 of the Holy Quran. \n';
    speechOutput += '- Tell me about the skill developer. \n';
    speechOutput += '- You can also say stop if you\'re done. \n';
    speechOutput += 'So, how can I help?';

    return ask(speechOutput).reprompt('So, how can I help?');
  }

  @Intent('AMAZON.ResumeIntent', 'AMAZON.PauseIntent')
  async notImplemented() {
    return say('Sorry, I don\'t know how to do that yet!');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  async stop() {
    return say(<speak>Goodbye!</speak>);
  }
}
