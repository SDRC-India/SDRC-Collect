var services = angular.module('sdrc-collect-service', []);
services.service('basicService', function () {
        var sdrcTitle = 'Main Menu';

        return {
            getSdrcTitle: function () {
                return sdrcTitle;
            },
            setSdrcTitle: function(value) {
                sdrcTitle = value;
            }
        };
});
services.service('titleService', function(){
   return {}; 
});
services.service('generaSettingService', function(){

    return {

        store: function(odkUrl, enketoUrl, username, password){   
            serverAuthDB.get('auth').then(function(doc){
                return serverAuthDB.put({
                    _id: 'auth',
                    _rev: doc._rev,
                    odkUrl: odkUrl,
                    enketoUrl: enketoUrl,
                    username: username,
                    password: password                  
                });                
            }).catch(function(err){
                msg = "insert failure! \nError: " + err + "\nError Message: "+ err.message;
                sdrcCollectLog('services.js', msg);
            });
        }

    };    
});