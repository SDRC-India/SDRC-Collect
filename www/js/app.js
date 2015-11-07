// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var msg = "";
var sdrcCollectLog = function(fileName, msg){
  console.log("sdrc_collect_log : " + new Date().toISOString() + " ::: "+ fileName + "\n"+ msg);
}

var c = function(msg){
  console.log (msg);
}

var a = function(msg){
  alert (msg);
}


var sdrc_collect_db_form = new PouchDB('sdrc_collect_db_form');
var serverAuthDB = new PouchDB('serverAuthDB');
// var remoteCouch = 'http://rkpradhan.iriscouch.com/sdrc_collect_db_form';
// function sync() {
//     var opts = {live: true};
//     sdrc_collect_db_form.sync(remoteCouch, opts, syncError);
//     // db.replicate.to(remoteCouch, opts, syncError);
//     // db.replicate.from(remoteCouch, opts, syncError);
//   }

//   // EDITING STARTS HERE (you dont need to edit anything below this line)

//   // There was some form or error syncing
//   function syncError() {
//     // syncDom.setAttribute('data-sync-state', 'error');
//     alert("sync error");
//   }

angular.module('starter', ['ionic','ionic.service.core', 'starter.controllers', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $ionicHistory) {
  $rootScope.mainTitle = "Main Menu";
  $rootScope.swipeRight = function(){
   // $ionicHistory.goBack(-1);
  };

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    };

    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
      console.log('Got token', data.token, data.platform);
      alert('Got token', data.token, data.platform);
      alert("push notification from server" + data);// Do something with the token
    });
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.adminSetting', {
    url: '/adminSetting',
    views: {
      'menuContent': {
        templateUrl: 'templates/adminSetting.html',
        controller: 'AdminSettingCtrl'
      }
    }
  })

  .state('app.getBlankForm', {
      url: '/getBlankForm',
      views: {
        'menuContent': {
          templateUrl: 'templates/getBlankForm.html',
          controller: 'GetBlankFormCtrl'
        }
      }
    })
  .state('app.reloadGetblankForm', {
      url: '/reloadGetblankForm',
      views: {
        'menuContent': {
          template: '',
          controller: 'ReloadGetblankFormFormCtrl'
        }
      }
    })
  .state('app.fillForm', {
      url: '/fillForm',
      views: {
        'menuContent': {
          templateUrl: 'templates/fillForm.html',
          controller: 'FillFormCtrl'
        }
      }
  })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
          controller: 'HomeCtrl'
        }
      }
    })

    .state('app.form', {
      url: '/form/:index',
      views: {
        'menuContent': {
          templateUrl: 'templates/form.html',
          controller: 'FormCtrl'
        }
      }
    })

    .state('app.dHtml', {
      url: '/dHtml',
      views: {
        'menuContent': {
          templateUrl: 'templates/dHtml.html',
          controller: 'DHtmlController'
        }
      }
    })
  .state('app.generalSetting', {
    url: '/generalSetting',
    views: {
      'menuContent': {
        templateUrl: 'templates/generalSetting.html',
        controller: 'GeneralSettingCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
