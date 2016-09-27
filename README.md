# [Alexa-Skill-Meezan](https://github.com/axis-tip/alexa-skill-meezan)

[![Build Status](http://img.shields.io/travis/axis-tip/alexa-skill-meezan/master.svg?style=flat-square)](https://travis-ci.org/axis-tip/alexa-skill-meezan)
[![Coverage Status](https://coveralls.io/repos/github/axis-tip/alexa-skill-meezan/badge.svg?branch=master)](https://coveralls.io/github/axis-tip/alexa-skill-meezan?branch=master)
[![Dependency Status](http://img.shields.io/david/axis-tip/alexa-skill-meezan.svg?style=flat-square)](https://david-dm.org/axis-tip/alexa-skill-meezan)

A Quran skill for Alexa.

## Example phrases

```
Alexa, ask Meezan …
```

See `model/UTTERANCES` for more example phrases.

## Development

### Test

```bash
npm test
```

### Package

```bash
npm run package
```

This creates `build/package.zip` containing the compiled skill - this can be uploaded directly to AWS Lambda. It exposes a single function `index.hander`. Skill utterances defined in the `model` directory are expanded and output to `build/UTTERANCES`.

### Deploy

```bash
npm run deploy
```

If you configure the project with AWS credentials then you can build, test, package and deploy the project with a single command. You can check it out in the [AWS console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/meezan).
