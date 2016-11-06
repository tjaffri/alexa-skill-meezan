import { say, AudioPlayer } from 'alexa-response';
import allChaptersInfo from '../chapters.json';
import { audioItem } from '../audioPlayer/audioDirectiveFactory';
import PlayHeadManager from '../audioPlayer/playHeadManager';

export async function playChapterByNumberIntent(chapterNumberString, event) {
  let speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${chapterNumberString}. Please try again later. `;
  let audioDirective;
  let nextPlayHead;
  const chapterNumber = Number(chapterNumberString);

  try {
    if (isNaN(chapterNumber) || chapterNumber < 1 || chapterNumber > 114) {
      throw new Error('Invalid Chapter Number');
    }

    // Bismillah (chapter 1, verse 1) is the first directive except for two special cases:
    // 1. Chapter 1 itself has Bismillah as the first directive by derfault
    // 2. Chapter 9 (Surah Tauba) is traditionally read without Bismillah.
    if (chapterNumber !== 1 && chapterNumber !== 9) {
      // If this is not a special case, the first item is Bismillah.
      audioDirective = AudioPlayer.play(audioItem(1, 1));
      // The next item is the first verse of the chapter requested.
      nextPlayHead = { chapterNumber, verseNumber: 1 };
    } else {
      // If this is a special case, the first item is the first verse of the chapter requested.
      audioDirective = AudioPlayer.play(audioItem(chapterNumber, 1));
      // The next item is the second verse of the chapter requested.
      nextPlayHead = { chapterNumber, verseNumber: 2 };
    }

    // Set new playHead state.
    const userId = event.session.user.userId;
    const accessToken = event.session.user.accessToken;
    await PlayHeadManager.setPlayHeadAsync(nextPlayHead, userId, accessToken);

    speechOutput = `Reciting chapter ${chapterNumber} in Arabic.`;
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

export async function playChapterByNameIntent(chapterNameString, event) {
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
      // Chapter number identified, call the play by number intent.
      return playChapterByNumberIntent(chapterInfo.id, event);
    }
  } catch (err) {
    // there was an error. Build the error response and send.
    const speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${chapterNameString}. More information: ${err}`;
    return say(speechOutput)
      .card({ title: 'Meezan', content: speechOutput })
      .build();
  }
}
