var readline = require('readline');
var subtitleColor = "";
var subtitleName = "";
function initialInterface() {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question("Digite o código Hexadecimal da cor desejada para a legenda (com #): ", function (subtitleColor) {
        rl.question("Digite o nome da legenda que pretende modificar (com o formato): ", function (subtitleName) {
            generateModifiedSubtitle(subtitleColor, subtitleName);
            rl.close();
        });
    });
}
function generateModifiedSubtitle(subtitleColor, subtitleName) {
    var fs = require('fs');
    fs.readFile(subtitleName, { encoding: 'latin1' }, function (err, data) {
        if (err)
            throw err;
        var arr = data.toString().replace(/\r\n/g, '\n').split('\n');
        var modifiedSubtitle = arr.slice();
        var regexFormatTime = new RegExp('[0-9]{2}[:][0-9]{2}[:][0-9]{2}[,][0-9]{3}');
        var regexFormatColor = new RegExp('</font>');
        for (var _i = 0, modifiedSubtitle_1 = modifiedSubtitle; _i < modifiedSubtitle_1.length; _i++) {
            var i = modifiedSubtitle_1[_i];
            if (i != "") {
                if (regexFormatTime.test(i)) {
                    modifiedSubtitle[modifiedSubtitle.indexOf(i) + 1] = arr[modifiedSubtitle.indexOf(i) + 1].fontcolor(subtitleColor);
                }
                else if (regexFormatColor.test(modifiedSubtitle[modifiedSubtitle.indexOf(i) - 1])) {
                    modifiedSubtitle[modifiedSubtitle.indexOf(i)] = arr[modifiedSubtitle.indexOf(i)].fontcolor(subtitleColor);
                }
            }
        }
        var writeStream = fs.createWriteStream("modified" + subtitleName);
        var pathName = writeStream.path;
        modifiedSubtitle.forEach(function (value) { return writeStream.write(value + "\n"); });
        writeStream.on('finish', function () {
            console.log("wrote all the array data to file " + pathName);
        });
        writeStream.on('error', function (err) {
            console.error("There is an error writing the file " + pathName + " => " + err);
        });
        writeStream.end();
    });
}
initialInterface();
