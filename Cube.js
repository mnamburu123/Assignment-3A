class Cube{
    constructor(){
      this.type = 'cube';
      this.color = [1.0, 1.0, 1.0, 1.0];
      this.matrix = new Matrix4();
      this.textureNum = -1;
    }
    render() {
  
      var rgba = this.color;

      gl.uniform1i(u_whichTexture, this.textureNum);

  
      gl.uniform4f(u_FragColor, rgba[0],rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);


      drawTriangle3DUV([0,0,0,   1,1,0,   1,0,0], [1, 0, 0, 1, 1, 1]);
      drawTriangle3DUV([0,0,0,   0,1,0,   1,1,0], [0, 0, 0, 1, 1, 1]);

      gl.uniform4f(u_FragColor, rgba[0]*.9,rgba[1]*.9, rgba[2]*.9, rgba[3]);
      
      // Front of the cube
      drawTriangle3D([0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0]);
      drawTriangle3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0]);

      // Back of the cube
      drawTriangle3D([0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0]);
      drawTriangle3D([0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);

      // Top of the cube
      drawTriangle3D([0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
      drawTriangle3D([0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0]);

      // Bottom of the cube
      drawTriangle3D([0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0]);
      drawTriangle3D([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0]);

      // Right of the cube
      drawTriangle3D([1.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0]);
      drawTriangle3D([1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0]);

      // Left of the cube
      drawTriangle3D([0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0]);
      drawTriangle3D([0.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0]);
      
      
    }
  }
  
  