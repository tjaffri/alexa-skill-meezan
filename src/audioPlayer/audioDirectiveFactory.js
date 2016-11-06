import padStart from 'string.prototype.padstart';
import { AudioFilesUri } from '../definitions.json';

// Calculate next playHead position by advancing to the next verse.
export async function nextVerse(playHead) {
  // If playHead does not exist, set to the beginning
  if (!playHead || !playHead.chapterNumber || !playHead.verseNumber) {
    return { chapterNumber: 1, verseNumber: 2 };
  }

  // Temporarily, increment but we need to add chapter wrapping logic
  return { chapterNumber: playHead.chapterNumber, verseNumber: playHead.verseNumber + 1 };
}

// Build the audio item portion of the Audio Directive.
export function audioItem(chapterNumber, verseNumber) {
  const paddedChapterString = padStart(String(chapterNumber), 3, '0');
  const paddedVerseString = padStart(String(verseNumber), 3, '0');

  return {
    url: `${AudioFilesUri}/${paddedChapterString}${paddedVerseString}.mp3`,
    offsetInMilliseconds: 0,
    token: JSON.stringify({ chapterNumber, verseNumber }),
  };
}
