/**
 * xtags functions
 * @author surfsky.github.com 2024
 */

/**Select one element */
function $(selector) { return document.querySelector(selector);}


/**Simply event bind */
Element.on = function(eventname, func) { return this.addEventListener(eventname, func); }

/**
 * Display html code.
 * @param {stirng} id <pre> tag id, to display code.
 */
function showHtmlCode(id){
    const bodyHtml = document.body.outerHTML;
      // 去除 script 标签，注释，空行
      const bodyWithoutScript = bodyHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      const bodyWithoutComments = bodyWithoutScript.replace(/<!--[\s\S]*?-->/g, '');
      const bodyWithoutEmptyLines = bodyWithoutComments.replace(/^\s*[\r\n]/gm, '');
      const codeDisplay = document.getElementById(id);
      codeDisplay.textContent = bodyWithoutEmptyLines;
      hljs.highlightElement(codeDisplay);
  }
