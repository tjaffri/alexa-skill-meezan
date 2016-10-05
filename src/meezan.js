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

  @Intent('ChapterCountIntent')
  async chapterCount() {
    const speechOutput = 'The Holy Quran contains 114 chapters, called "Surahs" in Arabic';

    return say(speechOutput).card({ title: 'Meezan', content: speechOutput });
  }

  @Intent('ChapterInfoByNumberIntent')
  async chapterInfoByNumber({ ChapterNumber }) {
    let speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${ChapterNumber}. Please try again later. `;

    try {
      // Fetch info about requested chapter and build dynamic response.
      const response = await request.get(`http://meezanapi.azurewebsites.net/chapters/${ChapterNumber}`);
      const chapterInfo = JSON.parse(response);
      speechOutput = `Chapter ${chapterInfo.id}, Surah ${chapterInfo.name.arroman}, which means ${chapterInfo.name.en}, has ${chapterInfo.ayas} verses. It is a ${chapterInfo.type} revelation.`;
    } catch (err) {
      speechOutput = `${speechOutput}. More information: ${err}`;
    }

    return say(speechOutput).card({ title: 'Meezan', content: speechOutput });
  }

  @Intent('ChapterInfoByNameIntent')
  async chapterInfoByName({ ChapterName }) {
    let speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${ChapterName}. Please try again later. `;

    try {
      // Fetch info about requested chapter and build dynamic response.
      const response = await request.get('http://meezanapi.azurewebsites.net/chapters');
      const allChaptersInfo = JSON.parse(response);

      // Search for a string or substring match (english or arabic name)
      const r = new RegExp(ChapterName, 'i');
      const chapterInfo = allChaptersInfo.find(c => r.test(c.name.arroman) || r.test(c.name.en));

      if (!chapterInfo) {
        // If no luck, throw a not found error
        throw new Error(`Sorry, could not find a Chapter with name matching: ${ChapterName}`);
      }
      speechOutput = `Chapter ${chapterInfo.id}, Surah ${chapterInfo.name.arroman}, which means ${chapterInfo.name.en}, has ${chapterInfo.ayas} verses. It is a ${chapterInfo.type} revelation.`;
    } catch (err) {
      speechOutput = `${speechOutput} More information: ${err}`;
    }

    return say(speechOutput).card({ title: 'Meezan', content: speechOutput });
  }

  @Intent('PlayChapterByNumberIntent')
  async playChapterByNumber({ ChapterNumber }) {
    return say(`Sorry, I don\'t know how to do that yet! Please try later. You requested chapter: ${ChapterNumber}`);
  }

  @Intent('PlayChapterByNameIntent')
  async playChapterByName({ ChapterName }) {
    return say(`Sorry, I don\'t know how to do that yet! Please try later. You requested chapter: ${ChapterName}`);
  }

  @Intent('PlayVerseByNumbersIntent')
  async playVerseByNumbers({ ChapterNumber, VerseNumber }) {
    let speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${ChapterNumber}. Please try again later. `;

    try {
      // Fetch info about requested chapter and build dynamic response.
      const response = await request.get(`http://meezanapi.azurewebsites.net/chapters/${ChapterNumber}`);
      const chapterInfo = JSON.parse(response);

      if (!chapterInfo || VerseNumber < 1 || VerseNumber > chapterInfo.ayas) {
        throw new Error('Invalid Chapter or Verse.');
      } else {
        speechOutput = `Reciting chapter ${ChapterNumber}, verse ${VerseNumber} in Arabic.`;
        const paddedChapterString = ChapterNumber.padStart(3, '0');
        const paddedVerseString = VerseNumber.padStart(3, '0');
        const token = { ChapterNumber, VerseNumber };

        return say(speechOutput)
          .directives(AudioPlayer.play(
            {
              url: `https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/${paddedChapterString}${paddedVerseString}.mp3`,
              token: JSON.stringify(token),
              offsetInMilliseconds: 0,
            }));
      }
    } catch (err) {
      speechOutput = `${speechOutput} More information: ${err}`;
      return say(speechOutput);
    }
  }

  @Intent('PlayVerseNumberByChapterNameIntent')
  async playVerseNumberByChapterName({ ChapterName, VerseNumber }) {
    let speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${ChapterName}. Please try again later. `;

    try {
      // Fetch info about requested chapter and build dynamic response.
      const response = await request.get('http://meezanapi.azurewebsites.net/chapters');
      const allChaptersInfo = JSON.parse(response);

      // Search for a string or substring match (english or arabic name)
      const r = new RegExp(ChapterName, 'i');
      const chapterInfo = allChaptersInfo.find(c => r.test(c.name.arroman) || r.test(c.name.en));

      if (!chapterInfo) {
        throw new Error(`Sorry, could not find a Chapter with name matching: ${ChapterName}`);
      }

      if (VerseNumber < 1 || VerseNumber > chapterInfo.ayas) {
        throw new Error('Invalid Chapter or Verse.');
      }

      // No errors, proceed with response.
      const ChapterNumber = chapterInfo.id.toString();
      speechOutput = `Reciting chapter ${ChapterName}, verse ${VerseNumber} in Arabic.`;
      const paddedChapterString = ChapterNumber.padStart(3, '0');
      const paddedVerseString = VerseNumber.padStart(3, '0');
      const token = { ChapterNumber, VerseNumber };

      return say(speechOutput)
        .directives(AudioPlayer.play(
          {
            url: `https://mirrors.quranicaudio.com/everyayah/Alafasy_128kbps/${paddedChapterString}${paddedVerseString}.mp3`,
            token: JSON.stringify(token),
            offsetInMilliseconds: 0,
          }));
    } catch (err) {
      speechOutput = `${speechOutput} More information: ${err}`;
      return say(speechOutput);
    }
  }

  @Launch
  async launch() {
    return say('Meezan launched!');
  }

  @Intent('AMAZON.HelpIntent')
  async help() {
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

  @Intent('AMAZON.ResumeIntent', 'AMAZON.PauseIntent')
  async notImplemented() {
    return say('Sorry, I don\'t know how to do that yet! Please try later');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  async stop() {
    return say(<speak>Goodbye!</speak>);
  }
}
