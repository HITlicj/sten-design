const icons = require('@sten-design/icons');

const transformTemp = (svgData, key) => {
    return `import { Component, h, Prop } from '@stencil/core';
    import { ${key} as svgData } from '@sten-design/icons';
    import { Icon } from './icon';

    @Component({
      tag: 'sten-icon-${svgData._name}',
    })

    export class StenIcon${key.split('icon')[1]} {
      // xxx
      render() {
        // 参数透传
        const { size, styles, classNames, color, rotate, spin } = this;
        return <Icon {...{ size, styles, classNames, color, rotate, spin, svgData }} />;
      }
    }
    `;
};

async function build() {
    // 清空文件夹
    fs.rmdirSync(outDir, { recursive: true });
    fs.mkdirSync(outDir);
    // 遍历 icons
    if (icons && Object.keys(icons).length) {
        Object.keys(icons).forEach(key => {
            // 组装文件名称
            const jsonFileName = `sten-icon-${icons[key]._name}.tsx`;
            //  加上模板，动态生成组件
            let temp = transformTemp(icons[key], key);
            // 格式化代码
            const formattedCode = prettier.format(temp, prettierConfig);
            // 写入文件
            fs.writeFileSync(resolve(outDir, jsonFileName), formattedCode, 'utf-8');
        });
    }
}
