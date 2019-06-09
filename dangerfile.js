import { message, fail, danger } from 'danger';

const fails = [];
const GITHUB_OWNER = process.env.GITHUB_OWNER || 'ardiadrianadri';
const GITHUB_REPO = process.env.GITHUB_REPO || 'danger-poc';

function checkReviewers () {
  let numReviewers = danger.github.requested_reviewers.users.length;

  if (numReviewers === 0) {
    fails.push(`No has añadido ningún revisor a la PR`);
  }
}

function checkBody () {
  let pullRequestDescription = danger.github.pr.body.length;

  if (pullRequestDescription === 0) {
    fails.push('Te falta añadir una descripción a tu PR');
  }
}

function checkIssue() {
  const regExpIssue = /issue #[0-9]{1,5}/gm;
  const pullRequestDescription = danger.github.pr.body;

  if (!regExpIssue.test(pullRequestDescription)) {
    fails.push('No has asociado tu PR a su respectiva issue');
  }
}

function checkChangelog() {
  const modifiedFiles = danger.git.modified_files.concat(danger.git.created_files);
  const changeLog = modifiedFiles.filter(file => file === 'CHANGE_LOG.md');

  if (changeLog.length === 0) {
    fails.push(`Te has olvidado de actualizar el changelog`);
  }
}

async function checkBranchName() {
  const validBranchName = /^(feature|bugfix|refactor|hotfix)\/.*$/g;
  const commitsLeng = danger.github.commits.length;
  const lastSha = danger.github.commits[commitsLeng - 1].sha;
  const githubResponse = await danger.github.api.request(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches`,
    {
      headers: {
        'accept': 'application/vnd.github.groot-preview+json'
      }
    }
  );

  const branchOur = githubResponse.data.filter(branch => branch.commit.sha === lastSha)[0];

  if (!validBranchName.test(branchOur.name)) {
    fails.push(`Las ramas deben empezar por feature, bugfix, refactor o hotfix y la tuya no lo hace`);
  }
}

async function checkLiveDocumentation() {
  const validComent = /\/\*\*.*(function)?.*\*\/\n(export )?(async )?function/s;
  const validJSFile = /\.js$/g;

  let modifiedFiles = danger.git.created_files.concat(danger.git.modified_files);
  let diffFile;
  let currentFile;

  modifiedFiles = modifiedFiles.filter(file => validJSFile.test(file) && file !== 'dangerfile.js');

  for (const file of modifiedFiles) {
    diffFile = await danger.git.diffForFile(file);
    currentFile = diffFile.after;

    if ((currentFile.indexOf('function') > -1) && (!validComent.test(currentFile))) {
      fails.push(`Te has olvidado de añadir la documentación viva en el fichero ${file}`);
    }
  }
}

function checkFails () {
  const leng = fails.length;
  let msgFail = '';

  if (leng === 0) {
    message(
    `Increible... que gran código. Como programador eres un orgulo para ti y para toda tu raza`
    );
  } else {
    msgFail = fails.reduce(
      (prev, current) => prev += ` ${current},`,
      `Pero que vergüenza, que desastre. ¿Tú te consideras un profesional?.
       Mira, mira en cuantas cosas has fallado:`);
    fail(msgFail);
  }
}

message(`
Hola, permiteme que me presente; soy DevVox 3000 un bot del futuro que ha venido 
para asegurarse de que tu código es digno de una raza superior.
`);

checkBranchName()
.then(() => {
  return checkLiveDocumentation();
})
.then(() => {
  checkChangelog();
  checkReviewers();
  checkBody();
  checkIssue();
  checkFails();
});
