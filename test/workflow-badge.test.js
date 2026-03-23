const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.join(__dirname, '..');
const readmePath = path.join(repoRoot, 'README.md');
const workflowPath = path.join(repoRoot, '.github', 'workflows', 'azure-webapps-node.yml');

test('README includes the branch-scoped Azure workflow badge snippet', () => {
  const readme = fs.readFileSync(readmePath, 'utf8');

  assert.match(
    readme,
    /<a href="https:\/\/github\.com\/phuquoc81\/PhuAntiMatter\/actions\/workflows\/azure-webapps-node\.yml"><img src="https:\/\/github\.com\/phuquoc81\/PhuAntiMatter\/actions\/workflows\/azure-webapps-node\.yml\/badge\.svg\?branch=copilot%2Fupdate-azure-web-apps-workflow-another-one&amp;event=check_run"><\/a>/
  );
});

test('Azure workflow keeps single branch and app-name keys', () => {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  const branchesKeys = workflow.match(/^\s+branches:/gm) ?? [];
  const webappNameKeys = workflow.match(/^  AZURE_WEBAPP_NAME:/gm) ?? [];

  assert.equal(branchesKeys.length, 1);
  assert.equal(webappNameKeys.length, 1);
  assert.match(workflow, /branches: \[ "main", "copilot\/\*\*" \]/);
  assert.match(workflow, /AZURE_WEBAPP_NAME: ''/);
});
