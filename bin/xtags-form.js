/**
 * xtags control tags.
 * @author surfsky.github.com 2024
 */
import { XTags, Tag, Style, Theme, Anchor } from "./xtags-base.js";
import { Rect, Circle, Row, Column, Grid } from "./xtags-container.js";
import { Mask, Toast, Tooltip, Dialog, MessageBox, Popup } from "./xtags-popup.js";



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
    }

    createRoot(){
        this.root = document.createElement('button');
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
                e.stopPropagation(); // no send event to other

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
                e.stopPropagation();

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


