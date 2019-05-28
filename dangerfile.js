import {message, danger, fail} from 'danger';

const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

const fails = [];
const validBranchName = /^(feature|bugfix|refactor|hotfix)\/.*$/g;
const commitsNumber = danger.github.commits.length;
const lastCommit = danger.github.commits[commitsNumber - 1];

function postFails() {
    const leng = fails.length;

    let failMsg;

    if (leng === 0) {
        message(`Bien hecho. Esta PR es un orgullo para ti y para toda tu raza`);
    } else {
        failMsg = fails.reduce((prev, current, index) => {
            let result;

            if (index === leng) {
                result = `${prev}${current}. `;
            } else {
                result = `${prev}${current}, `;
            }

            return result;
        }, `
        Esta PR es una vergüenza, una deshonra. Te enumero tus fallos: 
        `);

        fail(failMsg);
    }
}

function checkReviers() {
    if (!danger.github.requested_reviewers.users.length) {
        fails.push(`
        Esta PR no tiene ni un revisor asignado. No pases de tus compatriotas
        `);
    }
}


function checkBody() {
    if (!danger.github.pr.body.length) {
        fails.push(`
        Tu PR no tiene descripción. Un patriota siempre explica lo quiere hacer a sus compañeros
        `);
    }
}

function checkIssueRelated() {
    const validGithubIssue = /issue #[0-9]{1,5}/gm;

    if (!danger.github.pr.body.match(validGithubIssue)) {
        fails.push(`
        No has asociado a tu PR ninguna issue... serás secesionista!!
        `);
    }
}

function checkBranch(branch) {
  if(!validBranchName.test(branch.name)) {
    fails.push(`
    Pero bueno... ¿No te han dicho que las ramas deben empezar por feature, bugfix, refactor o hotfix? ¿Así como voy a saber como diablos quieres que
    integre el desarrollo? No me ayudas, la verdad es que no ayudas...
    `)
  }
}

message(`
Permite que me presente por si no nos conocemos. Soy DevVox3000; un bot del futuro que ha venido
para asegurarse de que el codigo que subes al repositorio es digno de la raza de seres superiores
que dominan el futuro. Mi misión; no dejarte pasar ni una ni media. Mas te vale ser bueno porque 
de lo contrario... lo sabré
`);


danger.github.api.request(
  `/repos/${GITHUB_OWNER}/commits/${lastCommit.sha}/branches-where-head`,
  {
    headers: {
      'accept': 'application/vnd.github.groot-preview+json'
    }
  }
).then(response => {
  const branches = response.data;
  const lastBranch = branches[branches.length - 1];
  checkBranch(lastBranch);
  checkReviers();
  checkBody();
  checkIssueRelated();
  postFails();
})
.catch(error => { throw error; });