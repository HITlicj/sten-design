import { FunctionalComponent, h, Host } from '@stencil/core';
import classNames from 'classnames';
import {getClassPrefix} from '../../utils/utils';
interface StenIconProps {
    /**

     * icon 尺寸 默认 20

     */

    size: number | string;

    /**

     * styles 传入的css样式

     */

    styles: object;

    /**

     * 图标颜色

     */

    color: string;

    /**

     * 旋转的角度

     */

    rotate: number;

    /**

     * 是否自动旋转

     */

    spin: boolean;

    /**

     * 需要渲染的svg数据

     */

    svgData: any;

}


export const Icon: FunctionalComponent<StenIconProps> = ({ size, styles, color, rotate, spin, svgData }) => {
    // 初始化 一个变量，先把 color 扔进去
    const outerStyle: Record<string, string> = { color };

// 看下 rotate 是否是个合理的取值，如果是的话，把 outerStyle 的 transform 设置好
    if (Number.isSafeInteger(rotate)) {
        outerStyle.transform = `rotate(${rotate}deg)`;
    }
    const classPrefix: string = getClassPrefix('icon');

    const classes = classNames(classPrefix, classNames, `${classPrefix}-block`, { [`${classPrefix}-spin`]: spin });
// 最后把剩下的 styles 变量都加到当前变量
    Object.assign(outerStyle, styles);
    return (
        <Host>
            <svg class={classes} width={size} height={size} style={outerStyle}></svg>
        </Host>
    );
}
