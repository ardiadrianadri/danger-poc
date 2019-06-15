import { message, fail, danger } from "danger";

const GITHUB_OWNER = process.env.GITHUB_OWNER || "ardiadrianadri";
const GITHUB_REPO = process.env.GITHUB_REPO || "danger-poc";

message(`
Hola a todos. Soy el bot dev vox 3000; un bot que viene del 
pasado mas rancio para asegurarse de tu código es digno de una
raza superior
`);

const fails = [];

function checkFails() {
  let messageFail;

  if (fails.length === 0) {
    message(`
    Que maravilla, que obra de arte. Este codigo es un orgullo
    para ti y para toda tu raza
    `);
  } else {
    messageFail = fails.reduce(
      (prev, current) => (prev += current + ", "),
      `Madre mia!!! que dolor. Mira todas las cagadas que has hecho: `
    );
    fail(messageFail);
  }
}

function checkReviewrs() {
  let numReviewrs = danger.github.requested_reviewers.users.length;

  if (numReviewrs === 0) {
    fails.push("No has añadido ningun revisor a tu PR");
  }
}

function checkBody() {
  let body = danger.github.pr.body;

  if (body.length === 0) {
    fails.push("No has añadido ninguna descripción de tus cambios");
  }
}

function checkIssue() {
  const validGithubIssue = /issue #[0-9]{1,5}/gm;
  const body = danger.github.pr.body;

  if (!validGithubIssue.test(body)) {
    fails.push("Indica la issue en el cuerpo del mensaje porfavor");
  }
}

function checkChangelog() {
  const modifiedFiles = danger.git.modified_files.concat(
    danger.git.created_files
  );
  const changelogFile = modifiedFiles.filter(
    file => file === "CHANGE_LOG.md"
  )[0];

  if (!changelogFile) {
    fails.push("Te has olvidado de añdir el change log");
  }
}

async function getCurrentBranch() {
  const lengCommits = danger.github.commits.length;
  const lastSha = danger.github.commits[lengCommits - 1].sha;

  const respondeGithb = await danger.github.api.request(
    `/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches`,
    {
      headers: {
        accept: "application/vnd.github.groot-preview+json"
      }
    }
  );

  const branches = respondeGithb.data;
  return branches.filter(branch => branch.commit.sha === lastSha)[0].name;
}

function chechBranchName(branchName) {
  const validBranchName = /^(feature|bugfix|refactor|hotfix)\/.*$/g;

  if (!validBranchName.test(branchName)) {
    fails.push('Nooooo, el nonbre de la rama no es correcto');
  }
}

getCurrentBranch().then(branchName => {
  chechBranchName(branchName);
  checkChangelog();
  checkBody();
  checkIssue();
  checkReviewrs();
  checkFails();
});
