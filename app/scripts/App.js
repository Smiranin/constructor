class App {

    constructor(options) {
        this._el = options.elem;
        this._defaultProduct = document.getElementById('products-title').firstElementChild;
        
        /*this.view_box = this._el.querySelector('[data-component="view_box"]');
        this.modal = document.getElementById('modal');

        this.defaultSize = options.defaultSize || {width: 400, height: 400};
        this.SIZE = this._initViewSize();
        this.img = new Image();
        this.canvas = document.getElementById('canvas');*/

        this.stepsPanel = new StepsPanel({
            elem: this._el.querySelector('[data-component="steps"]')
        });
        this.btnPanel = new BtnPanel({
            elem: this._el.querySelector('[data-component="btn_panel"]')
        });
        this.fieldDrawing = new FieldDrawing({
            elem: this._el.querySelector('[data-component="view_box"]'),
            titleEl: this._defaultProduct
        });
        this.imgEditor = new ImgEditor({
            elem: this._el.querySelector('[data-component="img_editor"]')
        });
        this.textEditor = new TextEditor({
            elem: this._el.querySelector('[data-component="text_editor"]')
        });
        
        this.imgViewer = new ImgViewer({
            elem: this._el.querySelector('[data-component="img_viewer"]')
        });


        EE.trigger('choiceProduct', {
            name: this._defaultProduct.innerHTML,
            path: this._defaultProduct.getAttribute('data-path')
        });

    }

/*
    _initViewSize() {
        var res = {};
        var diffW = (this.view_box.offsetWidth - this.defaultSize.width) / 2;
        var diffH = (this.view_box.offsetHeight - this.defaultSize.height) / 2;
        if (diffW <= 0) {
            res.width = this.view_box.offsetWidth;
            res.left = 0;
        } else {
            res.width = this.defaultSize.width;
            res.left = diffW
        }
        if (diffH <= 0) {
            res.height = this.view_box.offsetHeight;
            res.top = 0;
        } else {
            res.height = this.defaultSize.height;
            res.top = diffH;
        }
        return res;
    }*/
}


let constructor = new App({
    elem: document.getElementById('constructor')
});