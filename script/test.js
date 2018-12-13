function a()
{ 
   var a1 = "<p> "
  var a = [ "champ1", "champ2"]
  var a2= " </p>"
  
  var g; 
  for(var i=0;i<2;i++)
  { 
      g= document.createElement('div');
      g.id = i;
      document.body.appendChild(g);
      var abc = a1+a[i]+a2;
      document.getElementById(g.id).innerHTML=abc;         
    }  
}
a();