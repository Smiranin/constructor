class AjaxServices {

    static ajax(url, options){
        var method = options.method || 'GET';
        var data = options.data || '';

        var xhr = new XMLHttpRequest();

        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.send(data);

        xhr.onload = function () {
            if(xhr.status !== 200){
                console.error('Ошибка' + xhr.status);
            }else {
                options.cb(xhr.responseText);
            }
        }
    }


    static promise(url, options){
        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            var method = options.method || 'GET';
            var data = options.data || '';

            xhr.open(method, url, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

            xhr.onload = () => {
                if (xhr.status != 200) {
                    handleError();
                } else {
                    resolve();
                }
            };

            xhr.onerror = handleError;

            xhr.send(data);

            function handleError() {
                reject(new Error(xhr.status + ': ' + xhr.statusText));
            }
        });
    }
}