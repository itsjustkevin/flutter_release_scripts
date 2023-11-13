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

const generateReleaseNotes = async (repo) => {
  let data = await octokit.request('POST /repos/{owner}/{repo}/releases/generate-notes', {
    owner: 'flutter',
    repo: repo,
    tag_name: '3.16.0-0.5.pre',
    previous_tag_name: '3.13.0'
  });

  let notes = data.data.body;

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

const combineContributorLists = (list1, list2) => {
  const combinedSet = new Set([...list1, ...list2]);
  return Array.from(combinedSet);
};

const printContributorTable = (frameworkData, engineData) => {
  const combinedContributors = combineContributorLists(frameworkData.contributors, engineData.contributors);
  const combinedNewContributors = new Set([...frameworkData.newContributors, ...engineData.newContributors]);

  const contributorTableData = combinedContributors.map(username => ({
    Username: `@${username}`,
    'New Contributor': combinedNewContributors.has(username) ? 'Yes' : 'No'
  }));

  console.log(`Combined Contributor Statistics:`);
  console.table(contributorTableData);
  console.log(`Framework Commits: ${frameworkData.commitCount}, Contributors: ${frameworkData.contributors.length}, New Contributors: ${frameworkData.newContributors.size}`);
  console.log(`Engine Commits: ${engineData.commitCount}, Contributors: ${engineData.contributors.length}, New Contributors: ${engineData.newContributors.size}`);
  console.log(`Total Commits: ${frameworkData.commitCount + engineData.commitCount}, Unique Contributors: ${combinedContributors.length}, Total New Contributors: ${combinedNewContributors.size}`);
};

const writeReleaseNotes = async () => {
  const frameworkData = await generateReleaseNotes('flutter');
  const engineData = await generateReleaseNotes('engine');

  const combinedNotes = `Framework\n\n${frameworkData.notes}\n\nEngine\n\n${engineData.notes}`;

  await fs.writeFile('release-notes.md', combinedNotes);

  // Print combined contributor table and statistics to the console
  printContributorTable(frameworkData, engineData);
};

writeReleaseNotes().catch(console.error);
