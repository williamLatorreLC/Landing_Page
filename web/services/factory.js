(function() {
    'use strict';

    app.factory('servicio', servicio);

    servicio.$inject = ['$http'];

    function servicio($http) {
        return {
            host:"https://myit.claro.com.co:8443/myit/loginMyIT/",
            host2:"https://myit.claro.com.co:8443/myit/banners?estado=1",
            Post: Post,
            Get: Get
        };

        function Post(Params, Callbak){
            $http({
                url: this.host,
                method: 'POST',
                data:{"data":Params}
            }).then(function (res){
                Callbak(res.data);
            },function (res, data, status){
                Callbak(res);
            });
       }
       function Get(Paramas,Callbak){
           $http({
                url: this.host2,
                method: 'GET'
            }).then(function (res){
                Callbak(res.data);
            },function (res, data, status){
                Callbak(res);
            });
       }
       
    }
})();


