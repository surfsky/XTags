-----------------------------------------------------
About XTags
-----------------------------------------------------
xtags : html5 custom tag system without writing any css and class.

author: surfsky.github.com 2024


-----------------------------------------------------
Features
-----------------------------------------------------
- Tags: 
    - basic: tag, rect, circle, style
    - container: container, row, col, grid, form, frame
    - control: image, icon, link
    - form: button
    - popup: toast, mask, dialog, messagebox, popup, tooltip

- Position
    - anchor, fixanchor
    - childanchor

- Effect
    - Hover color change
    - Animation for position, size, color...
    - Button click ripple effect

- Event
    - click

- Theme
    - Just use XTags.showTheme(.)

- Attributes
    baseui: 
        tag
            box
                /size
                /border
                /margin\padding
                /radius
            position
                /anchor
                /childAnchor
            theme
                /bgcolor
                /textcolor
                /hovercolor
                /font
                /theme
            effect
                /transform
                /shadow
                /textshadow
                /rotate
                /scale
                /skew
                /animation
        container
            /row
            /column
            /grid
            /iframe
            /form responsive
            /container
        event
            /click
            /hover
            drag
            swipe
        temple
    control:
        /button
        /image
        /icon
        /link
        switch
        groupbutton
        textbox
        popup
        toast
    canvas
        shape
        control
    util:
        extensions



-----------------------------------------------------
Examples
-----------------------------------------------------
``` js
<script src="./xtags.js" type='module' defer ></script>

<x-rect anchor="topLeft" childanchor='center'>topLeft</x-rect>
<x-row gap='20px' anchor="center" width="430px">...<x-row>
<x-col gap="20px" anchor='right'  width="130px" height="500px">...<x-col>
<x-grid columns='4'>...<x-grid>
<x-form>...<x-form>
```



-----------------------------------------------------
shadow mode and inplace mode
-----------------------------------------------------
    
- shadow 模式是将动态生成的标签创建在 shadowDOM 内部，所有的style和js都自封装起来，好处是独立，不会污染页面。坏处是由于其隔离模式，无法被外部访问，会导致以下问题：
    三方库（如highlight.js）无法集成 ，估计是尝试获取 queryElement() 获取shadowDom中的子元素失败。
    iframe 放在 xtags 里面，无法自动撑开，要手动指定 width=100%
    iframe 放在 xtags 里面，<a> 标签中的target无法正确指向
    x-row 中的按钮点击后无法获取按钮的坐标和区域。见 popup.html
- inplace 模式是将动态生成的标签替代原有的 x- 开头的标签。好处是兼容三方类库且不会污染页面。
- 现阶段大部分控件都是用 inplace 方式创建的，少数复杂控件采用 shadow 模式封装：dialog、messagebox、popup


-----------------------------------------------------
Task
-----------------------------------------------------
优化dialog
    提供标题栏供拖动
    实现dialog buttons and dialogResult
    提供resize属性以及其它属性供用户自己设置
实现SideDialog，靠边刷出，高度填满，顶部或底部固定放置
button showRipple 改用方法来写，不用css，并改为异步的。

如何回收自动创建的style标签？
    删除前没有事件或方法可以调用
    删除后，标签都不存在了，属性和方法都不能调用了
    唯有静态成员还存在，那只能用class方式了
    注：ripple.animateend 方法会自动释放

完善link，动态修改色彩
canvas and shape
swipe
tooltip
layout-backend
layout-dashboard
实现 react、vue那样的组件生成方式
child sortable


发布
    build min.js
    备选名称：classless.js, noclass.js, cssless.js, onlytags.js




-----------------------------------------------------
history
-----------------------------------------------------
/实现iconfont, x-icon
/优化tootip，支持：textContext、attribute、callback
/修复 dialog、messagebox、Popup
/让dialog 使用shadow模式，自封装让页面更干净。
/显示页面源码
/解决重入几次的问题：button.html
/button按钮有点问题，有的可以正常，有的不行（如setTheme）。 要不增加一个 asyncclick ？
/完善 theme，可设置 border 组合属性，增加textLight 属性
/inplace 模式注意事项
    /把方法都写在root下面，避免 inplace 模式导致方法丢失
    /增加一个styleid属性？把 styleTag 挂在root下面
/全局自动注入 boxsizing、transition css，弄个开关。算了，用<style>标签吧，让用户自己设置。
/toast 的 style 需要回收，算了，不设置row 的 gap属性了。
/修复 Theme     遍历节点，setTheme方法丢失了，看是否把这个方法附在root下面
/fixanchor 固定在页面，不跟随父节点
/修复 Toast
/测试原地替换dom方式，而不是在shadow中创建，以避免shadow导致的隔离影响
    思路
        提供属性 render = Shadow | Body
        对于自己的样式控制，直接写没关系
        对于子类的渲染，需要给一个guid，并输出对应的 style 标签
    逐步修正。主要是查 shadowRoot
        /Style       需提供全局 box-sizing 模式，全屏设置，1em设置，响应容器设置
        /Link       按钮无法显示
        /Rectangle   点击动画
        /Circle      中间的圆显示不正常
        /Image
        /Icon
        /Button
        /Row       影响属性 gap
        /Column    影响属性 gap
        /Form
        /Mask
/实现 Container   响应式布局
/button 继承至 tag，且生成 <button> 标签
/按钮文字不可选择 user-select: none
/Button long time execute
/drag - dialog
/animation: Tag.animate(...)
/dragable
/resizable
/messagebox
/dialog
/unique id 对于动态创建的控件，自动生成一个唯一性ID，或者不用也行，用this.root 保存吧。
/layout-form
/弄个虚拟基类Tag，实现所有css
    Rect、Circle，butten
    Style、
    row、col，grid
/删除this.shadow，直接用 this.shadowRoot
/尝试用grid布局来写index.html
/Link hover、visited color
/Mask
/注入全局样式。或弄一个全局配置标签。
/x-img 也可以考虑支持icon，命名方式如：theme-iconname.xxx
/用 ITheme 接口改造 Rect，算了用约定吧
/用 Toast.show() 静态方法来展示 Toast
/image
/重构类库结构：base、baseui、control、util...
/Rect.fix -> anchor

