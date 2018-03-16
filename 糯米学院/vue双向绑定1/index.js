/**
 * 观察者构造函数
 * @constructor
 * @param {any} data 
 */
function Observer(data) {
    this.data = data
    this.walk(data)
}

let p = Observer.prototype


p.walk = function (obj) {
    let val
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            val = obj[key]
            if (typeof val === 'object') {
                new Observer(val)
            }

            this.convet(key, val)
        }
    }
}
p.convet = function (key, val) {
    Object.defineProperty(this.data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            console.log('访问key：', key)
            return val
        },
        set: function (newVal) {
            console.log('设置key:' + key + '为:' + newVal)
            if (newVal === val) return
            val = newVal
        }
    })
}

let app1 = new Observer({
    name: 'youngwind',
    age: 25
  });
  
  let app2 = new Observer({
    university: 'bupt',
    major: 'computer'
  });

app1.data.name
app1.data.age = 100
app2.data.university 
app2.data.major = 'science' 