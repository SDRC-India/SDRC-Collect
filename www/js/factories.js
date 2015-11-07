var todoApp = angular.module('todosApp', []);
todoApp.factory('getXMLDataFactory', function() {
	var x2js = new X2JS();
    xml = '<diffgr:diffgram xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" xmlns:diffgr="urn:schemas-microsoft-com:xml-diffgram-v1">'+
 			'<DocumentElement xmlns="">'+
  			'<semt_kodlari diffgr:id="semt_kodlari1" msdata:rowOrder="0">'+
   			'<semt_adi>ALTIKAT</semt_adi>'+
  			'</semt_kodlari>'+
 			'</DocumentElement>'+
			'</diffgr:diffgram>';
    console.log(xml, x2js);
    return {
    	get: function() { 
            return x2js.xml_str2json(xml);
        }
    };         
});

todoApp.factory('getIdFactory', function() {
	return {
    	getId: function(urlHere) { 
            return urlHere.split("=")[1];
        }
    };
});
todoApp.factory('xformFactory', function ($http) {
    var factory1 = {};
    factory1.getXForm = function (xformUrl) {
        return $http.get(xformUrl);        
    }
    return factory1;
});