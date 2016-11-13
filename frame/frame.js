String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof  (args) == "object") {
            for (var key  in  args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {           //var reg = new RegExp("({[" + i + "]})", "g");//这个在索引大于9时会有问题，谢谢何以笙箫的指出

                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
}
Array.prototype.contains = function (item) {
    return RegExp("\\b" + item + "\\b").test(this);
};
Object.prototype.clear = function () {
    for (var t in this) {
        delete eles[t];
    }
}
//基础库函数区域
var initlist = [];

function addinit(fun) {
    if (!(fun in initlist)) {
        initlist.push(fun);
    }
    if (window.isloaded == true) fun();
}
window.onload = function () {
    window.isloaded = true; //必须放在前面 否则初始化列表中的函数又添加新的init函数时 addinit不能正确处理
    for (var i = 0; i < initlist.length; i++) {
        var fun = initlist[i];
        fun();
    }
};
//以上为启动框架
//以下为基础环境设置
//基础环境构造目的在于让所有有id的标签都可以被直接访问
//
//扫描dom的函数 把所有有id节点都加入container中
function scandom(ele, container) {
    var clist = ele.childNodes;
    for (var i = 0; i < clist.length; ++i) {
        var cele = clist[i];
        if (cele.nodeName.toLowerCase() == '#text') continue; //如果是文本就跳过，此为递归收敛条件
        if (cele.id != '') {
            //加入eles
            eval("container.{0}=document.getElementById('{1}');".format(cele.id, cele.id));
            //以上添加对应对象进去
        }
        if (cele.hasChildNodes()) {
            //递归调用
            scandom(cele, container); //递归处理当前dom节点
        }
    }
}
var eles = {};
addinit(function () {
    //这里扫面body内所有节点 并保存有id的部分
    var body = document.body;
    scandom(body, eles); //扫面整个文档
});
//以下为工具函数
function StyleSet(node) {
    //状态集类
    this.node = node;
    this.set = {}; //状态集合
    this.push = function (stylename) {
        //这是改变node的style的函数
        if (this.set[stylename] == undefined) {
            //如果没有保存了初始状态
            this.set[stylename] = this.node.style[stylename]; //保存初始状态
        }
    };
    this.pusharray = function (snames) {
        for (var i = 0; i < snames.length; i++) this.push(snames[i]);
    }
    this.close = function () {
        for (var t in this.set) {
            this.node.style[t] = this.set[t]; //
        }
    }
}

function GetStringFormArray(arr, schar) {
    var ret = "";
    for (var i = 0; i < arr.length; i++) {
        ret += arr[i];
        ret += schar;
    }
    return ret;
}
//类操作函数
Element.prototype.GetClasses = function () {
    return this.className.split(' ');
}
//添加类
Element.prototype.addClass = function (classname) {
    var classes = this.GetClasses();
    classes.push(classname);
    this.className = GetStringFormArray(classes, ' ');
}
//删除类
Element.prototype.removeClass = function (classname) {
    var classes = this.GetClasses();
    if (classes.contains(classname)) {
        var index = classes.indexOf(classname);
        classes.splice(index, 1);
        this.className = GetStringFormArray(classes, ' ');
    }
}
//此函数设计错误，js单线程 异步是用任务队列实现的 无法实现此功能
//function sleep(ms) {
//    var isend = false;
//    setTimeout(function () {
//        isend = true;
//    }, ms);
//    while (!isend);
//}
var loader = {};
loader.toText = function (obj) {
    //把字典转换为字符串
    var str = "";
    for (var prop in obj) {
        str += prop + "=" + obj[prop] + "&"
    }
    return str.substr(0, str.length - 1);
};
loader.load = function (url, met, fun, async, data) {
    if (async == undefined || async == null) async = true; //默认同步模式
    var xhr = new XMLHttpRequest();
    xhr.open(met, url, async);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var text = xhr.responseText;
            fun(text);
        }
    }
    if (met == 'POST') {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(loader.toText(data));
    }
    else xhr.send();
}
loader.loadfile = function (url, fun, async) {
    loader.load(url, "GET", fun, async);
}
loader.loadfileOfPost = function (url, fun, async, data) {
    loader.load(url, 'POST', fun, async, data);
}
loader.getTextFromUrl = function (url) {
    var ret = null;
    var fun = function (str) {
        ret = str;
    }
    loader.loadfile(url, fun, false); //同步加载
    return ret;
}
loader.getTextFromUrlP = function (url, data, afun) {
    //此函数允许异步加载，异步加载返回null
    //此函数使用post获取远端数据
    var ret = null;
    var sfun = function (str) {
        ret = str;
    }
    if (afun == undefined || afun == null) {
        //同步模式
        loader.loadfileOfPost(url, sfun, false, data);
        return ret;
    }
    else {
        //异步模式
        loader.loadfileOfPost(url, afun, true, data);
        return null;
    }
};
loader.loadToNode = function (node, url) {
    loader.loadfile(url, function (text) {
        node.innerHTML = text;
        //以下取出页面的js标签执行 只扫描一级子节点
        var nodes = node.childNodes;
        for (var t = 0; t < nodes.length; ++t) {
            var tnode = nodes[t];
            if (tnode.tagName == 'SCRIPT') {
                var str = tnode.innerHTML;
                eval(str);
                var t = {};
            }
        }
    });
}
//类批量操作
function classReset(oclass, nclass) {
    var nodes = document.getElementsByClassName(oclass);
    var length = nodes.length;
    for (var t = 0; t < length; t++) {
        var node = nodes[0]; //html集合会自动根据情况变化所以reset时需要这样重复访问第一个
        node.removeClass(oclass);
        node.addClass(nclass);
    }
}

function classAppend(oclass, nclass) {
    //为某个类的所有节点添加新类
    var nodes = document.getElementsByClassName(oclass);
    for (var t = 0; t < nodes.length; t++) {
        var node = nodes[t];
        node.addClass(nclass); //直接添加不删除
    }
}
//以下是批量操作函数
function testAny(list, fun) {
    //测试如果有任何一个为真则真
    var ret = false;
    for (var t = 0; t < list.length; ++t) {
        var item = list[t];
        if (fun(item)) ret = true;
    }
    return ret;
}

function testAll(list, fun) {
    var ret = true;
    for (var t = 0; t < list.length; ++t) {
        var item = list[t];
        if (!fun(item)) ret = false;
    }
    return ret;
}

function GetAllChildren(fnode) {
    //获取子孙节点列表
    var nfun = function (node, isone) {
        var ret = [];
        if (!node.hasChildNodes && isone == false) return [node];
        var cnodes = node.childNodes;
        for (var t = 0; t < cnodes.length; t++) {
            var tnode = cnodes[t];
            ret.push(tnode);
            if (tnode.hasChildNodes) {
                var ccnodes = nfun(tnode, false);
                for (var s = 0; s < ccnodes.length; ++s) {
                    ret.push(ccnodes[s]); //加入所有其子节点
                }
            }
        }
        return ret;
    };
    var ret = nfun(fnode, true);
    return ret;
}
//动态脚本调试钩子函数
function dynamicscript_debug() {
}

//数据操作函数

function Marge(cont,extr) {
    //dict合并函数
    for(var t in extr){
        //合并
        var edata=extr[t];
        if(typeof(edata)!="object"||typeof(cont[t])!="object"){
            //如果不是对象类型与对象类型的合并 则直接替换
            cont[t]=edata;
            return;
        }
        //下面是是对象类型|与对象类型的情况
        if(!(t in cont)){
            //若原容器中没有一样的元素 就直接插入
            cont[t]=edata;
        }
        else{
            //否则则不插入 并检查此元素中是否有可以插入的数据
            Marge(cont[t],edata);//以cont的元素t为容器 extr[t]为附加数据 合并子容器
        }
    }
}