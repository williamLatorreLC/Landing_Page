var app = angular.module("myApp", ["ui.router", "ui.bootstrap", 'naif.base64',"blockUI"]);

var dataLayer = window.dataLayer = window.dataLayer || [];

app.directive("selectNgFiles", function() {
    return {
      require: "ngModel",
      link: function postLink(scope,elem,attrs,ngModel) {
        elem.on("change", function(e) {
          var files = elem[0].files;
          ngModel.$setViewValue(files);
        })
      }
    }
})

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
                .state('registroResolutor', {
                    url: "/registroResolutor",
                    templateUrl: "view/registroResolutor.html",
                    controller: "resolutorCtrl"
                })
                .state('listaCasos', {
                    url: "/listaCasos",
                    templateUrl: "view/listaCasos.html",
                    controller: "listaCasosCtrl"
                })
                .state('registroFinal', {
                    url: "/registroFinal",
                    templateUrl: "view/registroFinal.html",
                    controller: "registroCasosCtrl"
                })
        $locationProvider.html5Mode(false);
    }]).run(['$rootScope', '$http', '$state', 'blockUI', function ($rootScope) {

        var forceSSL = function () {
            if (window.location.protocol !== 'https:') {
                //window.location.href = window.location.href.replace("http:","https:");
            }
        };
        forceSSL();

        $rootScope.$on('$stateChangeStart', function (event, toState, fromState, next, current, $window, $location) {
            dataLayer.push({
                event: 'pages',
                attributes: {
                    route: window.location.href
                }
            });

        });
        
        $rootScope.idResolutor=5;
        
        $rootScope.Tagging = function (categoria, evento) {
            gtag('event', evento, {
                'event_category': categoria,
                'event_label': categoria + "-" + evento
            });
        };



    }]);