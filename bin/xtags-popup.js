/**
 * xtags control tags.
 * @author surfsky.github.com 2024
 */
import { XTags, Tag, Style, Theme, Anchor } from "./xtags-base.js";
import { Rect, Circle, Row, Column, Grid } from "./xtags-container.js";



/************************************************************
 * Mask
 * @example
 *     Mask.show(100);
 *     Mask.hide();
 ***********************************************************/
export class Mask {
    static async show(z = 99) {
        if (this.overlay == null) {
            this.overlay = document.createElement('div');
            this.overlay.style.position = 'fixed';
            this.overlay.style.top = 0;
            this.overlay.style.left = 0;
            this.overlay.style.width = '100%';
            this.overlay.style.height = '100%';
            this.overlay.style.display = 'none';
            this.overlay.style.transition = 'all 0.5s';
            this.overlay.style.zIndex = z;
            document.body.appendChild(this.overlay);
        }
        this.overlay.style.display = 'block';
        //this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
        await XTags.sleep(50);
        this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
    }

    static async hide() {
        if (this.overlay != null) {
            this.overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
            await XTags.sleep(500);
            this.overlay.style.display = 'none';
            document.body.removeChild(this.overlay);
            this.overlay = null;
        }
    }
}



/************************************************************
 * Toast
 * @example
 *     Toast.show('info', 'message info');
 ***********************************************************/
export class Toast {
    static counter = 0;
    /**
     * Show toast
     * @param {string} icon iconname without extension
     * @param {string} text information 
     */
    static async show(text, icon='white-bulb', width='400px', height='38px') {
        /*
        var toast = new Rect()
            .setSize('400px', '36px')
            .setRadius('6px')
            .setColors(XTags.theme.success, XTags.theme.light)
            .setAnchor(Anchor.T)
            .setChildAnchor(Anchor.C)
            ;
        toast.content = `<x-row height="100%"><img src='${XTags.getIconUrl(icon)}' width='20px'/><div>${text}<div></x-row>`;
        toast.style.height = toast.style.boxSizing=='border-box' ? '30px' : '26px';
        toast.style.opacity = 0.8;
        toast.style.border = '0';
        toast.style.top = '-100px';
        document.body.appendChild(toast);
        await XTags.sleep(50);
        toast.style.top = '25px';
        await XTags.sleep(2000);
        toast.style.top = '-100px';
        await XTags.sleep(1000);
        document.body.removeChild(toast);
        */

        var id = XTags.uuid();
        var tag = `
            <x-rect id='${id}' box='border-box' fixanchor='top' top='-100px' childanchor='center'
              width='${width}' height='${height}' radius='6px'  border='0'
              bgcolor='${XTags.theme.success}' color='${XTags.theme.light}' opacity='0.8'>
              <x-row height="100%">
                <img src='${XTags.getIconUrl(icon)}' width='20px' height='20px'/>&nbsp;
                <div>${text}<div>
              </x-row>
            </x-rect>
        `;

        // add to body
        //var ele2 = document.createElement('div');
        //ele.innerHTML = tag;
        //document.body.appendChild(ele);
        var ele = XTags.parseDomNode(tag);
        document.body.appendChild(ele);

        // parse height's value and unit, calc top position.
        this.counter++;
        const regex = /(\d+(?:\.\d+)?)(px|rem|em|%)/;
        const match = height.match(regex);
        const value = match ? parseFloat(match[1]) : 38;
        const unit  = match ? match[2] : 'px';
        var top = 25 + (this.counter-1)*(value+10) + unit;

        // show and hide with animation
        var toast = XTags.$('#' + id);  // = ele.root
        await XTags.sleep(50);
        toast.style.top = top;
        await XTags.sleep(2000);
        toast.style.top = '-100px';
        await XTags.sleep(1000);
        document.body.removeChild(toast);
        this.counter--;
    }

}

/************************************************************
 * Tooltip
 * @example
 *     Tooltip.show(ele, 'message info');
 *     Tooltip.hide();
 ***********************************************************/
export class Tooltip {
    /** Bind all matched elements to show tooltip
     * @param {string} selector Element selector 
     * @param {string} [attrName='tip'] Attribute name or callback， If null, show element's text content.
    */
    static bind(selector, attrName=null) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(ele => {
            var o = (ele.root == null) ? ele : ele.root;
            o.addEventListener('mouseover', () => Tooltip.show(ele, attrName));
            o.addEventListener('mouseout',  () => Tooltip.hide());
        });
    }

    /**
     * Show tooltip under element. 
     * @param {Tag} element 
     * @param {string} attrName
     */
    static show(element, attrName) {
        var text = '';
        if (attrName == null)                    text = element.textContent;
        else if (typeof attrName == 'function')  text = attrName(element);
        else                                     text = this.getVal(element, attrName);
        if (text == null || text == '')
            return;

        const tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.innerHTML = text;
        tooltip.style.display = 'block';
        tooltip.style.position = "fixed";
        tooltip.style.backgroundColor = 'white'; //"#f9f9f9";
        tooltip.style.border = "1px solid #ccc";
        tooltip.style.borderRadius = '4px';
        tooltip.style.padding = "5px";
        tooltip.style.zIndex = "999";

        var rect = element.getBoundingClientRect(); // get rect in viewport
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top  = rect.bottom + 4 + 'px';
        document.body.appendChild(tooltip);
    }

    /** Hide tooltip */
    static hide() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip != null)
            document.body.removeChild(tooltip);
    }

    /** Get element's attribute's value 
     * @param {Element} element 
     * @param {string} attr Attribute name, can be comma-seperated string: 'style.width'
    */
    static getVal(element, attr) {
        let attrs = attr.split('.');
        let value = element;
        for (let a of attrs) {
            value = value[a];
            if (value === undefined) {
                return undefined;
            }
        }
        return value;
    }
}


/************************************************************
 * Dialog
 * @example
 *     Dialog.show();
 *     Dialog.close();
 ***********************************************************/
export class Dialog extends Tag {
    /** Create element in shadow mode*/
    get useShadow() {return  true;}

    constructor() {
        super();
    }

    createStyle(){
        const style = document.createElement('style');
        style.textContent = `
          /* popup layer */
          .popup {
              position: absolute;
              background-color: white;
              padding: 40px 20px 20px 20px;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
              display: none;
              overflow: auto;
              box-sizing: border-box;
              width: 500px;
              height: 400px;
              z-index: 999;
              transition = 'all 0.5s';
            }
          .popup-content {
              text-align: center;
              /*user-select: none;*/
            }
          /* close button */
          .btn-close {
              position: absolute;
              top: 10px;
              right: 10px;
              cursor: pointer;
              user-select: none;
            }
          .btn-close:hover{
            color: red;
          }
          /* resizers */
          .resizer {
              position: absolute;
              cursor: pointer;
            }
          .resizer-top {
              top: 0;
              left: 0;
              right: 0;
              height: 10px;
              cursor: ns-resize;
            }
          .resizer-bottom {
              bottom: 0;
              left: 0;
              right: 0;
              height: 10px;
              cursor: ns-resize;
            }
          .resizer-left {
              top: 0;
              bottom: 0;
              left: 0;
              width: 10px;
              cursor: ew-resize;
            }
          .resizer-right {
              top: 0;
              bottom: 0;
              right: 0;
              width: 10px;
              cursor: ew-resize;
            }
          .resizer-topleft {
              top: 0;
              left: 0;
              width: 10px;
              height: 10px;
              cursor: nwse-resize;
            }
          .resizer-topright {
              top: 0;
              right: 0;
              width: 10px;
              height: 10px;
              cursor: nesw-resize;
            }
          .resizer-bottomleft {
              bottom: 0;
              left: 0;
              width: 10px;
              height: 10px;
              cursor: nesw-resize;
            }
          .resizer-bottomright {
              bottom: 0;
              right: 0;
              width: 10px;
              height: 10px;
              cursor: nwse-resize;
            }
          `;
        return style;
    }

    createRoot(){
        // popup
        this.root = document.createElement('div');
        this.root.classList.add('popup');


        // close button
        this.closeButton = document.createElement('span');
        this.closeButton.classList.add('btn-close');
        this.closeButton.textContent = '×';
        this.closeButton.addEventListener('click', () => this.close());
        this.root.appendChild(this.closeButton);

        // content
        this.contentDiv = document.createElement('div');
        this.contentDiv.classList.add('popup-content');
        this.contentDiv.innerHTML = this.innerHTML;
        this.root.appendChild(this.contentDiv);

        // resizer
        const resizerTop = document.createElement('div');
        resizerTop.classList.add('resizer', 'resizer-top');
        this.root.appendChild(resizerTop);
        const resizerBottom = document.createElement('div');
        resizerBottom.classList.add('resizer', 'resizer-bottom');
        this.root.appendChild(resizerBottom);
        const resizerLeft = document.createElement('div');
        resizerLeft.classList.add('resizer', 'resizer-left');
        this.root.appendChild(resizerLeft);
        const resizerRight = document.createElement('div');
        resizerRight.classList.add('resizer', 'resizer-right');
        this.root.appendChild(resizerRight);
        const resizerTopLeft = document.createElement('div');
        resizerTopLeft.classList.add('resizer', 'resizer-topleft');
        this.root.appendChild(resizerTopLeft);
        const resizerTopRight = document.createElement('div');
        resizerTopRight.classList.add('resizer', 'resizer-topright');
        this.root.appendChild(resizerTopRight);
        const resizerBottomLeft = document.createElement('div');
        resizerBottomLeft.classList.add('resizer', 'resizer-bottomleft');
        this.root.appendChild(resizerBottomLeft);
        const resizerBottomRight = document.createElement('div');
        resizerBottomRight.classList.add('resizer', 'resizer-bottomright');
        this.root.appendChild(resizerBottomRight);

        // mouse, popup, handler
        let rawX, rawY;
        let rawTop, rawLeft, rawWidth, rawHeight;
        let handler = '';

        // mouse down to record data
        this.root.addEventListener('mousedown', (e) => {
            rawX = e.clientX;
            rawY = e.clientY;
            rawTop    = this.root.offsetTop;
            rawLeft   = this.root.offsetLeft;
            rawWidth  = this.root.offsetWidth;
            rawHeight = this.root.offsetHeight;

            if (e.target.classList.contains('resizer-topleft')) {
                handler = 'TL';
                document.documentElement.style.cursor = 'nwse-resize';
            } else if (e.target.classList.contains('resizer-topright')) {
                handler = 'TR';
                document.documentElement.style.cursor = 'nesw-resize';
            } else if (e.target.classList.contains('resizer-bottomleft')) {
                handler = 'BL';
                document.documentElement.style.cursor = 'nesw-resize';
            } else if (e.target.classList.contains('resizer-bottomright')) {
                handler = 'BR';
                document.documentElement.style.cursor = 'nwse-resize';
            } else if (e.target.classList.contains('resizer-top')) {
                handler = 'T';
                document.documentElement.style.cursor = 'ns-resize';
            } else if (e.target.classList.contains('resizer-bottom')) {
                handler = 'B';
                document.documentElement.style.cursor = 'ns-resize';
            } else if (e.target.classList.contains('resizer-left')) {
                handler = 'L';
                document.documentElement.style.cursor = 'ew-resize';
            } else if (e.target.classList.contains('resizer-right')) {
                handler = 'R';
                document.documentElement.style.cursor = 'ew-resize';
            } else {
                handler = 'DRAG';
                document.documentElement.style.cursor = 'pointer';
            }

            console.log(`DOWN : (${rawLeft}, ${rawTop}, ${rawWidth}, ${rawHeight}), (${rawX}, ${rawY}), ${handler}`);
        });

        // mouse move to drag or resize
        document.addEventListener('mousemove', (e) => {
            if (handler === '') return;

            let dx = e.clientX - rawX;
            let dy = e.clientY - rawY;
            switch (handler) {
                case 'DRAG':
                    this.root.style.left = rawLeft + dx + 'px';
                    this.root.style.top = rawTop + dy + 'px';
                    break;
                case 'TL':
                    this.root.style.left = rawLeft + dx + 'px';
                    this.root.style.top = rawTop + dy + 'px';
                    this.root.style.width = rawWidth - dx + 'px';
                    this.root.style.height = rawHeight - dy + 'px';
                    break;
                case 'T':
                    this.root.style.top = rawTop + dy + 'px';
                    this.root.style.height = rawHeight - dy + 'px';
                    break;
                case 'TR':
                    this.root.style.top = rawTop + dy + 'px';
                    this.root.style.width = rawWidth + dx + 'px';
                    this.root.style.height = rawHeight - dy + 'px';
                    break;
                case 'L':
                    this.root.style.left = rawLeft + dx + 'px';
                    this.root.style.width = rawWidth - dx + 'px';
                    break;
                case 'R':
                    this.root.style.width = rawWidth + dx + 'px';
                    break;
                case 'BL':
                    this.root.style.left = rawLeft + dx + 'px';
                    this.root.style.width = rawWidth - dx + 'px';
                    this.root.style.height = rawHeight + dy + 'px';
                    break;
                case 'B':
                    this.root.style.height = rawHeight + dy + 'px';
                    break;
                case 'BR':
                    this.root.style.width = rawWidth + dx + 'px';
                    this.root.style.height = rawHeight + dy + 'px';
                    break;
            }

            console.log(`${handler} : (${dx}, ${dy}), (${this.root.offsetLeft}, ${this.root.offsetTop}, ${this.root.offsetWidth}, ${this.root.offsetHeight}), (${e.clientX}, ${e.clientY})`);
        });

        // mouse up to clear
        document.addEventListener('mouseup', () => {
            handler = '';
            document.documentElement.style.cursor = 'auto';
        });

        return this.root;
    }


    /**Show dialog with mask and center in screen*/
    show(model=true, closable=true, width='600px', height='400px', x='', y='') {
        if (model)
            Mask.show();
        this.closeButton.style.display = closable ? 'block' : 'none';
        this.root.style.display = 'block';
        this.root.style.width = width;
        this.root.style.height = height;

        // position
        if (x=='' && y==''){
            // auto center
            const viewWidth = window.innerWidth || document.documentElement.clientWidth;
            const viewHeight = window.innerHeight || document.documentElement.clientHeight;
            const popupWidth  = this.root.offsetWidth;
            const popupHeight = this.root.offsetHeight;
            this.root.style.left = (viewWidth - popupWidth) / 2 + 'px';
            this.root.style.top  = (viewHeight - popupHeight) / 2 + 'px';
        }
        else{
            this.root.style.left = x;
            this.root.style.top = y;
        }

    }

    /**Close dialog*/
    close() {
        Mask.hide();
        this.root.style.display = 'none';
    }

    /*Content*/
    get content()    { return this.contentDiv.innerHTML; }
    set content(val) { this.contentDiv.innerHTML = val; }

    /*Width*/
    get width()      { return this.root.style.width;}
    set width(val)   { this.root.style.width = val;}
    get height()     { return this.root.style.height;}
    set height(val)  { this.root.style.height = val;}
}

customElements.define('x-dialog', Dialog);




/************************************************************
 * MessageBox
 * @example
 *     MessageBox.show('message content', 'info');
 ***********************************************************/
export class MessageBox {
    /**
     * Show toast
     * @param {string} text information 
     * @param {string} icon iconname without extension
     */
    static async show(text, icon = 'black-bulb') {
        const dlg = new Dialog(); // document.createElement('x-dialog');
        dlg.content = `
            <img src='${XTags.getIconUrl(icon)}' width='24px'/>
            <p>${text}</p>
            `;
        document.body.appendChild(dlg);
        dlg.show(false, true, '500px', '150px');
    }
}


/************************************************************
 * Popup layer
 * @example
 *     Popup.show('info');
 ***********************************************************/
export class Popup {
    /**
     * Show popup
     * @param {string} text content
     */
    static async show(text, width, height, x, y) {
        const dlg = new Dialog();  // document.createElement('x-dialog');
        dlg.content = `${text}`;
        document.body.appendChild(dlg);
        dlg.show(false, false, width, height, x, y);
        return dlg;
    }
}
