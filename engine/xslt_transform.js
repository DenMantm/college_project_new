var xslt = require('node_xslt');
module.exports = function(transform,paths){
  		
		                                           
		var stylesheet = xslt.readXsltFile(transform);                          
		var document = xslt.readXmlFile(paths);                                                                                                          
		
		return xslt.transform(stylesheet, document, []);

};
    
    
    
    
