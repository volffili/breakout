// Paddle.js

/** @class Paddle
  * The Paddle in a Breakout game
  */
export default class Paddle {
	  constructor(maxspeed,friction,acc,x,y,width,height,game) {
	  	this.maxspeed = maxspeed;
	  	this.friction = friction;
	  	this.x = x;
	  	this.y = y;
	  	this.width = width;
	  	this.height = height;
	  	this.act_speed = 0;
	  	this.acc = acc;
	  	this.game = game;

    	this.sn_wall_block = [];
    	this.sn_wall_block.push(new Audio("sounds/wall_block1.wav"));
    	this.sn_wall_block.push(new Audio("sounds/wall_block2.wav"));
	  }
	  render(ctx){
    	ctx.fillStyle = this.game.cga_white;
	    ctx.fillRect((this.x-this.width/2),(this.y-this.height/2),this.width,this.height);	
    	ctx.fillStyle = this.game.cga_magenta;
	    ctx.fillRect((this.x-this.width/2)+2,(this.y-this.height/2)+2,this.width-4,this.height-4);	
	  }
	  moveLeft(){
	  	if(this.act_speed >= this.maxspeed*(-1) && this.x-this.width/2 > 0){
  			this.act_speed -= this.acc;
	  	}
	  }
	  moveRight(){
	  	if(this.act_speed < this.maxspeed && this.x+this.width/2 < this.game.base_width){
  			this.act_speed += this.acc;
	  	}
	  }
	  update(){
	  	if( this.x-this.width/2 < 0 || this.x+this.width/2 > this.game.base_width){
  			this.sn_wall_block[Math.floor(Math.random() * this.sn_wall_block.length)].play();
	  		this.act_speed = 0;
	  		if(this.x-this.width/2 < -1) {
	  			this.x=this.width/2;
	  		}
	  		if(this.x+this.width/2 > this.game.base_width+1) {
	  			this.x=this.game.base_width-this.width/2;	
	  		}
	  	}
	  	this.x += this.act_speed;
	  	this.act_speed *= this.friction;
	  }
}
