angular.module('myApp.factorys', ['ionic'])
  .factory('LoadView', function ($ionicLoading) {
    var ShowView = function (text) {//加载等待的界面
      if(text==null)
      {
        text="正在载入数据，请稍后...";
      }
      $ionicLoading.show({
        template: " <ion-spinner icon='ios'></ion-spinner><br>"+text
        , noBackdrop: false
        , hideOnStateChange: true
      });
    };
    var HideView = function () {
      $ionicLoading.hide();
    };
    return {
      Show: function (text) {
       return ShowView(text);
      },
      Hide: function () {
        HideView();
      }
    }
  })
;
