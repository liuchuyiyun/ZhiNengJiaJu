
angular.module('myApp', ['ionic', 'myApp.controllers', 'myApp.services'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {

      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $stateProvider

      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })
      .state('tab.deviceAll', {
        url: '/deviceAll',
        cache:'false',
        views: {
          'tab-deviceAll': {
            templateUrl: 'templates/device/tab-device-all.html',
            controller: 'DeviceCtrl'
          }
        }
      })
      .state('tab.deviceScene', {
        url: '/deviceScene',
        cache:'false',
        views: {
          'tab-deviceAll': {
            templateUrl: 'templates/device/tab-device-scene.html',
            controller: 'DeviceCtrl'
          }
        }
      })
      .state('tab.deviceSmart', {
        url: '/deviceSmart',
        cache:'false',
        views: {
          'tab-deviceAll': {
            templateUrl: 'templates/device/tab-device-smart.html',
            controller: 'DeviceCtrl'
          }
        }
      })
      .state('tab.timing', {
        url: '/timing',
        views: {
          'tab-timing': {
            templateUrl: 'templates/timing/tab-timing.html',
            controller: 'TimingCtrl'
          }
        }
      })
      .state('tab.setting', {
        url: '/setting',
        views: {
          'tab-setting': {
            templateUrl: 'templates/setting/tab-setting.html',
            controller: 'SettingCtrl'
          }
        }
      })

      .state('tab.moreChoice', {
        url: '/more-choice',
        views: {
          'tab-more': {
            templateUrl: 'templates/more/tab-more-choice.html',
            controller: 'MoreCtrl'
          }
        }
      })
      .state('tab.moreList', {
        url: '/more-list',
        views: {
          'tab-more': {
            templateUrl: 'templates/more/tab-more-list.html',
            controller: 'MoreListCtrl'
          }
        }
      })
      .state('tab.moreInfo', {
        url: '/more-all-info',
        views: {
          'tab-more': {
            templateUrl: 'templates/more/tab-more-all-info.html'
            ,controller: 'MoreInfoCtrl'
          }
        }
      })
      .state('tab.moreScence', {
        url: '/more-scene',
        views: {
          'tab-more': {
            templateUrl: 'templates/more/tab-more-scene.html'

          }
        }
      })
      .state('tab.moreSmart', {
        url: '/more-smart',
        views: {
          'tab-more': {
            templateUrl: 'templates/more/tab-more-smart.html'

          }
        }
      })




    ;

    $urlRouterProvider.otherwise('/tab/deviceAll');
    $ionicConfigProvider.tabs.position('bottom');//设置tabs的位置为底部
    $ionicConfigProvider.navBar.alignTitle('center');//设置标题文字居中
  });
