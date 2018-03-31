
function Vue(option) {
    this.el = option.el
    this.data = option.data
    this.walk(this.data)
    this.watchers = {}
    this.Observer(this.data)
}

let v = Vue.prototype

v.Observer = function (obj) {
    this.addWatch(obj)
}
v.addWatch = function (obj) {
    var key
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (typeof key === 'object') {
                this.addWatch(obj)
            }
            this.watch(key, function () {
                var val = Array.prototype.splice.call(arguments, 0)[0]
                if (typeof val === 'object') {
                    val = JSON.stringify(val)
                }
                console.log(key + '的值变为' + val)
            })
        }
    }
}
v.watch = function (key, callback) {
    if(!this.watchers){
        return 
    }
    if (!(key in this.watchers)) {
        this.watchers[key] = []
    }
    this.watchers[key].push(callback)
    return this
}
v.emit = function (key) {
    var i,
        that = this,
        argumentsArray = Array.prototype.slice.call(arguments, 1),
        watch = that.watchers[key],
        len = watch.length;
    if (!(key in that.watchers)) {
        return
    }
    for (i = 0; i < len; i++) {
        watch[i].apply(that, argumentsArray)
    }

    return that
}
v.remove = function (key, fn) {
    var that = this,
        fns = that.watchers[key],
        i =0,
        _fn,
        len=fns.length;
    if (!fns) {
        return false
    }
    if (!fn) {
        fns && (fns.length = 0)
    }else {
        for(;i<len;i++){
            _fn = fns[i]
            if(_fn === fn) {
                fns.slice(i,1)
            }
        }
    }
}
v.walk = function (obj) {
    var val, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            val = obj[key]
            if (typeof val === 'object') {
                this.Observer(val)
            }
        }
        this.convet(obj, key, val)
    }
    return this
}
v.convet = function (obj, key, val) {
    var that = this
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log(key+'的值为'+val)
            return val
        },
        set: function (newVal) {
            if(typeof newVal === 'object') {
                new this.Observer()
            }
            that.emit(key,newVal)
            val = newVal
        }
    })
}
let app = new Vue({
    el: '#app',
    data: {
        name: {
            firstName: {
                name: 'chaos'
            },
            lastName: '666'
        },
        age: 25
    }

});
