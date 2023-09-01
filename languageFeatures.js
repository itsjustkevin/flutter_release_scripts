import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const owner = 'dart-lang';
const repo = 'sdk';

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
    const languageFeatureName = 'Test';
    const umbrellaIssueTitle = 'Implement test feature';
    const issueList = generateIssueList(languageFeatureName);
    const umbrellaIssueBody = `This is an umbrella issue covering ${languageFeatureName}.`;
    const umbrellaIssue = await octokit.rest.issues.create({
      owner,
      repo,
      title: umbrellaIssueTitle,
      body: umbrellaIssueBody
    });

    const createdIssueLinks = [];
    for (const issueTitle of issueList) {
      const issue = await octokit.rest.issues.create({
        owner,
        repo,
        title: issueTitle,
        body: ''
      });
      createdIssueLinks.push(issue.data.html_url);
    }

    const fullUmbrellaIssueBody = `${umbrellaIssueBody}\n\nGenerated issue links:\n${createdIssueLinks.map(link => `- [${link}](${link})`).join('\n')}`;

    await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: umbrellaIssue.data.number,
      body: fullUmbrellaIssueBody
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
};

createLanguageIssues();
