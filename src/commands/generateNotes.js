import { Octokit } from 'octokit';

import transformLink from '../utils/transformLink';

import 'dotenv/config';

const TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: TOKEN });

const generateNotes = async (repo) => {
  let data = await octokit.request('POST /repos/{owner}/{repo}/releases/generate-notes', {
    owner: 'flutter',
    repo: repo,
    tag_name: '3.16.0-0.5.pre',
    previous_tag_name: '3.13.0'
  });

  let notes = data.data.body;

  notes = notes.split('\n')
    .filter(line => !line
      .includes('<!-- Release notes generated using configuration in .github/release.yml'))
      .join('\n')
      .trimStart();

  let fileLines = notes.split('\n');
  let transformedLines = fileLines.map(transformLink);

  return {
    notes: transformedLines.join('\n')
  };
};

const writeReleaseNotes = async () => {
  const frameworkData = await generateNotes('flutter');
  const engineData = await generateNotes('engine');

  const combinedNotes = `Framework\n\n${frameworkData.notes}\n\nEngine\n\n${engineData.notes}`;

  await fs.writeFile('release-notes.md', combinedNotes);
}

writeReleaseNotes().catch(console.error);

export default generateNotes;
