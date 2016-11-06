# [Alexa-Skill-Meezan](https://github.com/tjaffri/alexa-skill-meezan)

[![Build Status](http://img.shields.io/travis/tjaffri/alexa-skill-meezan/master.svg?style=flat-square)](https://travis-ci.org/tjaffri/alexa-skill-meezan)
[![Coverage Status](https://coveralls.io/repos/github/tjaffri/alexa-skill-meezan/badge.svg?branch=master)](https://coveralls.io/github/tjaffri/alexa-skill-meezan?branch=master)
[![Dependency Status](http://img.shields.io/david/tjaffri/alexa-skill-meezan.svg?style=flat-square)](https://david-dm.org/tjaffri/alexa-skill-meezan)

A Quran skill for Alexa.

## Example phrases

```
Alexa, ask Meezan how many verses are in Surah Fatiha
Alexa, ask Meezan to recite chapter 1, verse 5 of the Holy Quran
Alexa, ask Meezan how many chapters are in the Quran
```

See `model/UTTERANCES` for more example phrases.

## Development

### Test

```bash
npm test
```

### Building

```bash
npm run build
```

This creates the following build artifacts:

1. `build/release/` contains the transpiled skill files, with all required dependencies, and exposes a single function `index.hander`.
2. `build/UTTERANCES.txt` contains Skill utterances as defined in the `model` directory (expanded and ready to upload to the Alexa console).

### Deploy

This repository is set to deploy automatically to AWS lambda, via Travis CI. Any commits to master will get automatically built, tested and deployed.

However, if you want to deploy manually for any reason, you can follow the following steps:

1. Zip up the `build/release/` directory into `package.zip` and manually upload it to Lambda at: https://console.aws.amazon.com/lambda/home
2. If you have changed any files in `model/**` at all, you need to go to https://developer.amazon.com/edw/home.html and update the Interaction model
for the Alexa Skill. You can use the expanded utterances in `build/UTTERANCES.txt` as well as the schema and custom slot data under `model/**`.

#### TODO: Incorporate the items below

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
