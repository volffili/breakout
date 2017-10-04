// Brick.js

/** @class Brick
  * A Brick in a Breakout game
  */
export default class Brick {
	  constructor(x,y,width,height) {
	  	this.x = x;
	  	this.y = y;
	  	this.width  = width;
	  	this.height = height;

    	this.cga_white = "#ffffff";
    	this.cga_magenta = "#ff55ff";
    	this.cga_cyan = "#55ffff";
    	this.cga_black = "#000000";

    	var ran = Math.random();
    	if (ran <= 0.5){
		  	this.outside = this.cga_magenta;
		  	this.mid = this.cga_white;
		  	this.inside = this.cga_cyan;
			}else	{
		  	this.outside = this.cga_white;
		  	this.mid = this.cga_cyan;
		  	this.inside = this.cga_magenta;
			}

		  this.sn_bounce = [];
		  this.sn_bounce.push(new Audio("sounds/bounce1.wav"));
		  this.sn_bounce.push(new Audio("sounds/bounce2.wav"));
		  this.sn_bounce.push(new Audio("sounds/bounce3.wav"));
	  }
	  render(ctx){
    	/*ctx.fillStyle = this.cga_white;
	    ctx.fillRect((this.x),(this.y),this.width,2);	
    	ctx.fillStyle = this.cga_white;
	    ctx.fillRect((this.x),(this.y),2,this.height);*/	
    	ctx.fillStyle = this.outside;
	    ctx.fillRect(this.x,this.y,this.width,this.height);	
    	ctx.fillStyle = this.mid;
	    ctx.fillRect(this.x+2,this.y+2,this.width-4,this.height-4);	
    	ctx.fillStyle = this.inside;
	    ctx.fillRect(this.x+4,this.y+4,this.width-8,this.height-8);	
	  }
	  playSound(){
  		this.sn_bounce[Math.floor(Math.random() * this.sn_bounce.length)].play();
	  }
	  moveLeft(){

	  }
	  moveRight(){

	  }
	  update(){

	  }
}
