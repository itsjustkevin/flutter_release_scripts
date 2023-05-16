import {Octokit} from 'octokit'
import 'dotenv/config'

const TOKEN = process.env.GITHUB_TOKEN
const octokit = new Octokit({ auth: TOKEN })


let data = await octokit.request('GET /repos/{owner}/{repo}/issues', {
  owner: 'flutter',
  repo: 'flutter',
  state: 'closed',
  direction: 'desc',
  per_page: 100,
  headers: {
    'X-GitHub-Api-Version': '2022-11-28'
  }
})

let issueData = data.data

for (const issue of issueData) {
  let parsedDate = new Date(issue.closed_at).toISOString()



    console.log(parsedDate)
  // console.log(`${issue.title} | created at: ${issue.created_at} | closed at: ${issue.closed_at}`)
}
