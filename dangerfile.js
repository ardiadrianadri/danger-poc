import { message, fail, danger } from 'danger';

const fails = [];

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

checkReviewers();
checkBody();
checkIssue();
checkFails();