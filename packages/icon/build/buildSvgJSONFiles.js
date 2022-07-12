const path = require('path')
const fs = require('fs')
const {resolve, extname} = path;

const { optimize } = require('svgo');
const {parse} = require('svgson')

const entryDir = resolve(__dirname, '../svgs')
const outDir = resolve(__dirname, '../icons')
const outDirEsm = resolve(__dirname, '../icons_esm')
const indexFileName = 'index.js';
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
                    // '{...props}',
                ],
            },
        },
    ],
};
const transSvg = (svgString, svgFileName) => {
    return new Promise((resolve, reject) => {
        try {
            const format = () => optimize(svgString, config);
            return parse(format().data).then(json => resolve(json));
        } catch (e) {
            reject(e);
        }
    });
};
async function build(entryDir, outDir, outDirEsm, prefix, suffix) {
    // 重置文件夹
    fs.rmdirSync(outDir, { recursive: true });
    fs.rmdirSync(outDirEsm, { recursive: true });
    fs.mkdirSync(outDirEsm);
    fs.mkdirSync(outDir);
    const batches = svgDataFlat
        .map(async ({name, componentName, file}) => {
            const jsonFileName = `${componentName}.js`;
            const svgCode = fs.readFileSync(file, 'utf8');
            let JSONCode = await transSvg(svgCode, file);
            // 加上 _name 名称
            JSONCode._name = name;
            // 格式化代码，写入文件
            let _JSONCode = `exports.default = ${JSON.stringify(JSONCode)}`;
            // const formattedCode = prettier.format(_JSONCode, prettierConfig);
            fs.writeFileSync(resolve(outDir, jsonFileName), _JSONCode, 'utf-8');
            return { fileName: jsonFileName, componentName };
        });
    const arr = await Promise.all(batches);
    const indexFileContent = arr
        .map((a) => `exports.${a.componentName} = require('./${a.componentName}').default;`)
        .join('\n');
    fs.writeFileSync(
        resolve(outDir, indexFileName),
        '/* eslint-disable @typescript-eslint/no-var-requires */' + '\n' + indexFileContent + '\n',
        'utf-8',
    );
}
build(entryDir, outDir, outDirEsm)
