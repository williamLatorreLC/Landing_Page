app.controller("headerCtrl", function ($scope, $rootScope, $location) {
    console.log($location.path());
    $scope.activeRoute = $location.path();
    $scope.activeRouteLC = false;
    $scope.PreviousUrl = "";
    $scope.activeRoute = $scope.activeRoute.replace('/','');
    if($scope.activeRoute != 'listaCasos'){
        $scope.activeRouteLC = true;
    }else{
        $scope.activeRouteLC = false;
    }

    $rootScope.$on('$locationChangeStart', function (event, current, previous) {
        $scope.PreviousUrl = previous;
    });
})