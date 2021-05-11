app.controller("loginCtrl", function ($scope, servicios, blockUI,$state,$rootScope) {

    
    var block = blockUI.instances.get('screenBlockUI');

    $scope.usuario = {
        user: "",
        pass: ""
    };
    
    $rootScope.userData={};
    
    $rootScope.Tagging("Login","pt_login");


    $scope.login = function () {
        $rootScope.Tagging("Login","bt_login_iniciarsesion");
        if ($scope.usuario.user !== "" && $scope.usuario.pass !== "") {
            block.start('Cargando...');
            servicios.Post('loginMyIT', $scope.usuario, function (Data) {
                block.stop();
                if (Data.isError === false) {
                    Data.response.User=$scope.usuario.user;
                    Data.response.Pass=$scope.usuario.pass;
                    $rootScope.userData=Data.response;
                    sessionStorage.X_MYIT_INFO=Data.response.token;
                    sessionStorage.X_MYIT_REQ=Data.response.req;
                    $state.go("home");
                } else {
                    console.log(Data);
                    swal({
                        title: 'Error',
                        text: Data.response,
                        confirmButtonColor: "#dc3545",
                        confirmButtonText: "aceptar"
                    });
                }
            });
        } else {
            swal({
                title: "",
                text: "Ingresa usuario y contraseña",
                confirmButtonColor: "#dc3545",
                confirmButtonText: "aceptar"
            });
        }
    }


});
