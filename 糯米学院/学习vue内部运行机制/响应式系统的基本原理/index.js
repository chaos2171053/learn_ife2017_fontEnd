function defineReactive(obj, key, val) {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            dep.addSub(Dep.target)
            return val
        },
        set(newVal) {
            if (newVal === val) return
            dep.notify()
        }
    })
}
function cb(val) {
    console.log(`${val}`)
}

function observer(value) {
    if (!value || (typeof value !== 'object')) {
        return
    }

    Object.keys(value).forEach(key => {
        defineReactive(value, key, value[key])
    })
}
class Vue {
    constructor(options) {
        this._data = options.data
        observer(this._data)
        new Watcher()

        console.log('render', this._data.test)
    }


}

class Dep {
    constructor() {
        this.subs = []
    }
    addSub(sub) {
        this.subs.push(sub)
    }
    notify() {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}


class Watcher {
    constructor() {
        Dep.target = this
    }

    update() {
        console.log('视图更新啦')
    }
}


class VNode {
    constructor(tag, data, children, text, elm) {
        /*当前节点的标签名*/
        this.tag = tag;
        /*当前节点的一些数据信息，比如props、attrs等数据*/
        this.data = data;
        /*当前节点的子节点，是一个数组*/
        this.children = children;
        /*当前节点的文本*/
        this.text = text;
        /*当前虚拟节点对应的真实dom节点*/
        this.elm = elm;
    }
}

function createEmptyVNode() {
    const node = new VNode();
    node.text = '';
    return node;
}
function createTextVNode(val) {
    return new VNode(undefined, undefined, undefined, String(val));
}
function cloneVNode(node) {
    const cloneVnode = new VNode(
        node.tag,
        node.data,
        node.children,
        node.text,
        node.elm
    );
    return cloneVnode;
}

Dep.target = null


let o = new Vue({
    data: {
        test: "I am test."
    }
});