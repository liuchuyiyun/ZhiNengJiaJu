angular.module('starter.controllers', ['starter.factorys'])
  .controller('infoController', function ($scope, $ionicModal) {
    $ionicModal.fromTemplateUrl('templates/info.html', {
      scope: $scope
    }).then(function (modal1) {
      $scope.modal1 = modal1;
    })
  })
  .controller('forgotController', function ($scope, $rootScope) {

  })
  .controller('peiZhiController', function ($scope, $ionicPopup, $http,LoadView) {//WIFI配置界面
    $scope.email = window.sessionStorage.username;
    $scope.StartSetting = function () {
      LoadView.Show(null);
      $http(
        {
          method: "GET",
          url: gatewayIpConfig + "/&user:" + $scope.email + "&wifi:" + $scope.wifiName + "&pwd:" + $scope.wifiPass + "&end",
          params: {},
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            "Access-Control-Allow-Origin": "*"
          }
        }
      )
        .success(function (data, header, config, status) {
          LoadView.Hide();
          var alertPopup = $ionicPopup.alert({
            title: '检查网络',
            template: '请返回登录界面,检查网络！'
          });
          window.location.href = "pagelogin.html";
        })
        .error(function (data, header, config, status) {
          LoadView.Hide();
          var alertPopup = $ionicPopup.alert({
            title: '检查网络',
            template: '请返回登录界面,检查网络！'
          });
          window.location.href = "pagelogin.html";
        });
    }
  })
  .
  controller('loginController', function ($scope, $ionicPopup, $timeout, $rootScope, $http,$state) {//登录界面
    $scope.rePass;
    $scope.email;
    $scope.userPass;

    $scope.$on('$ionicView.beforeEnter', function () {   //页面开始的时候加载保存密码
      if (window.localStorage.getItem("remember") != null) {//自动登录
        if (localStorage.getItem("remember") == "true") {
          $scope.rePass = true;
        }
        if ($scope.rePass == true) {
          var username = window.localStorage.getItem("username");
          var password = window.localStorage.getItem("password");

          if (username != null
            && password != null) {
            //LoginAjax(username, password);
            $scope.email = username;
            $scope.userPass = password;
          }
        }
      } else {
        $scope.rePass = false;
      }
    });

    $scope.login = function () {//登录按钮

      var md5Pass;
      if ($scope.email == null) {
        var alertPopup = $ionicPopup.alert
        ({
          title: '登录失败',
          template: '邮箱不能为空！'
        });
      } else if ($scope.userPass.length < 8) {
        var alertPopup = $ionicPopup.alert({
          title: '登录失败',
          template: '密码不能小于8位！'
        });
      }
      else {
        var password = window.localStorage.getItem("password");
        if (password != null&&$scope.userPass == password) {
          md5Pass = password;
        }
        else {
          md5Pass = hex_md5($scope.userPass);
        }
        if ($scope.rePass) {
          window.localStorage.setItem("remember", true);
          window.localStorage.setItem("username", $scope.email);
          window.localStorage.setItem("password", md5Pass);
        }
        else {
          window.localStorage.setItem("remember", false);
          if (window.localStorage.getItem("username") != null) {
            window.localStorage.removeItem("username");
          }
          if (window.localStorage.getItem("password") != null) {
            window.localStorage.removeItem("password");
          }
        }
        LoginAjax($scope.email, md5Pass);
      }

    }

    function LoginAjax(username, password) {//登录AJAX
      $http(
        {
          method: "POST",
          url: ipconfig + "/login",
          params: {
            email: username,
            userPass: password
          },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            "Access-Control-Allow-Origin": "*"
          }
        }
      )
        .success(function (data, header, config, status) {
          if (data.success) {
            window.sessionStorage.username = username;
            if (data.data.state == -4) {
              $state.go("peizhi");
            }
            else {
              window.location.href = "main.html";
            }

          }
          else {
            var alertPopup = $ionicPopup.alert({
              title: '登录失败',
              template: data.data.stateInfo
            });
          }
        })
        .error(function (data, header, config, status) {
          var alertPopup = $ionicPopup.alert({
            title: '登录失败',
            template: '网络错误！'
          });
        });
    }

  })
  .
  controller('registerController', function ($scope, $ionicPopup, $rootScope, $http,$state) {//注册界面
    $scope.email = $rootScope.email;
    $scope.userPass;
    $scope.error = true;
    $scope.checkPass = '';
    var i = 0;
    $scope.checkRegister = function () {
      if (i == 0) {
        $scope.error = false;
        i = 1;
      }
      else {
        $scope.error = true;
        i = 0;
      }
    }
    $scope.surePass = function () {   //验证密码和注册
      var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var str = $scope.userPass;
      var regUpper = /[A-Z]/;
      var regLower = /[a-z]/;
      var regStr = /[0-9]/;
      var complex = 0;

      if (regLower.test(str) || regUpper.test(str)) {
        ++complex;
      }
      if (regStr.test(str)) {
        ++complex;
      }
      if (filter.test(($scope.email))) {
        if (complex < 2 || str.length < 8) {
          var alertPopup = $ionicPopup.alert({
            title: '注册失败',
            template: '密码错误，字母加数字不少于8位,且不大于16位！'
          });
        } else {
          if ($scope.checkPass == str) {
            var md5pass = hex_md5($scope.userPass);
            $http(
              {
                method: "POST",
                url: ipconfig + "/registered",
                params: {
                  email: $scope.email,
                  userPass: md5pass
                },
                withCredentials: true,
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                  "Access-Control-Allow-Origin": "*"
                }
              }
            )
              .success(function (data, header, config, status) {
                if (data.success == true) {
                  var alertPopup = $ionicPopup.alert({
                    title: '注册成功',
                    template: '注册成功！'
                  });
                  $state.go("login");

                }
                else {
                  var alertPopup = $ionicPopup.alert({
                    title: '注册失败',
                    template: data.data.stateInfo
                  });
                }

              })
              .error(function (data, header, config, status) {
                var alertPopup = $ionicPopup.alert({
                  title: '注册失败',
                  template: '网络错误！'
                });
              });
          } else {
            var alertPopup = $ionicPopup.alert({
              title: '注册失败',
              template: '两次输入密码不一致！'
            });
          }
        }
      } else {
        var alertPopup = $ionicPopup.alert({
          title: '注册失败',
          template: '邮箱格式错误！'
        });
      }

    }
  })
