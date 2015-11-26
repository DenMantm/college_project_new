module.exports = function (what,paths,user,message){
    var xmldom = require('xmldom').DOMParser,
    fs = require('fs');
fs.readFile(paths, 'utf-8', function (err, data) {
  if (err) {
    throw err;
  }
  var genreno,
      thisgenreobject,
      thisgenre,
      doc,
      genres;
  doc = new xmldom().parseFromString(data, 'application/xml');

var createMessage = function(text,user,what){
  var element = doc.createElement(what);

  var textEl = doc.createElement("text");
  var textTxt = doc.createTextNode(text);
  textEl.appendChild(textTxt);
  element.appendChild(textEl);

  var fromEl = doc.createElement("user");
  var fromTxt = doc.createTextNode(user);
  fromEl.appendChild(fromTxt);
  element.appendChild(fromEl);


   var dateEl = doc.createElement("date");
   var dateTxt = doc.createTextNode('000');
   dateEl.appendChild(dateTxt);
   element.appendChild(dateEl);


  genres = doc.documentElement.appendChild(element);
}

createMessage(message,user,what);

 var XMLSerializer = require('xmldom').XMLSerializer;
var serializer = new XMLSerializer();
var writetofile = serializer.serializeToString(doc);

          //writing file to the disk
          fs.writeFile(paths, doc, function(err) {
          if(err) {
                return console.log(err);
              }
          console.log("The file was saved!");
})

});
}