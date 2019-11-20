class Layer extends Components{
    
    constructor(options) {
        super(options);

        this._size = options.size;
        this._canvasCoords = options.coords;
        this._parent = options.parent;
        this._pCoords = options.pCoords;

        this.data = this._createLayer(this._size);

        this._el.addEventListener('mousedown', this._initClick.bind(this));
    }

    //Создает div(layer), анологичный картинки на канвасе
    _createLayer(data){
        var res = {};

        res.x = this._canvasCoords.x + data.mLeft;
        res.y = this._canvasCoords.y + data.mTop;

        if(data.text){
            data.el.type = 'text';
            this._setStyle(this._el.style,{
                top: res.y,
                left: res.x
            });
        }else {
            res.el = this._el;
            res.el.type = 'img';
            this._setStyle(res.el.style,{
                top: res.y,
                left: res.x,
                width: data.w,
                height: data.h
            });
        }

        res.cx = res.x + data.w / 2;
        res.cy = res.y + data.h / 2;
        res.rotate = 0;
        res.sx = res.x;
        res.sy = res.y;
        res.sw = data.w;
        res.sh = data.h;
        res.sml = data.mLeft;
        res.smt = data.mTop;

        this.toggle(this._el);
        this._parent.appendChild(this._el);

        Object.assign(res, data);
        return res;
    }





    //Роутер
    _initClick(e){
        if (e.which != 1) return;
        var elem = e.target;
        var action = elem.getAttribute('data-action');
        if(!action) return;

        if(elem.parentNode.type === 'text' || elem.type === 'text'){
            EE.trigger('initEditText', this.data);
        }else {
            EE.trigger('removeEditText', null);
        }
        this.open();
        this[action](elem, e);
    }
    
    
    _drag(elem, e){
        var downX = e.pageX - this._pCoords.left;
        var downY = e.pageY - this._pCoords.top;

        this.data.shiftX = downX - this.data.x;
        this.data.shiftY = downY - this.data.y;

        EE.trigger('startDrag', {
            data: this.data
        });
    }



    _scale(elem, e){
        var type = elem.parentNode.type;
        this.data.downX = e.pageX - this._pCoords.left;
        this.data.downY = e.pageY - this._pCoords.top;
        this.data.course = parseInt(elem.getAttribute('data-course'));
        
        EE.trigger('startScale', {
            data: this.data,
            type: type
        });
    }



    _rotate(elem, e){
        this.data.downX = e.pageX - this._pCoords.left;
        this.data.downY = e.pageY - this._pCoords.top;

        EE.trigger('startRotate', {
            data: this.data
        })
    }



    //Helpers
    
    
    
    _setStyle(elemS, params){
        for (var key in params) {
            elemS[key] = params[key] + 'px';
        }
    }
}
