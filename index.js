import {Octokit} from 'octokit'
import 'dotenv/config'
import * as fs from 'fs/promises'

const TOKEN = process.env.GITHUB_TOKEN

const octokit = new Octokit({ auth: TOKEN })

let data = await octokit.request('POST /repos/{owner}/{repo}/releases/generate-notes', {
  owner: 'flutter',
  repo: 'flutter',
  tag_name: '2.8.0',
  previous_tag_name: '2.5.0'
})

let notes = data.data.body

await fs.writeFile('release-notes.md', notes)


