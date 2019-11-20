class StepsPanel extends Components{

    constructor(options){
        super(options);

        this.activeEl = this._el.querySelector('[data-action="toggle"]');
        this._modalOptions = document.getElementById('order_options');
        this._ListColor = this._modalOptions.querySelector('[data-item="list_color"]');
        this._colorTitle = this._ListColor.querySelector('[data-item="color_title"]');
        this._quaEl = document.getElementById('qua');

        this._isPreview = false;
        this._orderOpt = {
            color: 'default',
            print: '3D Plastic',
            quantity: 1
        };

        this._el.addEventListener('click', this.router.bind(this));
        this._modalOptions.addEventListener('click', this.router.bind(this));
        this._quaEl.onkeypress = this._quantity.bind(this);
    }


    _choiceProduct (elem){
        var options = {
            name: elem.innerHTML,
            path: elem.getAttribute('data-path')
        };
        EE.trigger('choiceProduct', options);
        this.toggle();
    }


    _toggleOptions(elem){
        this._modalOptions.classList.toggle('active_js');
    }


    _addImg(elem){
        EE.trigger('showUploadPanel', null);
    }


    _addText(elem){
        EE.trigger('showTextPanel', null);
    }


    _options(elem, target) {
        var orderOpt = target.closest('.order_options');
        if(orderOpt)return;
        this.toggle(elem);
    }


    _quantity(e){
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        var chr = this._getChar(e);
        if (chr == null) return;
        if (chr < '0' || chr > '9') return false;

        var len = this._quaEl.value.length;
        if(len == 0 && chr == 0) return false;
        if(len == 2) return false;
    }


    _silicone2d(){
        this._ListColor.style.maxHeight = 500 + 'px';
        this._orderOpt.print = '2D Silicone';
        
    }


    _plastic3d(){
        this._ListColor.style.maxHeight = 0;
        this._orderOpt.print = '3D Plastic';
        this._orderOpt.color = 'default';
    }


    _choiceColor(elem, target){
        var color = target.innerHTML;
        this._colorTitle.className = color.toLowerCase();
        this._colorTitle.firstElementChild.innerHTML = color;
        this._orderOpt.color = color;
    }



        _preview(elem){
        var value;
        if(!this._isPreview){
            value = 'hidden';
            elem.innerHTML = '<p class="get_preview preview"><strong>Edit</strong></p>';
        }else {
            value = 'visible';
            elem.innerHTML = '<p class="get_preview">Step 04 <br> <strong>Preview</strong></p>';
        }
        EE.trigger('preview', {value: value});
        this._toggleViewSteps(value);
        this._isPreview = !this._isPreview;
    }
    
    
    _toggleViewSteps(value){
        var opacity;
        value === 'hidden' ? opacity = 0 : opacity = 1;
        var steps = this._el.querySelectorAll('.steps_list_js>li');
        for (var i = 0, len = steps.length - 2; i < len; i++) {
            steps[i].style.visibility = value;
            steps[i].style.opacity = opacity;
        }
    }


    _addToCart(){
        var quantity = this._quaEl.value;
        this._orderOpt.quantity = quantity || 1;
        EE.trigger('addToCart', {opt: this._orderOpt});
    }


    //Helpers

    _getChar(event){
        if (event.which == null) {
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode)
        }

        if (event.which != 0 && event.charCode != 0) {
            if (event.which < 32) return null;
            return String.fromCharCode(event.which)
        }

        return null;
    }
}
