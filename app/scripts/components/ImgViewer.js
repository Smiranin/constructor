class ImgViewer extends Components{
    
    constructor(options){
        super(options);

        this._imgBox = document.getElementById('instafeed');
        this.activeEl = this._el;

        this._el.addEventListener('click', this.router.bind(this));

        EE.on('successApi', this._viewImg.bind(this));
        EE.on('toggleImgViewer', this._togglePanel.bind(this));
    }
    
    
    _togglePanel(){
        this._el.classList.toggle('active_js');
    }


    _viewImg(options){
        this._imgBox.innerHTML = '';
        if(options.api === 'fb'){
            var res = '', data = options.data;
            if(data.length > 15) data.length = 15;
            for (var i = 0, len = data.length; i < len; i++) {
                res += '<div data-action="_choice" class="img_box"><img class="img-responsive" src=' + data[i].url + '/></div>';
            }
            document.getElementById('instafeed').innerHTML = res;
            EE.trigger('saveDataApi', options)
        }else {
            var self = this;
            var feed = new Instafeed({
                get: 'user',
                target: 'instafeed',
                userId: INSTAGRAM.user_id,
                accessToken: INSTAGRAM.access_token,
                sortBy: 'most-recent',
                limit: 15,
                resolution: 'standard_resolution',
                template: '<div data-action="_choice" class="img_box"><img class="img-responsive" src="{{image}}" /></div>',
                after: function () {
                    var data = self._prepareData(self._imgBox);
                    EE.trigger('saveDataApi', { data: data, api: 'inst' });
                }
            });
            feed.run();
        }
        this._togglePanel();
    }
    
    
    _prepareData(elem){
        var res = [];
        var images = elem.querySelectorAll('img');
        for (var i = 0; i < images.length; i++) {
            res.push({ url: images[i].src });
        }
        return res;
    }




    _choice(elem){
        var img = new Image();
        img.setAttribute('crossorigin','anonymous');
        img.src = elem.firstElementChild.src;

        img.onload = () => {
            var canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            document.body.appendChild(canvas);

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var file = canvas.toDataURL('image/jpg');

            document.body.removeChild(canvas);

            EE.trigger('load', {
                name: 'photo.jpg',
                data: file
            });

            EE.trigger('showUploadPanel', null);
            this._togglePanel();
            this._imgBox.innerHTML = '';
        };
    }
}
