// Paddle.js

/** @class Paddle
  * The Paddle in a Breakoute game
  */
export default class Paddle {
	  constructor(maxspeed,friction,acc,x,y,width,height) {
	  	this.maxspeed = maxspeed;
	  	this.friction = friction;
	  	this.x = x;
	  	this.y = y;
	  	this.width = width;
	  	this.height = height;
	  	this.act_speed = 0;
	  	this.acc = acc;
	  }
	  render(ctx){
    	ctx.fillStyle = "#fff";
	    ctx.fillRect((this.x-this.width/2),(this.y-this.height/2),this.width,this.height);	
	  }
	  moveLeft(){
	  	if(this.act_speed >= this.maxspeed*(-1))
	  		this.act_speed -= this.acc;
	  }
	  moveRight(){
	  	if(this.act_speed < this.maxspeed)
	  		this.act_speed += this.acc;
	  }
	  update(){
	  	this.x += this.act_speed;
	  	this.act_speed *= this.friction;
	  }
}
