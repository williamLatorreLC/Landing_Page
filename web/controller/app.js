var app = angular.module("myApp", ["ui.router", "ui.bootstrap", ]);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {

        $urlRouterProvider.otherwise('/inicio');
        $stateProvider
                .state('inicio', {
                    url: "/inicio",
                    templateUrl: "view/preguntaAnita.html",
                    controller: "preguntaAnita"

                })
                .state('MyIT', {
                    url: "/MyIT",
                    templateUrl: "view/MyIT.html",
                    controller: "myIT"

                })
                .state('store', {
                    url: "/MyITStore",
                    templateUrl: "view/MyITStore.html",
                    controller: "myITstore"

                })

                .state('chat', {
                    url: "/chat",
                    templateUrl: "view/chat.html",
                    controller: "chatCtrl"

                })
        $locationProvider.html5Mode(false);
    }]).run(['$rootScope', '$http', '$state', function ($rootScope, $http, $state) {
        $rootScope.banner = true;
        $rootScope.botones = true;
        $rootScope.cerrar = false;
        $state.go('inicio');
        $rootScope.banners = [{"idbanners": 1, "ruta": "", "estado": 1}];

        $rootScope.myInterval = 5000;
        $rootScope.noWrapSlides = false;
        $rootScope.active = 0;
        
        $rootScope.cerrarchat = function(){
            $state.go("inicio"); 
        }

        $rootScope.getBanners = function () {
            $http({
                url: "https://claroteayuda.wigilabs.com/banners?estado=1",
                method: 'GET'
            }).then(function (res) {
                if (res.data.error == 0 && res.data.response.length > 0) {
                        $rootScope.banners = res.data.response;
                } 
            }, function (res, data, status) {
                console.log(res);
            });
        };

        $rootScope.getBanners();


    }])

        .filter("toURL", ['$sce', function ($sce) {
                return function (val) {
                    return $sce.trustAsResourceUrl(val);
                }
            }]).filter("toHtml", ['$sce', function ($sce) {
        return function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        }
    }]);





