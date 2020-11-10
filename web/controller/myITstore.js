app.controller("myITstore", function ($scope, $window) {
            $scope.fija = function(){
                $window.open('http://colbtasscmpr01/CMApplicationCatalog/')
            }
            $scope.movil = function(){
                $window.open('http://wappsccm01/CMApplicationCatalog/')
            }
            $scope.dominio = function(){
                $window.open('http://wpltsccm03/CMApplicationCatalog/#/SoftwareLibrary/AppListPageView.xaml')
            }
});

