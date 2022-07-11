const path = require('path')
const fs = require('fs')
const {resolve, extname} = path;
const entryDir = resolve(__dirname, '../svgs')
const outDir = resolve(__dirname, '../icons')
const outDirEsm = resolve(__dirname, '../icons_esm')
const {svgDataFlat} = require('./getSvgData')

const config = {
    plugins: [
        'removeUnknownsAndDefaults', //
        'cleanupAttrs',
        'removeXMLNS',
        'removeDoctype',
        'removeXMLProcInst',
        'removeComments',
        'removeMetadata',
        'removeTitle',
        'removeDesc',
        'removeUselessDefs',
        'removeEditorsNSData',
        'removeEmptyAttrs',
        'removeHiddenElems',
        'removeEmptyText',
        'removeEmptyContainers',
        // 'removeViewBox',
        'cleanupEnableBackground',
        'convertStyleToAttrs',
        'convertColors',
        'convertPathData',
        'convertTransform',
        'removeNonInheritableGroupAttrs',
        'removeUselessStrokeAndFill',
        'removeUnusedNS',
        'cleanupIDs',
        'cleanupNumericValues',
        'moveElemsAttrsToGroup',
        'moveGroupAttrsToElems',
        'collapseGroups',
        // 'removeRasterImages',
        'mergePaths',
        'convertShapeToPath',
        'sortAttrs',
        'removeDimensions',
        {
            // https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Fills_and_Strokes
            name: 'addAttributesToSVGElement',
            params: {
                attributes: [
                    {
                        fill: 'none',
                    },
                    {
                        stroke: 'currentColor',
                    },
                    '{...props}',
                ],
            },
        },
    ],
};

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
