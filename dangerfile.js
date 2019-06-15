import {message, fail, danger} from 'danger';

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
      (prev, current) => prev += current +', ',
      `Madre mia!!! que dolor. Mira todas las cagadas que has hecho: `
      );
    fail(messageFail);
  }
}

function checkReviewrs () {
  let numReviewrs = danger.github.requested_reviewers.users.length;

  if (numReviewrs === 0) {
    fails.push('No has añadido ningun revisor a tu PR');
  }
}

function checkBody () {
  let body = danger.github.pr.body;

  if (body.length === 0) {
    fails.push('No has añadido ninguna descripción de tus cambios');
  }
}

function checkIssue() {
  const validGithubIssue = /issue #[0-9]{1,5}/gm;
  const body = danger.github.pr.body;

  if (!validGithubIssue.test(body)) {
    fails.push('Indica la issue en el cuerpo del mensaje porfavor');
  }
}

checkBody();
checkIssue();
checkReviewrs();
checkFails();
