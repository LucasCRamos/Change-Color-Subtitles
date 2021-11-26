interfaceInicial();

var subtitleColor = "";

function interfaceInicial(){

    let readline = require('readline');
    
    let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
    });

    rl.question("Digite o código Hexadecimal da cor desejada para a legenda: ", function(subtitleColor) {
        geraLegendaModificada();
    rl.close();
    });

}


function geraLegendaModificada(){

    const fs = require('fs');

    fs.readFile('SpiritedAway.srt', function (err, data) {

    if (err) throw err;

    const arr = data.toString().replace(/\r\n/g, '\n').split('\n');

    let auxiliar = "";

    let legendaModificada = arr.slice();

    let regexFormatTime = new RegExp('[0-9]{2}[:][0-9]{2}[:][0-9]{2}[,][0-9]{3}');
    let regexFormatColor = new RegExp('</font>');


    for (let i of legendaModificada) {

        if (i != "") {

            if (regexFormatTime.test(i)) {

                auxiliar = "<font color=#"+subtitleColor+">" + arr[legendaModificada.indexOf(i) + 1] + " </font>";

                legendaModificada[legendaModificada.indexOf(i) + 1] = auxiliar;

            }


            else if (regexFormatColor.test(legendaModificada[legendaModificada.indexOf(i) - 1])) {

                auxiliar = "<font color=#"+subtitleColor+">" + arr[legendaModificada.indexOf(i)] + " </font>";
                legendaModificada[legendaModificada.indexOf(i)] = auxiliar;

            }
        }

    }

    const writeStream = fs.createWriteStream('legendaModificada.srt');

    const pathName = writeStream.path;

    // write each value of the array on the file breaking line
    legendaModificada.forEach(value => writeStream.write(`${value}\n`));

    // the finish event is emitted when all data has been flushed from the stream
    writeStream.on('finish', () => {
        console.log(`wrote all the array data to file ${pathName}`);
    });

    // handle the errors on the write process
    writeStream.on('error', (err) => {
        console.error(`There is an error writing the file ${pathName} => ${err}`)
    });

    // close the stream
    writeStream.end();

});

}