app.controller("myIT", function ($scope, $window) {
            $scope.usuario = function(){
                $window.open('https://myit.claro.com.co:8443/ux/myitapp/')
            }
            $scope.usuario1 = function(){
                $window.open('https://myitfull.claro.com.co:8443/arsys/shared/login.jsp?/arsys/')
            }
});


