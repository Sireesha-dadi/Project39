var PLAY=1;
var END=0;
var gameState= PLAY;
var mario, mario_running, mario_collide,brickImage;
var ground, groundImage, invisibleGround,bg,bgImage;
var obsImage, obsGroup, bricksGroup, gameoverImage, restartImage;
var score=0, gameOver,restart;
var jumpSound,cpSound;

function preload(){
  
  mario_running=loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  mario_collide=loadAnimation("collided.png");
  
  groundImage=loadImage("ground2.png");
  bgImage=loadImage("bg.png");
  
  brickImage=loadImage("brick.png");
  obsImage=loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png")
 
  gameoverImage=loadImage("gameOver.png");
  restartImage=loadImage("restart.png");
  
  jumpSound= loadSound("jump.mp3");
  cpSound= loadSound("checkPoint.mp3");
}

function setup(){
  
  createCanvas(600,400);
  //create background
  bg= createSprite(300,200,600,400);
  bg.addImage(bgImage);
  
  //create a Mario sprite
  mario= createSprite(50,300,20,50);
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided",mario_collide);
  mario.scale=2;
  mario.x=50;
  
  mario.debug=true;
  mario.setCollider("rectangle",0,0,30,35);
  
  //create ground Sprite
  ground= createSprite(200,370,400,20);
  ground.addImage(groundImage);
  ground.x=ground.width/2;
  ground.velocityX=-6;
  
  //create invisible ground
  invisibleGround= createSprite(200,340,400,10);
  invisibleGround.visible=false;
  
  //create groups for bricks and obstacle
  obsGroup= new Group();
  bricksGroup= new Group();
  
  gameOver=createSprite(300,200);
  gameOver.addImage(gameoverImage);
  gameOver.scale=0.5;
  
  restart= createSprite(300,240);
  restart.addImage(restartImage);
  restart.scale=0.5;
}

function draw(){
  
 // background("white");
  
  
 camera.position= mario.x;
  if(gameState === PLAY){
    
    gameOver.visible=false;
    restart.visible=false;
    
    score=score+ Math.round(frameRate()/60);
   // console.log(frameRate());
    
     // Make mario jump with space key
  if(keyDown("space") && mario.y>=297){
    mario.velocityY=-15;
    jumpSound.play();
  }
  
  //Assign gravity to Mario
  mario.velocityY= mario.velocityY+0.8;
  
  //reset ground
  if(ground.x<0){
  ground.x=ground.width/2; 
  }
   
    //Play sound when score increases by 100
    if(score>0 && score % 100===0){
      cpSound.play();
    }
  
    
  for (var i = 0; i < bricksGroup.length; i++) {
    console.log(i);
      if(bricksGroup.get(i).isTouching(mario)){
      bricksGroup.get(i).remove()
      score =score+1;
    }
    }
   
    //Spawn bricks and obstacles   
     spawnBricks();
     spawnObs();
      
      
    //chnage gameState to end when mario touches obstacle
    if(obsGroup.isTouching(mario)){
      gameState = END;
    } 
    
  } else if(gameState === END){
    
    gameOver.visible=true;
    restart.visible=true;
    
    mario.changeAnimation("collided",mario_collide); 
    mario.velocityY=0;
    ground.velocityX=0;
    obsGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    
    obsGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
      
    //restart game by clicking restart button
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
   
 
  mario.collide(invisibleGround);
  

  drawSprites();
  text("Score= "+score,400,50);
  
}

function spawnBricks(){
  
  if(frameCount %60 ===0){
   var brick= createSprite(600,200,40,10);
    brick.velocityX=-3;
    brick.addImage(brickImage);
    brick.y=Math.round(random(150,200));
    brick.lifetime=200;        
    bricksGroup.add(brick);
  }
}

function spawnObs(){
  
  if(frameCount %120 ===0){
    var obs= createSprite(600,300,10,40);
    obs.addAnimation("obstacle",obsImage);
    obs.velocityX=-6;
    
    obsGroup.add(obs);
   
    
    obs.lifetime=200;
  }
}

function reset(){
  gameState=PLAY;
  gameOver.visible=false;
  restart.visible=false;
  
  bricksGroup.destroyEach();
  obsGroup.destroyEach();
  mario.changeAnimation("running", mario_running);
  score=0;
}