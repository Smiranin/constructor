class FieldDrawing extends Components{

    constructor(options){
        super(options);

        this._CANVAS = this._el.querySelector('#canvas');
        this._layerTemplate = this._el.querySelector('[data-component="layer"]');
        this._productTitle = options.titleEl;
        
        this._product = new Image();

        this._layers = [];
        this._currentLayer = null;

        this._canvasCoords = {};
        this._elCoords = this._getCoords(this._el);

        this._defaultSize = {w: 350, h: 350};
        
        this._move = this._move.bind(this);
        this._mouseUp = this._mouseUp.bind(this);

        this._initCourse = this._initCourse.bind(this);
        this._stopScale = this._stopScale.bind(this);

        this._rotate = this._rotate.bind(this);
        this._stopRotate = this._stopRotate.bind(this);

        EE.on('choiceProduct', this._choiceProduct.bind(this));
        EE.on('load', this._loadImg.bind(this));
        EE.on('startDrag', this._startDrag.bind(this));
        EE.on('startScale', this._startScale.bind(this));
        EE.on('startRotate', this._startRotate.bind(this));
        EE.on('editView', this._editView.bind(this));
        EE.on('del', this._delLayer.bind(this));
        EE.on('addText', this._addText.bind(this));
        EE.on('preview', this._preview.bind(this));
        EE.on('addToCart', this._initDataForSend.bind(this));
    }


    //Создание текстового блока
    _addText(options){
        if(options.edit){
            this._updateTextData(options);
            return;
        }
        var textData = this._initTextData(options);
        textData.index = this._layers.length;

        this._currentLayer = new Layer({
            elem: textData.el,
            size: textData,
            coords: this._canvasCoords,
            pCoords: this._elCoords,
            parent: this._el
        }).data;

        this._layers.push(this._currentLayer);
        this._currentText = true;
        this._draw(this._layers);
        
        EE.trigger('initEditText', this._currentLayer);
    }


    //Обновляем данные при редактировании текста
    _updateTextData(data){
        this._currentLayer.size = data.size;
        this._currentLayer.text = data.text;
        this._currentLayer.font = data.font;
        this._currentLayer.color = data.color;

        this._currentLayer.el.removeChild(this._currentLayer.el.lastChild);
        this._currentLayer.el.appendChild(document.createTextNode(data.text));

        this._currentLayer.el.style.font =  data.size + "% " + data.font;
        this._currentLayer.sw = this._currentLayer.w;

        this._currentLayer.w = this._currentLayer.el.offsetWidth;
        this._currentLayer.h = this._currentLayer.el.offsetHeight;

        this._currentLayer.x = this._currentLayer.x - (this._currentLayer.w - this._currentLayer.sw) / 2;
        this._currentLayer.mLeft = this._currentLayer.x - this._canvasCoords.x;
        this._currentLayer.el.style.left = this._currentLayer.x + 'px';

        this._draw(this._layers);
    }



    //Инициализация размеров текста
    _initTextData(options){
        var res = {};

        res.size = options.size;
        res.text = options.text;
        res.font = options.font;
        res.color = options.color;

        res.el = this._layerTemplate.cloneNode(true);
        res.el.appendChild(document.createTextNode(options.text));
        res.el.style.font =  options.size + "% " + options.font;
        this._el.appendChild(res.el);

        res.w = res.el.offsetWidth;
        res.h = res.el.offsetHeight;
        
        res.percent = res.h * 100 / res.w;
        res.bigW = true;
        res.mTop = (this._CANVAS.height - res.h) / 2;
        res.mLeft = (this._CANVAS.width - res.w) / 2;
        return res;
    }
    

    
    //Загружаю картинку продукта и устанавливаю размер канвас исходя из пропорция картинки, но не больше this._defaultSize.
    //Начально отрисовываю канвас.
    _choiceProduct(options) {
        this._productTitle.innerHTML = options.name;

        this._delAllLayers();
        this._product.src = options.path;
        this._product.onload = ()=> {
            var percent,
                width = this._product.width,
                height = this._product.height;

            if(width >= height){
                percent = height * 100 / width;
                width = this._defaultSize.w;
                height = width * percent / 100;
            }else {
                percent = width * 100 / height;
                height = this._defaultSize.h;
                width = height * percent / 100;
            }
            this._CANVAS.width = width;
            this._CANVAS.height = height;
            var coords = this._getCoords(this._CANVAS);
            this._canvasCoords.x = coords.left - this._elCoords.left;
            this._canvasCoords.y = coords.top - this._elCoords.top;

            var ctx = this._CANVAS.getContext('2d');
            ctx.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
            ctx.drawImage(this._product, 0, 0, this._CANVAS.width, this._CANVAS.height);
        }
    }



    //Создаем картинку и div(layer) под нее, отдельным компонентом, инициализируем данные и отрисовываем
    _loadImg(options){
        var img = new Image();
        img.src = options.data;
        img.onload = () => {
            var elem = this._layerTemplate.cloneNode(true);
            var size = this._initLayerSize(img);
            size.index = this._layers.length;

            this._currentLayer = new Layer({
                elem: elem,
                size: size,
                coords: this._canvasCoords,
                pCoords: this._elCoords,
                parent: this._el
            }).data;

            this._currentLayer.file = options;
            
            this._layers.push(this._currentLayer);
            this._draw(this._layers);
            EE.trigger('removeEditText', null);
        };
    }



    //Инициализирует размер накладной картинки в канвасе исходя из пропорций.
    _initLayerSize(img){
        var res = {}, percent;
        var width = img.width;
        var height = img.height;
        if(width >= height){
            percent = height * 100 / width;
            this._CANVAS.width <= width ? res.w = this._CANVAS.width : res.w = width;
            res.h = res.w * percent / 100;
            res.bigW = true;
            res.mTop = (this._CANVAS.height - res.h) / 2;
            width == height ? res.mLeft = (this._CANVAS.width - res.w) / 2 : res.mLeft = 0;
        }else {
            percent = width * 100 / height;
            this._CANVAS.height <= height ? res.h = this._CANVAS.height : res.h = height;
            res.w = res.h * percent / 100;
            res.mTop = 0;
            res.mLeft = (this._CANVAS.width - res.w) / 2;
        }
        res.percent = percent;
        res.img = img;
        return res;
    }



    //Главная функция для рисования
    _draw(data){
        var ctx = this._CANVAS.getContext('2d');
        var width = this._CANVAS.width;
        var height = this._CANVAS.height;
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(this._product, 0, 0, width, height);

        ctx.save();
        ctx.globalCompositeOperation = 'source-atop';
        for (var i = 0, len = data.length; i < len; i++) {
            var obj = data[i];
            if(obj.text){
                this._drawText(ctx, obj);
                continue;
            }
            if(obj.rotate){
                ctx.save();
                ctx.translate(obj.mLeft + obj.w / 2, obj.mTop + obj.h / 2);
                ctx.rotate(obj.rotate);
                ctx.drawImage(obj.img, -obj.w / 2, -obj.h / 2, obj.w, obj.h);
                ctx.restore();
                continue;
            }
            ctx.drawImage(obj.img, obj.mLeft, obj.mTop, obj.w, obj.h);
        }
        ctx.restore();
    }



    //Отрисовка текста
    _drawText(ctx, obj){
        ctx.font = obj.size + "% " + obj.font;
        ctx.fillStyle = obj.color;
        ctx.textBaseline = 'top';
        if(obj.rotate){
            ctx.save();
            ctx.translate(obj.mLeft + obj.w / 2, obj.mTop + obj.h / 2);
            ctx.rotate(obj.rotate);
            ctx.fillText(obj.text, -obj.w / 2, -obj.h / 2);
            ctx.restore();
        }else {
            ctx.fillText(obj.text,  obj.mLeft, obj.mTop);
        }
    }

    
    
//Start Drag>>>>>>>>>>>>>>>>>
    _startDrag(options){
        this._currentLayer = options.data;

        this._el.addEventListener('mousemove', this._move);
        document.addEventListener('mouseup', this._mouseUp);
    }


    _move(e){
        this._currentLayer.x = e.pageX - this._elCoords.left - this._currentLayer.shiftX;
        this._currentLayer.y = e.pageY - this._elCoords.top - this._currentLayer.shiftY;
        this._currentLayer.mLeft = this._currentLayer.x - this._canvasCoords.x;
        this._currentLayer.mTop = this._currentLayer.y - this._canvasCoords.y;

        this._draw(this._layers);

        this._currentLayer.el.style.left = e.pageX - this._elCoords.left - this._currentLayer.shiftX + 'px';
        this._currentLayer.el.style.top = e.pageY - this._elCoords.top - this._currentLayer.shiftY + 'px';
    }


    _mouseUp(e){
        this._currentLayer.cx = this._currentLayer.x + this._currentLayer.w / 2;
        this._currentLayer.cy = this._currentLayer.y + this._currentLayer.h / 2;

        this._el.removeEventListener('mousemove', this._move);
        document.removeEventListener('mouseup', this._mouseUp);
    }
 // End drag<<<<<<<<<<<<<<<<<   


    
//Scale>>>>>>>>>>>>>>>>>
    _startScale(options){
        this._currentLayer = options.data;
        this._saveStartSize();
        if(options.type === 'text'){
            this._currentLayer.sSize = this._currentLayer.size;
            this._currentLayer.el.style.width = 'auto';
            this._currentLayer.el.style.height = 'auto';
        }

        this._el.addEventListener('mousemove', this._initCourse);
        this._el.addEventListener('mouseup', this._stopScale);
    }


    _saveStartSize(){
        this._currentLayer.sx = this._currentLayer.x;
        this._currentLayer.sy = this._currentLayer.y;
        this._currentLayer.sw = this._currentLayer.w;
        this._currentLayer.sh = this._currentLayer.h;
        this._currentLayer.sml = this._currentLayer.mLeft;
        this._currentLayer.smt = this._currentLayer.mTop;
    }

//определяем за верхние или за нижние стрелки тянут
    _initCourse(e){
        var layer = this._currentLayer;
        var res;
        layer.course == 1 ? res = e.pageY - this._elCoords.top - layer.downY : res =  res = -(e.pageY - this._elCoords.top - layer.downY);
        if(layer.text){
            this._textScale(layer, res)
        }else {
            this._scale(layer, res);
        }
    }
    

    _textScale(layer, res){
        var dif = 23 - res;
        var p = dif * 100 / 23 - 100;

        if(layer.sSize + p <= 30) return;

        layer.size = layer.sSize + p;
        layer.el.style.fontSize = layer.size + '%';

        layer.w = layer.el.offsetWidth;
        layer.h = layer.el.offsetHeight;

        layer.x = layer.sx - (layer.w - layer.sw) / 2;
        layer.y = layer.sy - (layer.h - layer.sh) / 2;
        layer.mLeft = layer.x - this._canvasCoords.x;
        layer.mTop = layer.y - this._canvasCoords.y;

        layer.el.style.top = layer.y + 'px';
        layer.el.style.left = layer.x + 'px';

        this._draw(this._layers);
    }


    _scale(layer, res){
        if(layer.bigW){
            var w = layer.sw - res * 2;
            if(w <= 10) return;
            layer.w = w;
            layer.h = layer.w * layer.percent / 100;
        }else {
            var h = layer.sh - res * 2;
            if(h <= 10) return;
            layer.h = h;
            layer.w = layer.h * layer.percent / 100;
        }
        layer.mLeft = res + layer.sml;
        layer.mTop = res + layer.smt;
        layer.x = res + layer.sx;
        layer.y = res + layer.sy;

        layer.el.style.left = layer.x + 'px';
        layer.el.style.top = layer.y + 'px';
        layer.el.style.width = layer.w + 'px';
        layer.el.style.height = layer.h + 'px';

        this._draw(this._layers);
    }


    _stopScale(){
        this._currentLayer.cx = this._currentLayer.x + this._currentLayer.w / 2;
        this._currentLayer.cy = this._currentLayer.y + this._currentLayer.h / 2;

        this._el.removeEventListener('mousemove', this._initCourse);
        this._el.removeEventListener('mouseup', this._stopScale);
    }
//End Scale<<<<<<<<<<<<<<




//Start rotate>>>>>>>>>>>

    _startRotate(options){
        this._currentLayer = options.data;

        this._el.addEventListener('mousemove', this._rotate);
        this._el.addEventListener('mouseup', this._stopRotate);
    }


    _rotate(e){
        var layer = this._currentLayer;
        var xFromCentre = e.pageX - this._elCoords.left - layer.cx;
        var yFromCentre = e.pageY - this._elCoords.top - layer.cy;

        if(yFromCentre > 0){
            layer.rotate = Math.atan2(yFromCentre, xFromCentre);
         }else {
            layer.rotate = (Math.PI * 2 + Math.atan2(yFromCentre, xFromCentre));
         }
        var deg = layer.rotate  * 180 / Math.PI;
        layer.el.style.transform = 'rotate(' + deg + 'deg)';
        this._draw(this._layers);
    }


    _stopRotate(e){
        this._el.removeEventListener('mousemove', this._rotate);
        this._el.removeEventListener('mouseup', this._stopRotate);
    }
//End rotate<<<<<<<<<<<<<<



    _preview(options){
        for (var i = 0, len = this._layers.length; i < len; i++) {
            this._layers[i].el.style.visibility = options.value;
        }
    }



//Запускает рисование исходя из нажатия кнопок на btnPanel
    _editView(options){
        var layer = this._currentLayer;
        if(!layer)return;

        if(options.command === 'rotate'){

            var deg = layer.rotate * 180 / Math.PI;
            deg = deg + options.value;
            if(deg < 0)deg = 360 + deg;
            layer.rotate = deg * Math.PI / 180;

            this._currentLayer.el.style.transform = 'rotate(' + deg + 'deg)';
            this._draw(this._layers);

        }else {
            this._saveStartSize();
            if(this._currentLayer.text){
                this._currentLayer.sSize = this._currentLayer.size;
                this._textScale(this._currentLayer, options.value)
            }else {
                this._scale(this._currentLayer, options.value);
            }
            this._currentLayer.cx = this._currentLayer.x + this._currentLayer.w / 2;
            this._currentLayer.cy = this._currentLayer.y + this._currentLayer.h / 2;
        }
    }


    _delLayer() {
        if (!this._currentLayer) return;
        if(this._currentLayer.text) EE.trigger('removeEditText', null);

        this._el.removeChild(this._currentLayer.el);
        this._layers.splice(this._currentLayer.index, 1);

        for (var i = 0, len = this._layers.length; i < len; i++) {
            this._layers[i].index = i;
        }

        if(len > 0 ){
            this._currentLayer = this._layers[len - 1];
            this._draw(this._layers);
        }
        else {
            this._currentLayer = null;
            var ctx = this._CANVAS.getContext('2d');
            ctx.clearRect(0, 0, this._CANVAS.width, this._CANVAS.height);
            ctx.drawImage(this._product, 0, 0, this._CANVAS.width, this._CANVAS.height);
        }
    }


    _delAllLayers(){
        var len = this._layers.length;
        if(len == 0)return;

        this._currentLayer = null;
        for (var i = 0; i < len; i++) {
            var obj = this._layers[i];
            this._el.removeChild(obj.el);
        }
        this._layers = [];
    }


    //Send Photo
    _initDataForSend(options){
        var res, len = this._layers.length;
        var promiseArr = [];
        var preloader = document.getElementById('preloader');

        for (var i = 0; i < len; i++) {
            var obj = this._layers[i];
            if(obj.file){
                preloader.classList.add('active_js');
                var data = 'file=' + JSON.stringify(obj.file);
                promiseArr.push(
                    AjaxServices.promise(URL, {
                        method: 'POST',
                        data: data
                    })
                );
            }
        }

        Promise.all(promiseArr)
            .then(() => {
                var canvasView = this._CANVAS.toDataURL('image/png');
                var orderOpt = '';
                var title = this._productTitle.innerHTML.replace(/\//g, ' ');

                if (options.opt) {
                    orderOpt = options.opt;
                }
                AjaxServices.ajax(URL, {
                    method: 'POST',
                    data: 'file=' + JSON.stringify({
                        name: 'canvas',
                        data: canvasView,
                        product: title,
                        opt: orderOpt
                    }),
                    cb: function (msg) {
                        preloader.classList.remove('active_js');
                        window.location = 'http://idposter.com/Cart/';
                    }
                });
            });
    }


//Helpers
    _getCoords(elem){
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    }

}