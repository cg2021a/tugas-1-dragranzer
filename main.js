function main(){
    var canvas = document.getElementById("Canvas");
    var gl = canvas.getContext("webgl");

    var leftVertices = [
        // kubus sisi atas
        //segitiga 1 egh
        -0.74, 0.66,   222/255, 184/255, 135/255,  
        -0.76, 0.59,  222/255, 184/255, 135/255, 
        -0.21, 0.66,  222/255, 184/255, 135/255, 

        //segitiga 2 hef
        -0.76, 0.59,  222/255, 184/255, 135/255, 
        -0.21, 0.66,  222/255, 184/255, 135/255, 
        -0.2, 0.59,  222/255, 184/255, 135/255, 

        //kubus sisi depan
        //segitiga 1 efc
        -0.76, 0.59,  205/255, 133/255, 63/255, 
        -0.2, 0.59,  205/255, 133/255, 63/255, 
        -0.68, 0,  205/255, 133/255, 63/255,

        //segitiga 2 cfd
        -0.68, 0,  205/255, 133/255, 63/255,
        -0.2, 0.59,  205/255, 133/255, 63/255,  
        -0.25, 0,  205/255, 133/255, 63/255,

    ];

    var rightVertices = [
        // balok sisi atas
        0.35, 0.64, 222/255, 184/255, 135/255,
        0.33, 0.45, 222/255, 184/255, 135/255,
        0.43, 0.64, 222/255, 184/255, 135/255,
        
        0.33, 0.45, 222/255, 184/255, 135/255,
        0.43, 0.64, 222/255, 184/255, 135/255,
        0.44, 0.45, 222/255, 184/255, 135/255,

        // balok sisi samping
        0.33, 0.45, 205/255, 133/255, 63/255,
        0.44, 0.45, 205/255, 133/255, 63/255,
        0.35, 0.1, 205/255, 133/255, 63/255,

        0.44, 0.45, 205/255, 133/255, 63/255,
        0.35, 0.1, 205/255, 133/255, 63/255,
        0.42, 0.1, 205/255, 133/255, 63/255,
    ];

    var vertices = [...leftVertices,...rightVertices]; 

    // Create a linked-list for storing the vertices data
    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderSource = `
        attribute vec2 aPosition;
        attribute vec3 aColor;
        varying  vec3 vColor;
        uniform mat4 uTranslate;
        void main(){
            gl_Position = uTranslate * vec4(aPosition, 0.0, 1.0); // Center of the coordinate
            vColor = aColor;
        }
    `;

    var fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main(){
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;
    
    // Create .c in GPU
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentShaderSource);
    
    // Compile .c into .o
    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    
    // Prepare a .exe shell (shader program)
    var shaderProgram = gl.createProgram();

     // Put the two .o files into the shell
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    
    // Link the two .o files, so together they can be a runnable program/context.
    gl.linkProgram(shaderProgram);
    // Start using the context (analogy: start using the paints and the brushes)
    gl.useProgram(shaderProgram);
    
    // Teach the computer how to collect
    // the positional values from ARRAY_BUFFER
    // to each vertex being processed
    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    var speed = 0.0052;
    var dy = 0;
    // Create a uniform to animate the vertices
    const uTranslate = gl.getUniformLocation(shaderProgram, 'uTranslate');
    
    function render() {
        //control the bouncing range
        if (dy >= 0.4 || dy <= -1.1) speed = -speed;
		dy += speed;
        
        const rightPosition = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0, dy, 0.0, 1.0,
	]

	const leftPosition = [
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0, 0.0, 0.0, 1.0,
	]
		
        //coloring canvas
	gl.clearColor(0.7, 0.6, 0.6, 0.8); 
	gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniformMatrix4fv(uTranslate, false, leftPosition);
        gl.drawArrays(gl.TRIANGLES, 0, leftVertices.length/5);

		gl.uniformMatrix4fv(uTranslate, false, rightPosition);
        gl.drawArrays(gl.TRIANGLES, leftVertices.length/5, rightVertices.length/5);
            
        requestAnimationFrame(render);
    }
    render();
}
