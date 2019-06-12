import { message, danger, fail } from 'danger';

const fails = [];

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
      (prev, current) => prev += current + ', ',
      `Que vergüenza, que horror, mira todas las pifias que has hecho: `
    );

    fail(failMessage);
  }
}

function checkReviewrs () {
  let contReviwers = danger.github.requested_reviewers.users.length;

  if (contReviwers === 0) {
    fails.push('Necesitas al menos un reviewr');
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
    fails.push('Porfavor, indica que issue esta resolviendo con estos cambios');
  }
}


checkIssue();
checkBody();
checkReviewrs();
checkFails();