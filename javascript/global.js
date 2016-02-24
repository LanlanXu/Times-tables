//全局计算字体大小
var objectPrototype = Object.prototype;
var CallBack = {};
//扩展格式化时间方法
Date.prototype.format = function(format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
$.extend($,{
    isArray : function(value)
    {
        return objectPrototype.toString.apply(value) === '[object Array]';
    },
    isString : function(value)
    {
        return typeof value === 'string';
    },
    /**
     */
    isEmpty : function(value)
    {
        return (value === null) || (value === undefined) || ((core.isArray(value) && !value.length));
    },
    isFunction: function(value) {
        return objectPrototype.toString.apply(value) === '[object Function]';
    },
    isObject: function(value) {
        return !!value && !value.tagName && objectPrototype.toString.call(value) === '[object Object]';
    },
    /**
     */
    packing : function(elems)
    {
        if(elems instanceof $)
        {
            return elems;
        }
        else if($.isArray(elems) || elems.nodeType)
        {
            return $(elems);
        }
        else if($.isString(elems))
        {
            if(elems.indexOf('#')>=0 || elems.indexOf('.')>0)
            {
                return $(elems);
            }
            else
            {
                return $('#'+elems);
            }
        }
        else
        {
            return $([]);
        }
    },
    /**
     */
    nameSpace : function()
    {
        var a = arguments,
            o = null,
            globalObj,
            i = 1,
            j,
            d,
            arg;
        if(window[arguments[0]])
        {
            globalObj = window[arguments[0]];
        }
        else
        {
            window[arguments[0]] = {};
        }
        for(;i<a.length;i++)
        {
            o   = window[arguments[0]];
            arg = arguments[i];
            if(arg.indexOf('.'))
            {
                d = arg.split('.');
                for(j=0;j<d.length;j++)
                {
                    o[d[j]] = o[d[j]] || {};
                    o       = o[d[j]];
                }
            }
            else
            {
                o[arg] = o[arg] || {};
            }
        }
        return;
    }
});
$.extend($, {
    getPageSize: function () {
        var xScroll, yScroll;
        if (window.innerHeight && window.scrollMaxY) {
            xScroll = window.innerWidth + window.scrollMaxX;
            yScroll = window.innerHeight + window.scrollMaxY;
        } else {
            if (document.body.scrollHeight > document.body.offsetHeight) {
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight;
            } else {
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight;
            }
        }
        var windowWidth, windowHeight;
        if (self.innerHeight) {
            if (document.documentElement.clientWidth) {
                windowWidth = document.documentElement.clientWidth;
            } else {
                windowWidth = self.innerWidth;
            }
            windowHeight = self.innerHeight;
        } else {
            if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else {
                if (document.body) {
                    windowWidth = document.body.clientWidth;
                    windowHeight = document.body.clientHeight;
                }
            }
        }
        if (yScroll < windowHeight) {
            pageHeight = windowHeight;
        } else {
            pageHeight = yScroll;
        }
        if (xScroll < windowWidth) {
            pageWidth = xScroll;
        } else {
            pageWidth = windowWidth;
        }
        return {
            'pageWidth': pageWidth,
            'pageHeight': pageHeight,
            'windowWidth': windowWidth,
            'windowHeight': windowHeight
        }
    },
    getElementPosLeft: function (element) {
        var actualLeft = element.offsetLeft,
            current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        if (document.compatMode == "BackCompat") {
            var elementScrollLeft = document.body.scrollLeft;
        } else {
            var elementScrollLeft = document.documentElement.scrollLeft;
        }
        return actualLeft - elementScrollLeft;
    },
    getElementPosTop: function (element) {
        var actualTop = element.offsetTop,
            current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        if (document.compatMode == "BackCompat") {
            var elementScrollTop = document.body.scrollTop;
        } else {
            var elementScrollTop = document.documentElement.scrollTop;
        }
        return actualTop - elementScrollTop;
    },

    getMicroTime: function(time) {
        if (time) {
            return (new Date(time.replace(/-/g, "/"))).getTime();
        }
        else {
            return (new Date()).getTime();
        }
    },
    getNormalTime: function(microtime, timeformat) {
        var defaultformat = 'yyyy-MM-dd hh:mm';
        if (timeformat) {
            defaultformat = timeformat;
        }
        return new Date(microtime).format(defaultformat);
    },
    getDefaultTime: function(FromTime) {
        var todaymicro = parseInt($.getMicroTime()) + 2 * 24 * 60 * 60 * 1000,
            todaymicro2 = todaymicro + 2 * 24 * 60 * 60 * 1000,
            tomorrow1 = $.getNormalTime(todaymicro, "yyyy-MM-dd") + ' ' + FromTime,
            tomorrow2 = $.getNormalTime(todaymicro2, "yyyy-MM-dd") + ' ' + FromTime;
        return {
            day1: tomorrow1,
            day2: tomorrow2
        }
    },
    getShopHours : function(FromTime,ToTime)
    {
        var fromarr = FromTime.split(':'),
            toarr = ToTime.split(':');
        var len = (parseInt(toarr[0]) - parseInt(fromarr[0])) * 2 - 1;
        var arr = [], i = 0, add = 0, start = parseInt(fromarr[0]) + 1;
        if (fromarr[1] == '00') {
            arr.push(fromarr[0] + ':00');
            arr.push(fromarr[0] + ':30');
        }
        else {
            arr.push(fromarr[0] + ':30');
        }
        for (i; i < len; i++) {
            if (add == 0) {
                add = 1;
                if (start < 10) {
                    arr.push('0' + start + ':00');
                }
                else {
                    arr.push(start + ':00');
                }
            }
            else {
                add = 0;
                if (start < 10) {
                    arr.push('0' + start + ':30');
                }
                else {
                    arr.push(start + ':30');
                }
            }
            if (add == 0) {
                start++;
            }
        }
        if (toarr[1] == '30') {
            arr.push(start + ':30');
        }
        return arr;
    },
    getUrl: function (api, options) {
        var url = BASEURL + api + '?';
        for (var i in options) {
            url = url + i + '=' + options[i] + '&';
        }
        return url.substring(0, url.length - 1);
    },
    getStrLen: function (str) {
        return str.replace(/[^\x00-\xff]/g, "**").length;
    },
    getUrlData: function () {
        var url = window.location.href,
            urlstr = url.split('?')[1];
        if (urlstr) {
            var urlarr = urlstr.split('&'),
                data = {};
            $(urlarr).each(function () {
                var arr = (this + '').split('=');
                data[arr[0]] = arr[1];
            });
            return data;
        }
        else {
            return false;
        }
    },
    urlData: function() {
        var href = window.location.href,
            thisdata,
            data = {};
        href = href.split('?')[1];
        if (href) {
            href = href.split('&');
            $.packing(href).each(function() {
                thisdata = this.split('=');
                data[thisdata[0]] = thisdata[1];
            });
            return data;
        }
        else {
            return data;
        }
    },
    //全局AJAX LOADING遮罩页面
    loadingStart: function () {
        var mypage = $.getPageSize();
        if (document.getElementById('jsLoadingStart') == null) {
            var odiv = document.createElement('div'),
                odiv2 = document.createElement('div'),
                odiv3 = document.createElement('div'),
                body = document.getElementsByTagName('body')[0],
                oimg = document.createElement('img');
            oimg.src = '../images/loading9.gif';
            odiv.id = 'jsLoadingStart';
            $(odiv).css({
                'position': 'absolute',
                'left': '0px',
                'top': '0px',
                'z-index': '999999',
                'width': mypage.pageWidth,
                'height': mypage.pageHeight
            });
            $(oimg).css({
                'position': 'fixed',
                'width': '2em',
                'height': '2em',
                'left': '50%',
                'margin-left': '-1em',
                'top': '50%',
                'margin-top': '-1em'
            });
            $(odiv3).css({
                'position': 'absolute',
                'z-index': '2',
                'left': '0px',
                'top': '0px',
                'width': '100%',
                'height': '100%'
            });
            $(odiv2).addClass('jsmask');
            $(body).append(odiv);
            $(odiv).append(odiv2);
            $(odiv).append(odiv3);
            $(odiv3).append(oimg);

        }
        else {
            $('#jsLoadingStart').css({
                'width': mypage.pageWidth,
                'height': mypage.pageHeight
            });
            $('#jsLoadingStart').css('display', 'block');
        }

    },
    //关闭LOADING遮罩
    loadingEnd: function () {
        $('#jsLoadingStart').css('display', 'none');
    },
    easyErrorBox: function (str, callback) {
        var mypage = $.getPageSize();
        if (document.getElementById('jserrorbox') == null) {
            var odiv = document.createElement('div'),
                body = document.getElementsByTagName('body')[0],
                html = "<div class='errormask'></div>" +
                       "<div class='errorboxbg'></div>";
            $(body).append(odiv);
            odiv.id = 'jserrorbox';
            $(odiv).addClass('jsmsgbox');
            $(odiv).append(html);
            $('#jserrorbox').css('height', mypage.pageHeight);
        }
        $('#jserrorbox').css('height', mypage.pageHeight);
        $('#jserrorbox').css('display', 'block');
        $('#jserrorbox').find('div.mask').css({
            'width': mypage.pageWidth,
            'height': mypage.pageHeight
        });
        $('#jserrorbox').find('div.errorboxbg').empty();
        $('#jserrorbox').find('div.errorboxbg').append(str);
        window.setTimeout(function () {
            $('#jserrorbox').css('display', 'none');
            if ($.isFunction(callback)) {
                callback();
            }
        }, 2000)
    }
   
});

