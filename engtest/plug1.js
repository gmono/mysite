//测试实现
Name = "hello";
UNameSpace = "hello";
this.Parse = function (tlnode, contobj) {
    contobj.list = [];
    var childs = GetAllChildren(tlnode);
    for (var t = 0; t < childs.length; ++t) {
        var c = childs[t];
        if (c.nodeName == '#text' && c.nodeValue == "hello") {
            contobj.list.push(c);
        }
    }
};
this.Render = function (tlnode, contobj, userdata) {
    //测试 把userdata里面test对应的值替换到contobj
    for ()
};