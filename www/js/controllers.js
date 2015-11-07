angular.module('starter.controllers', ['sdrc-collect-service', 'todosApp'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $ionicPopover, $rootScope) {


$scope.popover;

 $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.demo = 'ios';
  $scope.setPlatform = function(p) {
    document.body.classList.remove('platform-ios');
    document.body.classList.remove('platform-android');
    document.body.classList.add('platform-' + p);
    $scope.demo = p;
  }

  $scope.closePopover = function() {
    $scope.popover.hide();
  };



 $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  
})

.controller('HomeCtrl', function($scope, $location, $cordovaToast){
  $scope.header = "SDRC Collect 1.2";
  $scope.paragraph = "Data collection made easier...";  
  $scope.go = function(){
      if(window.Connection) {
          if(navigator.connection.type == Connection.NONE || navigator.connection.type == "none") {
            $cordovaToast.show(notConnected, toastLDuration, toastPosition);    
          }else{
            serverAuthDB.get('auth').then(function(doc){
              if(doc.odkUrl != defaultOdkUrl && doc.username != defaultUsername && doc.password != defaultPassword)
                $location.path("app/getBlankForm");
              else
                $cordovaToast.show(invalidCredentials,toastLDuration,toastPosition);        
            }).catch(function(err){
                if(err.status == 404){
                    $cordovaToast.show(invalidCredentials,toastLDuration,toastPosition);
                }else{
                  msg = "insert failure! \nError: " + err + "\nError Message: "+ err.message;
                  sdrcCollectLog('controllers.js', msg);  
                }
                
            });

            // console.log(navigator.connection.type);

          }
      }
  }  

 })

.controller('GetBlankFormCtrl', function($cordovaToast, $scope, todoFactory, getIdFactory, 
  $rootScope, xformFactory, $location, $ionicLoading, $timeout, $http){

  

$scope.isLoadingHidden = false;
  
   $scope.show = function() {
    $ionicLoading.show({
      template: 'Please wait...'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $timeout(function(){
    $scope.hide();
    if(!$scope.isLoadingHidden){
      $cordovaToast.show('Server problem', 'long', 'center');
    }
  }, 15000);

  $scope.show();


  $scope.dataBaseData = [];//extracted database records will stay here


  /*
  The following method will extract the form data and store it in dataBaseData variable.
  */
  $scope.extractDatabaseData = function(){
    sdrc_collect_db_form.allDocs({include_docs: true, descending: false}).then(function(doc) {
    for (var i = 0; i < doc.rows.length; i++) {
      var obj = {};
      obj["name"] = "" + doc.rows[i].doc.name;
      obj["id"] = doc.rows[i].doc._id;
      obj["url"] = doc.rows[i].doc.url;
      obj["form"] = doc.rows[i].doc.form;      
      $scope.dataBaseData.push(obj);

    };

  }).catch(function(err){
    msg = "Database error while fethching record for fill up form.\nError: " + err + "\nError message: " + err.message;
    sdrcCollectLog('controllers.js', msg);
  });

  }

  $scope.extractDatabaseData();

  $scope.addOver = false;
  $scope.formsHere1;
  $scope.items = [];
  $rootScope.mainTitle = "Get Blank Form";
  $scope.odkUrl = "";




   /*

   The following method will check the object is present 
   in the database or not. If not present it will insert it into database.
   If present it will not insert.

   */
  $scope.checkAndPushInItems = function(obj){
    var flag = false;
    for(var i = 0; i < $scope.dataBaseData.length; i++){
      if($scope.dataBaseData[i].id == obj.id){
        flag = true;        
      }
    }
    if(!flag){
        $scope.items.push(obj);
    }    
      
  }


  $scope.setItems = function (forms){
    for (var i = 0; i < forms.length; i++) {
      var obj = {};
      obj["name"] = "" + forms[i];
      obj["id"] = $scope.getId(forms[i]._url);
      obj["url"] = forms[i]._url;
      obj["checked"] = false;
      $scope.checkAndPushInItems(obj);  
    };
    $scope.hide();
    $scope.isLoadingHidden = true;
      
  }
  /**
    *The following method will get executed after getting the forms from the server.
  **/
  $scope.afterGettingTheFormsFromServer = function (data){
      formsHere = x2js.xml_str2json(data);
      try{
        $scope.formsHere1 = formsHere.forms.form;
        $scope.setItems($scope.formsHere1);
      }catch(err){
        console.log(err.message);
        $scope.hide();
        $cordovaToast.show(invalidUrl,'long','center');
      }
  };
  var method = 'GET';
  var digestURI = '/ODKAggregate/formList';

  function makeid(vHere){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for( var i=0; i < vHere; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;

  }

      
  var nc = '0000000' + makeid(1);  
  var cnonce = makeid(8);
    
  $scope.getRResponse = function (nonce, realm, qop) {
      var HA1 = CryptoJS.MD5 ($scope.username + ":" + realm + ":" + $scope.password);
      var HA2 = CryptoJS.MD5 (method + ":" + digestURI);
      return CryptoJS.MD5 (HA1 + ":" + nonce + ":" + nc + ":"+ cnonce + ":" + qop + ":" + HA2); 
  }

  $scope.sendRequestForFormsWithHeader = function (nonce, realm, qop){
     var response = $scope.getRResponse (nonce, realm, qop);
     var auth = 'Digest username="'+ $scope.username +'", realm="'+realm+'", nonce="'+nonce+'", uri="'+digestURI+'", response="'+response+'", qop='+qop+', nc='+nc+', cnonce="'+cnonce+'"';
     var config = {
        headers: {     
          Authorization: auth
        }   
     };

     $http.get($scope.odkUrl, config).
     success(function(data, status, headers, config) {
        $scope.afterGettingTheFormsFromServer(data);     
     })
     .error(function(data, status, headers, config) {
        console.log("error");
      });
  };





  $scope.sendRequestForForms = function (){
    // c("username : " + $scope.username);
    $http.get($scope.odkUrl).
      success(function(data, status, headers, config) {
        $scope.afterGettingTheFormsFromServer(data);
      })
      .error(function(data, status, headers, config) {
      if(status === 401){
        var headerHere = headers('WWW-Authenticate');
        var nonce = headerHere.split('nonce=')[1];
        nonce = nonce.substring(1, nonce.length - 1);
        var realm = headerHere.split('realm="')[1];
        realm = realm.split('"')[0];
        var qop = headerHere.split('qop="')[1];
        qop = qop.split('"')[0];
        $scope.sendRequestForFormsWithHeader(nonce, realm, qop);        

      }else{
        console.log (status);
      }
    });

  };

  serverAuthDB.get('auth').then(function(doc){
      $scope.odkUrl = doc.odkUrl;
      $scope.username = doc.username;
      $scope.password = doc.password;
      $scope.sendRequestForForms();
  }).catch(function(err){
      if(err.status == 404){
        serverAuthDB.put({
              _id: 'auth',
              odkUrl: defaultOdkUrl,
              enketoUrl: defaultEnketoUrl,
              username: defaultUsername,
              password: defaultPassword 
          }).then(function (response) {
              msg = "Demo data inserted into serverAuthDB, _id auth";
              sdrcCollectLog('controllers.js', msg);
              $scope.odkUrl = defaultOdkUrl;
          }).catch(function (err) {
              msg = "Database error while fethching record for fill up form.\nError: " + err + "\nError message: " + err.message;
              sdrcCollectLog('controllers.js', msg);
          });
      }else{
        msg = "insert failure! \nError: " + err + "\nError Message: "+ err.message;
        sdrcCollectLog('controllers.js', msg);  
      }
      
  });

  

  



    
  
  // $timeout(function(){
  //     todoFactory.getForms($scope.odkUrl)
  //     .success(function (data) {
  //       $scope.afterGettingTheFormsFromServer(data);           
  //     })
  //     .error(function(err){
  //       console.log("Error here" + err.message);
  //       console.log("Error here" + err.status);
  //     });  
  // }, 1000);
  

  $scope.getId = function(urlHere){
    return getIdFactory.getId(urlHere);
  };

  
  $scope.count = 0;
  $scope.isGsDisabled = true;
  $scope.doCount = function(varIndex){

    if($scope.items[varIndex].checked == true){
      $scope.count++;  
    }else{
      $scope.count--;      
    }

    if($scope.count < 1){
      $scope.isGsDisabled = true;
    }else{
      $scope.isGsDisabled = false;
    }

  };
  $scope.selectAllCheckBox = function(){
    $scope.count = 0;
      for (var i = $scope.items.length - 1; i >= 0; i--) {
        $scope.count++;
        $scope.items[i].checked = true;
        $scope.isGsDisabled = false;   
      };


  };
  $scope.checkedLength = 0;
  $scope.checkedLengthTwo = 0;
  $scope.extractedForms = [];
  $scope.iArray = [];
  $scope.getSelectedForm = function(){
    $scope.show();
    sdrcCollectLog('controllers.js', "GetBlankFormCtrl controller's getSelectedForm method called");
    for (var i = 0; i < $scope.items.length; i++) {
      if($scope.items[i].checked){
          $scope.checkedLength++;
      }
    }
    for (var i = 0; i < $scope.items.length; i++) {
      if($scope.items[i].checked){
          $scope.iArray.push(i);
          var urlHere = "http://192.168.1.122:8085/transform?xform="+$scope.items[i].url;
          $http.get(urlHere).
            success(function(data, status, headers, config) {
              $scope.afterGettingTheFormsFromServer(data);
            })
            .error(function(data, status, headers, config) {
            if(status === 401){
              var headerHere = headers('WWW-Authenticate');
              c("headerHere : " + headerHere);
              var nonce = headerHere.split('nonce=')[1];
              nonce = nonce.substring(1, nonce.length - 1);
              var realm = headerHere.split('realm="')[1];
              realm = realm.split('"')[0];
              var qop = headerHere.split('qop="')[1];
              qop = qop.split('"')[0];
              var response = $scope.getRResponse (nonce, realm, qop);
              var auth = 'Digest username="'+ $scope.username +'", realm="'+realm+'", nonce="'+nonce+'", uri="'+digestURI+'", response="'+response+'", qop='+qop+', nc='+nc+', cnonce="'+cnonce+'"';
              console.log ("auth : " + auth);
              // var config = {
              //     headers: {     
              //       Authorization: auth
              //     }   
              // };

              // $http.get(urlHere, config).
              //  success(function(data, status, headers, config) {
              //     $scope.afterGettingTheFormsFromServer(data);     
              // })
              // .error(function(data, status, headers, config) {
              //     console.log("error");
              // });        

            }else{
              console.log (status);
            }
          });          

          // xformFactory.getXForm(urlHere).success(function (data) {
          //     var obj = {
          //       _id: $scope.items[$scope.iArray[$scope.checkedLengthTwo]].id,
          //       name: $scope.items[$scope.iArray[$scope.checkedLengthTwo]].name,
          //       url: $scope.items[$scope.iArray[$scope.checkedLengthTwo]].url,
          //       form: data.form
          //     };

          //     sdrc_collect_db_form.put(obj).then(function(){
          //       msg = "Insert success! db : sdrc_collect_db_form " + obj.name;
          //       sdrcCollectLog('controllers.js', msg);
          //         // console.log(new Date().toISOString() + ":::"+ "Insert success!" + obj);
          //     }).catch(function(err){
          //       msg = "insert failure! \nError: " + err + "\nError Message: "+ err.message;
          //       sdrcCollectLog('controllers.js', msg);
          //     });
          //     $scope.checkedLengthTwo++;
          //     if($scope.checkedLength == $scope.checkedLengthTwo){
          //         $scope.hide();
          //         $location.path("app/home");
          //     }              
          // });
      }
    }
    // sync();
  }
  $scope.refresh = function(){
    alert("hello");   
  }


})

.controller('FillFormCtrl', function($scope, $rootScope, $location){
  sdrcCollectLog('controllers.js', "FillFormCtrl controller called");
  $rootScope.mainTitle = "Fill Form";
  $scope.items = [];
  sdrc_collect_db_form.allDocs({include_docs: true, descending: false}).then(function(doc) {
    for (var i = 0; i < doc.rows.length; i++) {
      var obj = {};
      obj["name"] = "" + doc.rows[i].doc.name;
      obj["id"] = doc.rows[i].doc._id;
      obj["url"] = doc.rows[i].doc.url;
      obj["form"] = doc.rows[i].doc.form;      
      $scope.items.push(obj);

    };

  }).catch(function(err){
    msg = "Database error while fethching record for fill up form.\nError: " + err + "\nError message: " + err.message;
    sdrcCollectLog('controllers.js', msg);
  });

  $scope.getXformC = function(indexHere){
    // $location.path("app/form/"+ $scope.items[indexHere].form);
    $location.path("app/form/" + indexHere);                        
  }
})

.controller('FormCtrl', function($scope, $stateParams){
  sdrc_collect_db_form.allDocs({include_docs: true, descending: false}).then(function(doc) {
    var myEl = angular.element( document.querySelector( '#header' ) );
    myEl.after(doc.rows[$stateParams.index].doc.form);      
  }).catch(function(err){
    msg = "Database error while fethching record for fill up form.\nError: " + err + "\nError message: " + err.message;
    sdrcCollectLog('controllers.js', msg);
  });  
})

.controller('GeneralSettingCtrl', function($scope, $rootScope, $ionicPopup, generaSettingService, $timeout) {
  
  $rootScope.mainTitle = "General Setting";
  $scope.odkUrl = defaultOdkUrl;
  $scope.enketoUrl = defaultEnketoUrl;
  $scope.username = defaultUsername;
  $scope.password = defaultPassword;

  



  

  $scope.showPlatformPopup = function(){
      var myPopup = $ionicPopup.show({
        templateUrl: "templates/platformPopup.html",
        title: 'Platform',
        // subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
        {
         text: '<b>Cancel</b>',
         type: 'button-positive',
         onTap: function(e) {
          myPopup.close();
           //cancel code here
         }
       },
     ]
      });
  }

  $scope.showConfigurePlatformSettingPopup = function(){

    serverAuthDB.allDocs({include_docs: true, descending: false}).then(function(doc) {
      if(doc.rows.length > 0){
          $scope.odkUrl = doc.rows[0].doc.odkUrl;
          $scope.enketoUrl = doc.rows[0].doc.enketoUrl;
          $scope.username = doc.rows[0].doc.username;
          $scope.password = doc.rows[0].doc.password;
      }else{
          serverAuthDB.put({
              _id: 'auth',
              odkUrl: defaultOdkUrl,
              enketoUrl: defaultEnketoUrl,
              username: defaultUsername,
              password: defaultPassword 
          }).then(function (response) {
              msg = "Demo data inserted into serverAuthDB, _id auth";
              sdrcCollectLog('controllers.js', msg);
          }).catch(function (err) {
              msg = "Database error while fethching record for fill up form.\nError: " + err + "\nError message: " + err.message;
              sdrcCollectLog('controllers.js', msg);
          });
      }                        

    }).catch(function(err){
      msg = "Database error while fethching record for fill up form.\nError: " + err + "\nError message: " + err.message;
      sdrcCollectLog('services.js', msg);
    });
    $timeout(function(){
       $scope.data = {
      odkUrl: $scope.odkUrl,
      enketoUrl: $scope.enketoUrl,
      username: $scope.username,
      password: $scope.password
    };
      var myPopup = $ionicPopup.show({
        templateUrl: "templates/configurePlatformSetting.html",
        title: configurePlatformSettingTitle,
        // subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
        {
         text: '<b>Ok</b>',
         type: 'button-energized',
         onTap: function(e) {
          myPopup.close();
           generaSettingService.store($scope.data.odkUrl, $scope.data.enketoUrl, $scope.data.username, $scope.data.password);           
         }
       },
        {
         text: '<b>Cancel</b>',
         type: 'button-energized',
         onTap: function(e) {
          myPopup.close();
           //cancle code
         }
       }
     ]
      }); 
    }, 1000);
    
  }


  $scope.showGoogleAccountPopup = function(){
      var myPopup = $ionicPopup.show({
        templateUrl: "templates/googleAccountPopup.html",
        title: 'Platform',
        // subTitle: 'Please use normal things',
        scope: $scope,
        buttons: [
        {
         text: '<b>Cancel</b>',
         type: 'button-energized',
         onTap: function(e) {
          myPopup.close();
           // if (!$scope.data.wifi) {
           //   //don't allow the user to close unless he enters wifi password
           //   e.preventDefault();
           // } else {
           //   return $scope.data.wifi;
           // }
         }
       },
     ]
      });
  }

})



.controller('AdminSettingCtrl', function($scope, $rootScope) {
  $rootScope.mainTitle = "Admin Setting";
})

.controller('DHtmlController', function($scope){
  // $scope.dataHere = gData;
})

;

