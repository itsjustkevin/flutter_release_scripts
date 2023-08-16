import {Octokit} from 'octokit'
import 'dotenv/config'
import * as fs from 'fs/promises'

// Environment varaible containing the github token, could be replaced with a
// github.SECRET variable if used in actions.
const TOKEN = process.env.GITHUB_TOKEN
const octokit = new Octokit({ auth: TOKEN })

// TODO(kevin): Make this a reusable function passing in appropriate values
let data = await octokit.request('POST /repos/{owner}/{repo}/releases/generate-notes', {
  owner: 'flutter',
  repo: 'flutter',
  tag_name: '3.13.0-0.4.pre',
  previous_tag_name: '3.10.0'
})

// grab the information I care about stripping headers.
let notes = data.data.body

// write to initial temp file for later transformation
await fs.writeFile('tmp.md', notes)

const output = await fs.readFile('tmp.md', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(data);
});

const fileLines = output.split('\n')

// transform links to actual markdown that can be understood outside of github.
// Input: * Add `useSafeArea` parameter to `showModalBottomSheet` by @bleroux in https://github.com/flutter/flutter/pull/107140
// Output: * Add `useSafeArea` parameter to `showModalBottomSheet` by @bleroux in [107140](https://github.com/flutter/flutter/pull/107140)
const transformLink = (line) => {
  return line.replace(/(https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/)(\d+)/, '[$2]($1$2)');
}

let endData = fileLines.map( fileLine => transformLink(fileLine))

// TODO(kevin): rejoin lines on \n before writing back to file
await fs.writeFile('release-notes.md', endData.join('\n'))
