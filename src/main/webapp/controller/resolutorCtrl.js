app.controller("resolutorCtrl", function ($scope, $window, $state, servicios, $rootScope, blockUI, $uibModal, $document) {
    var block = blockUI.instances.get('screenBlockUI');
    $scope.infoTicket = {requisitos: "", DOCUMENTOS: []};
    $scope.InfoAdicional = [1];
    $scope.estados = [];
    $scope.codigos = [];

    $scope.init = function () {
        if (sessionStorage.X_MYIT_LAND != null
                && sessionStorage.X_MYIT_LAND != ""
                && sessionStorage.X_MYIT_LAND != undefined) {
            $rootScope.infoUser = $rootScope.userData;
            if ($rootScope.userData == null || $rootScope.userData == undefined) {
                $scope.getInfo();
            } else {
                console.log($rootScope.infoUser);
                $scope.getParametrizations();
            }
        } else {
            $state.go('login');
        }
    };

    $scope.modalValidateSubmitCase = function (type) {
        if ($scope.infoTicket.ESTADO == '3000' && (!$scope.infoTicket.CODIGODECIERRE)) {
            swal({
                title: '',
                text: "Debes completar el campo código de cierre.",
                confirmButtonColor: "#dc3545",
                confirmButtonText: "aceptar"
            });
            return;
        } else if ($scope.infoTicket.ESTADO == '3000' && (!$scope.infoTicket.RESOLUCION)) {
            swal({
                title: '',
                text: "Debes completar el campo resolución.",
                confirmButtonColor: "#dc3545",
                confirmButtonText: "aceptar"
            });
            return;
        } else {
            swal({
                title: '',
                text: "¿Estás seguro de gestionar el caso?",
                confirmButtonColor: "#c62f3d",
                confirmButtonText: "Aceptar",
                showCancelButton: true,
                cancelButtonColor: "#d9d9d9",
                cancelButtonText: "Cancelar",
                cancelButtonClass: 'parraf'
            }).then(function (result) {
                if (result.value) {
                    $scope.infoTicket.USUARIO = $rootScope.infoUser.User;
                    $scope.infoTicket.NOMBREUSUARIO = $rootScope.infoUser.First_Name + " " + $rootScope.infoUser.Last_Name;
                    console.log($scope.infoTicket);
                    block.start('Cargando...');
                    servicios.Post("casos/gestionResolutor", $scope.infoTicket, function (Data) {
                        block.stop();
                        if (Data.isError === false) {
                            swal({
                                title: '',
                                text: Data.response,
                                confirmButtonColor: "#dc3545",
                                confirmButtonText: "aceptar"
                            });
                            $state.go('listaCasos');
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
                }
            });
        }

    };

    $scope.getInfo = function () {
        block.start('Cargando...');
        servicios.Post("utils/dec", {
            "token": sessionStorage.X_MYIT_LAND
        }, function (Data) {
            block.stop();
            if (Data.isError === false) {
                $rootScope.infoUser = Data.response.map;
                setTimeout(function () {
                    $scope.$apply();
                    $scope.getParametrizations();
                }, 200);
            } else {
                $state.go('login');
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            }
        });
    };

    $scope.getParametrizations = function () {
        $scope.getDataCasoSessionStorage();
        block.start('Cargando...');
        servicios.Post('obtenerListas/parametrizacion', {
            "lineaServicio": $scope.infoTicket.LINEASERVICIO,
            "tipoFalla": $scope.infoTicket.TIPODEFALLA,
            "servicio": $scope.infoTicket.SERVICIO,
            "aplicacion": $scope.infoTicket.APLICACION
        }, function (Data) {
            block.stop();
            if (Data.isError === false) {
                $scope.estados = Data.response.estados;
                $scope.codigos = Data.response.codigoCierres;
                $scope.infoTicket.requisitos = Data.response.prerequisitos.prerequisitosAMX != null ? Data.response.prerequisitos.prerequisitosAMX : "";
                console.log(Data.response);
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
    };

    $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
        if (fileList.length > 5) {
            reader.abort();
            swal({
                title: "Solos puedes cargar 5 adjuntos",
                animation: false,
                customClass: 'animated tada'
            });
            document.getElementById("documentos").value = "";
        } else {
            if (fileList.length > 0) {
                if ($scope.infoTicket.DOCUMENTOS && $scope.infoTicket.DOCUMENTOS.length == 5) {
                    reader.abort();
                    swal({
                        title: "Solos puedes cargar 5 adjuntos",
                        animation: false,
                        customClass: 'animated tada'
                    });
                    document.getElementById("documentos").value = "";
                } else {
                    var doc = {nombre: fileObj.filename, file: fileObj.base64};

                    if ($scope.infoTicket.DOCUMENTOS) {
                        $scope.infoTicket.DOCUMENTOS.push(doc);
                    } else {
                        let arrDocument = [];
                        arrDocument.push(doc);
                        Object.assign($scope.infoTicket, {DOCUMENTOS: arrDocument});
                    }
                }
            }
        }
    };

    $scope.getDataCasoSessionStorage = function () {
        block.stop();
        let dataCaso = JSON.parse(sessionStorage.CASO);

        Object.assign($scope.infoTicket, dataCaso);
        console.log($scope.infoTicket)
        $scope.infoTicket.DOCUMENTOS = [];
    };



    $scope.addInfoAdicional = function () {
        if ($scope.InfoAdicional.length < 12) {
            $scope.InfoAdicional.push($scope.InfoAdicional.length + 1);
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        }
    };

    $scope.deleteDocument = function (index) {
        $scope.infoTicket.DOCUMENTOS.splice(index, 1);
    };

    $scope.init();
});