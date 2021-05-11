app.factory('servicios', function ($http) {
    return {
        host: "./api/",
        Post: Post,
        Get: Get
    };

    function Post(url, Params, Callbak) {
        var data = encodeURIComponent();
        $http({
            url: this.host+url,
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            data: { "data": Params }
        }).then(function (res) {
            Callbak(res.data);
        }, function (res, data, status) {
            Callbak(res);
        });
    }
    
    function Get(url, Callbak) {
        $http({
            url: this.host+url,
            method: 'GET'
        }).then(function (res) {
            Callbak(res.data);
        }, function (res, data, status) {
            Callbak(res);
        });
    }

})


