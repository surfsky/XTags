/**
 * xtags basic custom tags.
 * @author surfsky.github.com 2024
 */
import { XTags, Tag, Style, Theme, Anchor } from "./xtags-base.js";



/************************************************************
 * Rect
 * @example
 *     <x-rect width='100px'></x-rect>
 ***********************************************************/
export class Rect extends Tag {
    constructor() {
        super();
        this.root.style.boxSizing = 'border-box';  // size = content + padding + border, margin is outside.
        this.root.style.transition = 'all 0.5s';   // animation
        this.root.style.padding = "10px";
        this.root.style.width = '100px';
        this.root.style.height = '100px';
        this.root.style.border = '1px solid lightgray';
        this.root.style.overflow = 'hidden';
        if (this.innerHTML != '')
            this.setChildAnchor(Anchor.C);
    }
}
customElements.define("x-rect", Rect);



/************************************************************
 * Circle
 * @example
 *     <x-circle width='100px'></x-circle>
 ***********************************************************/
export class Circle extends Rect {
    constructor() {
        super();
        this.root.style.overflow = 'hidden';
    }
    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch(name){
            case 'width':
                this.root.style.height = this.root.style.width;
                this.root.style.borderRadius = "50%";
                break;
        }
    }    
}
customElements.define("x-circle", Circle);





/***********************************************************
 * Row container
 * @example
 *     <x-row gap="20px">
 ***********************************************************/
export class Row extends Tag {
    constructor() {
        super();

        // flex row
        this.root.id = this.getId();
        this.root.style.width = '100%';
        this.root.style.height = '100px';
        this.root.style.display = "flex";
        this.root.style.flexDirection = "row";

        // child margin
        var gap = this.getAttribute('gap');
        if (gap != null)
            this.setChildMargin(`0 ${gap} 0 0`);
    }

    /** Set children margin 
     * @param {string} val css number. eg. 10px, 1em, 1rem
    */
    setChildMargin(val){
        this.root.styleTag = document.createElement('style');
        this.root.styleTag.textContent = `#${this.root.id} > *  {margin: ${val} }`;
        this.saveStyle();
    }

    static get observedAttributes() {
        return ['gap'].concat(this._attrs);
    }


    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch(name){
            case 'gap':            
                this.setChildMargin(newValue);
                break;
        }
    }
}

customElements.define("x-row", Row);




/************************************************************
 * Column container
 * @example
 *     <x-col cellmargin="0 0 20px 0" bgcolor="lightgray" width="150px" height="500px">
 ***********************************************************/
export class Column extends Row {
    constructor() {
        super();
        this.root.style.flexDirection = "column";
        this.root.style.width = '';
        this.root.style.height = '100%';
        var gap = this.getAttribute('gap');
        if (gap != null)
            this.setChildMargin(`0 0 ${gap} 0`);
    }
}

customElements.define("x-col", Column);



/************************************************************
 * Grid container
 * @example
 *     <x-grid gap="20px" columns='4'>
 *     <x-grid gap="20px" columns='100px auto 100px'>
 ***********************************************************/
export class Grid extends Tag {
    constructor() {
        super();
        this.setChildAnchor(null);
        this.root.style.display = "grid";
        this.root.style.gap = '10px';
        this.setColumns(4);
    }

    static get observedAttributes() {
        return ['gap', 'columns', 'rows'].concat(this._attrs);
    }

    isNumberString(str) {
        const num = Number(str);
        return !isNaN(num);
    }

    setColumns(val){
        if (this.isNumberString(val))
            this.root.style.gridTemplateColumns = `repeat(${val}, 1fr)`; 
        else
            this.root.style.gridTemplateColumns = val;
    }

    setRows(val)   { 
        if (this.isNumberString(val))
            this.root.style.gridTemplateRows = `repeat(${val}, 1fr)`; 
        else
            this.root.style.gridTemplateRows = val;
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch(name){
            case 'gap':             this.root.style.gap = newValue; break;
            case 'columns':         this.setColumns(newValue); break;
            case 'rows':            this.setRows(newValue); break;
        }
    }
}

customElements.define("x-grid", Grid);




/************************************************************
 * Responsive form grid container to display 1-4 columns
 * @example
 *     <x-form>
 ***********************************************************/
export class Form extends Tag {
    constructor() {
        super();
    }

    createRoot(){
        this.root = document.createElement('form');
        this.root.classList.add('gridForm');
        this.root.innerHTML = this.innerHTML;
        this.root.id = this.getId();
        return this.root;
    }

    createStyle(){
        const style = document.createElement('style');
        style.textContent = `
            /* Responsive form grid container to display 1-4 columns*/
            .gridForm {
                display: grid;
                gap: 10px;
                padding: 10px;
            }
            @media (min-width: 400px)  {.gridForm { grid-template-columns: auto; }}
            @media (min-width: 800px)  {.gridForm { grid-template-columns: 100px auto; }}
            @media (min-width: 1000px) {.gridForm { grid-template-columns: 100px auto 100px auto; }}
            @media (min-width: 1200px) {.gridForm { grid-template-columns: 100px auto 100px auto 100px auto 100px auto;}}
            @media (min-width: 1400px) {.gridForm { grid-template-columns: 100px auto 100px auto 100px auto 100px auto 100px auto 100px auto;}}
            .gridForm > * {text-align: left; height: 30px;}
            .gridForm > label {padding-top: 0px;}
            .gridForm > input {border-radius: 4px; border: 1px solid gray;}
        `;
        return style;
    }

    static get observedAttributes() {
        return ['gap', 'action'].concat(this._attrs);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch(name){
            case 'gap':             this.root.style.gap = newValue; break;
            case 'action':          this.root.setAttribute('action', newValue); break;
        }
    }
}

customElements.define("x-form", Form);



/************************************************************
 * Responsive container
 * @example
 *     <x-form>
 ***********************************************************/
export class Container extends Tag {
    constructor() {
        super();
    }

    createRoot(){
        this.root = document.createElement('div');
        this.root.innerHTML = this.innerHTML;
        this.root.style.transition = 'all 0.5s';   // animation
        return this.root;
    }

    createStyle(){
        this.root.id = this.getId();
        const style = document.createElement('style');
        style.textContent = `
            #${this.root.id} {
                width: 100%;
                margin-left: auto;
                margin-right: auto;
                padding-left: 15px;
                padding-right: 15px;
                }
                /* Responsive container 540-720-960-1140 */
                @media (min-width: 576px)  { #${this.root.id}   {max-width: 540px;}}  /*xs*/
                @media (min-width: 768px)  { #${this.root.id}   {max-width: 720px;}}  /*s*/
                @media (min-width: 992px)  { #${this.root.id}   {max-width: 960px;}}  /*m*/
                @media (min-width: 1200px) { #${this.root.id}   {max-width: 1140px;}} /*l*/
                @media (min-width: 1500px) { #${this.root.id}   {max-width: 1400px;}} /*xl*/
                @media (min-width: 1800px) { #${this.root.id}   {max-width: 1700px;}} /*xxl*/
                @media (min-width: 2000px) { #${this.root.id}   {max-width: 1900px;}} /*xxxl*/
        `;
        return style;
    }
}

customElements.define("x-container", Container);



/************************************************************
 * IFrame
 * @example
 *     <x-frame></x-frame>
 ***********************************************************/
export class Frame extends Tag {
    constructor() {
        super();
        this.clear();
        this.root = document.createElement("iframe");
        this.root.innerHTML = this.innerHTML;
        this.root.style.border = '0';
        this.shadowRoot.appendChild(this.root);
    }

    static get observedAttributes() {
        return ['src'].concat(this._attrs);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        super.attributeChangedCallback(name, oldValue, newValue);
        switch (name) {
            case 'src': this.root.src = newValue; break;
        }
    }
}
customElements.define("x-frame", Frame);

