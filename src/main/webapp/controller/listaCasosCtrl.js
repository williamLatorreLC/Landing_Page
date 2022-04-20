app.controller("listaCasosCtrl", function ($scope, $window, $state, servicios, $rootScope, blockUI, $uibModal, $document, $element, $timeout) {
    var block = blockUI.instances.get('screenBlockUI');


    $scope.listaCasos = [];
    $scope.comentarios = [];
    $scope.organizaciones = [];
    $scope.grupos = [];
    $scope.documentos = [];
    $scope.dataGestion = {documentos: []};
    $scope.search = {};


    $scope.onLoad = function (e, reader, file, fileList, fileOjects, fileObj) {
        if (fileList.length > 5) {
            reader.abort();
            swal({
                title: "Solos puedes cargar 5 adjuntos por gestion",
                animation: false,
                customClass: 'animated tada'
            });
            document.getElementById("documentos").value = "";
        } else {
            if (fileList.length > 0) {
                if ($scope.dataGestion.documentos && $scope.dataGestion.documentos.length == 5) {
                    reader.abort();
                    swal({
                        title: "Solos puedes cargar 5 adjuntos  por gestion",
                        animation: false,
                        customClass: 'animated tada'
                    });
                    document.getElementById("documentos").value = "";
                } else {
                    var doc = {nombre: fileObj.filename, file: fileObj.base64};

                    if ($scope.dataGestion.documentos) {
                        $scope.dataGestion.documentos.push(doc);
                    } else {
                        let arrDocument = [];
                        arrDocument.push(doc);
                        Object.assign($scope.dataGestion, {documentos: arrDocument});
                    }
                }
            }
        }
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
                $scope.getCasesUser();
            }
        } else {
            $state.go('login');
        }
    };

    $scope.openForm = function () {
        $state.go("registroFinal");
    };

    $scope.escalar = function (detalleCaso, idModal) {
        $(idModal).modal('hide');
        block.start('Cargando...');
        servicios.Get('obtenerListas/organizaciones', function (Data) {
            block.stop();
            if (Data.isError === false) {
                $scope.organizaciones = Data.response;
                setTimeout(function () {
                    $scope.$apply();
                    $('#modalEscalar').modal('show');
                }, 200);
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

    $scope.getGroups = function (organizacion) {
        block.start('Cargando...');
        servicios.Post("obtenerListas/grupos", {
            "organizacion": organizacion
        }, function (Data) {
            block.stop();
            if (Data.isError === false) {
                $scope.grupos = Data.response;
                setTimeout(function () {
                }, 200);
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

    $scope.getMembers = function (grupo) {
        var group = JSON.parse(grupo);
        console.log(group);
        block.start('Cargando...');
        servicios.Post("obtenerListas/miembros", {
            "idGrupo": group.id
        }, function (Data) {
            block.stop();
            if (Data.isError === false) {
                $scope.miembros = Data.response;
                setTimeout(function () {
                }, 200);
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

    $scope.openComentarios = function (comentarios) {
        $scope.comentarios = comentarios;
        setTimeout(function () {
            $scope.$apply();
            $('#modalComentarios').modal('show');
        }, 200);
    };

    $scope.openAllDocuments = function () {
        setTimeout(function () {
            $scope.$apply();
            $('#modalDocumentos').modal('show');
        }, 200);
    };

    $scope.openGestion = function (idModal) {
        $(idModal).modal('hide');
        setTimeout(function () {
            $scope.$apply();
            $('#modalGestion').modal('show');
        }, 200);
    };


    $scope.deleteDocument = function (index) {
        $scope.dataGestion.documentos.splice(index, 1);
    };


    $scope.gestionarCaso = function (idModal) {
        $scope.dataGestion.idCaso = $scope.details.ID;
        $scope.dataGestion.usuario = $rootScope.infoUser.User;
        $scope.dataGestion.nombreUsuario = $rootScope.infoUser.First_Name + " " + $rootScope.infoUser.Last_Name;
        $(idModal).modal('hide');
        block.start('Cargando...');
        servicios.Post("casos/gestionar", $scope.dataGestion, function (Data) {
            block.stop();
            if (Data.isError === false) {
                $scope.getCasesUser();
                $scope.dataGestion = {documentos: []};
                swal({
                    title: '',
                    text: Data.response,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "aceptar"
                });
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

    $scope.escalarCaso = function (details, idModal) {
        $(idModal).modal('hide');
        $scope.escalarData.idCaso = details.ID;
        var group = JSON.parse($scope.escalarData.grupo);
        $scope.escalarData.grupo = group.grupo;
        $scope.escalarData.usuario = $rootScope.infoUser.User;
        if ($scope.escalarData.usuarioAsignado != null && $scope.escalarData.usuarioAsignado != undefined) {
            $scope.escalarData.usuarioAsignado = JSON.parse($scope.escalarData.usuarioAsignado);
            if ($scope.escalarData.usuarioAsignado.usuario != null && $scope.escalarData.usuarioAsignado.usuario != undefined) {
                $scope.escalarData.nombreUsuarioAsignado = $scope.escalarData.usuarioAsignado.nombre;
                $scope.escalarData.usuarioAsignado = $scope.escalarData.usuarioAsignado.usuario;
            }
        }
        $scope.escalarData.nombreUsuario = $rootScope.infoUser.First_Name + " " + $rootScope.infoUser.Last_Name;
        block.start('Cargando...');
        servicios.Post("casos/escalar", $scope.escalarData, function (Data) {
            block.stop();
            if (Data.isError === false) {
                $scope.getCasesUser();
                swal({
                    title: '',
                    text: Data.response,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "aceptar"
                });
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

    function arrayBufeerHelperBase() {
        var factory = {};
        factory.arrayBufferToBase64 = function (buffer) {
            var binary = '';
            var bytes = new Uint8Array(buffer);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[ i ]);
            }
            return window.btoa(binary);
        }

        factory.base64ToArrayBuffer = function (base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
        return factory;
    }


    $scope.downloadFile = function (filename, data) {
        //debugger;
        if (!filename || !data) {
            return;
        }
        var arrayBufferHelper = arrayBufeerHelperBase();
        var arrayData = arrayBufferHelper.base64ToArrayBuffer(data);
        var objData = arrayData;
        var filename = filename;
        var contentType = "application/octet-stream";
        //debugger;
        var dataTypeName = objData.constructor.name;
        switch (dataTypeName) {
            case 'Promise':
                objData.then(function (response) {
                    //debugger;
                    if (response.data) {
                        var data = response.data;
                    } else
                    {
                        var data = response;
                    }
                    switch (data.constructor.name) {
                        case 'Blob':
                        case 'ArrayBuffer':
                            //var base64 = _arrayBufferToBase64(data);
                            //var dataAgain = _base64ToArrayBuffer(base64);
                            console.log('Downloading...');
                            createDownloadFile(data, filename, contentType);
                            break;
                    }
                }, function () {
                    console.log('Error when download the file, data get issues');
                });
                break;
            case 'ArrayBuffer':
                console.log('Downloading...');
                createDownloadFile(objData, filename, contentType);
                break;
            default:
                console.log('Data type ' + dataTypeName + ' of objData is unknown');
        }
    };

    function createDownloadFile(fileData, filename, dataContentType) {

        var blob = new Blob([fileData], {'type': dataContentType});
        var _navigator = $window.navigator;
        var _userAgent = _navigator.userAgent;
        console.log(_userAgent);
        //debugger;
        if (_navigator.msSaveOrOpenBlob) {
            //IE 11+
            _navigator.msSaveOrOpenBlob(blob, filename);
        } else if (_userAgent.match("CriOS")) {
            //Chrome iOS
            var reader = new FileReader();
            reader.onloadend = function () {
                $window.open(reader.result);
            };
            reader.readAsDataURL(blob);
        } else {

            var address = $window.URL.createObjectURL(blob);

            var downloadLink = $element.find("a");
            if (!downloadLink[0]) {
                downloadLink = angular.element('<a>');
            }
            //debugger;
            downloadLink.attr("download", filename);
            downloadLink.attr("href", address);
//            if (vm.newWindow) {
//                console.log('Opened in new window =' + vm.newWindow);
//                downloadLink.attr("target", '_blank');
//            } else {
//                console.log('Opened in current window');
//            }

            $element.append(downloadLink);
            console.log(downloadLink[0]);
            downloadLink.ready(function () {
                console.log('ready!!!');
                console.log('anchor clicking...');
                downloadLink[0].click();
                console.log('anchor clicked');
                $timeout(function () {
                    console.log('detaching anchor...');
                    downloadLink.detach();
                    console.log('detached anchor');
                }, 1000);
            });
        }
    }


    $scope.caseDetails = function (caso) {
        $scope.details = caso;
        block.start('Cargando...');
        servicios.Post("casos/documentos", {"idCaso": caso.ID}, function (Data) {
            block.stop();
            if (Data.isError === false) {
                $scope.documentos = Data.response;
                $scope.details.DOCUMENTOS = $scope.documentos;
                setTimeout(function () {
                    $scope.$apply();
                    $('#modalInfoCaso').modal('show');
                }, 200);
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

    $scope.listAll = function () {
        if ($scope.search.criterio == "" || !$scope.search.criterio) {
            $scope.getCasesUser();
        }
    };

    $scope.searchCase = function () {
        if ($scope.search.criterio && $scope.search.criterio != "") {
            block.start('Cargando...');
            servicios.Post("listaCasos/buscar", {"criterio": $scope.search.criterio}, function (Data) {
                block.stop();
                if (Data.isError === false) {
                    var finalList = [];
                    angular.forEach(Data.response, function (value) {
                        value.comentarios = [];
                        if (value.NOTADETRABAJO) {
                            var items = value.NOTADETRABAJO.split(";");
                            for (var i in items) {
                                var item = items[i].split(",");
                                value.comentarios.push({nota: item[0], usuario: item[1], nombre: item[2]});
                            }
                        }
                        finalList.push(value);
                    });
                    $scope.listaCasos = finalList;

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
        }
    };



    $scope.getCasesUser = function () {
        console.log($rootScope.infoUser);
        block.start('Cargando...');
        var path = "listaCasos/usuario";
        var data = {"usuario": $rootScope.infoUser.User};
        if ($rootScope.infoUser.esResolutor) {
            path = "listaCasos/resolutor";
            data.grupos = [];
            if ($rootScope.infoUser.grupos.myArrayList && $rootScope.infoUser.grupos.myArrayList.length > 0) {
                data.grupos = $rootScope.infoUser.grupos.myArrayList;
            } else if ($rootScope.infoUser.grupos && $rootScope.infoUser.grupos.length > 0) {
                data.grupos = $rootScope.infoUser.grupos;
            }

        }
        servicios.Post(path, data, function (Data) {
            block.stop();
            if (Data.isError === false) {
                console.log(Data.response);
                var finalList = [];

                var full = false;
                if (data.grupos) {
                    for (var i = 0; i < data.grupos.length; i++) {
                        if (data.grupos[i] == "COL-IT-GMSC-CALIDAD" || data.grupos[i] == "COL-IT-GMSC-N1-MESA MOVIL NIVEL 1" || data.grupos[i] == "COL-IT-GMSC-SOPORTE-SITIO-MOVIL") {
                            full = true;
                            break;
                        }
                    }
                }
                angular.forEach(Data.response, function (value) {
                    if ($rootScope.infoUser.User == value.USUARIO || value.ESTADO != "3000" || ($rootScope.infoUser.esResolutor && full)) {
                        value.comentarios = [];
                        if (value.NOTADETRABAJO) {
                            var items = value.NOTADETRABAJO.split(";");
                            for (var i in items) {
                                var item = items[i].split(",");
                                value.comentarios.push({nota: item[0], usuario: item[1], nombre: item[2]});
                            }
                        }
                        finalList.push(value);
                    }
                });
                $scope.listaCasos = finalList;
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            } else {
                console.log(Data);
                swal({
                    title: 'Error',
                    text: Data.response,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "aceptar"
                });
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            }
        });
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
                    $scope.getCasesUser();
                }, 200);
            } else {
                $state.go('login');
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            }
        });
    };

    $scope.resolverCaso = function (caso, idModal) {
        sessionStorage.CASO = JSON.stringify(caso);
        $(idModal).modal('hide');
        $state.go('registroResolutor');
    };

    $scope.init();


})