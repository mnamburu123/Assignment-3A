class Oval {
    constructor(){
        this.type = "Oval";
        this.matrix = new Matrix4();
        this.radius = 1.0; 
        this.segements = 60; 
    }

    render() {
        var rgba = [1.0, 0.0, 0.0, 1.0];

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var angleStep = 360 / this.segements;
        var vertices = [];

        for (let i = 0; i <= this.segements; i++) {
            let angle = i * angleStep;
            let x = this.radius * Math.cos(angle);
            let y = this.radius * Math.sin(angle);
            vertices.push(x, y, 0); 
        }

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.segements + 1);
    }
}



