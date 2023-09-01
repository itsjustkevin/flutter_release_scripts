Collection of convenience scripts used in Dart and Flutter release processes.

## How to run
1. Create a copy of .example.env
2. rename to .env
3. add your GITHUB_TOKEN as a string value
4. run `npm install`
5. run `node ${scriptName}`

## Scripts
### index.js
Script used to generate release notes through the Github releases API.
Currently, you must concat the engine result with the framework result.  There
is an open todo to automate that process as well.

### languageFeatures.js
Script used to generate language feature issues for new Dart language features.
