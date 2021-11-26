let readline = require('readline');

var subtitleColor = "";

var subtitleName = "";

function initialInterface() {

    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });


    rl.question("Digite o código Hexadecimal da cor desejada para a legenda (com #): ", (subtitleColor) => {

        rl.question("Digite o nome da legenda que pretende modificar (com o formato): ", (subtitleName) => {

            generateModifiedSubtitle(subtitleColor,subtitleName);

            rl.close();

        });

    });

}

function generateModifiedSubtitle(subtitleColor, subtitleName) {

    const fs = require('fs');

    fs.readFile(subtitleName, function (err, data) {

        if (err) throw err;

        const arr = data.toString().replace(/\r\n/g, '\n').split('\n');

        let modifiedSubtitle = arr.slice();

        let regexFormatTime = new RegExp('[0-9]{2}[:][0-9]{2}[:][0-9]{2}[,][0-9]{3}');
        
        let regexFormatColor = new RegExp('</font>');

        for (let i of modifiedSubtitle) {

            if (i != "") {

                if (regexFormatTime.test(i)) {

                    modifiedSubtitle[modifiedSubtitle.indexOf(i) + 1] = "<font color=#" + subtitleColor + ">" + arr[modifiedSubtitle.indexOf(i) + 1] + " </font>";

                }


                else if (regexFormatColor.test(modifiedSubtitle[modifiedSubtitle.indexOf(i) - 1])) {

                    modifiedSubtitle[modifiedSubtitle.indexOf(i)] = "<font color=#" + subtitleColor + ">" + arr[modifiedSubtitle.indexOf(i)] + " </font>";

                }
            }

        }

        const writeStream = fs.createWriteStream("modified" + subtitleName);

        const pathName = writeStream.path;

        modifiedSubtitle.forEach(value => writeStream.write(`${value}\n`));

        writeStream.on('finish', () => {
            console.log(`wrote all the array data to file ${pathName}`);
        });

        writeStream.on('error', (err) => {
            console.error(`There is an error writing the file ${pathName} => ${err}`)
        });

        writeStream.end();

    });

}

initialInterface();