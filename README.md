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

This creates `build/package.zip` containing the compiled skill. It exposes a single function `index.hander`. Skill utterances defined in the `model` directory are expanded and output to `build/UTTERANCES`.

### Deploy

The project is set to deploy automatically to AWS lambda, via Travis CI. However, if you want to deploy manually for any reason
you can follow the following steps:

1. Build the `build/package.zip` as noted above and manually upload it to Lambda at: https://console.aws.amazon.com/lambda/home
2. If you have changed any files in `models/**` at all, you need to go to https://developer.amazon.com/edw/home.html and update the Interaction model
for the Alexa Skill. 
