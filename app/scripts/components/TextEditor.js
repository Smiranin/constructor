class TextEditor extends Components{

    constructor(options){
        super(options);
        
        this._inputText = this._el.querySelector('#text');
        this._fontTitle = this._el.querySelector('[data-item="font_title"]');
        this._sizeTitle = this._el.querySelector('[data-item="size_title"]');
        this.outputColor = this._el.querySelector('#output');

        this._mainTitle = this._el.querySelector('.m_header h1');
        this._mainBtn = this._el.querySelector('[data-action="_addText"]');

        this._defaultData = {
            size: 100,
            font: 'orange_juice',
            fontName: 'Orange juice',
            mainSize: 40,
            color: 'rgb(255,0,0)'
        };
        this._data = {};

        this._picker = false;
        this._isEdit = false;

        this._el.addEventListener('click', this.router.bind(this));

        EE.on('showTextPanel', this._showPanel.bind(this));
        EE.on('addColor', this._addColor.bind(this));
        EE.on('initEditText', this._initEditText.bind(this));
        EE.on('removeEditText', this._clearFields.bind(this));
    }


    _showPanel(options){
        this._el.classList.add('active_js');

        if(!this._picker){
            var pickerEl = document.getElementById('picker');
            pickerEl.style.display = 'block';
            this._picker = new ColorPicker({
                line: document.getElementById('line_picker'),
                _picker: document.getElementById('field_picker'),
                output: document.getElementById('output'),
                parent: pickerEl,
                imgPath: 'bgGradient.png',
                colors: ['rgb(255,0,0)','rgb(255,255,0)','rgb(0,255,0)','rgb(0,255,255)','rgb(0,0,255)','rgb(255,0,255)','rgb(255,0,0)']
            });
            pickerEl.style.display = '';
            return;
        }

        this._clearFields();
    }
    
    
    
    _closePanel(){
        this._el.classList.remove('active_js');
    }


    _addFont(elem){
        this._data.font = elem.className;
        this._fontTitle.innerHTML = elem.innerHTML;

        this._fontTitle.className =  elem.className;
        this._inputText.className =  elem.className;
    }


    _addSize(elem){
        var size = parseInt(elem.innerHTML);
        this._sizeTitle.innerHTML = size;
        this._data.size = size * 100 / this._defaultData.mainSize;
        this._inputText.style.fontSize = size + 'px';
    }



    _addColor(options){
        this._inputText.style.color = options.color;
        this._data.color = options.color;
    }
    
    
    _addText(elem){
        var text = this._inputText.value;
        if(!text){
            alert('You did not add text!');
            return;
        }

        this._data.text = text;
        this._data.size = this._data.size || this._defaultData.size;
        this._data.font = this._data.font || this._defaultData.font;
        this._data.color = this._data.color || this._defaultData.color;
        this._data.edit = this._isEdit;

        EE.trigger('addText', this._data);
        this._data = {};
        this._closePanel();
    }


    _initEditText(options){
        if(options){
            this._inputText.value = options.text;
            this._inputText.className = options.font;
            this._inputText.style.color = options.color;
            this.outputColor.style.background = options.color;

            var size = Math.round(options.size * 40 / 100);
            this._inputText.style.fontSize = size + 'px';


            this._data.size = options.size;
            this._data.font = options.font;
            this._data.color = options.color;

            this._fontTitle.innerHTML = options.font;
            this._fontTitle.className = options.font;

            this._sizeTitle.innerHTML = size;

            this._mainTitle.innerHTML = 'Edit text';
            this._mainBtn.innerHTML = 'edit';
            EE.trigger('showEditBtn', {action: 'show'});
        }else {
            this._el.classList.add('active_js');
        }
        this._isEdit = true;
    }


    _clearFields(){
        this._inputText.value = '';
        this._inputText.className = this._defaultData.font;
        this._inputText.style.fontSize = '40px';
        this.outputColor.style.background = '';
        this._inputText.style.color = '';

        this._fontTitle.innerHTML = this._defaultData.fontName;
        this._fontTitle.className = this._defaultData.font;
        this._mainTitle.innerHTML = 'Step 2 - add text';
        this._mainBtn.innerHTML = 'add text';

        this._sizeTitle.innerHTML = '40';
        this._isEdit = false;
        this._data = {};

        EE.trigger('showEditBtn', {action: 'hide'});
    }
}
