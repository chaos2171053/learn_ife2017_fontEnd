/**
 * 观察者构造函数
 * @constructor
 * @param {any} data 
 */
function Observer(data) {
    this.data = data
    this.watchers = {}
    this.walk(data)
    this.addWatcher(this.data)
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
    return this;
}
/**
 * 触发事件
 * @param {sring} type 
 */
p.emit = function (type) {
    let that = this;
    let handlerArgs = Array.prototype.slice.call(arguments, 1)
    if(!(type in this.watchers)) {
        return 
    }
    for (let i = 0, len = that.watchers[type].length; i < len; i++) {
        that.watchers[type][i].apply(that, handlerArgs)
    }
    return that
}
/**
 * 为每个key添加订阅
 * @param {Object} obj 
 */
p.addWatcher = function(obj) {
   for( let key in  obj) {
       if(obj.hasOwnProperty(key)) {
           this.watch(key,function(){
               let value = Array.prototype.splice.call(arguments,0)[0]
               if(typeof value ==='object') {
                   value = JSON.stringify(value)
               }
               console.log(`${key}的值变为${value}`)
           })
       }
   }
}
/**
 * 遍历构造函数中传入的对象
 * @param {object} obj 
 */
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
/**
 * 为对象设置键值对
 * @param {string} key 
 * @param {*} val 
 */
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
/**
 * 取消订阅事件
 * @param {string} key 键 
 * @param {funciton} fn 回调函数，不传则取消该键绑定的所有事件
 */
p.remove = function(key,fn){
    let fns = this.watchers[key]
    let len = fns.length
    // 如果key没有被人订阅，则直接返回
    if(!fns) {
        return false
    }
    // 如果没有传入具体的回调，取消该key所有订阅
    if(!fn) {
        fns && (fns.length = 0)
    }else {
        for(let i = 0;i<len;i++) {
            let _fn = fns[i]
            if(_fn===fn) {
                fns.slice(i,1)
            }
        }
    }
}
let app = new Observer({
    name: 'chaos',
    age: 24
});