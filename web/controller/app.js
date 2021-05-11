var app = angular.module("myApp", ["ui.router", "ui.bootstrap", "blockUI"]);

var dataLayer = window.dataLayer = window.dataLayer || [];

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'blockUIConfig', function ($stateProvider, $urlRouterProvider, $locationProvider, blockUIConfig) {

        // Tell blockUI not to mark the body element as the main block scope.
        blockUIConfig.autoInjectBodyBlock = false;

        $urlRouterProvider.otherwise('/login');
        $stateProvider

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
    }]).run(['$rootScope', '$http', '$state', 'blockUI', function ($rootScope) {

        $rootScope.$on('$stateChangeStart', function (event, toState, fromState, next, current, $window, $location) {
            console.log(window.location.href);
            dataLayer.push({
                event: 'pages',
                attributes: {
                    route: window.location.href
                }
            });

        });

        $rootScope.Tagging = function (categoria, evento) {
            gtag('event', evento, {
                'event_category': categoria,
                'event_label': categoria + "-" + evento
            });
        };



    }]);