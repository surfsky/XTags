/**
 * xtags functions
 * @author surfsky.github.com 2024
 */

//--------------------------------------------
// DOM
//--------------------------------------------
/**Select one element */
function $(selector) { return document.querySelector(selector);}

/**Event bind */
Element.on = function(eventname, func) { return this.addEventListener(eventname, func); }



//--------------------------------------------
// Text
//--------------------------------------------
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


/**Get query string 
 * @param {string} url
 * @returns {string}
*/
function getQueryString(url) {
  const queryString = url.split('?')[1];
  return queryString? queryString : null;
}


//--------------------------------------------
// Network
//--------------------------------------------
/**
 * Ajax get
 * @param (string) url
*/
async function get(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const content = xhr.responseText;
          resolve(content);
        } else {
          reject(new Error('Failed to fetch the page.'));
        }
      }
    };
    xhr.send();
  });
}
