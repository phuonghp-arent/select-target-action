import * as fs from 'fs';
import * as core from '@actions/core';

const recursive = require("recursive-readdir");

function getLabels(): string[] {
    const labelsFileName = 'labels.txt'
    const labelsFilePath = process.env.CI_INFO_TEMP_DIR
    recursive(labelsFilePath + "/" + labelsFileName, function (err, files) {
        core.debug(files);
    });
    core.debug(fs.readFileSync(labelsFilePath + "/" + labelsFileName).toString());
    let r = fs.readFileSync(labelsFilePath + "/" + labelsFileName).toString().split(/\r?\n/).filter(Boolean);
    let labels: string[] = Object.values(r)
    core.debug(labels.toString())
    return labels;
}

export function getTargets(configPath: string): object[] {
    const labels = getLabels();
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'))

    let targets: object[] = [];
    for (const idx in labels) {
        let key = labels[idx];
        for (const i in configData[key]) {
            targets.push(configData[key][i])
        }
    }

    // merge working directories
    let set = new Set(targets)
    let setToArr = Array.from(set)
    core.debug(setToArr.toString())
    return setToArr;
}
