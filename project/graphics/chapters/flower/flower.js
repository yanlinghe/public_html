function Flower( width, height ) {
  this.width = width;
  this.height = height;
  
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 75, this.width/this.height, 0.1, 10000 );
  
  this.renderer = new THREE.WebGLRenderer();
  
  this.linesData = new Array();
  this.lines = new Array();
  
  this.count = 0;
  this.h = 0.8;
  this.reverse = false;
  this.curColor = new THREE.Color(0.82, 0.43, this.h);
  
  this.start = function() {
    this.readPoints( "chapters/flower/points/tulip.txt", this.linesData, 
                    function() {
                      this.init();
                      this.render();
                    }.bind(this)
                   );
  }
    
  this.init = function() {
    this.renderer.setSize( this.width, this.height );
    document.body.appendChild( this.renderer.domElement );

    var geometry;
    var subDivision = 10;
    for (var i = 0; i < this.linesData.length; i++) {
      this.h -= 0.003;
      this.curColor.setHSL(0.9, 0.5, this.h);
      for( var j=0; j<this.linesData[i].length-2; j++ ) {
        var deltaX = (this.linesData[i][j+2].x - this.linesData[i][j+1].x)/subDivision;
        var deltaY = (this.linesData[i][j+2].y - this.linesData[i][j+1].y)/subDivision;
          
        for (var k=0; k<subDivision; k++) {    
          geometry = new THREE.Geometry();
          geometry.vertices = [this.linesData[i][j], 
                              new THREE.Vector3( this.linesData[i][j+1].x+deltaX*k,
                                                 this.linesData[i][j+1].y+deltaY*k, 0)
                               ];
          var subline = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: this.curColor } ) );
          this.lines.push(subline);
//          this.scene.add(subline);
        }
      }
      
    }
    
    this.camera.position.z = 350; 
  }
  
  this.render = function() {
    requestAnimationFrame( this.render.bind(this) );
    if (this.count < this.lines.length) {
      this.scene.add(this.lines[this.count]);
      this.count++;
    }
    this.renderer.render(this.scene, this.camera);
  }
  
  this.readPoints = function( file, linesData, callback ) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
      if(rawFile.readyState === 4)
      {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
          var allText = rawFile.responseText;
          var lines = allText.split('\n');
          
          var width = 0, height = 0;
          if(lines[0].includes("width")) {
            width = parseInt(lines[0].split(' ')[1]);
          }
          if(lines[1].includes("height")) {
            height = parseInt(lines[1].split(' ')[1]);
          }
          var ratioX = 1.0, ratioY = 1.0;
          if (width/height > 800/600) {
            newWidth = 800;
            newHeight = height/width*800;
          } else {
            newWidth = width/height*600;
            newHeight = 600;
          }
          var x =0, y = 0;
          var lineCount = 0;
          for(var line = 2; line < lines.length; line++){
            if (lines[line] === "") {
              linesData.push(new Array());
              lineCount++;
              line++;
            } else {
              x = (parseInt(lines[line].split(' ')[0]) - width/2.0)/width * newWidth;
              y = (-parseInt(lines[line].split(' ')[1]) + height/2.0)/height * newHeight;
              linesData[lineCount - 1].push( new THREE.Vector3( x, y, 0 ));
            }
          }
          callback();
        }
      }
    }
    rawFile.send(null);
  }
  
}