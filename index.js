import { Octokit } from 'octokit';
import 'dotenv/config';
import * as fs from 'fs/promises';

const TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: TOKEN });

const extractContributors = (notes) => {
  const contributorSet = new Set();
  const contributorRegex = /by @(\w+)/g;
  let match;

  while ((match = contributorRegex.exec(notes)) !== null) {
    contributorSet.add(match[1]);
  }

  return Array.from(contributorSet);
};

const extractNewContributors = (notes) => {
  const newContributorSet = new Set();
  const newContributorRegex = /@(\w+) made their first contribution/g;
  let match;

  while ((match = newContributorRegex.exec(notes)) !== null) {
    newContributorSet.add(match[1]);
  }

  return newContributorSet;
};

const generateReleaseNotes = async () => {
  let data = await octokit.request('POST /repos/{owner}/{repo}/releases/generate-notes', {
    owner: 'flutter',
    repo: 'flutter',
    tag_name: '3.32.0-0.2.pre',
    previous_tag_name: '3.29.0'
  });

  let notes = data.data.body;

  notes = notes.split('\n')
    .filter(line => !line
      .includes('<!-- Release notes generated using configuration in .github/release.yml'))
      .join('\n')
      .trimStart();

  const transformLink = (line) => {
    return line.replace(/(https:\/\/github\.com\/[^/]+\/[^/]+\/pull\/)(\d+)/, '[$2]($1$2)');
  };

  let fileLines = notes.split('\n');
  let transformedLines = fileLines.map(transformLink);

  const contributors = extractContributors(notes);
  const newContributors = extractNewContributors(notes);
  const commitCount = fileLines.length;

  return {
    notes: transformedLines.join('\n'),
    commitCount,
    contributors,
    newContributors
  };
};

const printContributorStats = (data) => {
  const contributorTableData = data.contributors.map(username => ({
    Username: `@${username}`,
    'New Contributor': data.newContributors.has(username) ? 'Yes' : 'No'
  }));

  console.log(`Contributor Statistics:`);
  console.table(contributorTableData);
  console.log(`Total Commits: ${data.commitCount}, Unique Contributors: ${data.contributors.length}, New Contributors: ${data.newContributors.size}`);
};

const writeReleaseNotes = async () => {
  const releaseData = await generateReleaseNotes();
  await fs.writeFile('release-notes.md', releaseData.notes);
  printContributorStats(releaseData);
};

writeReleaseNotes().catch(console.error);
