class ImgEditor extends Components{

    constructor(options){
        super(options);

        this.input = this._el.querySelector('#file');

        this.maxFileSize = 5000000;
        
        this._fbImages = null;
        this._instaImages = null;

        this._el.addEventListener('click', this.router.bind(this));
        this.input.addEventListener('change', this._load.bind(this));

        EE.on('showUploadPanel', this._togglePanel.bind(this));
        EE.on('saveDataApi', this._saveDataApi.bind(this));
    }


    _togglePanel(){
        this._el.classList.toggle('active_js');
    }


    _load(e){
        var file = e.target.files[0];
        if(!file)return;
        var msg = this._validateFile(file);
        if(msg){
            alert(msg);
            return;
        }

        var fileRider = new FileReader();
        var self = this;
        fileRider.onload = (function (file, self) {
            return function (e) {
                EE.trigger('load', {name: file.name, data: this.result});
                self._el.classList.remove('active_js');
            }
        })(file, self);
        fileRider.readAsDataURL(file);
    }


    _validateFile(file){
        if ( !file.type.match(/image\/(jpeg|jpg|png|gif)/) ) {
            return 'The photo must be in the format jpg, png or gif';
        }
        if ( file.size > this.maxFileSize ) {
            return 'File size should not exceed 5 MB';
        }
    }
    
    
    _instagram(){
        if(this._instaImages){
            this._showImages(this._instaImages);
        }else{
            InstagramServices.init();
        }
    }
    
    
    _facebook(){
        if(this._fbImages){
            this._showImages(this._fbImages);
        }else{
            FacebookServicesInit();
        }
    }
    
    
    _saveDataApi(options){
        if(options.api === 'fb'){
            this._fbImages = options.data;
        }else {
            this._instaImages = options.data;
        }
    }
    
    
    _showImages(data){
        var res = '';
        for (var i = 0, len = data.length; i < len; i++) {
            res += '<div data-action="_choice" class="img_box"><img class="img-responsive" src=' + data[i].url + '/></div>';
        }
        document.getElementById('instafeed').innerHTML = res;
        EE.trigger('toggleImgViewer', null);
    }

}