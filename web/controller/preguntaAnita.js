app.controller("preguntaAnita", function ($scope,$rootScope,servicio,$state) {
    $scope.showAnita = true;
    $scope.showLogin = false;
    $scope.loginMovil = true;
    $scope.toggle =false;
    $rootScope.banner=true;
    $rootScope.botones=true;
    $rootScope.cerrar = false;
    
    $scope.data = {user: "", pass: ""};
    
    
    $scope.showlogin = function () {
        $scope.showAnita = true;
        $scope.showLogin = true;
    }
    $scope.showLoginChat = function () {
        $scope.loginMovil = false;
        $scope.showAnita = false;
        
    }
    $scope.hideLogin = function () {
        $scope.loginMovil = true;
        $scope.showAnita = true;
    }
    $scope.iconoojo = 'password'; 
    
    $scope.showCambio = function (){
        if($scope.iconoojo === "password"){
        $scope.iconoojo = "text";
        $scope.toggle = !$scope.toggle;
        }
        else{
        $scope.iconoojo = "password";
        $scope.toggle = !$scope.toggle;
        }  
    }

    
    $scope.loginmyIt = function () {
        if ($scope.data.user !== "") {
            if ($scope.data.pass !== "") {
                servicio.Post($scope.data, function (Data) {
                    if (Data.isError === false) {
                        Data.response.Departament=Data.response.Departament.replace(/&/g,"");
                        Data.response.Job_Title=(Data.response.Job_Title!=undefined)?Data.response.Job_Title.replace(/&/g,""):"";
                        $rootScope.chatURL = encodeURI('/myit/chatbot/?First_Name=' + Data.response.First_Name + '&Last_Name=' + Data.response.Last_Name + '&ProfileId=' + Data.response.ProfileId + '&Support_Staff=' + Data.response.Support_Staff + '&Profile_Status=' + Data.response.Profile_Status + '&Organization=' + Data.response.Organization + '&Departament=' + Data.response.Departament + '&Job_Title=' + Data.response.Job_Title + '&User_ID=' + $scope.data.user + '&Internet_Email=' + Data.response.Internet_Email + '&User_Profile=' + Data.response.ProfileId + '&Site=' + Data.response.Site);
                        $scope.hideLogin();
                        $('#myModal').modal('hide');
                        if ($('.modal-backdrop').is(':visible')) {
                          $('body').removeClass('modal-open'); 
                          $('.modal-backdrop').remove(); 
                         };
                       $state.go("chat");
                    } else {
                        swal({
                            type: 'error',
                            title: 'Error',
                            text: 'Por favor intentar nuevamente'
                        });
                    }
                });
            } else {
                swal({
                    type: 'error',
                    title: 'Error',
                    text: 'Debes ingresar una contraseña'
                });
            }
        } else {
            swal({
                type: 'error',
                title: 'Error',
                text: 'Debes ingresar un usuario'
            });
        }
    };
});
