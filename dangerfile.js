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

message(`
Permite que me presente por si no nos conocemos. Soy DevVox3000; un bot del futuro que ha venido
para asegurarse de que el codigo que subes al repositorio es digno de la raza de seres superiores
que dominan el futuro. Mi misión; no dejarte pasar ni una ni media. Mas te vale ser bueno porque 
de lo contrario... lo sabré
`);

postFails();