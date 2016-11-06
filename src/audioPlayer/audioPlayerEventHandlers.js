import { directives, AudioPlayer, Response } from 'alexa-response';
import { audioItem, nextVerse } from './audioDirectiveFactory';
import PlayHeadManager from './playHeadManager';

export async function audioPlayerPlaybackStartedEvent(event) {
  console.log(`audioPlayerPlaybackStartedEvent: ${JSON.stringify(event)}`);
  return new Response();
}

export async function audioPlayerPlaybackPausedEvent(event) {
  console.log(`audioPlayerPlaybackPausedEvent: ${JSON.stringify(event)}`);
  return new Response();
}

// Queues the next verse, and advance playHead state.
export async function audioPlayerPlaybackNearlyFinishedEvent(event) {
  console.log(`audioPlayerPlaybackNearlyFinishedEvent: ${JSON.stringify(event)}`);

  // identify the user this event is for
  const userId = event.context.System.user.userId;
  const accessToken = event.context.System.user.accessToken;

  // Fetch current playHead state for this user.
  // Build the audio directive at this position (it was already advanced previously).
  const currentPlayHead = await PlayHeadManager.getPlayHeadAsync(userId, accessToken);
  const payload = audioItem(currentPlayHead.chapterNumber, currentPlayHead.verseNumber);
  payload.expectedPreviousToken = event.request.token;

  // Calculate new playHead location and advance state.
  const newPlayHead = await nextVerse(currentPlayHead);
  await PlayHeadManager.setPlayHeadAsync(newPlayHead, userId, accessToken);

  // Build and send the audio directive.
  return directives(AudioPlayer.enqueue(payload));
}

export async function audioPlayerPlaybackFinishedEvent(event) {
  console.log(`audioPlayerPlaybackFinishedEvent: ${JSON.stringify(event)}`);
  return new Response();
}

export async function audioPlayerPlaybackFailedEvent(event) {
  console.log(`audioPlayerPlaybackFailedEvent: ${JSON.stringify(event)}`);
  return new Response();
}
