import { Enttity } from "./Entity.js";
import { Rect } from "./Rect.js";

/*--------------------------
Setup
--------------------------*/

// Matter Modules
const Engine = Matter.Engine;
const Render = Matter.Render;
const Runner = Matter.Runner;
const World = Matter.World;
const Body = Matter.Body;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

// Scene Container
const sceneContainer = document.querySelector(".scene");
const canvasWidth = sceneContainer.offsetWidth;
const canvasHeight = sceneContainer.offsetHeight;

/*--------------------------
Engine
---
Setup the Matter engine. This is what the Matter bodies will run in.
--------------------------*/

const engine = Engine.create();

/*--------------------------
Pixi Data
--------------------------*/

const images = [
  {
    src: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
    initialPosition: {
      x: 300,
      y: 180
    },
    width: 200,
    height: 100
  },
  {
    src: "https://images.unsplash.com/photo-1526312426976-f4d754fa9bd6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
    initialPosition: {
      x: 300,
      y: 180
    },
    width: 200,
    height: 100
  },
  {
    src: "https://images.unsplash.com/photo-1534214526114-0ea4d47b04f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80",
    initialPosition: {
      x: 500,
      y: 180
    },
    width: 200,
    height: 100
  },
  {
    src: "./images/test.png",
    initialPosition: {
      x: 350,
      y: 280
    },
    width: 200,
    height: 100
  },
];


// This will be populated as we create our bodies and sprites from the images.
const sceneObjects = [];

/*--------------------------
Setup Walls
---
Walls will keep our bodies and sprites within a confined area.
--------------------------*/

const wallTop = Bodies.rectangle(canvasWidth / 2, 0, canvasWidth, 10, {
  isStatic: true
});
const wallBottom = Bodies.rectangle(
  canvasWidth / 2,
  canvasHeight,
  canvasWidth,
  10,
  {
    isStatic: true
  }
);
const wallRight = Bodies.rectangle(
  canvasWidth,
  canvasHeight / 2,
  10,
  canvasHeight,
  {
    isStatic: true
  }
);
const wallLeft = Bodies.rectangle(0, canvasHeight / 2, 10, canvasHeight, {
  isStatic: true
});

// Add Matter walls to the world. This will keep the bodies within certain parameters.
World.add(engine.world, [wallBottom, wallTop, wallLeft, wallRight]);

/*--------------------------
Pixi
--------------------------*/

// Setup Pixi renderer to match the same size as the Matter world.
const app = new PIXI.Application({
  transparent: true,
  resizeTo: sceneContainer
});

// Put the pixi apps canvas into the scene container.
document.querySelector(".scene").appendChild(app.view);

/*--------------------------
Create Scene Object
--------------------------*/

const options ={
    app: app,
    bodies: Bodies,
    world: World,
    engine: engine,
    image: images[2]
};

//t1 test
const t1 = Enttity(options);
sceneObjects.push(t1);


function createSceneObject(image) {
  // Matter Body
  const imageBody = Bodies.rectangle(
    image.initialPosition.x,
    image.initialPosition.y,
    image.width,
    image.height,
    {
      restitution: 0.8,
    }
  );
  World.addBody(engine.world, imageBody);

  // Pixi Sprite
  // The sprite can be anything from the Pixi api. Video, image, make it into a circle, mask it, etc. You just need to make sure the proper anchor point is set, its added to the stage and that it follows the body in our pixi app ticker.
  const imageSprite = new     PIXI.Sprite.from(image.src);
  imageSprite.width = image.width;
  imageSprite.height = image.height;
  imageSprite.position;
  imageSprite.anchor.set(0.5, 0.5);
  app.stage.addChild(imageSprite);
  
  // Add the complete scene object (body and sprite) to our array of objects. We'll track those objects in the pixi frame updates (see app.ticker below).
  sceneObjects.push({
    body: imageBody,
    sprite: imageSprite,
  });
}

/*--------------------------
Pixi Frame Updates
--------------------------*/

app.ticker.add(() => {
  sceneObjects.forEach(object => {
    // Make all pixi sprites follow the position and rotation of their body.
    object.sprite.position = object.body.position;
    object.sprite.rotation = object.body.angle;
  });

});

/*--------------------------
Mouse Control
---
Add the mouse to the Pixi frame. This is how you enable interaction with the bodies. We aren't using the Matter renderer so need the mouse to be attached to our invisible Matter engine that runs on top of the Pixi world.
--------------------------*/

const mouseConstraint = MouseConstraint.create(engine, {
  mouse: Mouse.create(document.querySelector(".scene canvas")),
});

World.add(engine.world, mouseConstraint);

/*--------------------------
Run
--------------------------*/

// Create the bodies and sprites.
images.forEach(image => {
  createSceneObject(image);
});

// Run the Matter engine. This continuously updates the Matter.Engine. It ensures we can listen for the updates on each tick and move the Pixi objects with Matter bodies (see app.ticker function).
let runner = Runner.create();
Runner.run(runner, engine);