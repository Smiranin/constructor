var EE = {
    "subscribers": {},

    "on": function (event, cb) {
        var eventType = event || 'default';
        if(!this.subscribers[eventType]){
            this.subscribers[eventType] = [];
        }
        this.subscribers[eventType].push(cb);
    },



    "off": function () {
        
    },

    
    "trigger": function (event, options) {
        var sub = this.subscribers[event];

        for (var i = 0, len = sub.length; i < len; i++) {
            sub[i](options);
        }
    }
};
