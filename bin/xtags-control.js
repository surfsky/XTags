/**
 * xtags control tags.
 * @author surfsky.github.com 2024
 */
import { XTags, Tag, Style, Theme, Anchor } from "./xtags-base.js";
import { Rect, Circle, Row, Column, Grid } from "./xtags-container.js";
import { Mask, Toast, Tooltip, Dialog, MessageBox, Popup } from "./xtags-popup.js";



/************************************************************
 * Image
 * @example
 *     <x-img></x-img>
 ***********************************************************/
export class Image extends Tag {
    constructor() {
        super();
    }

    createRoot(){
        this.root = document.createElement("img");
        this.root.innerHTML = this.innerHTML;     // contain child items
        this.root.style.transition = 'all 0.5s';  // animation
        this.root.style.overflow = 'hidden';
        return this.root;
    }

    static get observedAttributes() {
        return ['src', 'avatar', 'icon'].concat(this._attrs);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'src':
                this.root.setAttribute('src', newValue);
                break;
            case 'icon':
                this.root.setAttribute('src', XTags.getIconUrl(newValue));
                break;
            case 'avatar':
                if (XTags.toBool(newValue)) {
                    this.root.style.height = this.root.style.width;
                    this.root.style.backgroundColor = 'white';
                    this.root.style.padding = '5px';
                    this.root.style.border = '1px solid #a0a0a0';
                    this.root.style.borderRadius = '50%';
                }
                break;
        }
    }

}
customElements.define("x-img", Image);


/************************************************************
 * FontAwesome Icon
 * @example
 *     <x-icon name='bulb' type='solid' color='red'></x-icon>
 *     <x-icon name='bulb' type='regular' color='blue'></x-icon>
 * @description
 *     <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
 *     <i class="fa-regular fa-lightbulb" style="color:red"></i>
 *     see https://fontawesome.com.cn/v5
 ***********************************************************/
export class Icon extends Tag {
    constructor() {
        super();
    }

    createRoot(){
        this.root = document.createElement("i");
        this.root.style.transition = 'all 0.5s';  // animation
        this.root.classList.add('fa-' + this.getAttribute('name'));
        this.root.classList.add('fa-' + this.getAttribute('type'));

        this.root.linkTag = document.createElement('link');
        this.root.linkTag.rel = 'stylesheet';
        this.root.linkTag.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
        document.head.appendChild(this.root.linkTag);
        return this.root;
    }
}
customElements.define("x-icon", Icon);



/************************************************************
 * Link
 * @example
 *     <x-link></x-link>
 ***********************************************************/
export class Link extends Tag {
    constructor() {
        super();
    }

    createRoot(){
        this.root = document.createElement("a");
        this.root.innerHTML = this.innerHTML;     // contain child items
        this.root.style.transition = 'all 0.5s';  // animation
        this.root.style.textDecoration = 'none';
        return this.root;
    }

    /** Set theme. 
    * @param {Theme} t 
    */
    setTheme(t) {
        this.writeLinkStyle(t.link, t.linkHover, t.linkVisited);  // TODO：无效？
    }

    /**
     * Write link style.
     * @param {Color} color 
     * @param {Color} hoverColor 
     * @param {Color} visitedColor 
     */
    writeLinkStyle(color, hoverColor, visitedColor) {
        if (this.root.styleTag == null){
            this.root.styleTag = document.createElement('style');
            this.saveStyle();
        }
        this.root.styleTag.textContent = `
            a         { text-decoration: none; color: ${color};}
            a:hover   { text-decoration: none; color: ${hoverColor};}
            a:visited { text-decoration: none; color: ${visitedColor};}
            `;
        // 经测试，不支持动态修改，修改完毕后无法通知应用样式
    }


    /**
     * Set link color style. Notice the visited color can't be changed for safety reason.
     * @param {Color} color 
     * @param {Color} hoverColor 
     * @param {Color} visitedColor 
     */
    setLinkColors(color, hoverColor, visitedColor) {
        this.writeLinkStyle(color, hoverColor, visitedColor);

        // 直接修改a标签的文本色彩毫无效果
        //this.root.style.color = color;
        //this.setHoverTextColor(hoverColor);

        //this.root.addEventListener('mouseover', ()=> this.style.color = color);
        //this.root.style['--link-color'] = color;
        //this.root.style.setProperty('--link-color', color);
        //this.shadow.style.setProperty('--link-color', color);
        //var o = this.root.style.getPropertyValue('--link-color');
        //var s = this.root.style.cssText;

        // 动态修改变量毫无效果
        this.root.style.setProperty('--link-color', color);
        this.root.style.setProperty('--hover-color', hoverColor);
        this.root.style.setProperty('--visit-color', visitedColor);
    }


    static get observedAttributes() {
        return ['href', 'target'].concat(this._attrs);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'href':   this.root.setAttribute('href', newValue); break;
            case 'target': this.root.setAttribute('target', newValue); break;
            case 'color':  this.setLinkColors(newValue, newValue, newValue); break;
        }
    }
}
customElements.define("x-link", Link);



/************************************************************
 * Button
 * @example
 *     <x-btn click='alert("...")' ripple='true'></x-btn>
 * @description
 *     - default theme like bootstrap
 *     - support click disable and become gray
 ***********************************************************/
export class Button extends Tag {

    constructor() {
        super();
        this.saveRoot();
    }

    createRoot(){
        this.root = document.createElement('button');
        this.root.innerHTML = this.innerHTML;     // contain child items
        this.root.style.boxSizing = 'border-box';
        this.root.style.transition = 'all 0.5s';  // animation
        this.root.style.padding = "10px";
        this.root.style.overflow = 'hidden';
        this.root.style.backgroundColor = XTags.theme.primary;
        this.root.style.color = XTags.theme.light;
        this.root.style.borderRadius = "8px";
        this.root.style.borderWidth = "0px";
        this.root.style.height = this.root.style.boxSizing=='border-box' ? '44px' : '24px';
        this.root.style.width = this.root.style.boxSizing=='border-box' ? '120px' : '100px';
        this.root.style.userSelect = 'none';   // can't select button text
        this.root.style.textAlign = 'center';  // horizontal center text
        this.setHoverOpacity('0.8');
        return this.root;
    }

    //----------------------------------------------------
    // Attributes
    //----------------------------------------------------
    static get observedAttributes() {
        return ['ripple', 'asyncclick'].concat(this._attrs);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'ripple':      this.setRipple(newValue);        break;
            case 'asyncclick':   this.setClick(newValue, true);   break;
        }
    }

    //----------------------------------------------------
    // Set functions
    //----------------------------------------------------
    /**
     * Set theme. 
     * @param {Theme} o 
     */
    setTheme(o) {
        super.setTheme(o);
        this.root.style.borderRadius = o.radius;
        this.root.style.color = o.textLight;
        if (o.border == null || o.border == ''){
            var clr = XTags.getDarkerColor(this.root.style.backgroundColor, 0.2);
            this.root.style.border = `1px solid ${clr}`;
        }
        else{
            this.root.style.border = o.border;
        }
    }


    /**
     * Set click event
     * @param {function | string} func callback function or string. eg. "alert('hello world');"
     * @param {boolean} [isAsync=false] Whether the func is async?
     */
    setClick(func, isAsync=false) {
        if (isAsync)
            this.root.addEventListener('click', async (e) => {
                // show ripple effect
                if (this._showRipple)
                    this.showRipple(e.offsetX, e.offsetY);

                // disable - eval - enable
                this.setEnable(false);
                if (typeof func === 'string')
                    await eval(`(async () => {${func}})()`);
                else
                    await func();
                this.setEnable(true);
            });
        else{
            this.root.addEventListener('click',  (e) => {
                // show ripple effect
                if (this._showRipple)
                    this.showRipple(e.offsetX, e.offsetY);

                // disable - eval - enable
                //this.setEnable(false);
                if (typeof func === 'string')
                    eval(func);
                else
                    func();
                //this.setEnable(true);
            });
        }
    }



    //----------------------------------------------------
    // Ripple effect
    //----------------------------------------------------
    /**Ripple style element */
    static _rippleStyle = null;

    setRipple(b) {
        this._showRipple = Boolean(b);
    }

    /**
     * Show ripple
     * @param {number} x 
     * @param {number} y 
     */
    showRipple(x, y){
        // style
        if (this.root.styleTag == null){
            this.root.styleTag = document.createElement('style');
            this.root.styleTag.textContent = `
                @keyframes ripple-effect {
                    to { transform: scale(10); opacity: 0;}
                }`;
            this.saveStyle();
        }

        // ripple div
        const ripple = document.createElement('div');
        ripple.style.width = "40px";
        ripple.style.height = "40px";
        ripple.style.borderRadius = "20px";
        ripple.style.position = 'absolute';
        ripple.style.left = `${x-20}px`;
        ripple.style.top  = `${y-20}px`;
        ripple.style.backgroundColor = 'white';
        ripple.style.opacity = '0.9';
        ripple.style.animation = 'ripple-effect 0.3s linear';
        this.root.appendChild(ripple);
        ripple.addEventListener('animationend', function () {
            this.remove();
            //this.root.styleTag.remove();
        });
    }
}

customElements.define("x-btn", Button);


