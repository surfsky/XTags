/**
 * xtags basic class : XTags, Tag, Style, Theme, Anchor.
 * @author surfsky.github.com 2024
 */


/************************************************************
 * Align enum for anchor and childAnchor
 ***********************************************************/
export const Anchor = {
  TL: 'topLeft',
  T:  'top',
  TR: 'topRight',
  L:  'left',
  C:  'center',
  R:  'right',
  BL: 'bottomLeft',
  B:  'bottom',
  BR: 'bottomRight',
  F:  'fill'
};


/************************************************************
 * Theme
 ***********************************************************/
export class Theme{
    constructor(opt) {
        this.name        = opt.name;
        this.text        = opt.text;
        this.textLight   = opt.textLight;
        this.background  = opt.background;
        this.link        = opt.link;
        this.linkHover   = opt.linkHover;
        this.linkVisited = opt.linkVisited;
        this.primary     = opt.primary;
        this.secondary   = opt.secondary;
        this.success     = opt.success;
        this.info        = opt.info;
        this.warning     = opt.warning;
        this.danger      = opt.danger;
        this.dark        = opt.dark;
        this.light       = opt.light;
        this.border      = opt.border;  // border style. eg. '1px solid red'
        this.radius      = opt.radius;
    }

    /** Theme light*/
    static themeLight = new Theme({
        name        : 'iOSLight',
        text        : 'black',
        textLight   : 'white',
        background  : 'white',
        link        : 'blue',
        linkHover   : 'darkblue',
        linkVisited : 'gray',
        primary     : '#007bff',
        secondary   : '#7633d4',
        success     : '#28a745',
        info        : '#17a2b8',
        warning     : '#ffc107',
        danger      : '#dc3545',
        dark        : '#343a40',
        light       : '#f8f9fa',
        //border      : '1px solid #cdcdcd',
        radius      : '8px',
    });

    /** Theme dark */
    static themeDark = new Theme({
        name        : 'MaterialDark',
        text        : '#cccccc',
        textLight   : '#f0f0f0', //'#f8f9fa',
        background  : '#171717',
        link        : 'red',
        linkHover   : 'green',
        linkVisited : 'gray',
        primary     : '#007bff',
        secondary   : '#7633d4',
        success     : '#28a745',
        info        : '#17a2b8',
        warning     : '#ffc107',
        danger      : '#dc3545',
        dark        : '#343a40',
        light       : '#f8f9fa',
        //border      : '1px solid #707070',
        radius      : '8px',
    });
}


/** Theme interface (no use yet) */
class ITheme{
    /**
     * Set theme
     * @param {Theme} theme 
     */
    setTheme(theme)
    {
        throw new Error('Incomplete.');
    }
}


/************************************************************
 * XTags utils: sleep, theme, icon, color, px, position....
 ***********************************************************/
export class XTags {
    /** Icon root path*/
    static iconRoot = "../icons/";


    //-----------------------------------------
    // Common
    //-----------------------------------------
    /**
     * async/await sleep 
     * @param {number} ms
     * @example await delay(20);
     */
    static sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /** Change func to async promise. eg. await toPromise(func); */
    static toPromise(func){
      return new Promise((resolve) => {
        func(); 
        resolve();
      });
    }

    /** TODO: Create unique id */
    static uuid(){
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }

    /**HtmlEncode */
    static htmlEncode(code) {
        return code.replace(/[<>]/g, function(match) {
            switch (match) {
                case '<':   return '&lt;';
                case '>':   return '&gt;';
            }
        });
        //return code.replace(/[<>&"']/g, function(match) {
        //    switch (match) {
        //        case '<':   return '&lt;';
        //        case '>':   return '&gt;';
        //        case '&':   return '&amp;';
        //        case '"':   return '&quot;';
        //        case "'":   return '&#39;';
        //    }
        //});
    }
  

    //-----------------------------------------
    // DOM
    //-----------------------------------------
    /** Get element by class or id
     * @param {string} selector eg. tagName #idName .className
     */
    static $(selector){
        return document.querySelector(selector);
    }

    /** Get all elements by class or id */
    static $$(selector){
       return document.querySelectorAll(selector);
    }

    /**Parse centain tag string to a html element node.
     * @param {string} tagText eg. <div>...</div>
     * @returns {ChildNode}
    */
    static parseElement(tagText){
        var parser = new DOMParser();
        var doc = parser.parseFromString(tagText, 'text/html');
        return doc.body.firstChild;
    }


    /** Get view width */
    static get viewWidth() { return  window.innerWidth || document.documentElement.clientWidth;}

    /** Get view height */
    static get viewHeight() { return window.innerHeight || document.documentElement.clientHeight;}

    /** Center element in window */
    static centerlize(selector){
      const popup = document.querySelector(selector);
      const popupWidth = popup.offsetWidth;
      const popupHeight = popup.offsetHeight;
      popup.style.transtion = '';
      popup.style.left = (this.viewportWidth - popupWidth) / 2 + 'px';
      popup.style.top  = (this.viewportHeight - popupHeight) / 2 + 'px';
      popup.style.display = 'block';
    }

    /** Calculate element's real pixel value. 
     * @param {string} num css number expression, eg. 12px, 1em, 1rem
     * @param {Element} element when num unit is 'em', we need this parameter to calculate by parent node's size. 
    */
    calcPx(num, element=null){
      if (num.endsWith('px')) {
        return parseInt(num, 10);
      } else if (num.endsWith('rem')) {
        const rootFontSize   = parseInt(getComputedStyle(document.documentElement).fontSize, 10);
        return parseInt(num, 10) * rootFontSize;
      } else if (num.endsWith('em')) {
        const parentFontSize = parseInt(getComputedStyle(element.parentNode).fontSize, 10);
        return parseInt(num, 10) * parentFontSize;
      }
      return 0;
    }

    /**Get element's real bound 
     * @param {Element} ele 
     * @returns DOMRect
    */
    calcBound(ele){
      return ele.getBoundingClientRect();
    }

    /**
     * Calc element's real display style.
     * @param {Element} ele 
     * @returns CSSStyleDeclaration
     */
    calcStyle(ele){
        return getComputedStyle(ele);
    }

    /**
     * Search and remove &lt;style&gt; tag that contains certain stylename (eg. '.mytag')
     * @param {string} styleName 
     */
    removeStyleTag(styleName) {
        const styleTags = document.getElementsByTagName('style');
        for (let i = 0; i < styleTags.length; i++) {
            const tag = styleTags[i];
            if (tag.textContent.includes(styleName)) {
                tag.remove();
            }
        }
    }

    //-----------------------------------------
    // Theme
    //-----------------------------------------
    /** Global Theme*/
    static theme = Theme.themeLight;

    /**
     * Set page theme.
     * @param {Theme} theme 
     */
    static setTheme(theme){
        this.theme = theme;
        var tags = Array.from(document.querySelectorAll('*'));
        tags.forEach(tag => {
            if (tag.setTheme != undefined){
              tag.setTheme(theme);
            }
        });
        document.dispatchEvent(new Event('themechanged'));  // send message to document
    }



    //-----------------------------------------
    // Icon
    //-----------------------------------------
    /** Get icon url from icons root and icon name 
     * @param {string} name IconName without folder and extension
    */
    static getIconUrl(name){
        if (name.includes('.'))
            return this.iconRoot + name;
        return `${this.iconRoot}${name}.png`;
    }


    //-----------------------------------------
    // Convertor
    //-----------------------------------------
    /**Get boolean value 
     * @param {string | boolean} val 
    */
    static toBool(val){
        var type = typeof val;
        if (type == 'boolean') return val;
        if (type == 'string')  return val.toLowerCase() == 'true';
        return false;
    }
    

    //-----------------------------------------
    // Color
    //-----------------------------------------
    /** Build random color */
    static getRandomColor() {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r},${g},${b})`;
  }

    /** Build opacity color */
    static getOpacityColor(rawColor, opacity) {
        var clr = this.parseColor(rawColor);
        if (clr!= null)
          return `rgba(${clr.r}, ${clr.g}, ${clr.b}, ${opacity})`;
        return 'white';
    }

    /** Build lighter color */
    static getLighterColor(color, factor = 0.5) {
        const rgb = this.parseColor(color);
        if (!rgb) return null;
      
        const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * factor));
        const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * factor));
        const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * factor));
      
        if (rgb.hasOwnProperty('a')) {
          return `rgba(${r}, ${g}, ${b}, ${rgb.a})`;
        } else {
          return `rgb(${r}, ${g}, ${b})`;
        }
      }
      
    /** Build darker color */
    static getDarkerColor(color, factor = 0.5) {
        const rgb = this.parseColor(color);
        if (!rgb) return null;
      
        const r = Math.max(0, Math.round(rgb.r * (1 - factor)));
        const g = Math.max(0, Math.round(rgb.g * (1 - factor)));
        const b = Math.max(0, Math.round(rgb.b * (1 - factor)));
      
        if (rgb.hasOwnProperty('a')) {
          return `rgba(${r}, ${g}, ${b}, ${rgb.a})`;
        } else {
          return `rgb(${r}, ${g}, ${b})`;
        }
      }

    static parseColor(colorStr) {
        let rgb;
        if (colorStr.startsWith('#')) {
          rgb = this.hexToRgb(colorStr);
        } else if (colorStr.startsWith('rgb(')) {
          rgb = this.rgbFromRgbExpression(colorStr);
        } else if (colorStr.startsWith('rgba(')) {
          rgb = this.rgbaFromRgbaExpression(colorStr);
        } else {
          return null;
        }
        return rgb;
    }
      
    static hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
            }
            : null;
    }
      
    static rgbFromRgbExpression(rgbExpression) {
        const values = rgbExpression.match(/\d+/g);
        return values
            ? {
              r: parseInt(values[0]),
              g: parseInt(values[1]),
              b: parseInt(values[2]),
            }
            : null;
    }
      
    static rgbaFromRgbaExpression(rgbaExpression) {
        const values = rgbaExpression.match(/[\d.]+/g);
        return values
            ? {
              r: parseInt(values[0]),
              g: parseInt(values[1]),
              b: parseInt(values[2]),
              a: parseFloat(values[3]),
            }
            : null;
      }
}




/************************************************************
 * Tag base. Create tag using attribute, no need write any css.
 * @example  <x-rect width="100px" height="100px" bgcolor="green" color="white" radius="10px" borderwidth="2px" bordercolor="yellow" borderstyle="solid" ></rect-tag>
 * @author surfsky.github.com 2024
 * @property {string} theme Set theme such as primary, secondary, success...
 ***********************************************************/
export class Tag extends HTMLElement {
    //-----------------------------------------------------
    // Constructor
    //-----------------------------------------------------
    // supported attribute. Notice these names must be all small chars.
    static _attrs = [
        // basic
        'id', 'name', 'class', 'newclass', 'z', 'opacity', 'visible', 'overflow', 'cursor',

        // box module
        'box', 
        'margin',  'margintop',  'marginright',  'marginbottom',  'marginleft', 
        'padding', 'paddingtop', 'paddingright', 'paddingbottom', 'paddingleft', 
        'width', 'height', 'minwidth', 'minheight', 'maxwidth', 'maxheight',
        'border', 'borderwidth', 'bordercolor', 'borderstyle', 'radius',  

        // position
        'position', 'anchor', 'fixanchor', 'top', 'bottom', 'left', 'right',  

        // child position
        'display', 'childanchor', 'textalign', 'flex', 'gridcolumn',

        // theme
        'theme', 
        'background','bgcolor', 'bgimage', 'bgrepeat', 'bgposition', 'bgsize',
        'color', 'font', 'fontsize', 'fontfamily', 'fontstyle', 'fontweight',

        // data
        'title', 'tip',

        // effect
        'shadow', 'transform', 'rotate', 'scale', 'skew', 'textshadow',
        'hoverbgcolor', 'hovercolor',

        // event
        'click', 'draggable',
    ];

    /** Create element in shadow or body*/
    get useShadow() {
        var attr = this.getAttribute('useshadow');
        if (attr == null)
            return false;
        else
            return XTags.toBool(attr);
    }

    /**Constructor. Build a frame rectangle with content in center.*/
    constructor() {
        super();
        if (this.useShadow)
            this.attachShadow({mode: 'open'});

        // root element with styletag
        this.root = this.createRoot();
        this.root.styleTag = this.createStyle();

        // backup functions to tag for inplace mode.
        var tag = this.root;
        tag.root = this.root;
        tag.setTheme = this.setTheme;
        tag.beforeRemove = this.beforeRemove;
        tag.afterRemove = this.afterRemove;
        tag.disconnectedCallback = this.disconnectedCallback;

        // save root and style tags.
        this.saveRoot();
        this.saveStyle();
    }

    /**Destructor. Call when release. */
    disconnectedCallback(){
        this.afterRemove();
    }

    /**Call this function manually when need release something before remove.*/
    beforeRemove() { }

    /**Call this function anto after node is removed. */
    afterRemove(){
        if (this.root != null && this.root.styleTag != null)
            this.root.styleTag.remove();
    }



    /**Create root element(virtual function) */
    createRoot(){
        var tagName = this.getAttribute('tagname');
        if (tagName == null) tagName = 'div';

        //
        var ele = document.createElement(tagName);
        ele.innerHTML = this.innerHTML;      // contain child items
        ele.style.transition = 'all 0.5s';   // animation
        //ele.style.boxSizing = 'border-box';  // size = content + padding + border, margin is outside.
        return ele;
    }

    /**Create style element(virtual function) */
    createStyle(){
        return null;
    }

    /**Save root element. */
    saveRoot(){
        if (this.root == null || this.root == document.body) 
            return;

        if (this.useShadow)
            this.shadowRoot.appendChild(this.root);
        else {
            const parent = this.parentNode;
            if (parent != null){
                // replace inplace
                const index = Array.from(parent.children).indexOf(this);
                parent.removeChild(this);
                parent.insertBefore(this.root, parent.children[index]);
            }
        }
    }

    /** Save styleTage element */
    saveStyle(){
        if (this.root.styleTag == null) return;
        if (this.useShadow){
            this.shadowRoot.appendChild(this.root.styleTag);
        }
        else{
            document.head.appendChild(this.root.styleTag);
        }
    }

    /**Get or build uuid id. */
    getId(){
        var id = this.getAttribute('id');
        if (id == null) id = XTags.uuid();
        return id;
    }



    //-----------------------------------------------------
    // Attribute change event
    //-----------------------------------------------------
    /**Support attributes.*/
    static get observedAttributes() {
        return this._attrs;
    }

    /**
     * Call when attribute changed 
     * @param {string} name attribute name 
     * @param {string} oldValue old attribute value
     * @param {string} newValue new attribute value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        switch(name){
            // common
            case 'id':                this.root.setAttribute('id', newValue); break;
            case 'name':              this.root.setAttribute('name', newValue); break;
            case 'class':             this.root.setAttribute('class', newValue); break;
            case 'newclass':          this.root.setAttribute('class', newValue + ' ' + this.root.getAttribute('class')); break;
            case 'z':                 this.root.style.zIndex = newValue; break;
            case 'opacity':           this.root.style.opacity = newValue;  break;
            case 'visible':           this.setVisible(newValue); break;
            case 'overflow':          this.root.style.overflow = newValue; break;
            case 'cursor':            this.root.style.cursor = newValue; break;

            // size
            case 'width':             this.root.style.width = newValue;  break;
            case 'height':            this.root.style.height = newValue;  break;
            case 'minwidth':          this.root.style.minWidth = newValue;  break;
            case 'minheight':         this.root.style.minHeight = newValue;  break;
            case 'maxwidth':          this.root.style.maxWidth = newValue;  break;
            case 'maxheight':         this.root.style.maxHeight = newValue;  break;

            // anchor(position)
            case 'position':          this.root.style.position = newValue; break;
            case 'anchor':            this.setAnchor(newValue, 'absolute'); break;
            case 'fixanchor':         this.setAnchor(newValue, 'fixed'); break;
            case 'top':               this.root.style.top = newValue;  break;
            case 'bottom':            this.root.style.bottom = newValue;  break;
            case 'left':              this.root.style.left = newValue;  break;
            case 'right':             this.root.style.right = newValue;  break;

            // child
            case 'flex':              this.root.style.flex = newValue;  break;
            case 'gridcolumn':        this.setGridColumn(newValue); break;

            // child anchor
            case 'display':           this.root.style.display = newValue; break;
            case 'childanchor':       this.setChildAnchor(newValue); break;
            case 'textalign':         this.root.style.textAlign = newValue; break;

            // border
            case 'border':            this.root.style.border = newValue;  break;
            case 'borderwidth':       this.root.style.borderWidth = newValue;  break;
            case 'bordercolor':       this.root.style.borderColor = newValue;  break;
            case 'borderstyle':       this.root.style.borderStyle = newValue;  break;
            case 'radius':            this.root.style.borderRadius = newValue;  break;

            // box & margin & padding
            case 'box':               this.root.style.boxSizing = newValue; break;
            case 'margin':            this.root.style.margin = newValue;  break;
            case 'margintop':         this.root.style.marginTop = newValue;  break;
            case 'marginright':       this.root.style.marginRight = newValue;  break;
            case 'marginbottom':      this.root.style.marginBottom = newValue;  break;
            case 'marginleft':        this.root.style.marginLeft = newValue;  break;
            case 'padding':           this.root.style.padding = newValue;  break;
            case 'paddingtop':        this.root.style.paddingTop = newValue;  break;
            case 'paddingright':      this.root.style.paddingRight = newValue;  break;
            case 'paddingbottom':     this.root.style.paddingBottom = newValue;  break;
            case 'paddingleft':       this.root.style.paddingLeft = newValue;  break;

            // theme
            case 'theme':             this.setThemeCls(newValue); break;

            // background
            case 'background':        this.root.style.background = newValue; break;
            case 'bgcolor':           this.root.style.backgroundColor = newValue;  break;
            case 'bgimage':           this.root.style.backgroundImage = `url('${newValue}')`; break;
            case 'bgrepeat':          this.root.style.backgroundRepeat = newValue; break;
            case 'bgposition':        this.root.style.backgroundPosition = newValue; break;
            case 'bgsize':            this.root.style.backgroundSize = newValue; break;

            // text
            case 'color':             this.root.style.color = newValue;  break;
            case 'font':              this.root.style.font = newValue;  break;
            case 'fontsize':          this.root.style.fontSize = newValue;  break;
            case 'fontfamily':        this.root.style.fontFamily = newValue;  break;
            case 'fontstyle':         this.root.style.fontStyle = newValue;  break;
            case 'fontweight':        this.root.style.fontWeight = newValue;  break;

            // data
            case 'title':             this.root.title = newValue;  break;
            case 'tip':               this.root.setAttribute('tip', newValue);  break;

            // effect
            case 'shadow':            this.setShadow(newValue); break;
            case 'textshadow':        this.setTextShadow(newValue); break;
            case 'transform':         this.root.style.transform = newValue; break;
            case 'rotate':            this.root.style.transform = `rotate(${newValue}deg)`; break;
            case 'skew':              this.root.style.transform = `skew(${newValue}deg)`; break;
            case 'scale':             this.root.style.transform = `scale(${newValue})`; break;
            case 'hoverbgcolor':      this.setHoverBgColor(newValue); break;
            case 'hovercolor':        this.setHoverTextColor(newValue);  break;

            // event
            case 'click':             this.setClick(newValue); break;
            case 'draggable':         this.root.setAttribute('draggable', newValue);  // draggable="true"
        }
    }

    //-----------------------------------------------------
    // Property Getter & Setter
    //-----------------------------------------------------
    /** Get element by tagname, id, class */
    static $(selector) { 
        return document.querySelector(selector);
    }

    /** This root div's style */
    get style(){
        return this.root.style;
    }

    /** Child content object (equal innerHTML) */
    get content(){
        return this.root.innerHTML;
    }
    set content(val){
        this.root.innerHTML = val;
    }


    //-----------------------------------------------------
    // Theme
    //-----------------------------------------------------
    /** Set theme class, eg. primary, secondary, info, warning...*/
    setThemeCls(cls){
        this.root.themeCls = cls;
        this.setTheme(XTags.theme);
        return this;
    }

    /**
     * Set theme for background and text color. Other settings will be setted in child class.
     * @param {Theme} t 
     */
    setTheme(t){
        this.root.style.color = t.text;
        switch (this.root.themeCls){
            case "primary":   this.root.style.backgroundColor = t.primary;     break;
            case "secondary": this.root.style.backgroundColor = t.secondary;   break;
            case "success":   this.root.style.backgroundColor = t.success;     break;
            case "info":      this.root.style.backgroundColor = t.info;        break;
            case "warning":   this.root.style.backgroundColor = t.warning;     break;
            case "danger":    this.root.style.backgroundColor = t.danger;      break;
            default:          this.root.style.backgroundColor = t.background;  break;
        }
        return this;
    }

    //-----------------------------------------------------
    // Set functions
    //-----------------------------------------------------
    setColors(bgColor, textColor){
        this.root.style.backgroundColor = bgColor;
        this.root.style.color = textColor;
        return this;
    }

    /**Set border color by darker background color. */
    setAutoBorderColor() {
        //var clr = 'red';  // ok
        //var clr1 = XTags.getOpacityColor(this.root.style.backgroundColor, 0.5);  // fail
        //var clr3 = XTags.getLighterColor(this.root.style.backgroundColor, 0.5);  // ok
        var clr2 = XTags.getDarkerColor(this.root.style.backgroundColor, 0.2);   // ok
        this.root.style.borderColor = clr2;
    }



    /** Set size */
    setSize(w, h){
        this.root.style.width = w;
        this.root.style.height = h;
        return this;
    }

    /** Set radius */
    setRadius(r){
        this.root.style.borderRadius = r;
        return this;
    }

    /**
     * Set anchor
     * @param {string} anchor see Anchor
     * @param {string} [position='absolute'] positon type: absolute | fixed
     * @description
        .fixTopLeft    {position:fixed; top:0px;    left:0px; }
        .fixTop        {position:fixed; top:0px;    left:50%; transform: translateX(-50%);}
        .fixTopRight   {position:fixed; top:0px;    right:0px; }
        .fixBottomLeft {position:fixed; bottom:0px; left:0px; }
        .fixBottom     {position:fixed; bottom:0px; left:50%; transform: translateX(-50%); }
        .fixBottomRight{position:fixed; bottom:0px; right:0px; }
        .fixLeft       {position:fixed; top:50%;    left:0px; transform: translateY(-50%); }
        .fixCenter     {position:fixed; top:50%;    left:50%;transform: translate3D(-50%, -50%, 0); }
        .fixRight      {position:fixed; top:50%;    right:0px; transform: translateY(-50%); }
        .fill          {position:fixed; top:0px;    left:0px;  right:0px; bottom:0px; }
    */
    setAnchor(anchor, position='absolute'){
        var s = this.root.style;
        switch (anchor){
            case Anchor.TL  : s.position=position; s.top='0px';    s.left='0px';  break;
            case Anchor.T   : s.position=position; s.top='0px';    s.left='50%';  s.transform='translateX(-50%)';break;
            case Anchor.TR  : s.position=position; s.top='0px';    s.right='0px'; break;
            case Anchor.BL  : s.position=position; s.bottom='0px'; s.left='0px';  break;
            case Anchor.B   : s.position=position; s.bottom='0px'; s.left='50%';  s.transform='translateX(-50%)'; break;
            case Anchor.BR  : s.position=position; s.bottom='0px'; s.right='0px'; break;
            case Anchor.L   : s.position=position; s.top='50%';    s.left='0px';  s.transform='translateY(-50%)';           break;
            case Anchor.C   : s.position=position; s.top='50%';    s.left='50%';  s.transform='translate3D(-50%, -50%, 0)'; break;
            case Anchor.R   : s.position=position; s.top='50%';    s.right='0px'; s.transform='translateY(-50%)';           break;
            case Anchor.F   : s.position=position; s.top='0';      s.right='0';   s.bottom='0';   s.left='0'; s.width='100%'; s.height='100%';              break;  //
        }
        return this;
    }


    /**
     * Set child anchor
     * @param {Anchor} anchor 
     .childTopLeft       {display: flex; justify-content: flex-start;  align-items: flex-start;}
    .childTop           {display: flex; justify-content: center;      align-items: flex-start;}
    .childTopRight      {display: flex; justify-content: flex-end;    align-items: flex-start;}
    .childBottomLeft    {display: flex; justify-content: flex-start;  align-items: flex-end;}
    .childBottom        {display: flex; justify-content: center;      align-items: flex-end;}
    .childBottomRight   {display: flex; justify-content: flex-end;    align-items: flex-end;}
    .childLeft          {display: flex; justify-content: flex-start;  align-items: center;}
    .childCenter        {display: flex; justify-content: center;      align-items: center; flex-direction: column;}
    .childRight         {display: flex; justify-content: flex-end;    align-items: center;}
    */
    setChildAnchor(anchor){
        var s = this.root.style;
        if (anchor == null || anchor == ""){
            s.display = '';
            s.flexDirection  = '';     
            s.justifyContent = '';  
            s.alignItems = '';
        }
        else{
            s.display = 'flex';
            switch (anchor){
                case Anchor.TL  : s.flexDirection='row';     s.justifyContent='flex-start';  s.alignItems='flex-start'; break;
                case Anchor.T   : s.flexDirection='row';     s.justifyContent='center';      s.alignItems='flex-start'; break;
                case Anchor.TR  : s.flexDirection='row';     s.justifyContent='flex-end';    s.alignItems='flex-start'; break;
                case Anchor.L   : s.flexDirection='row';     s.justifyContent='flex-start';  s.alignItems='center';     break;
                case Anchor.C   : s.flexDirection='column';  s.justifyContent='center';      s.alignItems='center';     break;
                case Anchor.R   : s.flexDirection='row';     s.justifyContent='flex-end';    s.alignItems='center';     break;
                case Anchor.BL  : s.flexDirection='row';     s.justifyContent='flex-start';  s.alignItems='flex-end';   break;
                case Anchor.B   : s.flexDirection='row';     s.justifyContent='center';      s.alignItems='flex-end';   break;
                case Anchor.BR  : s.flexDirection='row';     s.justifyContent='flex-end';    s.alignItems='flex-end';   break;
                case Anchor.F   : this.setChildFill();   break;
            }
        }
        return this;
    }

    /** Set child fill parent. Add css. */
    setChildFill(){
        this.root.style.display = 'flex';
        this.root.classList.add('x-container');
        if (this.childStyleTag == null){
            this.childStyleTag = document.createElement('style');
            this.childStyleTag.textContent = `
                x-container > * { flex: 1}
                `;
            this.shadowRoot.appendChild(this.childStyleTag);
        }
    }

    //-----------------------------------------------------
    // Effect
    //-----------------------------------------------------
    /** Set box shadow*/
    setShadow(newValue){
        if (newValue == 'true' || newValue == true)
            this.root.style.boxShadow = '5px 5px 10px lightgray';
        else if (newValue == 'false' || newValue == false)
            this.root.style.boxShadow = '';
        else
            this.root.style.boxShadow = newValue;
        return this;
    }

    /** Set text shadow*/
    setTextShadow(newValue){
        if (newValue == 'true' || newValue == true)
            this.root.style.textShadow = '5px 5px 10px black';
        else if (newValue == 'false' || newValue == false)
            this.root.style.textShadow = '';
        else
            this.root.style.textShadow = newValue;
        return this;
    }

    /**
     * Set hover background color
     * @param {Color} color 
     */
    setHoverBgColor(color){
        var oldColor  = this.root.style.backgroundColor;
        var oldCursor = this.root.style.cursor;
        this.root.addEventListener('mouseover', () => {
            this.root.style.backgroundColor = color;
            this.root.style.cursor = 'pointer';
        });
        this.root.addEventListener('mouseout', () => {
            this.root.style.backgroundColor = oldColor;
            this.root.style.cursor = oldCursor;
        });
        return this;
    }

    /**
     * Set hover text color
     * @param {Color} color 
     */
    setHoverTextColor(color){
        var element = this.root;
        var oldColor = element.style.Color;
        var oldCursor = element.style.cursor;
        element.addEventListener('mouseover', function() {
            element.style.Color = color;
            element.style.cursor = 'pointer';
        });
        element.addEventListener('mouseout', function() {
            element.style.Color = oldColor;
            element.style.cursor = oldCursor;
        });
        return this;
    }

    /**
     * Set hover opacity color
     * @param {Color} color 
     */
    setHoverOpacity(opacity){
        var element = this.root;
        var oldValue = element.style.opacity;
        var oldCursor = element.style.cursor;
        element.addEventListener('mouseover', function() {
            element.style.opacity = opacity;
            element.style.cursor = 'pointer';
        });
        element.addEventListener('mouseout', function() {
            element.style.opacity = oldValue;
            element.style.cursor = oldCursor;
        });
        return this;
    }
    

    /**
     * Set visible
     * @param {boolean} newValue 
     */
    setVisible(newValue){
        var b = (newValue=='true' || newValue==true);
        this.root.style.visibility = b ? 'visible' : 'hidden';
        return this;
    }


    /**
     * Set enable. If disable, it become gray, and cannot click. 
     * @param {boolean} b 
     */
    setEnable(b){
        if (b){
            this.root.disabled = false;
            this.root.style.pointerEvents = '';
            this.root.style.filter = '';
        }
        else{
            this.root.disabled = true;
            this.root.style.pointerEvents = 'none';
            this.root.style.filter = 'grayscale(100%)';
        }
        return this;
    }

    /**
     * Set draggable
     * @param {boolean} b 
     */
    setDraggable(b){
        this.root.draggable = b;
        if (b){
            // TODO：根据当前位置拖动div位置
        }
        return this;
    }

    //-----------------------------------------------------
    // Animation
    //-----------------------------------------------------
    /**
     * Make animation
     * @param {function} animFunc  target animation function. eg. this.style.height='0px';
     * @param {function} endFunc callback animation when finished. eg. this.style.visibility = 'hidden';
     * @param {number} second animation duration seconds
     * @param {string} [easing='ease'] easing animation name 
     * @example tag.animate((ele)=> ele.style.height = '0px');
     */
    animate(animFunc, endFunc=null, second=0.1, easing='ease'){
        this.root.style.transition = `all ${second}s ${easing}`;
        if (endFunc != null)
            this.root.addEventListener('transitionend', () => endFunc(this.root), { once: true });
        requestAnimationFrame(() => animFunc(this.root));
    }

    //-----------------------------------------------------
    // Event
    //-----------------------------------------------------
    /** Set click event */
    setClick(func){
        this.root.addEventListener('click', ()=>eval(func));
        return this;
    }


    /**Set grid column 
     * @param {string} expr start-length or start/end
     */
    setGridColumn(expr){
        if (expr.indexOf('-') != -1){
            // start-length
            const parts = expr.split("-");
            this.root.style.gridColumnStart = parts[0];
            this.root.style.gridColumnEnd = parseInt(parts[1]) + 1;
        }
        else{
            // start/end
            this.root.style.gridColumn = expr;
        }
    }
}
customElements.define("x-tag", Tag);



/***********************************************************
 * Div
 * @example
 *     <x-div cellmargin="0 20px 0 0" bgcolor="lightgray" margin="0 0 10px 0" ></x-div>
 ***********************************************************/
export class Div extends Tag {
    constructor() {
        super();
    }
}
customElements.define("x-div", Div);



/***********************************************************
 * Global style
 * @example
 *     <x-style cellmargin="0 20px 0 0" bgcolor="lightgray" margin="0 0 10px 0">
 ***********************************************************/
export class Style extends Tag {
    constructor() {
        super();
    }

    createRoot(){
        return document.body;
    }

    createStyle(){
        var tag = document.createElement('style');
        //document.head.appendChild(tag);
        tag.textContent = `
            /* fullscreen */
            html,body {
                width: 100%;  height: 100%; 
                padding: 0px; margin: 0px;
            }

            /* boxmodule */
            *, *::before, *::after {box-sizing: border-box;}

            /* animation */
            * {transition: 0.5s;}

            /* link */
            a, a:hover, a:visited { text-decoration: none; }
        `;
        return tag;
    }
}

customElements.define("x-style", Style);