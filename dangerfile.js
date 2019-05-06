/* eslint-disable no-undef */
import {message, danger, fail} from "danger"

const owner = process.env.GITHUB_OWNER || 'ardiadrianadri';
const repoName = process.env.GITHUB_REPO || 'danger-poc';
const fails = []
const validBranchName = /^(feature|bugfix|refactor|hotfix)\/.*$/g;
const validGithubIssue = /issue #[0-9]{1,5}/gm;
const validJSFile = /\.js$/g;
const validComent = /\/\*\*.*(function)?.*\*\/\n(async )?function/s;
const leng = danger.github.commits.length;
const lastCommit = danger.github.commits[leng-1];
const lengModfiedFiles = danger.git.modified_files.length;
// const reviewersCount = danger.github.requested_reviewers.users.length

/**
 * Function that prints the fails in the PR
 * @param {array} fails - Array with the list of fails
 */
async function finalJudgment (fails) {
  const leng = fails.length;

  let msg = ''
  if(leng > 0) {
    msg = fails.reduce((current, next, index) => {
      if (index === (leng - 1)) {
        return `${current} ${next}`;
      } else {
        return `${current} ${next},`;
      }
    }, 'This pull request is not worth for a superior race: ')
    fail(msg)
  } else {
    message(`Congrats this pull request is a proud for you and all your race`)
  }
}

/**
 * Function that check if the live documentation exist
 * @param {array} modifiedFiles - Array with the list of modified files
 */
async function checkLiveDocumentation (modifiedFiles) {
  let diffFile;
  let currentContent;

  for (let file of modifiedFiles) {
    if ((file.indexOf('dangerfile') < 0) && (file.match(validJSFile))) {
      diffFile = await danger.git.diffForFile(file);
      currentContent = diffFile.after;

      if ((currentContent.indexOf('function') > -1) && (!currentContent.match(validComent))) {
        fails.push(`Hey! The file ${file} has a function but it doesn't have a live documentation. It is not admisible`);
      }
    }
  }
}

/**
 * Function that checks the branch name
 * @param {response} response - Object with the response from 
 */
async function checkBranch(response) {

  const branches = response.data;
  const branch = branches[branches.length - 1];
  
  if(!validBranchName.test(branch.name)) {
    fails.push('I don\'t understand the reason to be of this PR. Have you read the rules to name the branches of the PR?')
  }
}

message(`
Hello:
I am DevVox3000, the bot that came from the future to make sure that your pull request has the standard of
a superior race.
I'm going to inspect your work to make sure your RP has what it needs to have ... so be a good developer and wait quietly while you watch as the expert works.
`)

/* if (reviewersCount <= 0) {
  fails.push('The pull request must have, at least, one reviewer');
} */

if (danger.github.pr.body.length === 0) {
  fails.push('This pull request deserves some description to be clear, Don\'t you think?');
}

if (!validGithubIssue.test(danger.github.pr.body)) {
  fails.push('This pull request is not related with any github issue. Are you sure that you are working in something that worth?');
}

danger.github.api.request(
  `/repos/${owner}/${repoName}/commits/${lastCommit.sha}/branches-where-head`,
  {
    headers: {
      'accept': 'application/vnd.github.groot-preview+json'
    }
  }
)
.then(response => checkBranch(response))
.then(() => checkLiveDocumentation(danger.git.modified_files))
.then(() => { finalJudgment(fails); })
.catch(error => { throw error })