class Components {

    constructor(options){
        this._el = options.elem;
        this.activeEl = null;

        this._isActive = false;
        this._onDocClick = this._onDocClick.bind(this);
    }



    router(e){
        var target = e.target;
        var elem = target.closest('[data-action]');
        if(!elem) return;
        var action = elem.getAttribute('data-action');
        this[action](elem, target);
    }


    
    _onDocClick(e){
        if (!this.activeEl.contains(e.target)) this._close();
    }

    

    toggle (elem){
        this.activeEl = elem || this.activeEl;
        if(!this._isActive){this.open()}
        else{this._close()}
    }



    open(){
        this.activeEl.classList.add('active_js');
        document.addEventListener('click', this._onDocClick);
        this._isActive = true;
    }



    _close(){
        this.activeEl.classList.remove('active_js');
        document.removeEventListener('click', this._onDocClick);
        this._isActive = false;
    }
}
