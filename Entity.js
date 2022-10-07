const Enttity = function createSceneObject(options) {
    
    let { app, bodies, world, engine, image } = options;

    // Matter Body
    const imageBody = bodies.rectangle(
      image.initialPosition.x,
      image.initialPosition.y,
      image.width,
      image.height,
      {
        restitution: 0.8,
      }
    );
    world.addBody(engine.world, imageBody);
  
    // Pixi Sprite
    // The sprite can be anything from the Pixi api. Video, image, make it into a circle, mask it, etc. You just need to make sure the proper anchor point is set, its added to the stage and that it follows the body in our pixi app ticker.
    const imageSprite = new PIXI.Sprite.from(image.src);
    imageSprite.width = image.width;
    imageSprite.height = image.height;
    imageSprite.position;
    imageSprite.anchor.set(0.5, 0.5);
    app.stage.addChild(imageSprite);
    
    // Add the complete scene object (body and sprite) to our array of objects. We'll track those objects in the pixi frame updates (see app.ticker below).
    return {
      body: imageBody,
      sprite: imageSprite,
    };
  }
  
export { Enttity };