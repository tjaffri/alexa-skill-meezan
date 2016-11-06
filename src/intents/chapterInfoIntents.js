import { say } from 'alexa-response';
import allChaptersInfo from '../chapters.json';

export async function chapterInfoByNumberIntent(chapterNumber) {
  let speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${chapterNumber}. Please try again later. `;

  try {
    // Load info about all chapters, and then we do a local in memory search to identify
    // the requested chapter by ID.
    const chapterInfo = allChaptersInfo.find(c => c.id === Number(chapterNumber));

    if (!chapterInfo) {
      throw new Error('Invalid Chapter Number.');
    }

    speechOutput = `Chapter ${chapterInfo.id}, Surah ${chapterInfo.name.arroman}, which means ${chapterInfo.name.en}, has ${chapterInfo.ayas} verses. It is a ${chapterInfo.type} revelation.`;
  } catch (err) {
    speechOutput = `${speechOutput} More information: ${err}`;
  }

  return say(speechOutput)
    .card({ title: 'Meezan', content: speechOutput })
    .build();
}

export async function chapterInfoByNameIntent(chapterName) {
  let speechOutput;
  try {
    // Load info about all chapters, and then we do a local in memory search to identify
    // the requested chapter by name.
    // Search for a string or substring match (english or arabic name)
    let chapterInfo;
    for (const term of chapterName.split(' ')) {
      const r = new RegExp(term, 'i');
      chapterInfo = allChaptersInfo.find(c => r.test(c.name.arroman) || r.test(c.name.en));

      if (!!chapterInfo) break; // found something, stop searching
    }

    if (!chapterInfo || isNaN(chapterInfo.id)) {
      throw new Error(`Sorry, could not find a Chapter with name matching: ${chapterName}`);
    } else {
      speechOutput = `Chapter ${chapterInfo.id}, Surah ${chapterInfo.name.arroman}, which means ${chapterInfo.name.en}, has ${chapterInfo.ayas} verses. It is a ${chapterInfo.type} revelation.`;
    }
  } catch (err) {
    // there was an error. Build the error response and send.
    speechOutput = `Hmm, I ran into a problem and could not process your request for chapter ${chapterName}. More information: ${err}`;
  }

  return say(speechOutput)
    .card({ title: 'Meezan', content: speechOutput })
    .build();
}
