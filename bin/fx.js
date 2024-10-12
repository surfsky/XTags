/**
 * xtags functions
 * @author surfsky.github.com 2024
 */

/**Select one element */
function $(selector) { return document.querySelector(selector);}


/**Simply event bind */
Element.on = function(eventname, func) { return this.addEventListener(eventname, func); }

/**HtmlEncode */
function htmlEncode(code) {
  //return code.replace(/[<>&"']/g, function(match) {
  return code.replace(/[<>]/g, function(match) {
      switch (match) {
          case '<':   return '&lt;';
          case '>':   return '&gt;';
          case '&':   return '&amp;';
          case '"':   return '&quot;';
          case "'":   return '&#39;';
      }
  });
}

/**
 * Display html highlight code in container.
 * @param {stirng} containerId container  <pre> tag id, to display code.
 * @description
 * <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/default.min.css">
 * <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
 */
function showPageCode(containerId){
    const bodyHtml = document.body.outerHTML;
    // clear <script> <!-- comment --> and empty line.
    const bodyWithoutScript = bodyHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    const bodyWithoutComments = bodyWithoutScript.replace(/<!--[\s\S]*?-->/g, '');
    const bodyWithoutEmptyLines = bodyWithoutComments.replace(/^\s*[\r\n]/gm, '');

    // highlight display in container using highlight.js
    const container = document.getElementById(containerId);
    container.textContent = bodyWithoutEmptyLines;
    hljs.highlightElement(container);
}
