app.controller("registroCasosCtrl", function ($scope, $window, $state, servicios, $rootScope, blockUI, $uibModal, $document) {
    var block = blockUI.instances.get('screenBlockUI');
    $scope.servicios = [];
    $scope.sedes = [];
    $scope.aplicaciones = [];
    $scope.tipos = {fallas: [], operaciones: [], usuarios: [], impactos: []};
    $scope.infoTicket = {requisitos: "", documentos: []};
    $scope.requisitos = "";
    $scope.InfoAdicional = [1];
    $scope.urgencias = [];
    $scope.files;

    /* $scope.setRequisites=function(aplicacion,servicio,lineaServicio){
     if (aplicacion && servicio && lineaServicio) {
     $scope.infoTicket.requisitos = "";
     angular.forEach($scope.aplicaciones,function(value){
     if(value.aplicacion==aplicacion && value.prerequisitos!=undefined){
     console.log(value);
     $scope.infoTicket.requisitos = value.prerequisitos;
     }
     });
     }
     }*/

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
                if ($scope.infoTicket.documentos && $scope.infoTicket.documentos.length == 5) {
                    reader.abort();
                    swal({
                        title: "Solos puedes cargar 5 adjuntos",
                        animation: false,
                        customClass: 'animated tada'
                    });
                    document.getElementById("documentos").value = "";
                } else {
                    var doc = {nombre: fileObj.filename, file: fileObj.base64};

                    if ($scope.infoTicket.documentos) {
                        $scope.infoTicket.documentos.push(doc);
                    } else {
                        let arrDocument = [];
                        arrDocument.push(doc);
                        Object.assign($scope.infoTicket, {documentos: arrDocument});
                    }
                }
            }
        }
    };


    $scope.setRequisites = function (aplicacion, servicio, lineaServicio) {
        if (aplicacion && servicio && lineaServicio) {
            $scope.infoTicket.requisitos = "";

            block.start('Cargando...');
            let dataService = {
                "aplicacion": aplicacion,
                "servicio": servicio,
                "lineaServicio": lineaServicio
            }
            servicios.Post('obtenerListas/tipos', dataService, function (Data) {
                block.stop();
                if (Data.isError === false) {
                    $scope.tipos = Data.response;
                    console.log($scope.tipos);
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
    };

    $scope.modalValidateSubmitCase = function (type) {
        swal({
            title: '',
            text: "¿Estás seguro de generar el caso?",
            confirmButtonColor: "#c62f3d",
            confirmButtonText: "Aceptar",
            showCancelButton: true,
            cancelButtonColor: "#d9d9d9",
            cancelButtonText: "Cancelar",
            cancelButtonClass: 'parraf'
        }).then(function (result) {
            if (result.value) {
                if (!$scope.infoTicket.documentos) {
                    $scope.infoTicket.documentos = [];
                }
                if ($scope.infoTicket.telefono) {
                    $scope.infoTicket.telefono = $scope.infoTicket.telefono.toString();
                }

                if ($scope.infoTicket.date) {
                    $scope.infoTicket.fecha = $scope.infoTicket.date.toISOString().split("T")[0];
                    $scope.infoTicket.hora = $scope.infoTicket.date.toLocaleTimeString();
                } else {
                    if ($scope.infoTicket.servicio == 'Soporte') {
                        swal({
                            title: '',
                            text: 'Por favor asignar fecha y hora de la falla.',
                            confirmButtonColor: "#dc3545",
                            confirmButtonText: "aceptar"
                        });
                        return;
                    } else {
                        $scope.infoTicket.fecha = "";
                        $scope.infoTicket.hora = "";
                    }

                }
                block.start('Cargando...');
                servicios.Post("casos/crear", $scope.infoTicket, function (Data) {
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
    };

    $scope.preloadData = function () {
        $scope.infoTicket = {
            "usuario": $rootScope.infoUser.User,
            "nombre": $rootScope.infoUser.First_Name + " " + $rootScope.infoUser.Last_Name,
            "correo": $rootScope.infoUser.Internet_Email
        };
    };


    $scope.getLists = function () {
        $scope.preloadData();
        block.start('Cargando...');
        servicios.Get('obtenerListas', function (Data) {
            block.stop();
            if (Data.isError === false) {
                $scope.lineasServicios = Data.response.lineasServicios;
                $scope.sedes = Data.response.sedes;
                //$scope.selectedServicio = $scope.servicios[0].servicio;
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

    $scope.init = function () {
        if (sessionStorage.X_MYIT_LAND != null
                && sessionStorage.X_MYIT_LAND != ""
                && sessionStorage.X_MYIT_LAND != undefined) {
            $rootScope.infoUser = $rootScope.userData;
            if ($rootScope.userData == null || $rootScope.userData == undefined) {
                $scope.getInfo();
            } else {
                console.log($rootScope.infoUser);
                $scope.getLists();
            }
        } else {
            $state.go('login');
        }
    };

    $scope.getInfo = function () {
        console.log($rootScope.infoUser);
        block.start('Cargando...');
        servicios.Post("utils/dec", {
            "token": sessionStorage.X_MYIT_LAND
        }, function (Data) {
            block.stop();
            if (Data.isError === false) {
                $rootScope.infoUser = Data.response.map;
                setTimeout(function () {
                    $scope.$apply();
                    $scope.getLists();
                }, 200);
            } else {
                $state.go('login');
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            }
        });
    };

    $scope.changeServicio = function (selectedServicio, lineaServicio) {
        if (lineaServicio) {
            block.start('Cargando...');
            let dataService = {
                "servicio": selectedServicio,
                "lineaServicio": lineaServicio
            };
            console.log(dataService);
            servicios.Post('obtenerListas/aplicaciones', dataService, function (Data) {
                block.stop();
                if (Data.isError === false) {
                    $scope.aplicaciones = Data.response;
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
    };

    $scope.changeServiceLine = function (selectedServiceLine) {
        if (selectedServiceLine) {
            block.start('Cargando...');
            let dataService = {
                "lineaServicio": selectedServiceLine
            }
            servicios.Post('obtenerListas/servicios', dataService, function (Data) {
                block.stop();
                if (Data.isError === false) {
                    $scope.servicios = [];
                    if (Data.response.length > 0) {
                        $scope.servicios = Data.response;
                    } else {
                        $scope.changeServicio(null, selectedServiceLine);
                    }
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
    };

    $scope.getUrgencias = ({usuario, aplicacion, lineaServicio, servicio, tipoFalla}) => {
        //if (servicio === "Soporte" && tipoFalla) {
        block.start('Cargando...');
        if (usuario && aplicacion && lineaServicio && servicio && tipoFalla) {
            let data = {usuario, aplicacion, lineaServicio, servicio, tipoFalla};
            servicios.Post('obtenerListas/tipoUrgencias', data, (Data) => {
                block.stop();
                if (Data.isError === false) {
                    $scope.urgencias = Data.response;
                    $scope.infoTicket.requisitos = "";
                    if (Data.prerequisitos && Data.prerequisitos != "" && Data.prerequisitos.prerequisitos) {
                        $scope.infoTicket.requisitos = Data.prerequisitos.prerequisitos;
                    }
                    console.log($scope.urgencias);
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
    //}
    };

    $scope.addInfoAdicional = function () {
        if ($scope.InfoAdicional.length < 12) {
            $scope.InfoAdicional.push($scope.InfoAdicional.length + 1);
            window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
        }
    }

    $scope.deleteDocument = function (index) {
        $scope.infoTicket.documentos.splice(index, 1);
    };

    $scope.init();
});