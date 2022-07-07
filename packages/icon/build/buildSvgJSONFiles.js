const path = require('path')
const fs = require('fs')
const {resolve, extname} = path;
const entryDir = resolve(__dirname, '../svgs')
const outDir = resolve(__dirname, '../icons')
const outDirEsm = resolve(__dirname, '../icons_esm')
const {svgDataFlat} = require('./getSvgData')

async function build(entryDir, outDir, outDirEsm, prefix, suffix) {
    // 重置文件夹
    fs.rmdirSync(outDir, { recursive: true });
    fs.rmdirSync(outDirEsm, { recursive: true });
    fs.mkdirSync(outDirEsm);
    fs.mkdirSync(outDir);
    const batches = svgDataFlat
        .map(async ({name, componentName, file}) => {
            // console.log(name, componentName, file)
        });
    const arr = await Promise.all(batches);
}
build(entryDir, outDir, outDirEsm)
