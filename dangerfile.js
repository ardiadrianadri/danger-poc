import {message, danger, fail} from 'danger';

const fails = [];

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
        }, `Esta PR es una vergüenza, una deshonra. Te enumero tus fallos: `);

        fail(failMsg);
    }
}

function checkReviers() {
    if (!danger.github.requested_reviewers.users.length) {
        fails.push('Esta PR no tiene ni un revisor asignado. No pases de tus compatriotas');
    }
}


function checkBody() {
    if (!danger.github.pr.body.length) {
        fails.push('Tu PR no tiene descripción. Un patriota siempre explica lo quiere hacer a sus compañeros');
    }
}

function checkIssueRelated() {
    const validGithubIssue = /issue #[0-9]{1,5}/gm;

    if (!danger.github.pr.body.match(validGithubIssue)) {
        fails.push('No has asociado a tu PR ninguna issue... serás secesionista!!');
    }
}

message(`
Permite que me presente por si no nos conocemos. Soy DevVox3000; un bot del futuro que ha venido
para asegurarse de que el codigo que subes al repositorio es digno de la raza de seres superiores
que dominan el futuro. Mi misión; no dejarte pasar ni una ni media. Mas te vale ser bueno porque 
de lo contrario... lo sabré
`);

checkReviers();
checkBody();
checkIssueRelated();
postFails();