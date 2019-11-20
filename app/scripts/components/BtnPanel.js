class BtnPanel extends Components{

    constructor(options){
        super(options);
        this._editBtn = this._el.querySelector('[data-action="_editText"]');

        this._el.addEventListener('click', this.router.bind(this));

        EE.on('showEditBtn', this._toggleEdit.bind(this));
        EE.on('preview', this._preview.bind(this));
    }

    _rotate(elem){
        var value = parseInt(elem.getAttribute('data-value'));
        EE.trigger('editView', {
            command: 'rotate',
            value: value
        });
    }
    
    
    _scale(elem){
        var value = parseInt(elem.getAttribute('data-value'));
        EE.trigger('editView', {
            value: value,
            command: 'scale'
        });
    }
    
    
    
    _del(){
        EE.trigger('del', {});
    }
    
    
    _toggleEdit(options){
        if(options.action === 'hide'){
         this._editBtn.classList.add('disabled')   
        }else {
            this._editBtn.classList.remove('disabled');
        }
    }


    _editText(elem){
        if(elem.matches('.disabled'))return;
        EE.trigger('initEditText', null);
    }
    
    
    _preview(options){
        this._el.style.visibility = options.value;
        if(options.value === 'hidden'){
            this._el.style.opacity = 0;
        }else {
            this._el.style.opacity = 1;
        }
    }
}
