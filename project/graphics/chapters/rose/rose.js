function Rose( width, height ) {
  this.width = width;
  this.height = height;
  
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 75, this.width/this.height, 0.1, 10000 );
  
  this.renderer = new THREE.WebGLRenderer();
  
  this.linesData = new Array();
  this.lines = new Array();
  this.subLines = new Array();
  
  this.count = 0;
  
  this.reverse = false;
  this.curColor;
  this.h = 0.1;
  
  this.start = function() {
    this.readPoints( "chapters/rose/points.txt", this.linesData, 
                    function() {
                      this.init();
                      this.render();
                    }.bind(this)
                   );
  }
    
  this.init = function() {
    this.renderer.setSize( this.width, this.height );
    document.body.appendChild( this.renderer.domElement );

    this.curColor = new THREE.Color( 0x0000ff );
    var geometry, subGeometry;
    for (var i = 0; i < this.linesData.length; i++) {
      if ( i%2 == 0 ) {
        for( var j=0; j<this.linesData[i].length-2; j++ ) {
          var deltaX = (this.linesData[i][j+2].x - this.linesData[i][j+1].x)/20.0;
          var deltaY = (this.linesData[i][j+2].y - this.linesData[i][j+1].y)/20.0;
          
          for (var k=0; k<20; k++) {
            subGeometry = new THREE.Geometry();
            subGeometry.vertices = [this.linesData[i][j], 
                                    new THREE.Vector3( this.linesData[i][j+1].x+deltaX*k,
                                                     this.linesData[i][j+1].y+deltaY*k, 0)
                                   ];
            var subline = new THREE.Line( subGeometry, new THREE.LineBasicMaterial( { color: this.curColor } ) );
            this.subLines.push(subline);
          }
        }
      }
      
    }
    
    this.camera.position.z = 2000; 
  }
  
  this.render = function() {
    requestAnimationFrame( this.render.bind(this) );
    if (this.count < this.subLines.length) {
      if (this.h >= 0.3) {
        this.reverse = true;
      }
      if (this.h <= 0.1) {
        this.reverse = false;
      }
      if (this.reverse) {
        this.h -= 0.001;
      } else {
        this.h += 0.001;
      }
      this.subLines[this.count].material.color.setHSL(0.67, 1.0, this.h);
      this.scene.add(this.subLines[this.count]);
      this.count++;
    } else {
      this.count = 0;
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
          var x =0, y = 0;
          var lineCount = 0;
          for(var line = 2; line < lines.length; line++){
            if (lines[line] === "") {
              linesData.push(new Array());
              lineCount++;
              line++;
            } else {
              x = parseInt(lines[line].split(' ')[0]) - width/2.0;
              y = -parseInt(lines[line].split(' ')[1]) + height/2.0 - 90;
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