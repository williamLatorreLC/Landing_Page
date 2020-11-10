/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

(function() {
      'use strict';

      app.controller('chatCtrl', chatCtrl);
      
      chatCtrl.$inject = ['$scope','$rootScope','$state'];
      
      function chatCtrl($scope,$rootScope,$state) {
            $scope.showSpinner = true;
            $rootScope.banner=false;
            $rootScope.botones=false;
            $rootScope.chatURL = $rootScope.chatURL ? $rootScope.chatURL : "";
            $rootScope.cerrar = true;
            
            $scope.initView=function(){
                if($rootScope.chatURL==""){
                    window.location.href="/myit/";
                }else{
                    $("#siteloader").html('<object data="' + $rootScope.chatURL + '" />');
                    $scope.showSpinner = false;
                }
                
            };
            
            $scope.initView();
            
      }
})();

