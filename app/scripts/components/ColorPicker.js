class ColorPicker{
    
    constructor(options){
        this.line = options.line;
        this._picker = options._picker;
        this.output = options.output;
        this.imgPath = options.imgPath;
        this.colors = options.colors;

        this.caretLine = {
            el: this.line.querySelector('.caret'),
            top: 0,
            left: this.line.offsetWidth / 2
        };
        this.caretPicker = {
            el: this._picker.querySelector('.caret'),
            right: -3,
            top: -3
        };

        this.ctxL = null;
        this.ctxP = null;
        this.IMG = new Image();

        this.moveOnLine = this.moveOnLine.bind(this);
        this.lineUp = this.lineUp.bind(this);
        this.moveOnPicker = this.moveOnPicker.bind(this);

        this.lineCoords = this.getCoords(this.line);
        this.pickerCoords = this.getCoords(this._picker);

        this.line.onmousedown = this.clickOnLine.bind(this);
        this._picker.onmousedown = this.clickOnPicker.bind(this);

        this.init();
    }


    init () {
        this._canvasP = this._picker.querySelector('canvas');
        this._canvasL = this.line.querySelector('canvas');

        this._canvasP.width = this._picker.offsetWidth;
        this._canvasP.height = this._picker.offsetHeight;

        this._canvasL.width = this.line.offsetWidth;
        this._canvasL.height = this.line.offsetHeight;

        this.ctxP = this._canvasP.getContext('2d');
        this.ctxL = this._canvasL.getContext('2d');

        this.createGradient();
    }


    createGradient () {
        var grad = this.ctxL.createLinearGradient(this._canvasL.width / 2, this._canvasL.height, this._canvasL.width / 2, 0);

        for (var i = 0, len = this.colors.length; i < len; i++) {
            grad.addColorStop(i / 6, this.colors[i]);
        }
        this.ctxL.fillStyle = grad;
        this.ctxL.fillRect(0, 0, this._canvasL.width, this.line.offsetHeight);

        this.IMG.src = PICKER_PATH;
        this.IMG.onload = function () {
            this.draw();
        }.bind(this);
    }

    
    clickOnPicker (e) {
    if(e.target === this.caretPicker.el){
        document.onmousemove = this.moveOnPicker;
        document.onmouseup = this.lineUp;
        return;
    }
    var x = e.pageX - this.pickerCoords.left;
    var y = e.pageY - this.pickerCoords.top;
        
    this.caretPicker.el.style.top = y - 3 + 'px';
    this.caretPicker.el.style.left = x - 3 + 'px';
    this.getColor(x, y, this.ctxP);
    }



    moveOnPicker (e) {
    var y = e.pageY - this.pickerCoords.top;
    var x = e.pageX - this.pickerCoords.left;

    if(y < 0 || y > this._canvasP.height - 4 ||
        x < 0 || x > this._canvasP.width - 4) return;

    this.caretPicker.el.style.top = y - 3 + 'px';
    this.caretPicker.el.style.left = x - 3 + 'px';
    var color = this.getColor(x, y, this.ctxP);
    }



    clickOnLine (e) {
    if(e.target === this.caretLine.el){
        document.onmousemove = this.moveOnLine;
        document.onmouseup = this.lineUp;
        return;
    }

    var y = e.pageY - this.lineCoords.top;
    if(y < 0) y = 0;
    if(y > this._canvasL.height - 5)return;

    this.caretLine.el.style.top = y + 'px';

    var color = this.getColor(this.caretLine.left, y, this.ctxL);

    this.draw(color);
   }



    moveOnLine (e) {
    var y = e.pageY - this.lineCoords.top;
    if(y < 0) y = 0;
    if(y > this._canvasL.height - 5)return;

    this.caretLine.el.style.top = y + 'px';
    var color = this.getColor(this.caretLine.left, y, this.ctxL);

    this.draw(color);
    }



    lineUp (e) {
    document.onmousemove = null;
    document.onmouseup = null;
     }



    draw (color) {
    this.ctxP.clearRect(0, 0, this._canvasP.width, this._canvasP.height);

    this.ctxP.drawImage(this.IMG, 0, 0, this._canvasP.width, this._canvasP.height);
    this.ctxP.save();
    this.ctxP.globalCompositeOperation = 'destination-over';
    this.ctxP.fillStyle = color || 'rgb(255,0,0)';
    this.ctxP.fillRect(0, 0, this._canvasP.width, this._canvasP.height);
    this.ctxP.restore();
    }



    getColor (x, y, ctx) {
    var imgData = ctx.getImageData(x, y, 1, 1).data;
    var R = imgData[0];
    var G = imgData[1];
    var B = imgData[2];
    var rgb = 'rgb(' + R + ',' + G + ',' + B + ')';
    this.output.style.backgroundColor = rgb;
    EE.trigger('addColor',{color: rgb});
    return rgb;
    }


    getCoords (elem){
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };
    }
}