import {Octokit} from 'octokit'
import 'dotenv/config'

const TOKEN = process.env.GITHUB_TOKEN
const octokit = new Octokit({ auth: TOKEN })

let data = await octokit.request('GET /repos/{owner}/{repo}/issues/{issue_number}', {
  owner: 'flutter',
  repo: 'flutter',
  issue_number: '125834',
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

let strippedBody = data.data.body.replaceAll('#', '')
let parsedBody = JSON.parse(strippedBody)
console.log(parsedBody);

