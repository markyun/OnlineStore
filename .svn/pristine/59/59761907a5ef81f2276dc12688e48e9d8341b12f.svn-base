/**
 * Created by huangxinghui on 2015/2/5.
 */
define(function() {
    var apiUrl = "";
    $.ajax({
        url : 'app/busiConfig.json',
        dataType : 'json',
        success : function(config) {
            apiUrl = config.API_URL;
            app.cert_type = config.cert_type;
            app.customer_type = config.customer_type;
            app.payTypeList = config.payTypeList;
            app.cardTypeList = config.cardTypeList;
        }
    });
    var app = {
    	flag:null,//标记finishActvity执行次数
        root : '',
        user : null,
        // url 为资源和方法部分，data为js对象
        post : function(url, data, callback) {
            return $.ajax({
                url : apiUrl + url,
                type : 'post',
                dataType : 'json',
                headers: {
                	"app_key": "ff88b80a1369124e0f277f67c8542fcf"
                },
                contentType : 'application/json',
                data : JSON.stringify(data),
                success : callback,
                error : function(e) {
                    console.log(e);
                }
            });
        },
        // paramArr为get的参数数组
        get : function(url, paramArr, callback) {
            var restfulUrl = apiUrl + url;
            for(var i = 0; i < paramArr.length; i++) {
                restfulUrl += "/" + paramArr[i];
            }
            return $.ajax({
                url : restfulUrl,
                type : 'get',
                dataType : 'json',
                headers: {
                	"app_key": "ff88b80a1369124e0f277f67c8542fcf"
                },
                contentType : 'application/json',
                success : callback,
                error : function(e) {
                    console.log(e);
                }
            });
        }
    };

    $.ajax({
        url : 'app/flowconfig.json',
        dataType : 'json',
        success : function(config) {
            app.steps = config;
        }
    });
    $.ajax({
    	url:'app/flowpaid.json',
    	dataType:'json',
    	success:function(paid){
    		app.flow_steps = paid;
    	}
    });
    return app;
});