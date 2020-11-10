(function() {
    'use strict';

    app.factory('servicio', servicio);

    servicio.$inject = ['$http'];

    function servicio($http) {
        return {
            host:"https://claroteayuda.wigilabs.com/loginMyIT/",
            host2:"https://claroteayuda.wigilabs.com/banners?estado=1",
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


