var sess_username = window.sessionStorage.username;
angular.module('myApp.controllers', ['myApp.services', 'myApp.factorys'])
  .controller('DeviceCtrl', function ($scope, $rootScope, $state, $http
    , $timeout, $ionicPopup, LoadView, furnitures) {//设备列表
    $scope.furnitures = furnitures.all();//家具列表
    $scope.nowFurniture = $scope.furnitures[0];//当前家具
    /*-----家具具体列表-----*/
    $scope.toolList = [];

    $scope.$on('$ionicView.beforeEnter', function () {//页面开始的时候加载家具列表
      if (sess_username == null) {
        window.location.href = "../www/pagelogin.html";
      }
      else {
        $scope.UpdateToolList();
      }
    });



    $scope.UpdateToolList = function () {//更新列表
      LoadView.Show(null);
      $http(
        {
          method: "POST",
          url: ipconfig + "/screenEquipment",
          params: {
            uid: sess_username,
            furnType: $scope.nowFurniture.id
          },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            "Access-Control-Allow-Origin": "*"
          }
        })
        .success(function (data, header, config, status) {
          LoadView.Hide();
          var newData = data.data.data;
          if (newData != null) {
            for (var i = 0; i < newData.length; i++) {
              if (newData[i].status == "OPEN") {
                newData[i].isOpen = true;
              }
              else if (newData[i].status == "CLOSE") {
                newData[i].isOpen = false;
              }
            }
            $scope.toolList = newData;
          }
        }).error(function (data, header, config, status) {
          LoadView.Hide();
          var alertPopup = $ionicPopup.alert({
            title: '获取失败',
            template: '网络连接失败！'
          });
        });
    };
    $scope.OpenClose = function (tool) {//开关灯

      var comm = function () {
        if (tool.status == "OPEN") {
          LoadView.Show("正在关闭！");
          return "CLOSE";
        }
        else if (tool.status == "CLOSE") {
          LoadView.Show("正在开启！");
          return "OPEN";
        }
        LoadView.Show(null);
        return "NONE";
      };

      $http(
        {
          method: "POST",
          url: ipconfig + "/operationEquipment",
          params: {
            eid: tool.id,
            command: comm()
          },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            "Access-Control-Allow-Origin": "*"
          }
        })
        .success(function (data, header, config, status) {
          LoadView.Hide();
          if (data.success == false) {
            var alertPopup = $ionicPopup.alert({
              title: '获取失败',
              template: data.data.stateInfo
            });
          }
          $scope.UpdateToolList();
        }).error(function (data, header, config, status) {
          LoadView.Hide();
          var alertPopup = $ionicPopup.alert({
            title: '开关失败',
            template: '网络连接失败！'
          });
        });
    };

    $scope.doRefresh = function () {
      $scope.UpdateToolList();
      $scope.$broadcast('scroll.refreshComplete');
    };

  })

  .controller('MoreCtrl', function ($scope, $rootScope, $stateParams, $ionicBackdrop, $ionicLoading
    , $state, $http, $ionicPopup, LoadView, furnitures) {//更多详情界面
    $scope.furnitures = furnitures.all();

    $scope.GoList = function (clickSheBei) {
      LoadView.Show(null);
      $rootScope.clickSheBei = clickSheBei;
      $state.go("tab.moreList");

    }

  })
  .controller('MoreListCtrl', function ($scope, $rootScope, $state, $http, $ionicHistory, LoadView) {//更多详情列表
    /*-----家具列表-----*/
    $scope.toolList = $rootScope.toolList;

    $scope.$on('$ionicView.beforeEnter', function () {//页面开始的时候加载家具列表
      if (sess_username == null) {
        window.location.href = "../www/pagelogin.html";
      }
      else {
        $scope.UpdateToolList();
      }
    });

    $scope.UpdateToolList = function () {//更新列表
      LoadView.Show(null);
      $http(
        {
          method: "POST",
          url: ipconfig + "/screenEquipment",
          params: {
            uid: sess_username,
            furnType: $rootScope.clickSheBei.id
          },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            "Access-Control-Allow-Origin": "*"
          }
        })
        .success(function (data, header, config, status) {
          LoadView.Hide();
          var newData = data.data.data;
          for (var i = 0; i < newData.length; i++) {
            if (newData[i].status == "OPEN") {
              newData[i].isOpen = true;
            }
            else if (newData[i].status == "CLOSE") {
              newData[i].isOpen = false;
            }
          }
          $scope.toolList = newData;
        }).error(function (data, header, config, status) {
          LoadView.Hide();
          var alertPopup = $ionicPopup.alert({
            title: '获取失败',
            template: '网络连接失败！'
          });
        });
    };
    /*-----家具详情-----*/
    $scope.GoDetail = function (tool) {
      $rootScope.nowTool = tool;
      $state.go("tab.moreInfo");
    };
    $scope.GoBack = function () {
      $ionicHistory.goBack();
    };
    $scope.doRefresh = function () {
      $scope.UpdateToolList();
      $scope.$broadcast('scroll.refreshComplete');
    };
  })
  .controller('MoreInfoCtrl', function ($scope, $rootScope, $state, $ionicHistory, $ionicPopup, $http, LoadView) {//更多信息
    $scope.nowTool = $rootScope.nowTool;
    $scope.rooms = [];
    $scope.$on('$ionicView.beforeEnter', function () {//页面开始的时候加载家具列表
      $scope.GetRooms();
    });

    $scope.GetRooms = function () {
      LoadView.Show(null);
      $http(
        {
          method: "POST",
          url: ipconfig + "/getRooms",
          params: {
            uid: sess_username
          },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            "Access-Control-Allow-Origin": "*"
          }
        })
        .success(function (data, header, config, status) {
          LoadView.Hide();
          $scope.rooms = data.data.data;
        }).error(function (data, header, config, status) {
          LoadView.Hide();
          var alertPopup = $ionicPopup.alert({
            title: '获取失败',
            template: '网络连接失败！'
          });
        });
    };

    $scope.Save = function () {
      $http(
        {
          method: "POST",
          url: ipconfig + "/editorEquipment",
          params: {
            eid: $scope.nowTool.id,
            equipmentName: $scope.nowTool.equipmentName,
            roomId: $scope.nowTool.room.id
          },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            "Access-Control-Allow-Origin": "*"
          }
        })
        .success(function (data, header, config, status) {
          LoadView.Hide();
          $ionicHistory.goBack();
        }).error(function (data, header, config, status) {
          LoadView.Hide();
          var alertPopup = $ionicPopup.alert({
            title: '获取失败',
            template: '网络连接失败！'
          });
        });

    };
    $scope.GoBack = function () {
      $ionicHistory.goBack();
    };
    $scope.Delete = function () {
      //TODO:AJAX删除指令
      $ionicHistory.goBack();
    };
  })
  .controller('TimingCtrl', function ($scope) {

  })
  .controller('SettingCtrl', function ($scope, $stateParams) {
  });
