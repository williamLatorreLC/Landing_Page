var app = angular.module("myApp", ["ui.router", "ui.bootstrap","blockUI"]);
app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider','blockUIConfig', function ($stateProvider, $urlRouterProvider, $locationProvider,blockUIConfig) {

  // Tell blockUI not to mark the body element as the main block scope.
  blockUIConfig.autoInjectBodyBlock = false;  

    $urlRouterProvider.otherwise('/login');
    $stateProvider
        /* .state('inicio', {
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
        .state('NuevaRuta', {
            url: "/MyITStore",
            templateUrl: "view/MyITStore.html",
            controller: "myITstore"
        })
        .state('chat', {
            url: "/chat",
            templateUrl: "view/chat.html",
            controller: "chatCtrl"
        }) */
        // rediseño
        .state('home', {
            url: "/home",
            templateUrl: "view/home.html",
            controller: "homeCtrl"
        })
        .state('login', {
            url: "/login",
            templateUrl: "view/login.html",
            controller: "loginCtrl"
        })
         .state('chat', {
            url: "/chat",
            templateUrl: "view/chat.html",
            controller: "chatCtrl"
        })
        .state('estadisticas', {
            url: "/estadisticas",
            templateUrl: "view/estadisticas.html",
            controller: "estadisticasCtrl"
        })
    $locationProvider.html5Mode(false);
}]).run(['$rootScope', '$http', '$state', 'blockUI', function ($rootScope, $http, $state, blockUI) {
    //$state.go('login');

}])
// .filter("toURL", ['$sce', function ($sce) {
//     return function (val) {
//         return $sce.trustAsResourceUrl(val);
//     }
// }]).filter("toHtml", ['$sce', function ($sce) {
//     return function (htmlCode) {
//         return $sce.trustAsHtml(htmlCode);
//     }
// }])