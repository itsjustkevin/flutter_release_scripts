#!/usr/bin/env node

import { program } from 'commander'
import generateNotes from '../commands/generateNotes'
import countStats from '../commands/countStats'

program
  .name('release-manager')
  .description('CLI to automate release management processes')

program
  .command('generate-notes')
  .description('Generate release notes')
  .option('-r, --repos <repos...>', 'Repository names', ['flutter', 'engine'])
  .requiredOption('-t, --tag <tag>', 'Tag name (e.g., 3.13.0-0.4.pre)')
  .requiredOption('-p, --previousTag <previousTag>', 'Previous tag name (e.g., 3.10.0)')
  .action(generateNotes);

program
  .command('count-stats')
  .description('Count commits and contributors')
  .requiredOption('-r, --repo <repo>', 'Repository name (e.g., flutter or engine)')
  .requiredOption('-t, --tag <tag>', 'Tag name (e.g., 3.13.0-0.4.pre)')
  .requiredOption('-p, --previousTag <previousTag>', 'Previous tag name (e.g., 3.10.0)')
  .action(countStats);

program.parse(process.argv);
