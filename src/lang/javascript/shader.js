
import { toShaderReult } from '../tool';
import keyWords from './assets/key';

export default function (textString, colors, notToResult) {

    let shaderArray = [];

    // 当前面对的
    let i = 0;

    // 获取往后n个值
    let nextNValue = function (n) {
        return textString.substring(i, n + i > textString.length ? textString.length : n + i);
    };

    let template = "";

    // 初始化模板，开始文本捕获
    let initTemplate = function () {
        if (template != "") {

            // 考虑开始的(s
            if (template[0] == '(') {
                shaderArray.push({
                    color: colors.border,
                    content: "("
                });
                template = template.substr(1);
            }

            shaderArray.push({
                color: colors.text,
                content: template
            });
        }

        template = "";
    };

    while (true) {

        console.log(template);

        /* 1.注释1 */

        if (nextNValue(2) == '/*') {

            initTemplate();
            while (nextNValue(2) !== '*/' && i < textString.length) {
                template += textString[i++];
            }

            shaderArray.push({
                color: colors.annotation,
                content: template + nextNValue(2)
            });
            i += 2;
            template = "";

        }

        /* 2.注释2 */

        else if (nextNValue(2) == '//') {
            initTemplate();
            while (nextNValue(1) !== '\n' && i < textString.length) {
                template += textString[i++];
            }
            shaderArray.push({
                color: colors.annotation,
                content: template
            });
            template = "";
        }

        /* 3.字符串 */

        else if (["'", '"', '`'].indexOf(nextNValue(1)) > -1) {



            let strBorder = nextNValue(1);
            initTemplate();

            do {
                template += textString[i++];
            } while (nextNValue(1) != strBorder && i < textString.length)

            // 因为可能是没有字符导致的结束
            if (nextNValue(1) != strBorder) {
                strBorder = "";
            } else {
                i += 1;
            }

            shaderArray.push({
                color: colors.string,
                content: template + strBorder
            });
            template = "";

        }


        /* 4.函数定义 */

        else if (nextNValue(1) == '(' && (template[0] == ' ' || (i - template.length - 1 >= 0 && textString[i - template.length - 1] == " "))) {
            shaderArray.push({
                color: colors.tag,
                content: template
            });
            i += 1;
            template = "(";

        }

        /* 5.方法调用 */

        else if (nextNValue(1) == '(') {

            shaderArray.push({
                color: colors.attr,
                content: template
            });
            i += 1;
            template = "(";
        }

        /* 6.边界 */

        else if ([";", '{', '}', '(', ')', '.', '\n'].indexOf(nextNValue(1)) > -1) {

            initTemplate();
            shaderArray.push({
                color: colors.border,
                content: nextNValue(1)
            });
            template = "";
            i += 1;
        }

        /* 7.关键字 */

        else if (nextNValue(1) == ' ' && keyWords.indexOf(template.trim()) > -1) {

            shaderArray.push({
                color: colors.key,
                content: template + " "
            });
            template = "";
            i += 1;

        }

        /* 追加字符 */

        else {
            if (i >= textString.length) {
                initTemplate();
                break;
            } else {
                template += textString[i++];
            }
        }

    }

    return notToResult ? shaderArray : toShaderReult(shaderArray);

};