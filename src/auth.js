import { say } from 'alexa-response';

export default function validateUserSignedIn(event) {
  if (!event || !event.session || !event.session.user || !event.session.user.accessToken) {
    const linkText = 'To start using this skill, please use the Alexa companion app to sign in.';
    return say(linkText).card({ type: 'LinkAccount' }).build();
  }

  return null;
}
