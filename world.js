var VSHADER_SOURCE = `
  attribute vec4 a_Position; 
  attribute vec2 a_UV;
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;                                             
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
  }`

// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform sampler2D u_Sampler2;
  uniform sampler2D u_Sampler3;
  uniform int u_whichTexture;
  void main() {
    if(u_whichTexture == -2){
      gl_FragColor = u_FragColor;

    }
    else if(u_whichTexture == -1){
      gl_FragColor = vec4(v_UV, 1.0, 1.0);
    }
    else if(u_whichTexture == 0){
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
    else if(u_whichTexture == 1){
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }
    else if(u_whichTexture == 2){
      gl_FragColor = texture2D(u_Sampler2, v_UV);
    }
    else if(u_whichTexture == 3){
      gl_FragColor = texture2D(u_Sampler3, v_UV);
    }
    else{
      gl_FragColor = vec4(1, 0.2, 0.2, 1);
    }
  }`

// Global Variables
let canvas;
let gl;
let a_Position;
let a_UV;
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ViewMatrix;                             
let u_ProjectionMatrix; 
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_Sampler3;
let u_GlobalRotateMatrix;
let u_whichTexture;

function setupWebGL(){
    // Retrieve <canvas> element
    canvas = document.getElementById('webgl');
    // Get the rendering context for WebGL
    gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }
  gl.enable(gl.DEPTH_TEST);
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  
    if (a_UV < 0) {
        console.log('Failed to get the storage location of a_UV');
        return;
    }


  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log("Failed to get the storage location of u_ViewMatrix");
    return;
  }

  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log("Failed to get the storage location of u_ProjectionMatrix");
    return;
  }


  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    if (!u_Sampler0) {
        console.log('Failed to get the storage location of u_Sampler0');
        return;
    }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    if (!u_Sampler1) {
        console.log('Failed to get the storage location of u_Sampler1');
        return;
    }  
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    if (!u_Sampler2) {
        console.log('Failed to get the storage location of u_Sampler2');
        return;
    }  
  u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    if (!u_Sampler3) {
        console.log('Failed to get the storage location of u_Sampler3');
        return;
    }  
    u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
    if (!u_whichTexture) {
        console.log('Failed to get the storage location of u_whichTexture');
        return;
    }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);

}


let g_selectedColor = [1.0, 1.0, 1.0, 1.0];
let g_size = 5;
let g_selectedAngle = 0;
let g_tail = 0;
let g_body = 0;
let g_Head = 0;
let g_tailAnimation = false;
let g_bodyAnimation = false;
let g_HeadAnimation = false;

let AngleX = 0;
let AngleY = 0;

function addActionsForHtmlUI(){


  document.getElementById('animationTailOnButton').onclick = function() {g_tailAnimation = true; };
  document.getElementById('animationTailOffButton').onclick = function() {g_tailAnimation = false; };
  document.getElementById('animationBodyOnButton').onclick = function() {g_bodyAnimation = true; };
  document.getElementById('animationBodyOffButton').onclick = function() {g_bodyAnimation = false; };
  document.getElementById('animationHeadOnButton').onclick = function() {g_HeadAnimation = true; };
  document.getElementById('animationHeadOffButton').onclick = function() {g_HeadAnimation = false; };

  document.getElementById('Body').addEventListener('mousemove', function() {g_body = this.value; renderAllShapes();});
  document.getElementById('Head').addEventListener('mousemove', function() {g_Head = this.value; renderAllShapes();});

  document.getElementById('Tail').addEventListener('mousemove', function() {g_tail = this.value; renderAllShapes();});
  document.getElementById('Angle').addEventListener('mousemove', function() {g_selectedAngle = this.value; renderAllShapes(); });

}

function Undo() {
  if (g_shapesList.length > 0) {
      g_shapesList.pop(); 
      renderAllShapes(); 
  } 
}

function initTextures() {
    
  var image0 = new Image(); 
  var image1 = new Image(); 
  var image2 = new Image(); 
  var image3 = new Image(); 
  
  // Register the event handler to be called on loading an image
  image0.onload = function(){ sendTextureToGLSL(image0,  0); };
  image1.onload = function(){ sendTextureToGLSL(image1,  1); };
  image2.onload = function(){ sendTextureToGLSL(image2,  2); };
  image3.onload = function(){ sendTextureToGLSL(image3,  3); };

  image0.src = 'sky.jpg';
  image1.src = 'grass.jpg';
  image2.src = 'skin.jpg';
  image3.src = 'tail.jpg';

  return true;
}

function sendTextureToGLSL(image, number) { 
  var texture = gl.createTexture(); // Create a texture object
  if (!texture) {
      console.log('Failed to create the texture object');
      return false;
  }
  
   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); 
   if (number === 0) {
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(u_Sampler0, 0);
  } else if (number === 1) {
    gl.activeTexture(gl.TEXTURE1);
    gl.uniform1i(u_Sampler1, 1);
  }
  else if (number === 2) {
    gl.activeTexture(gl.TEXTURE2);
    gl.uniform1i(u_Sampler2, 2);
  }
  else if (number === 3) {
    gl.activeTexture(gl.TEXTURE3);
    gl.uniform1i(u_Sampler3, 3);
  }

   gl.bindTexture(gl.TEXTURE_2D, texture);
   
   // Set the texture parameters
   gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
   // Set the texture image
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  
}



function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();


//canvas.onmousedown = click;
canvas.onmousemove = function(ev) {
  if (ev.buttons === 1) {
    rotation(ev);
  }
 };

  initTextures();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);


  requestAnimationFrame(tick); 
  //renderAllShapes();
}

var g_startTime = performance.now()/ 1000.0;
var g_seconds = performance.now()/ 1000.0 - g_startTime;


function rotation(ev){
  const x = ev.clientX - canvas.getBoundingClientRect().left;
  const y = ev.clientY - canvas.getBoundingClientRect().top;

  AngleX = 360 - (x / canvas.getBoundingClientRect().width) * 360;
  AngleY = 360 - (y / canvas.getBoundingClientRect().height) * 360;
}


function updateAnimationAngles() {
  if (g_bodyAnimation) {
    g_body = (45 * Math.sin(g_seconds));
  }
  if (g_tailAnimation) {
    g_tail = 20 * Math.sin(2 * Math.PI * g_seconds)
  }
  if (g_HeadAnimation) {
    g_Head = 20 * Math.sin(2 * Math.PI * g_seconds)
  }
}


function tick() {
  g_seconds = performance.now()/1000.0 - g_startTime;
  updateAnimationAngles();
  console.log(g_seconds);
  renderAllShapes();
  requestAnimationFrame(tick);
}

var g_shapesList = [];

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);
  let point;
  if(g_selectedType == POINT){
    point = new Point();
  }else if(g_selectedType == TRIANGLE) {
    point = new Triangle();
  }else if(g_selectedType == CIRCLE){
    point = new Circle();
    point.segment = g_selectedSegment;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_size;
  g_shapesList.push(point);

  renderAllShapes();
}


function convertCoordinatesEventToGL(ev){
    
    var x = ev.clientX; 
    var y = ev.clientY; 
    var rect = ev.target.getBoundingClientRect();
    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return([x, y]);
}

var g_eye = [0,0,-1];
var g_at = [0,0,-100];
var g_up = [0,1,0];

function renderAllShapes(){
  // Clear <canvas>
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(90, canvas.width / canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(1, 0, -1, 0,0,0, 0,1,0);
  //viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2], g_at[0], g_at[1], g_at[2], g_up[0], g_up[1], g_up[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);


  var globalRotMat = new Matrix4().rotate(AngleX, 0, 1, 0).rotate(AngleY, 1, 0, 0).rotate(g_selectedAngle, 0, 1, 0);

  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);


  renderScene();

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + "fps: " + Math.floor(10000/duration)/10, "numdot");

}
  
function sendTextToHTML(text, htmlID){
    var htmlElm = document.getElementById(htmlID);
    if(!htmlElm){
        console.log("Failed to get " + htmlID + " from HTML");
        return;
    }
    htmlElm.innerHTML = text;
}
function renderScene() {

  // sky
  var sky = new Cube();
  sky.color = [1.0, 0.0, 0.0, 1.0]; 
  sky.textureNum = 0;
  sky.matrix.scale(50, 50, 50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  //ground
  var ground = new Cube();
  ground.color = [1.0, 0.0, 0.0, 1.0]; 
  ground.textureNum = 1;
  ground.matrix.translate(0, -0.75, 0.0);
  ground.matrix.scale(10, 0, 10);
  ground.matrix.translate(-0.5, 0, -0.5);
  ground.render();



  // Main body of the dog
  var body = new Cube();
  body.color = [0.6, 0.4, 0.2, 1.0]; 
  body.textureNum = 2;
  body.matrix.setTranslate(-0.4, -0.3, 0.0);
  body.matrix.rotate(g_body, 0, 1, 0); 
  var bodyconstruct = new Matrix4(body.matrix);
  body.matrix.scale(1, 0.5, 0.5);
  body.render();

    // Head of the dog
    var head = new Cube();
    head.color = [1.0, 0.8, 0.6, 1.0]; // Light brown for the head
    head.textureNum = 2;
    head.matrix = bodyconstruct;
    head.matrix.translate(-0.4, 0.2, 0.0);
    var consruct = new Matrix4(head.matrix);
    head.matrix.scale(0.5, 0.5, 0.5);
    head.render();

    // nose
    var nose = new Cube();
    nose.color = [1.0, 0.0, 0.0, 1.0];
    nose.matrix = consruct;
    nose.textureNum = -2;
    nose.matrix.translate(-0.05, 0.2, 0.25);
    nose.matrix.rotate(g_Head, 0, 1, 0); 
    nose.matrix.scale(0.1, 0.1, 0.1);
    nose.render();

    // Left ear
    var leftear = new Cube();
    leftear.color = [1.0, 1.0, 1.0, 1.0]; // White for the eyes
    leftear.textureNum = -2;
    leftear.matrix = consruct;
    leftear.matrix.translate(2.0, 3.0, 0.25);
    leftear.matrix.scale(1, 1, 0.5);
    leftear.render();
  
  
    // right ear
    var rightear = new Cube();
    rightear.color = [1.0, 1.0, 1.0, 1.0]; // White for the eyes
    rightear.textureNum = -2;
    rightear.matrix = consruct;
    rightear.matrix.translate(2.0, 0.0, 0.25);
    rightear.matrix.scale(1, 1, 0.5);
    rightear.render();



    // front left leg
    var legBackRight = new Cube();
    legBackRight.color = [0.5, 0.3, 0.1, 1.0]; // Darker brown
    legBackRight.textureNum = -2;
    legBackRight.matrix = bodyconstruct;
    legBackRight.matrix.translate(1.0, -1.1, 0.5);
    legBackRight.matrix.scale(0.25, 0.7, 0.15);
    legBackRight.render();

      // back left leg
      var legFrontRight = new Cube();
      legFrontRight.color = [0.5, 0.3, 0.1, 1.0]; // Darker brown
      legFrontRight.textureNum = -2;
      legFrontRight.matrix = bodyconstruct;
      legFrontRight.matrix.translate(2.0, -0.04, 1);
      legFrontRight.matrix.scale(1.0, 1.9, 0.15);
      legFrontRight.render();

    // back left leg
    var legBackLeft = new Cube();
    legBackLeft.color = [0.5, 0.3, 0.1, 1.0]; // Darker brown
    legBackLeft.textureNum = -2;
    legBackLeft.matrix = bodyconstruct;
    legBackLeft.matrix.translate(3.0, -0.03, 1);
    legBackLeft.matrix.scale(1.0, 0.9, 0.15);
    legBackLeft.render();

    // back right leg
    var legBackRight = new Cube();
    legBackRight.color = [0.5, 0.3, 0.1, 1.0]; // Darker brown
    legBackRight.textureNum = -2;
    legBackRight.matrix = bodyconstruct;
    legBackRight.matrix.translate(1.4, -0.01, 0.50);
    legBackRight.matrix.scale(1.0, 0.67, 0.15);
    legBackRight.render();

  // Tail of the dog
  var tail = new Cube();
  tail.color = [0.9, 0.7, 0.5, 1.0]; // Lighter brown, almost beige
  tail.textureNum = 3;
  tail.matrix = bodyconstruct;
  tail.matrix.translate(0.8, 0.7, 0.5);
  tail.matrix.rotate(g_tail, 0, 1, 0); 
  tail.matrix.rotate(45, 0, 1, 0);
  tail.matrix.scale(3, 1.0, 0.15);
  tail.render();

}