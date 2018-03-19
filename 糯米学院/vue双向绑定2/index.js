/**
 * 观察者构造函数
 * @constructor
 * @param {any} data 
 */
function Observer(data) {
    this.data = data
    this.watchers = {}
    this.walk(data)
}

let p = Observer.prototype


/**
 * 监听者
 * @param {string} type 
 * @param {funciton} callback
 */
p.watch = function (type, callback) {
    if(!(type in this.watchers)) {
        this.watchers[type] = [];
    }
    this.watchers[type].push(callback);
    console.log(this.watchers)
    return this;
}
/**
 * 触发事件
 * @param {sring} type 
 */
p.emit = function (type) {
    let that = this;
    let handlerArgs = Array.prototype.slice.call(arguments, 1)
    for (let i = 0, len = that.watchers[type].length; i < len; i++) {
        that.watchers[type][i].apply(that, handlerArgs)
    }
    return that
}
p.walk = function (obj) {
    let val
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            val = obj[key]
            if (typeof val === 'object') {
                new Observer(val)
            }
        }
        this.convet(key, val)
    }
}
p.convet = function (key, val) {
    let that = this
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            return val
        },
        set: function (newVal) {
            if (typeof newVal == "object") {
                new Observer(newVal);
            }
            val = newVal
            that.emit(key,val)
            

        }
    })
}

p.$watch = function () {

}
let app = new Observer({
    name: 'chaos',
    age: 24
});

app.watch('age', function(age) {
    console.log(`我的年纪变了，现在已经是：${age}岁了`)
});