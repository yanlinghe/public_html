SUBDIVISIONS = 50;
TOTAL_LINE = 200;
R = 50;
WIDTH = 512;
HEIGHT = 512;

function Visualization() {
  this.scene = new THREE.Scene();
  this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  this.renderer = new THREE.WebGLRenderer();
  this.controls = new THREE.OrbitControls( this.camera );
  this.ball;
  this.curve = new Array();
  this.line = new Array();
  this.midPoint = new Array();
    
  this.light;
    
  this.start = function() {
    this.init();
    this.animate();
  }
    
  this.init = function() {
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
        
    this.camera.position.z = 100;
    
		this.controls.damping = 0.2;
		this.controls.addEventListener( 'change', this.render.bind(this) );
	
    var geometry = new THREE.SphereGeometry( 50, 32, 32 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff, ambient: 0xff0000, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending } );
    this.ball = new THREE.Mesh( geometry, material );
    this.scene.add( this.ball );

    for (var i = 0; i < TOTAL_LINE; i++) {
      var geometry = new THREE.Geometry();
      this.midPoint[i] = this.getPointInsideBall(i*2*Math.sin(Math.PI/TOTAL_LINE), 0);
      var polars = this.getPointsOnBall(i*2*Math.PI/TOTAL_LINE, i*2*Math.PI/TOTAL_LINE);
      this.curve[i] = new THREE.QuadraticBezierCurve3(
        polars[0],
        this.midPoint[i],
        polars[1]
      );
      
      for (j = 0; j < SUBDIVISIONS; j++) {
        geometry.vertices.push( this.curve[i].getPoint(j / SUBDIVISIONS) );
      }
        
      var material = new THREE.LineBasicMaterial( { color: 0x990000, linewidth: 1 } );
      this.line[i] = new THREE.Line(geometry, material);
      this.scene.add(this.line[i]);
    }
  };
  
  this.getPointsOnBall = function(theta, phi) {
    var x = R * Math.sin(theta) * Math.cos(phi);
    var y = R * Math.sin(theta) * Math.sin(phi);
    var z = R * Math.cos(theta);
        
    return [ new THREE.Vector3(x, y, z), new THREE.Vector3(-x, -y, -z) ];
  };
        
  this.getPointInsideBall = function(theta, phi) {
    var r = R
    
    var x = r * Math.sin(theta) * Math.cos(phi);
    var y = r * Math.sin(theta) * Math.sin(phi);
    var z = r * Math.cos(theta);
        
    return new THREE.Vector3(0, 0, 0);
  };

  this.render = function () {
    for ( var i = 0; i < TOTAL_LINE; i++ ) {
      var geometry = this.line[i].geometry;
      this.curve[i].v0 = this.getPointsOnBall(i*2*Math.PI/TOTAL_LINE* Math.cos(new Date() / 1000), i*2*Math.PI/TOTAL_LINE )[0];
      this.curve[i].v2 = this.getPointsOnBall(i*2*Math.PI/TOTAL_LINE, i*2*Math.PI/TOTAL_LINE*Math.sin(new Date() / 1000) )[1];
      for (j = 0; j < SUBDIVISIONS; j++) {
        geometry.vertices[j].copy( this.curve[i].getPoint(j / SUBDIVISIONS));
      }
      geometry.verticesNeedUpdate=true;
      geometry.colorsNeedUpdate=true;
    }
    this.renderer.render(this.scene, this.camera);
  };
    
  this.animate = function() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.controls.update();
  }
    
}