var canvas = require('canvas-api-wrapper'),
    dsv = require('d3-dsv'),
    csvFilename = process.argv[2];

async function getCSV(courseCsvFile) {
    const stripBOM = require('strip-bom');
    const dsv = require('d3-dsv');
    const path = require('path');
    const fs = require('fs');
    //resolve the path the user puts in
    courseCsvFile = path.resolve(courseCsvFile);
    //read it in and remove the potential BOM and then parse with DSV 
    var csvCourseData = dsv.csvParse(stripBOM(fs.readFileSync(courseCsvFile, 'utf8')));

    return csvCourseData;
}


async function main() {
    try {

        // read in csv
        var csvData = await getCSV(csvFilename);
        csvData = csvData.slice(0);

        var postBody = {
            course: {
                event: "offer"
            }
        };
        //loop and publish them all
        for (let i = 0; i < csvData.length; i++) {
            const course = csvData[i];
            await canvas.put(`/api/v1/courses/${course.id}`, postBody);
            console.log(`finished ${course.name}| ${course.id} |${((i+1)/csvData.length*100).toFixed(2)}%`)
        }
    } catch (e) {
        console.log(e);
    }
}

main();