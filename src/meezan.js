import { Skill, Launch, Intent } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import { ssml } from 'alexa-ssml';

@Skill
export default class Meezan {

  @Launch
  launch() {
    return say('Meezan launched!');
  }

  @Intent('hello')
  hello({ Person = 'world' }) {
    return say(`Hello ${Person}`).card({ title:'Meezan', content:`Hello ${Person}` });
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return ask('I say hello to people. Who should I say hello to?').reprompt('Who should I say hello to?');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say(<speak>Goodbye!</speak>);
  }
}
