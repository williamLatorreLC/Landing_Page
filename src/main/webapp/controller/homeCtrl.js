app.controller("homeCtrl", function ($scope, $window, $state, servicios, $rootScope, $uibModal, $document) {
    $scope.menu = true;
    $scope.banner = true;
    $scope.botones = true;
    $scope.cerrar = false;
    $scope.banners = [];
    $scope.avatars = [];

    $scope.myInterval = 5000;
    $scope.noWrapSlides = false;
    $scope.chatOpen = false;
    $scope.active = 0;
    $rootScope.infoUser = {};
    $scope.modalInstance = null;

    $rootScope.Tagging("Home", "pt_home");
    var verify = null;
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
            "token": sessionStorage.X_MYIT_LAND
        }, function (Data) {
            if (Data.isError === false) {
                $rootScope.infoUser = Data.response.map;
                setTimeout(function () {
                    $scope.$apply();
                }, 200);
            }
        });
    };

    $scope.open = function (parentSelector) {
        $rootScope.Tagging("Home", "pt_encuestas");
        var parentElem = parentSelector ?
                angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
        $scope.modalInstance = $uibModal.open({
            animation: true,
            ariaLabelledBy: 'modal-title',
            ariaDescribedBy: 'modal-body',
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: "lg",
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
        $("#siteloader").html('');
        $scope.chatOpen = false;
        $rootScope.Tagging("Home", "bt_home_encuestas");
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
                            title: '',
                            text: "No tienes encuestas pendientes por responder.",
                            confirmButtonColor: "#dc3545",
                            confirmButtonText: "aceptar"
                        });
                    } else {
                        swal({
                            title: '',
                            text: Data.response,
                            confirmButtonColor: "#dc3545",
                            confirmButtonText: "aceptar"
                        });
                    }
                });
    };

    $scope.abrirChat = function () {
        $rootScope.Tagging("Home", "bt_home_chatbot");
        $rootScope.chatURL = encodeURI('./chatbot/');
        $("#siteloader").html('<object class="chatObj" data="' + $rootScope.chatURL + '"  style="z-index:999 !important"/>');
        $scope.chatOpen = true;
        $scope.modalInstance = null;
        var obj, verify, launcher = null;
        verify = setInterval(function () {
            obj = document.getElementById('siteloader');
            if (obj.lastChild != null && obj.lastChild != undefined && obj.lastChild.contentDocument != null && obj.lastChild.contentDocument != undefined && obj.lastChild.contentDocument.body != null && obj.lastChild.contentDocument.body != undefined) {
                clearInterval(verify);
                obj.lastChild.contentDocument.body.addEventListener('mouseup', $scope.verifyChat);
            }
        }, 100);
        launcher = setInterval(function () {
            obj = document.getElementById('siteloader');
            if (!$scope.chatOpen) {
                clearInterval(launcher);
            }
            if (obj.lastChild != null && obj.lastChild != undefined && obj.lastChild.contentDocument != null && obj.lastChild.contentDocument != undefined && obj.lastChild.contentDocument.body != null && obj.lastChild.contentDocument.body != undefined) {
                if (obj.lastChild.contentDocument.querySelector('.inbenta .inbenta-bot__launcher__image')) {
                    clearInterval(launcher);
                    $scope.chatOpen = false;
                    $("#siteloader").html('');
                }
            }
        }, 100);
    };

    $scope.verifyChat = function (event) {
        if (event != null && event != undefined && event.path != null && event.path != undefined) {
            if (event.path[0].className == "header__actions__icon inbenta-bot-icon") {
                $scope.chatOpen = false;
                event.preventDefault();
            }
        }
    }

    $scope.myITStore = function (parentSelector) {
        $rootScope.Tagging("Home", "bt_home_store");
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
        $rootScope.Tagging("Home", "bt_home_it");
        if ($rootScope.infoUser.esContingencia) {
            $state.go('listaCasos');
        } else {
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
        }
    };

    $scope.init = function () {
        if (sessionStorage.X_MYIT_LAND != null
                && sessionStorage.X_MYIT_LAND != ""
                && sessionStorage.X_MYIT_LAND != undefined) {
            $rootScope.infoUser = $rootScope.userData;
            if ($rootScope.userData == null || $rootScope.userData == undefined) {
                $scope.getInfo();
            }

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
        $rootScope.Tagging("Home", "bt_home_cerrarsesion");
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
        //$window.open('https://myit.claro.com.co:8443/dwp/app');
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

    $ctrl.surveyDetails = function (item) {
        servicios.Post("surveys/GetDetails", {
            "reqNumber": item.Originating_Request_ID
        }, function (Data) {
            if (!Data.isError) {
                swal({
                    title: 'Detalle',
                    html: Data.response.replace(/\n/g, "<br/>"),
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
                                    title: '',
                                    text: "No tienes encuestas pendientes por responder.",
                                    confirmButtonColor: "#dc3545",
                                    confirmButtonText: "aceptar"
                                });
                                $uibModalInstance.dismiss('cancel');
                            } else {
                                swal({
                                    title: '',
                                    text: Data.response,
                                    confirmButtonColor: "#dc3545",
                                    confirmButtonText: "aceptar"
                                });
                                $uibModalInstance.dismiss('cancel');

                            }


                        });
            } else {
                swal({
                    title: '',
                    text: Data.response,
                    confirmButtonColor: "#dc3545",
                    confirmButtonText: "aceptar"
                });
            }
        });

    };

});
