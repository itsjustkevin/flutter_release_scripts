import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = 'dart-sdk';
const repo = 'sdk';
const languageFeatureName = 'Augmentations';

const generateIssueList = (languageFeatureName) => [
  `[${languageFeatureName}] Write the spec`,
  `[${languageFeatureName}] Language tests`,
  `[${languageFeatureName}] Co19 tests - add tests`,
  `[${languageFeatureName}] Implement feature in the CFE`,
  `[${languageFeatureName}] Analyzer implementation`,
  `[${languageFeatureName}] Tests validating as passing (Tracking via Google Sheet)`,
  `[${languageFeatureName}] Syntax highlighters implementation`,
  `[${languageFeatureName}] DDC implementation`,
  `[${languageFeatureName}] Dart2js implementation`,
  `[${languageFeatureName}] VM implementation`,
  `[${languageFeatureName}] Build system support`,
  `[${languageFeatureName}] Web debugging support`,
  `[${languageFeatureName}] Core library updates`,
  `[${languageFeatureName}] Analysis server / IDE`,
  `[${languageFeatureName}] dart_style support`,
  `[${languageFeatureName}] dartdoc implementation`,
  `[${languageFeatureName}] Cider support`,
  `[${languageFeatureName}] Kythe implementation`,
  `[${languageFeatureName}] Angular compiler implementation`,
  `[${languageFeatureName}] Intellij implementation`,
  `[${languageFeatureName}] Language feature docs`,
  `[${languageFeatureName}] VM service protocol support`,
  `[${languageFeatureName}] VM debugging support`,
  `[${languageFeatureName}] linter support`
];

const createLanguageIssues = async () => {
  try {
    const umbrellaIssueTitle = 'Implement augmentations feature';
    const issueList = generateIssueList(languageFeatureName);
    const umbrellaIssueBody = `This is an umbrella issue covering ${languageFeatureName}.`;

    console.log(`Creating umbrella issue in ${owner}/${repo}...`);
    const umbrellaIssue = await octokit.rest.issues.create({
      owner,
      repo,
      title: umbrellaIssueTitle,
      body: umbrellaIssueBody
    });
    console.log('Umbrella issue created:', umbrellaIssue.data.html_url);

    const createdIssueLinks = [];
    for (const issueTitle of issueList) {
      console.log(`Creating issue: ${issueTitle}`);
      const issue = await octokit.rest.issues.create({
        owner,
        repo,
        title: issueTitle,
        body: ''
      });
      console.log('Issue created:', issue.data.html_url);
      createdIssueLinks.push(issue.data.html_url);
    }

    const fullUmbrellaIssueBody = `${umbrellaIssueBody}\n\nGenerated issue links:\n${createdIssueLinks.map(link => `- [${link}](${link})`).join('\n')}`;

    console.log('Updating umbrella issue with created issue links...');
    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: umbrellaIssue.data.number,
      body: fullUmbrellaIssueBody
    });
    console.log('Umbrella issue updated successfully.');

  } catch (error) {
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Request URL:', error.request.url);
      console.error('Request Method:', error.request.method);
      console.error('Request Headers:', error.request.headers);
    } else {
      console.error('Error:', error.message);
    }
  }
};

createLanguageIssues();
