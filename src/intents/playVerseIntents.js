import { say, AudioPlayer } from 'alexa-response';
import allChaptersInfo from '../chapters.json';
import { audioItem, nextVerse } from '../audioPlayer/audioDirectiveFactory';
import PlayHeadManager from '../audioPlayer/playHeadManager';

export async function playVerseByNumbersIntent(chapterNumberString, verseNumberString, event) {
  let speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${chapterNumberString} verse ${verseNumberString}. Please try again later. `;
  let audioDirective;
  const chapterNumber = Number(chapterNumberString);
  const verseNumber = Number(verseNumberString);

  try {
    if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 114) {
      throw new Error('Invalid Chapter Number');
    }

    // Load info about all chapters, and then we do a local in memory search to identify
    // the requested chapter by ID.
    const chapterInfo = allChaptersInfo.find(c => c.id === Number(chapterNumber));

    if (!chapterInfo || isNaN(verseNumber) || verseNumber < 1 || verseNumber > chapterInfo.ayas) {
      throw new Error('Invalid Chapter or Verse Number.');
    } else {
      // Set new playHead state.
      const nextPlayHead = await nextVerse({ chapterNumber, verseNumber });
      const userId = event.session.user.userId;
      const accessToken = event.session.user.accessToken;
      await PlayHeadManager.setPlayHeadAsync(nextPlayHead, userId, accessToken);

      speechOutput = `Reciting chapter ${chapterNumber}, verse ${verseNumber} in Arabic.`;
      audioDirective = AudioPlayer.play(audioItem(chapterNumber, verseNumber));
    }
  } catch (err) {
    speechOutput = `${speechOutput} More information: ${err}`;
  }

  let response = say(speechOutput)
    .card({ title: 'Meezan', content: speechOutput });

  if (!!audioDirective) {
    response = response.directives(audioDirective);
  }

  return response.build();
}

export async function playVerseNumberByChapterNameIntent(chapterNameString, verseNumberString, event) {
  try {
    // Fetch info about all chapters, and then we do a local in memory search to identify
    // the requested chapter by name.
    // Search for a string or substring match (english or arabic name)
    let chapterInfo;
    for (const term of chapterNameString.split(' ')) {
      const r = new RegExp(term, 'i');
      chapterInfo = allChaptersInfo.find(c => r.test(c.name.arroman) || r.test(c.name.en));

      if (!!chapterInfo) break; // found something, stop searching
    }

    if (!chapterInfo || isNaN(chapterInfo.id)) {
      throw new Error(`Sorry, could not find a Chapter with name matching: ${chapterNameString}`);
    } else {
      // Chapter number identified, call the play by numbers intent
      return playVerseByNumbersIntent(chapterInfo.id, verseNumberString, event);
    }
  } catch (err) {
    // there was an error. Build the error response and send.
    const speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${chapterNameString}. More information: ${err}`;
    return say(speechOutput)
      .card({ title: 'Meezan', content: speechOutput })
      .build();
  }
}
