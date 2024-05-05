class Triangle{
    constructor(){
        this.type = 'triangle';
        this.position = [0.0,0.0,0.0];
        this.color = [1.0,1.0,1.0,1.0];
        this.size = 5.0;
    }

    render(){
    var xy = this.position;
    var rgba = this.color;
    var size = this.size;


    // Pass the color of a point to u_FragColor variable
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniform1f(u_Size, size);
    var d = this.size/200.0;
    // Draw
    //gl.drawArrays(gl.POINTS, 0, 1);
    drawTriangle([xy[0], xy[1], xy[0]+ d, xy[1], xy[0], xy[1] + d]);

}
}

function drawTriangle(vertices) {
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //if (a_Position < 0){
        //console.log('Failed to get the storage location of a_Position');
        //return -1;
    //}
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n );
  
    //return n;
}

function drawTriangle3D(vertices) {
    var n = 3;
    var vertexBuffer = gl.createBuffer();
    if(!vertexBuffer){
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    //var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    //if (a_Position < 0){
        //console.log('Failed to get the storage location of a_Position');
        //return -1;
    //}
    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  
    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, n );
  
    //return n;
}

function drawTriangle3DUV(vertices, uv) {
    // Check for sufficient data
    if (vertices.length < 9 || uv.length < 6) {
        console.log("Insufficient data for the draw call.");
        return;
    }

    var n = vertices.length / 3; // Three components per vertex (x, y, z)

    // Bind vertex buffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Bind UV buffer
    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, n);
}




