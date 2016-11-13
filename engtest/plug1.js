//测试实现
//注意contobj只存储持久数据 和dom相关的不能存储
Name = "hello";
UNameSpace = "hellodata";
this.Parse = function (tlnode, contobj) {
};
this.Render = function (tlnode, contobj, userdata) {
    var childs = GetAllChildren(tlnode);
    for (var t = 0; t < childs.length; ++t) {
        var c = childs[t];
        if (c.nodeName == '#text' && c.nodeValue == "hello") {
            c.nodeValue=userdata.text+userdata.num;//替换
        }
    }
};