import { message, danger, fail } from "danger";

const fails = [];
const GITHUB_OWNER = process.env.GITHUB_OWNER || "ardiadrianadri";
const GITHUB_REPO = process.env.GITHUB_REPO || "danger-poc";

message(`
Hola a todos soy DevVox 3000 un bot que ha resucitado de un pasado muy casposo y viene a asegurase de tu 
codigo es digno de un desarrollador de una raza superior
`);

function checkFails() {
  const leng = fails.length;

  let failMessage;

  if (leng === 0) {
    message(`
      Que bonito, que obra de arte, que cosa mas chula. Este código demuestra que eres un orgullo para ti
      y para toda tu raza
    `);
  } else {
    failMessage = fails.reduce(
      (prev, current) => (prev += current + ", "),
      `Que vergüenza, que horror, mira todas las pifias que has hecho: `
    );

    fail(failMessage);
  }
}

function checkReviewrs() {
  let contReviwers = danger.github.requested_reviewers.users.length;

  if (contReviwers === 0) {
    fails.push("Necesitas al menos un reviewr");
  }
}

function checkBody() {
  if (!danger.github.pr.body.length) {
    fails.push(`
     Pon al menos uno o dos lineas de descripción
    `);
  }
}

function checkIssue() {
  const validGithubIssue = /issue #[0-9]{1,5}/gm;
  const body = danger.github.pr.body;

  if (!validGithubIssue.test(body)) {
    fails.push("Porfavor, indica que issue esta resolviendo con estos cambios");
  }
}

function checkChangelog() {
  const modifiedFiles = danger.git.modified_files.concat(
    danger.git.created_files
  );
  const changeLog = modifiedFiles.filter(file => file === "CHANGE_LOG.md")[0];

  if (!changeLog) {
    fails.push("Te has olvidado de añadir el changelog");
  }
}

async function getBranch() {
  const lengCommits = danger.git.commits.length;
  const lastCommit = danger.git.commits[lengCommits - 1];
  const lastSha = lastCommit.sha;

  const responseGithub = await danger.github.api.request(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches`,
    {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      }
    }
  );

  const listBranches = responseGithub.data;

  return listBranches.filter(branch => branch.commit.sha === lastSha)[0].name;
}

function checkBranchName(name) {
  const validBranchName = /^(feature|bugfix|refactor|hotfix)\/.*$/g;

  if (!validBranchName.test(name)) {
    fails.push(
      "La rama tiene que empezar por feature, bugfix, refactor o hotfix"
    );
  }
}

async function checkLiveDocu() {
  const validComent = /\/\*\*.*(function)?.*\*\/\n(export )?(async )?function/s;
  const validJSFile = /\.js$/g;

  let modifiedFiles = danger.git.modified_files.concat(
    danger.git.created_files
  );

  modifiedFiles = modifiedFiles.filter(file => (validJSFile.test(file) && file !== 'dangerfile.js'));

  for (const file of modifiedFiles) {
    const diffFile = await danger.git.diffForFile(file);
    const filePostPr = diffFile.after;

    if (!validComent.test(filePostPr)) {
      fails.push(`Te has olvidado de añadir los comentarios en el fichero ${file}`);
    }
  }
}

getBranch().then(nameBranch => {
  checkBranchName(nameBranch);

  return checkLiveDocu();
})
.then(() => {
  checkChangelog();
  checkIssue();
  checkBody();
  checkReviewrs();
  checkFails();
});
