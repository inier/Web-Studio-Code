import isElement from '@yelloxing/core.js/isElement';
import isString from '@yelloxing/core.js/isString';
import isFunction from '@yelloxing/core.js/isFunction';

import { textWidth, bestLeftNum, calcCanvasXY } from './edit-view/tool';

import { initDom, initView } from './edit-view/init';
import { updateView, updateSelectView, updateCursorPosition, updateCanvasSize, cancelSelect } from './edit-view/update';
import bindEvent from './edit-view/bind';

// 引入内置的语言支持

import html_shader from './lang/html/shader';
import html_format from './lang/html/format';

import css_shader from './lang/css/shader';
import css_format from './lang/css/format';

import javascript_shader from './lang/javascript/shader';
import javascript_format from './lang/javascript/format';

let wscode = function (options) {

    /**
     * 
     * [格式化配置]
     * 
     * 所有的配置校验和默认值设置等都应该在这里进行
     * 经过这里处理以后，后续不需要再进行校验了
     * 因此这里的内容的更改一定要慎重
     * 
     */

    // 编辑器挂载点
    if (isElement(options.el)) {

        // 着色器
        let shader = {
            html: html_shader,
            css: css_shader,
            javascript: javascript_shader,
            normal: () => {
                let resultData = [];
                this._contentArray.forEach(text => { resultData.push([{ content: text, color: this._colorText }]); });
                return resultData;
            }
        };

        // 格式化
        let format = {
            html: html_format,
            css: css_format,
            javascript: javascript_format,
            normal: textString => textString
        };

        this._el = options.el;

        // 着色
        options.color = options.color || {};
        this._colorBackground = options.color.background || "#d6d6e4"; /*编辑器背景*/
        this._colorText = options.color.text || "#000000"; /*普通文本颜色*/
        this._colorNumber = options.color.number || "#888484"; /*行号颜色*/
        this._colorEdit = options.color.edit || "#eaeaf1"; /*编辑行颜色*/
        this._colorCursor = options.color.cursor || "#ff0000"; /*光标颜色*/
        this._colorSelect = options.color.select || "#6c6cf155"; /*选择背景*/
        this._fontFamily = options["font-family"] || "新宋体"; /*字体*/
        this._fontWeight = options["font-weight"] || 600;/*字重*/
        this._tabSpace = options.tabSpace || 4;/*设置一个tab表示多少个空格*/

        // 语言类型
        let lang = options.lang || {};
        this._langType = lang.type || "normal"; /*默认普通文本*/
        this._langColors = lang.color || {}; this._langColors.text = this._colorText;

        // 文本
        this._contentArray = isString(options.content) ? (options.content + "").split("\n") : [""];

        // 着色方法
        this.$shader = isFunction(options.shader) ? options.shader : shader[this._langType];

        // 格式化方法
        this.$format = isFunction(options.format) ? options.format : format[this._langType];

    } else {

        // 挂载点是必须的，一定要有
        throw new Error('options.el is not a element!');
    }

    // 先初始化DOM
    this.$$initDom();

    // 初始化控制变量
    this.__needUpdate = true;
    this.__lineNum = this._contentArray.length - 1;
    this.__leftNum = this._contentArray[this.__lineNum].length;
    this.__formatData = this.$shader(this._contentArray.join('\n'), this._langColors);

    // 初始化视图
    this.$$initView();

    // 更新视图
    this.$$updateView();

    // 绑定操作
    this.$$bindEvent();

    this.valueOf = () => {
        return this._contentArray.join('\n');
    };

    this.format = () => {

        // 格式化内容
        this._contentArray = this.$format(this._contentArray.join('\n')).split('\n');

        this.__lineNum = this._contentArray.length - 1;
        this.__leftNum = this._contentArray[this.__lineNum].length;

        // 着色
        this.__formatData = this.$shader(this._contentArray.join('\n'), this._langColors);

        // 更新视图
        this.$$updateView();

        // 更新光标位置
        this.$$initView();

    };

};

// 挂载辅助方法
wscode.prototype.$$textWidth = textWidth;
wscode.prototype.$$bestLeftNum = bestLeftNum;
wscode.prototype.$$calcCanvasXY = calcCanvasXY;

// 挂载核心方法

wscode.prototype.$$initDom = initDom;
wscode.prototype.$$initView = initView;

wscode.prototype.$$updateView = updateView;
wscode.prototype.$$updateSelectView = updateSelectView;
wscode.prototype.$$updateCursorPosition = updateCursorPosition;
wscode.prototype.$$updateCanvasSize = updateCanvasSize;
wscode.prototype.$$cancelSelect = cancelSelect;

wscode.prototype.$$bindEvent = bindEvent;

wscode.author = '心叶（yelloxing@gmail.com）';

if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = wscode;
} else {
    window.WSCode = wscode;
}