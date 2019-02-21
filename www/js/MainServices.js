angular.module('myApp.services', [])
  .factory('furnitures', function () {
    var furnitures = [
      {
        id: 1,
        name: '开关'
      }, {
        id: 2,
        name: '灯'
      }, {
        id: 3,
        name: '插座'
      }, {
        id: 4,
        name: '热水器'
      }, {
        id: 5,
        name: '空调'
      }];

    return {
      all: function () {
        return furnitures;
      },
      remove: function (furniture) {
        furnitures.splice(furnitures.indexOf(furniture), 1);
      },
      get: function (furnitureId) {
        var id = parseInt(furnitureId);
        for (var i = 0; i < furnitures.length; i++) {

          if (furnitures[i].id === id) {
            return furnitures[i];
          }
        }
        return null;
      }
    };
  });
