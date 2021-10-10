function main() {
    const canvas = document.querySelector("#myCanvas");
    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 50;
    const aspect = 2; // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 120;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    let lights = [];
    const directLight1 = new THREE.DirectionalLight(0xff9900, 1);
    const directLight2 = new THREE.DirectionalLight(0xff9900, 1);
    const directLight3 = new THREE.DirectionalLight(0x0088ff, 1);
    const directLight4 = new THREE.DirectionalLight(0x00ff88, 1);

    const pointLight1 = new THREE.PointLight(0xff9900, 1);
    const pointLight2 = new THREE.PointLight(0xff2200, 1);
    const pointLight3 = new THREE.PointLight(0x0088ff, 1);
    const pointLight4 = new THREE.PointLight(0x00ff88, 1);

    const spotLight1 = new THREE.SpotLight(0xff9900, 2, 200, 0.5, 0.25);
    const spotLight2 = new THREE.SpotLight(0xff2200, 2, 200, 0.5, 0.25);
    const spotLight3 = new THREE.SpotLight(0x0088ff, 2, 200, 0.5, 0.25);
    const spotLight4 = new THREE.SpotLight(0x00ff88, 2, 200, 0.5, 0.25);

    directLight1.position.set(6, 2, 0);
    directLight1.target.position.set(0, 0, 0);
    directLight2.position.set(-6, 2, 0);
    directLight2.target.position.set(0, 0, 0);
    directLight3.position.set(0, 2, 6);
    directLight3.target.position.set(0, 0, 0);
    directLight2.position.set(0, 2, -6);
    directLight4.target.position.set(0, 0, 0);

    pointLight1.position.set(100, 0, 0);
    pointLight2.position.set(-100, 0, 0);
    pointLight3.position.set(0, 0, 100);
    pointLight4.position.set(0, 0, -100);

    spotLight1.position.set(100, 1, 100);
    spotLight1.target.position.set(1, -3, 1);
    spotLight2.position.set(-100, 1, 100);
    spotLight2.target.position.set(-1, -3, 1);
    spotLight3.position.set(100, 1, -100);
    spotLight3.target.position.set(1, -3, -1);
    spotLight4.position.set(-100, 1, -100);
    spotLight4.target.position.set(-1, -3, -1);

    lights.push(directLight1);
    lights.push(directLight2);
    lights.push(directLight3);
    lights.push(directLight4);

    lights.push(pointLight1);
    lights.push(pointLight2);
    lights.push(pointLight3);
    lights.push(pointLight4);

    lights.push(spotLight1);
    lights.push(spotLight2);
    lights.push(spotLight3);
    lights.push(spotLight4);

    lights.forEach((light) => {
        scene.add(light);
        light.visible = false;
    });

    lights[0].visible = true;
    lights[1].visible = true;
    lights[2].visible = true;
    lights[3].visible = true;

    const buttons = document.querySelectorAll("button");
    buttons.forEach((button, index1) => {
        button.addEventListener("click", () => {
            buttons.forEach((button, index2) => {
                let indexLight = (index2 + 1) * 4;
                if (button.classList.contains("active")) {
                    button.classList.remove("active");
                }
                if (index2 !== index1) {
                    lights[indexLight - 4].visible = false;
                    lights[indexLight - 3].visible = false;
                    lights[indexLight - 2].visible = false;
                    lights[indexLight - 1].visible = false;
                    console.log(indexLight - 2);
                    console.log(indexLight - 1);
                    // console.log(index2);
                }
            });
            button.classList.toggle("active");
            let indexLight = (index1 + 1) * 4;
            lights[indexLight - 4].visible = true;
            lights[indexLight - 3].visible = true;
            lights[indexLight - 2].visible = true;
            lights[indexLight - 1].visible = true;
        });
    });

    const objects = [];
    const spread = 15;

    function addObject(x, y, obj) {
        obj.position.x = x * spread;
        obj.position.y = y * spread;

        scene.add(obj);
        objects.push(obj);
    }

    function createMaterial(material) {
        return material;
    }

    function addGeometry(x, y, geometry, material) {
        const mesh = new THREE.Mesh(geometry, material);
        addObject(x, y, mesh);
    }

    //make Extrude Gemometry
    {
        const outline = new THREE.Shape([
            [ -2, -0.1], [  2, -0.1], [ 2,  0.6],
            [1.6,  0.6], [1.6,  0.1], [-2,  0.1],
        ].map(p => new THREE.Vector2(...p)));
        
        const x = -2.5;
        const y = -5;
        const shape = new THREE.CurvePath();
        const points = [
            [x + 2.5, y + 2.5],
            [x + 2.5, y + 2.5], [x + 2,   y      ], [x,       y      ],
            [x - 3,   y      ], [x - 3,   y + 3.5], [x - 3,   y + 3.5],
            [x - 3,   y + 5.5], [x - 1.5, y + 7.7], [x + 2.5, y + 9.5],
            [x + 6,   y + 7.7], [x + 8,   y + 4.5], [x + 8,   y + 3.5],
            [x + 8,   y + 3.5], [x + 8,   y      ], [x + 5,   y      ],
            [x + 3.5, y      ], [x + 2.5, y + 2.5], [x + 2.5, y + 2.5],
        ].map(p => new THREE.Vector3(...p, 0));
        for (let i = 0; i < points.length; i += 3) {
        shape.add(new THREE.CubicBezierCurve3(...points.slice(i, i + 4)));
        }
        
        const extrudeSettings = {
        steps:  10,  
        
        bevelEnabled: false,
        extrudePath: shape,
        };
        
        // const geometry =  new THREE.ExtrudeGeometry(outline, extrudeSettings);
        // return geometry;

        addGeometry(
            -2,
            2,
            new THREE.ExtrudeGeometry(outline, extrudeSettings),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0xffd700,
                    shininess: 150,
                })
            )
        );
    }
    //make cube 2
    {
        const width = 8;
        const height = 8;
        const depth = 8;
        addGeometry(
            2,
            -2,
            new THREE.BoxGeometry(width, height, depth),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0xffd700,
                    shininess: 150,
                })
            )
        );
    }
    //make torus
    {
        // const radius = 5;
        const radius = 110;
        addGeometry(
            0,
            0,
            new THREE.OctahedronGeometry(radius),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0x00ff88,
                    side: THREE.DoubleSide,
                    wireframe: true,
                    shininess: 150,
                })
            )
        );
    }
    //make dodecahedron 1
    {
        const radius = 10;
        const detail = 100;
        addGeometry(
            0,
            0,
            new THREE.DodecahedronGeometry(radius, detail),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0x00ff88,
                    side: THREE.DoubleSide,
                    wireframe: true,
                    shininess: 150,
                })
            )
        );
    }
    //make dodecahedron 2
    {
        const radius = 10;
        const detail = 100;
        addGeometry(
            0,
            0,
            new THREE.DodecahedronGeometry(radius, detail),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0x00ff88,
                    side: THREE.DoubleSide,
                    wireframe: true,
                    shininess: 150,
                })
            )
        );
    }
    // make bola 1
    {
        const radius = 10;  
        const widthSegments = 12;  
        const heightSegments = 8;
        addGeometry(
            1,
            1,
            new THREE.SphereGeometry(radius, widthSegments, heightSegments),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0x00ffff,
                    side: THREE.DoubleSide,
                    wireframe: true,
                    shininess: 50,
                })
            )
        );
        // const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    }
    // make bola 2
    {
        const radius = 10;  
        const widthSegments = 12;  
        const heightSegments = 8;
        addGeometry(
            -1,
            -1,
            new THREE.SphereGeometry(radius, widthSegments, heightSegments),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0x00ffff,
                    side: THREE.DoubleSide,
                    wireframe: true,
                    shininess: 50,
                })
            )
        );
        // const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    }
    {
        const radius =  5.5;  
        const tubeRadius = 2;  
        const radialSegments = 8;  
        const tubularSegments = 24;
        addGeometry(
            1,
            -4,
            new THREE.TorusGeometry(
                radius, tubeRadius,
                radialSegments, tubularSegments),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0x00ffff,
                    side: THREE.DoubleSide,
                    wireframe: true,
                    shininess: 50,
                })
            )
        );
        // const geometry = new THREE.TorusGeometry(
        //     radius, tubeRadius,
        //     radialSegments, tubularSegments);
    }
    {
        const radius = 3.5;  
        const tubeRadius = 1.5;  
        const radialSegments = 8;  
        const tubularSegments = 64;  
        const p = 2;  
        const q = 3;  
        addGeometry(
            2,
            4,
            new THREE.TorusKnotGeometry(
                radius, tubeRadius, tubularSegments, radialSegments, p, q),
            createMaterial(
                new THREE.MeshPhongMaterial({
                    color: 0x00ffff,
                    side: THREE.DoubleSide,
                    wireframe: true,
                    shininess: 50,
                })
            )
        );
    }

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function animateRotate(obj, time) {
        const speed = 1;
        const rot = time * speed;
        obj.rotation.x = rot;
        obj.rotation.y = rot;
    }
    function animateTranslate(obj) {
        const speed = 1;

        if (obj.position.x <= 30 && obj.position.y >= 29) {
            obj.position.x += speed;
        } else if (obj.position.x >= 29 && obj.position.y >= -30) {
            obj.position.y -= speed;
        } else if (obj.position.x >= -30) {
            obj.position.x -= speed;
        } else if (obj.position.y <= 30) {
            obj.position.y += speed;
        }
    }
    function animateCircularY(obj, time, reverse) {
        const speed = time;

        obj.position.y = 10 * Math.sin(speed) * 3.8 * -1;
        obj.position.z = 10 * Math.cos(speed) * 3.8 * -1;
        if (reverse) {
            obj.position.y = -obj.position.y;
            obj.position.z = -obj.position.z;
        }
    }
    function animateCircularX(obj, time, reverse) {
        const speed = time;

        obj.position.x = 10 * Math.sin(speed) * 7;
        obj.position.z = 10 * Math.cos(speed) * 7;
        if (reverse) {
            obj.position.x = -obj.position.x;
            obj.position.z = -obj.position.z;
        }
    }

    let yPosSpeed = 8 / 1000;
    let xRotSpeed = 0.75 / 1000;
    let speed = 0;
    function moveCamera() {
        speed += yPosSpeed;
        camera.position.x = 200 * Math.sin(speed);
        camera.position.z = 200 * Math.cos(speed);
        camera.rotation.y += yPosSpeed;

        requestAnimationFrame(moveCamera);
    }
    moveCamera();

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        objects.forEach((obj, ndx) => {
            const speed = 1;
            const rot = time * speed;
            obj.rotation.x = rot;
            obj.rotation.y = rot;
        });
        // animateTranslate(objects[0]);
        // animateTranslate(objects[1]);

        // animateRotate(objects[0], time);
        // animateRotate(objects[1], time);
        animateRotate(objects[2], time);

        // animateCircularY(objects[3], time, false);
        // animateCircularY(objects[4], time, true);

        animateCircularX(objects[5], time, false);
        animateCircularX(objects[6], time, true);

        animateCircularY(objects[7], time, true);
        

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();