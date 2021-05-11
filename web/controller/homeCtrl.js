app.controller("homeCtrl", function ($scope, $window, $state, servicios, $rootScope, $uibModal, $document) {
    $scope.menu = true;
    $scope.banner = true;
    $scope.botones = true;
    $scope.cerrar = false;
    $scope.banners = [];
    $scope.avatars = [];

    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    $rootScope.infoUser = {};
    $scope.modalInstance = null;

    $scope.getBanners = function () {
        servicios.Get("banners/1", function (Data) {
            if (Data.isError === false && Data.response.length > 0) {
                $scope.banners = Data.response;
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            }
        });
    };

    $scope.getAvatars = function () {
        servicios.Get("avatars/1", function (Data) {
            if (Data.isError === false && Data.response.length > 0) {
                $scope.avatars = Data.response;
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            }
        });
    };

    $scope.getInfo = function () {
        servicios.Post("utils/dec", {
            "token": sessionStorage.X_MYIT_INFO
        }, function (Data) {
            if (Data.isError === false) {
                $rootScope.infoUser = Data.response;
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            }
        });
    };

    $scope.open = function (parentSelector) {
        var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: "md",
            appendTo: parentElem,
            resolve: {
                items: function () {
                    return $scope.surveys;
                }
            }
        });

        $scope.modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.getSurveys = function () {
        servicios.Post(
                "surveys/GetList",
                {
                    "token": sessionStorage.X_MYIT_REQ
                },
                function (Data) {
                    if (Data.isError === false && Data.response.length > 0) {
                        const options = {year: 'numeric', month: 'long', day: 'numeric'};
                        for (var i = 0; i < Data.response.length; i++) {
                            var d = new Date(Data.response[i].Create_date);
                            Data.response[i].Hora = d.toLocaleTimeString([],
                                    {hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false});
                            Data.response[i].Fecha = d.toLocaleString('es-US', options);
                            Data.response[i].Active = false;
                            Data.response[i].Hover2 = false;
                            Data.response[i].Hover4 = false;
                            Data.response[i].Hover6 = false;
                            Data.response[i].Hover8 = false;
                            Data.response[i].Hover10 = false;
                            Data.response[i].SelectedValue = null;
                            Data.response[i].Comentario = "";
                        }
                        $scope.surveys = Data.response;
                        $scope.open();
                        setTimeout(function () {
                            console.log($scope.surveys);
                            $scope.$apply();
                        }, 200);

                    } else if (Data.isError === false && Data.response.length == 0) {
                        swal({
                            title: 'Error',
                            text: "No tienes encuestas pendientes por responder.",
                            confirmButtonColor: "#dc3545",
                            confirmButtonText: "aceptar"
                        });
                    } else {
                        swal({
                            title: 'Error',
                            text: Data.response,
                            confirmButtonColor: "#dc3545",
                            confirmButtonText: "aceptar"
                        });
                    }
                });
    };

    $scope.abrirChat = function () {
        $scope.modalInstance = null;
        $state.go('chat');
    };

    $scope.myITStore = function (parentSelector) {
        var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myITStoreModalContent.html',
            controller: 'ModalMyITStoreInstanceCtrl',
            controllerAs: '$ctrl',
            size: "md",
            appendTo: parentElem,
            resolve: {
                items: function () {
                    return $scope.surveys;
                }
            }
        });

        $scope.modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.myITModal = function (parentSelector) {
        var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myITModalContent.html',
            controller: 'ModalMyITInstanceCtrl',
            controllerAs: '$ctrl',
            size: "md",
            appendTo: parentElem,
            resolve: {
                items: function () {
                    return $scope.surveys;
                }
            }
        });

        $scope.modalInstance.result.then(function (selectedItem) {
            console.log(selectedItem);
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };

    $scope.init = function () {
        if (sessionStorage.X_MYIT_INFO != null
                && sessionStorage.X_MYIT_INFO != ""
                && sessionStorage.X_MYIT_INFO != undefined) {
            $rootScope.infoUser = $rootScope.userData;
            if ($rootScope.userData == null || $rootScope.userData == undefined) {
                $scope.getInfo();
            }
            $rootScope.chatURL = encodeURI('/myit/chatbot/');
            $scope.getBanners();
            $scope.getAvatars();
        } else {
            $state.go('login');
        }
    };

    $scope.init();


    $scope.openMenu = function () {
        if ($scope.menu == true) {
            $scope.menu = false;
        } else {
            $scope.menu = true;
        }
    }

    $scope.redirect = function (enlace) {
        $state.go(enlace);
    }

    $scope.cerrarsesion = function () {
        servicios.Post('logout', {"token": sessionStorage.X_MYIT_INFO}, function (Data) {
            if (Data.isError === false) {
                sessionStorage.clear();
                $state.go('login');
            } else {
                swal({
                    title: 'Error',
                    text: Data.response,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "aceptar"
                });
            }
        });
    };

});

app.controller('ModalMyITStoreInstanceCtrl', function ($uibModalInstance, items, $window) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = null;

    $ctrl.dominio = function () {
        $window.open('http://wpltsccm03/CMApplicationCatalog/#/SoftwareLibrary/AppListPageView.xaml');
        $uibModalInstance.dismiss('ok');
    };


    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ModalMyITInstanceCtrl', function ($uibModalInstance, items, $window) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = null;


    $ctrl.usuario = function () {
        $window.open('https://myit.claro.com.co:8443/ux/myitapp/');
    };
    $ctrl.usuario1 = function () {
        $window.open('https://myitfull.claro.com.co:8443/arsys/shared/login.jsp?/arsys/');
    };


    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});

app.controller('ModalInstanceCtrl', function ($uibModalInstance, items, servicios, $rootScope) {
    var $ctrl = this;
    $ctrl.items = items;
    $ctrl.selected = null;



    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.enviar = function (item) {
        servicios.Post("surveys/Set", {
            "id": item.Survey_ID,
            "comentario": item.Comentario,
            "calificacion": item.SelectedValue.toString(),
            "token": sessionStorage.X_MYIT_REQ
        }, function (Data) {
            if (!Data.isError) {
                servicios.Post(
                        "surveys/GetList",
                        {
                            "token": sessionStorage.X_MYIT_REQ
                        },
                        function (Data) {
                            if (Data.isError === false && Data.response.length > 0) {
                                const options = {year: 'numeric', month: 'long', day: 'numeric'};
                                for (var i = 0; i < Data.response.length; i++) {
                                    var d = new Date(Data.response[i].Create_date);
                                    Data.response[i].Hora = d.toLocaleTimeString([],
                                            {hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: false});
                                    Data.response[i].Fecha = d.toLocaleString('es-US', options);
                                    Data.response[i].Active = false;
                                    Data.response[i].Hover2 = false;
                                    Data.response[i].Hover4 = false;
                                    Data.response[i].Hover6 = false;
                                    Data.response[i].Hover8 = false;
                                    Data.response[i].Hover10 = false;
                                    Data.response[i].SelectedValue = null;
                                    Data.response[i].Comentario = "";
                                }
                                $ctrl.items = Data.response;
                                console.log($ctrl.items);
                            } else if (Data.isError === false && Data.response.length == 0) {
                                swal({
                                    title: 'Error',
                                    text: "No tienes encuestas pendientes por responder.",
                                    confirmButtonColor: "#dc3545",
                                    confirmButtonText: "aceptar"
                                });
                                $uibModalInstance.dismiss('cancel');
                            } else {
                                swal({
                                    title: 'Error',
                                    text: Data.response,
                                    confirmButtonColor: "#dc3545",
                                    confirmButtonText: "aceptar"
                                });
                                $uibModalInstance.dismiss('cancel');

                            }


                        });
            } else {
                swal({
                    title: 'Error',
                    text: Data.response,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "aceptar"
                });
            }
        });

    };

});
