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

### Test Automation

Test automation for this skill requires credentials for a test account that the ``MeezanApi`` will accept. By default
the API is configured to be ``http://meezanapi.azurewebsites.net`` but you can change this to a different URI and provide
test account credentials that will be accepted at your API.

The following test account credentials are read from environment variables. For convenience you may want to create a file 
called ``tools/.env-auth0.sh`` with the test account credentials so you can set these during development (the CI server sets these
values in the build environment to run CI tests successfully)

```sh
#!/bin/sh

AUTH0_ACCESS_TOKEN_URI=https://[YOUR NAME SPACE ON AUTH0].auth0.com/oauth/token
AUTH0_CLIENT_ID=[YOUR CLIENT ID]
AUTH0_CLIENT_SECRET=[YOUR CLIENT SECRET]
TEST_ACCOUNT_REFRESH_TOKEN=[REFRESH TOKEN FOR A TEST ACCOUNT]

export AUTH0_ACCESS_TOKEN_URI
export AUTH0_CLIENT_ID
export AUTH0_CLIENT_SECRET
export TEST_ACCOUNT_REFRESH_TOKEN
```

Once the environment is set up you can run the following command to run the tests locally.

```bash
npm test
```

> **Note:** You may wish to follow the discussion [here](https://auth0.com/forum/t/using-auth0-for-amazon-alexa-account-linking/3911)
to configure your auth0 environment.

### Building

```bash
npm run build
```

This creates the following build artifacts:

1. `build/release/` contains the transpiled skill files, with all required dependencies, and exposes a single function `index.hander`.
2. `build/UTTERANCES.txt` contains Skill utterances as defined in the `model` directory (expanded and ready to upload to the Alexa console).

### Deploy

This repository is set to deploy automatically to AWS lambda, via Travis CI. Any commits to master will get automatically built, tested and deployed.

However, if you want to deploy manually for any reason, you have two options:

#### Manual Deployment in the Developer Console

1. Package up your skill by running:
```bash
npm run package
```

2. This creates `build/package.zip` containing the compiled skill, which can be uploaded directly to AWS Lambda. It exposes a single function `index.hander`. Skill utterances defined in the `model` directory are expanded and output to `build/UTTERANCES`.
3. Manually upload `package.zip` it to Lambda at: https://console.aws.amazon.com/lambda/home
4. If you have changed any files in `model/**` at all, you need to go to https://developer.amazon.com/edw/home.html and update the Interaction model
for the Alexa Skill. You can use the expanded utterances in `build/UTTERANCES.txt` as well as the schema and custom slot data under `model/**`.

#### Manual Deployment via Local Deployment Script

If you configure the project with AWS credentials under ``config/lambda.config.js`` then you can build, test, package and deploy the project with a single command.
You can then configure the deployed skill in the [AWS console](https://console.aws.amazon.com/lambda/home?region=us-east-1#/functions/meezan).

```bash
npm run deploy
```
