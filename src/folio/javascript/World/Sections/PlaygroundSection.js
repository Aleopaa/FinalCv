import * as THREE from 'three';

export default class PlaygroundSection {
    constructor(_options) {
        // Options
        this.time = _options.time;
        this.resources = _options.resources;
        this.objects = _options.objects;
        this.areas = _options.areas;
        this.walls = _options.walls;
        this.tiles = _options.tiles;
        this.debug = _options.debug;
        this.x = _options.x;
        this.y = _options.y;

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder('playgroundSection');
            // this.debugFolder.open();
        }

        // Set up
        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        this.resources.items.areaResetTexture.magFilter = THREE.NearestFilter;
        this.resources.items.areaResetTexture.minFilter = THREE.LinearFilter;

       this.setStatic();
       // this.setBricksWalls();
       // this.setBowling();
        this.setVinyls();
        this.setNovels();

        
    }

   /* setAnimeImages(){
        //SET ANIME IMAGES UP FOR THE MONITORS HERE AND THEN HOST THE SITE TO SHOW TOMORROW
        });  
    }*/


    setStatic() {
        this.objects.add({
            base: this.resources.items.playgroundStaticBase.scene,
            collision: this.resources.items.playgroundStaticCollision.scene,
            floorShadowTexture: this.resources.items.playgroundStaticFloorShadowTexture,
            offset: new THREE.Vector3(this.x, this.y, 0),
            mass: 0
        });
    }

    setBricksWalls() {
        // Set up
        this.brickWalls = {};
        this.brickWalls.x = this.x + 15;
        this.brickWalls.y = this.y + 14;
        this.brickWalls.items = [];

        // Brick options
        this.brickWalls.brickOptions = {
            base: this.resources.items.brickBase.scene,
            collision: this.resources.items.brickCollision.scene,
            offset: new THREE.Vector3(0, 0, 0.1),
            rotation: new THREE.Euler(0, 0, 0),
            duplicated: true,
            shadow: { sizeX: 1.2, sizeY: 1.8, offsetZ: -0.15, alpha: 0.35 },
            mass: 0.5,
            soundName: 'brick'
        };

        this.brickWalls.items.push(
            this.walls.add({
                object: this.brickWalls.brickOptions,
                shape: {
                    type: 'rectangle',
                    widthCount: 5,
                    heightCount: 6,
                    position: new THREE.Vector3(this.brickWalls.x - 6, this.brickWalls.y, 0),
                    offsetWidth: new THREE.Vector3(0, 1.05, 0),
                    offsetHeight: new THREE.Vector3(0, 0, 0.45),
                    randomOffset: new THREE.Vector3(0, 0, 0),
                    randomRotation: new THREE.Vector3(0, 0, 0.4)
                }
            }),
            this.walls.add({
                object: this.brickWalls.brickOptions,
                shape: {
                    type: 'brick',
                    widthCount: 5,
                    heightCount: 6,
                    position: new THREE.Vector3(this.brickWalls.x - 12, this.brickWalls.y, 0),
                    offsetWidth: new THREE.Vector3(0, 1.05, 0),
                    offsetHeight: new THREE.Vector3(0, 0, 0.45),
                    randomOffset: new THREE.Vector3(0, 0, 0),
                    randomRotation: new THREE.Vector3(0, 0, 0.4)
                }
            }),
            this.walls.add({
                object: this.brickWalls.brickOptions,
                shape: {
                    type: 'triangle',
                    widthCount: 6,
                    position: new THREE.Vector3(this.brickWalls.x - 18, this.brickWalls.y, 0),
                    offsetWidth: new THREE.Vector3(0, 1.05, 0),
                    offsetHeight: new THREE.Vector3(0, 0, 0.45),
                    randomOffset: new THREE.Vector3(0, 0, 0),
                    randomRotation: new THREE.Vector3(0, 0, 0.4)
                }
            })
        );

        // Reset
        this.brickWalls.reset = () => {
            for (const _wall of this.brickWalls.items) {
                for (const _brick of _wall.items) {
                    _brick.collision.reset();
                }
            }
        };

        // Reset area
        this.brickWalls.resetArea = this.areas.add({
            position: new THREE.Vector2(this.brickWalls.x, this.brickWalls.y),
            halfExtents: new THREE.Vector2(2, 2)
        });
        this.brickWalls.resetArea.on('interact', () => {
            this.brickWalls.reset();
        });

        // Reset label
        this.brickWalls.areaLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.5), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0xffffff, alphaMap: this.resources.items.areaResetTexture }));
        this.brickWalls.areaLabelMesh.position.x = this.brickWalls.x;
        this.brickWalls.areaLabelMesh.position.y = this.brickWalls.y;
        this.brickWalls.areaLabelMesh.matrixAutoUpdate = false;
        this.brickWalls.areaLabelMesh.updateMatrix();
        this.container.add(this.brickWalls.areaLabelMesh);

        // Debug
        if (this.debugFolder) {
            this.debugFolder.add(this.brickWalls, 'reset').name('brickWalls reset');
        }
    }

    setNovels() {
        this.novels = {};
        this.novels.items = []; // Initialize the items array
    
        this.novels.novelOptions = {
            base: this.resources.items.novelBase.scene,
            collision: this.resources.items.novelCollision.scene,
            offset: new THREE.Vector3(0, 0, 0.1),
            rotation: new THREE.Euler(0, 0, 0),
            duplicated: true,
            shadow: { sizeX: 1.2, sizeY: 1.8, offsetZ: -0.15, alpha: 0.35 },
            mass: 0.5,
            soundName: 'songThree'
        };
    
        const numBooksPerStack = 5; // Adjust as needed
        const numBooksPerStack2 = 10; // Adjust as needed
        const manualBookHeight = 0.4; // Manually set the book height
        const spacing = 0.01; // Adjust the spacing between books
    
        // Ensure `this.z` is defined, otherwise use a default value
        const startZ = (typeof this.z !== 'undefined') ? this.z : 0;
        console.log('Start Z:', startZ);
    
        const stack1X = -50; // X position for the first stack
        const stack2X = -50; // X position for the second stack
        const stack3X = -52; // X position for the third stack
        const stack4X = -52; // X position for the forth stack

        const stack1Y = -50; // X position for the first stack
        const stack2Y = -41; // X position for the second stack
        const stack3Y = -51; // X position for the third stack
        const stack4Y = -39; // X position for the forth stack



    // Define two stacks of novel positions
    const stack1Positions = [];
    const stack2Positions = [];
    const stack3Positions = [];
    const stack4Positions = [];

    for (let i = 0; i < numBooksPerStack; i++) {
        stack1Positions.push(new THREE.Vector3(
            stack1X,
            stack1Y,
            startZ + i * (manualBookHeight + spacing)
        ));

        stack2Positions.push(new THREE.Vector3(
            stack2X,
            stack2Y,
            startZ + i * (manualBookHeight + spacing)
        ));
    }
    
        for (let i = 0; i < numBooksPerStack2; i++) {
            stack3Positions.push(new THREE.Vector3(
                stack3X,
                stack3Y,
                startZ + i * (manualBookHeight + spacing)
            ));

        stack4Positions.push(new THREE.Vector3(
            stack4X,
            stack4Y,
            startZ + i * (manualBookHeight + spacing)
        ));
    }

    // Combine the positions of both stacks
    const novelPositions = stack1Positions.concat(stack2Positions).concat(stack3Positions).concat(stack4Positions);

    for (let i = 0; i < novelPositions.length; i++) {
        const position = novelPositions[i];

        // Random rotation around the Z-axis only
        const randomRotationZ = (Math.random() - 0.5) * 0.3; // Small random rotation for Z axis only
        const rotation = new THREE.Euler(
            this.novels.novelOptions.rotation.x,
            this.novels.novelOptions.rotation.y,
            this.novels.novelOptions.rotation.z + randomRotationZ
        );

        console.log(`Book ${i + 1} position:`, position);
        console.log(`Book ${i + 1} rotation:`, rotation);

        this.novels.items.push(
            this.objects.add({
                base: this.resources.items.novelBase.scene,
                collision: this.resources.items.novelCollision.scene,
                offset: position,
                rotation: rotation,
                duplicated: this.novels.novelOptions.duplicated,
                shadow: this.novels.novelOptions.shadow,
                mass: this.novels.novelOptions.mass,
                soundName: 'testThree'
            })
        );
    }

    // Optional: Add reset functionality, area, label, and debug as needed
    // Example reset function:
    this.novels.reset = () => {
        for (const novel of this.novels.items) {
            novel.collision.reset();
        }
    };

    // Example reset area:
    this.novels.resetArea = this.areas.add({
        position: new THREE.Vector2(this.x - 13, this.y - 24),
        halfExtents: new THREE.Vector2(2, 2)
    });

    this.novels.resetArea.on('interact', () => {
        this.novels.reset();
    });

    // Example reset label:
    this.novels.areaLabelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 0.5),
        new THREE.MeshBasicMaterial({
            transparent: true,
            depthWrite: false,
            color: 0xffffff,
            alphaMap: this.resources.items.areaResetTexture
        })
    );
    this.novels.areaLabelMesh.position.copy(new THREE.Vector3(this.x - 13, this.y - 24, 0));
    this.novels.areaLabelMesh.matrixAutoUpdate = false;
    this.novels.areaLabelMesh.updateMatrix();
    this.container.add(this.novels.areaLabelMesh);

    // Debug
    if (this.debugFolder) {
        this.debugFolder.add(this.novels, 'reset').name('novels reset');
    }
}
setVinyls() {
    this.vinyls = {};
    this.vinyls.items = []; // Initialize the items array

    // Define vinyl options for the initial vinyl object
    const initialVinylOptions = {
        base: this.resources.items.vinylBase.scene.clone(), // Clone to create new instance
        collision: this.resources.items.vinylCollision.scene.clone(), // Clone to create new instance
        offset: new THREE.Vector3(0, 0, 0.1),
        rotation: new THREE.Euler(0, 0, 0),
        duplicated: true,
        shadow: { sizeX: 1.2, sizeY: 1.8, offsetZ: -0.15, alpha: 0.35 },
        mass: 0.5,
        soundName: 'testOne'
    };

    // Add initial vinyl object directly to this.vinyls.items
    //const initialVinylObject = this.createVinylObject(initialVinylOptions);
    //this.vinyls.items.push(initialVinylObject);

    // Example: Place additional vinyls in zigzag formation
    const vinylPositions = [
        new THREE.Vector3(-54, -22, 0.25),
        new THREE.Vector3(-48, -19, 0.25),
        new THREE.Vector3(-42, -22, 0.25),
        new THREE.Vector3(-36, -19, 0.25),
        new THREE.Vector3(-30, -22, 0.25)
    ];

    for (let i = 0; i < vinylPositions.length; i++) {
        const position = vinylPositions[i];

        // Create vinyl object with adjusted position, using initial options
        const vinylOptions = {
            ...initialVinylOptions,
            base: this.resources.items.vinylBase.scene.clone(), // Clone to create new instance
            collision: this.resources.items.vinylCollision.scene.clone(), // Clone to create new instance
            offset: position
        };

        const vinylObject = this.createVinylObject(vinylOptions);
        this.vinyls.items.push(vinylObject);
    }

    // Example reset function:
    this.vinyls.reset = () => {
        for (const vinyl of this.vinyls.items) {
            vinyl.collision.reset();
        }
    };

    // Example reset area:
    this.vinyls.resetArea = this.areas.add({
        position: new THREE.Vector2(this.x - 12, this.y + 5), // Adjusted position example
        halfExtents: new THREE.Vector2(2, 2)
    });

    this.vinyls.resetArea.on('interact', () => {
        this.vinyls.reset();
    });

    // Example reset label:
    this.vinyls.areaLabelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 0.5),
        new THREE.MeshBasicMaterial({
            transparent: true,
            depthWrite: false,
            color: 0xffffff,
            alphaMap: this.resources.items.areaResetTexture
        })
    );
    this.vinyls.areaLabelMesh.position.copy(new THREE.Vector3(this.x - 12, this.y + 5, 0)); // Adjusted position example
    this.vinyls.areaLabelMesh.matrixAutoUpdate = false;
    this.vinyls.areaLabelMesh.updateMatrix();
    this.container.add(this.vinyls.areaLabelMesh);

    // Debug
    if (this.debugFolder) {
        this.debugFolder.add(this.vinyls, 'reset').name('vinyls reset');
    }

   /* // Update the rotation in the animation loop
    this.time.on('tick', () => {
        this.rotateVinyls(this.time.delta);
    });*/
}

// Function to create vinyl object
createVinylObject(options) {
    const vinyl = this.objects.add(options);
    vinyl.base = options.base;
    return vinyl;
}

// Function to rotate vinyls
/*rotateVinyls(delta) {
    const rotationSpeed = 0.5; // Adjust rotation speed as needed
    //console.log(`Rotating vinyls with delta: ${delta}`);
    
    this.vinyls.items.forEach(vinyl => {
        if (vinyl.base) {
            //console.log(`Before rotation: ${vinyl.base.rotation.z}`);
            //vinyl.base.rotation.z += rotationSpeed * delta * 0.001; // Convert delta to seconds
            //console.log(`After rotation: ${vinyl.base.rotation.z}`);
        } else {
           // console.warn('vinyl.base is undefined');
        }
    });
}
    */
    setBowling() {
        this.bowling = {};
        this.bowling.x = this.x + 15;
        this.bowling.y = this.y + 4;

        this.bowling.pins = this.walls.add({
            object: {
                base: this.resources.items.bowlingPinBase.scene,
                collision: this.resources.items.bowlingPinCollision.scene,
                offset: new THREE.Vector3(0, 0, 0.1),
                rotation: new THREE.Euler(0, 0, 0),
                duplicated: true,
                shadow: { sizeX: 1.4, sizeY: 1.4, offsetZ: -0.15, alpha: 0.35 },
                mass: 0.1,
                soundName: 'bowlingPin'
                // sleep: false
            },
            shape: {
                type: 'triangle',
                widthCount: 4,
                position: new THREE.Vector3(this.bowling.x - 25, this.bowling.y, 0),
                offsetWidth: new THREE.Vector3(0, 1, 0),
                offsetHeight: new THREE.Vector3(0.65, 0, 0),
                randomOffset: new THREE.Vector3(0, 0, 0),
                randomRotation: new THREE.Vector3(0, 0, 0)
            }
        });

        this.bowling.ball = this.objects.add({
            base: this.resources.items.bowlingBallBase.scene,
            collision: this.resources.items.bowlingBallCollision.scene,
            offset: new THREE.Vector3(this.bowling.x - 5, this.bowling.y, 0),
            rotation: new THREE.Euler(Math.PI * 0.5, 0, 0),
            duplicated: true,
            shadow: { sizeX: 1.5, sizeY: 1.5, offsetZ: -0.15, alpha: 0.35 },
            mass: 1,
            soundName: 'bowlingBall'
            // sleep: false
        });

        // Reset
        this.bowling.reset = () => {
            // Reset pins
            for (const _pin of this.bowling.pins.items) {
                _pin.collision.reset();
            }

            // Reset ball
            this.bowling.ball.collision.reset();
        };

        // Reset area
        this.bowling.resetArea = this.areas.add({
            position: new THREE.Vector2(this.bowling.x, this.bowling.y),
            halfExtents: new THREE.Vector2(2, 2)
        });
        this.bowling.resetArea.on('interact', () => {
            this.bowling.reset();
        });

        // Reset label
        this.bowling.areaLabelMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.5), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, color: 0xffffff, alphaMap: this.resources.items.areaResetTexture }));
        this.bowling.areaLabelMesh.position.x = this.bowling.x;
        this.bowling.areaLabelMesh.position.y = this.bowling.y;
        this.bowling.areaLabelMesh.matrixAutoUpdate = false;
        this.bowling.areaLabelMesh.updateMatrix();
        this.container.add(this.bowling.areaLabelMesh);

        // Debug
        if (this.debugFolder) {
            this.debugFolder.add(this.bowling, 'reset').name('bowling reset');
        }

        console.log(this.resources.items.novelBase);
        console.log(this.resources.items.vinylBase);
    }
}