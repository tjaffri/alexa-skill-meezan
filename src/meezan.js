import { annotation, Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { Response } from 'alexa-response';

import { aboutIntent, chapterCountIntent, launchIntent, helpIntent, stopIntent, notImplementedIntent } from './intents/staticIntents';
import { chapterInfoByNumberIntent, chapterInfoByNameIntent } from './intents/chapterInfoIntents';
import { playChapterByNumberIntent, playChapterByNameIntent } from './intents/playChapterIntents';
import { playVerseByNumbersIntent, playVerseNumberByChapterNameIntent } from './intents/playVerseIntents';
import {
  audioPlayerPlaybackStartedEvent,
  audioPlayerPlaybackPausedEvent,
  audioPlayerPlaybackNearlyFinishedEvent,
  audioPlayerPlaybackFinishedEvent,
  audioPlayerPlaybackFailedEvent,
} from './audioPlayer/audioPlayerEventHandlers';

const AudioPlayerEvent = annotation(
  ({ request = {} }) => request.type && request.type.startsWith('AudioPlayer.'),
  ({ request = {} }) => request.type
);

@Skill
export default class Meezan {

  @Intent('AboutIntent')
  async about(_, event) {
    return aboutIntent(event);
  }

  @Intent('ChapterCountIntent')
  async chapterCount() {
    return chapterCountIntent();
  }

  @Intent('ChapterInfoByNumberIntent')
  async chapterInfoByNumber({ chapterNumber }, event) {
    return chapterInfoByNumberIntent(chapterNumber, event);
  }

  @Intent('ChapterInfoByNameIntent')
  async chapterInfoByName({ chapterName }, event) {
    return chapterInfoByNameIntent(chapterName, event);
  }

  @Intent('PlayChapterByNumberIntent')
  async playChapterByNumber({ chapterNumber }, event) {
    return playChapterByNumberIntent(chapterNumber, event);
  }

  @Intent('PlayChapterByNameIntent')
  async playChapterByName({ chapterName }, event) {
    return playChapterByNameIntent(chapterName, event);
  }

  @Intent('PlayVerseByNumbersIntent')
  async playVerseByNumbers({ chapterNumber, verseNumber }, event) {
    return playVerseByNumbersIntent(chapterNumber, verseNumber, event);
  }

  @Intent('PlayVerseNumberByChapterNameIntent')
  async playVerseNumberByChapterName({ chapterName, verseNumber }, event) {
    return playVerseNumberByChapterNameIntent(chapterName, verseNumber, event);
  }

  @AudioPlayerEvent
  onAudioPlayerEvent(type, event) {
    switch (type) {
      case 'AudioPlayer.PlaybackStarted':
        return audioPlayerPlaybackStartedEvent(event);
      case 'AudioPlayer.PlaybackPaused':
        return audioPlayerPlaybackPausedEvent(event);
      case 'AudioPlayer.PlaybackNearlyFinished':
        return audioPlayerPlaybackNearlyFinishedEvent(event);
      case 'AudioPlayer.PlaybackFinished':
        return audioPlayerPlaybackFinishedEvent(event);
      case 'AudioPlayer.PlaybackFailed':
        return audioPlayerPlaybackFailedEvent(event);
      default:
        // If the event was not recognized, enter an empty response.
        return new Response();
    }
  }

  @Launch
  async launch() {
    return launchIntent();
  }

  @Intent('AMAZON.HelpIntent')
  async help() {
    return helpIntent();
  }

  @Intent('AMAZON.ResumeIntent', 'AMAZON.PauseIntent')
  async notImplemented() {
    return notImplementedIntent();
  }

  @SessionEnded
  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  async stop() {
    return stopIntent();
  }
}
