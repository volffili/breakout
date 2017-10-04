// Ball.js

import Particle from './particle';

/** @class Ball
  * A Ball in a Breakout game
  */
export default class Ball {
	  constructor(game,x,y,size,maxspeed,direction,fric) {
	  	this.x = x;
	  	this.y = y;
	  	this.size  = size;
	  	this.maxspeed = maxspeed;
	  	this.direction = direction;
	  	this.maxspeed = maxspeed;
	  	this.actspeed = 0;
	  	this.friction = fric;
	  	this.game = game;
	  	this.bounced_of_block = true;
	  	this.speed = 0;
		  this.sn_bounce = [];
		  this.sn_bounce.push(new Audio("sounds/bounce1.wav"));
		  this.sn_bounce.push(new Audio("sounds/bounce2.wav"));
		  this.sn_bounce.push(new Audio("sounds/bounce3.wav"));
	  }
	  render(ctx){
    	ctx.fillStyle = "#fff";

    	ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);

			ctx.beginPath();
			for(var i=0;i<8;++i){
				ctx.lineTo(this.x+this.radius*Math.cos(2 * Math.PI/8*i), this.y+this.radius*Math.sin(2 * Math.PI/8*i));
			}
			ctx.closePath();
			ctx.fill();

	  }
	  bounce(){
				if(this.direction >= 0 && this.direction <= Math.PI/2){
	  			this.direction = Math.PI*2-this.direction;
				}else if(this.direction > Math.PI/2 && this.direction <= Math.PI){
	  			this.direction = Math.PI+(Math.PI-this.direction);
				}else if(this.direction > Math.PI && this.direction <= Math.PI/2*3){
	  			this.direction = Math.PI/2+(Math.PI*3/2-this.direction);
				}else	if(this.direction > Math.PI*3/2 && this.direction < Math.PI*2){
	  			this.direction = (Math.PI*2-this.direction);
				}
	  	/*if(this.direction > Math.PI){
	  		if(this.direction < Math.PI/2*3){
	  			this.direction = (Math.PI*2-this.direction)+Math.PI;
	  		}else{
	  			this.direction = (Math.PI/2*3-this.direction)+Math.PI/2;
	  		}
	  	}else{
	  		if(this.direction < Math.PI/2){
	  			this.direction = (Math.PI*2-this.direction);
	  		}else{
	  			this.direction = (Math.PI-this.direction)+Math.PI;
	  		}
	  	}*/
	  	this.bounced_of_block = true;
	  }
	  checkCollision(x,y,w,h){
	  	if((this.x > x - this.size/2  )
	 		&& (this.x < x+w + this.size/2)
	  	&& (this.y > y - this.size/2 )
	  	&& (this.y < y+h + this.size/2)){
	  		return true;
	  	}else{
	  		return false;
	  	}
	  }
	  update(){

	  	while(this.direction > 2*Math.PI){
	  		this.direction -= 2*Math.PI;
	  	}
	  	while(this.direction < 0){
	  		this.direction += 2*Math.PI;
	  	}

	  	//if(this.bounced_of_block){
	  		//this.actspeed*=this.friction;
	  	//}

	  	if(this.speed < this.maxspeed){
	  		this.speed += this.maxspeed/this.game.FPS/8;
	  	}else{
	  		this.speed = this.maxspeed;
	  	}
	  	var fin_speed = this.speed;

	  	this.x += fin_speed*Math.cos(this.direction);
	  	this.y -= fin_speed*Math.sin(this.direction);

	  	var x = this.game.player.x;
  		var y = this.game.player.y;
  		var w = this.game.player.width;
  		var h = this.game.player.height;

	  	if(this.checkCollision(x-w/2,y-h/2,w,h*3)){

	  		this.direction = (-1)*(((this.x-(x-w/2))/w)-0.5)*Math.PI/2+Math.PI/2;
	  		while(this.y > y-h/2){
	  			--this.y;
	  		}
	  		//this.actspeed = this.maxspeed*4;
	  		this.sn_bounce[Math.floor(Math.random() * this.sn_bounce.length)].play();
	  		this.game.screen_shake += 6;
	  		//this.game.zoom += 0.075;
        for(var i=0;i<25;++i){
          new Particle(this.x,this.y,2,4,this.cga_cyan,5,Math.random()*Math.PI*2);
          new Particle(this.x,this.y,1,6,this.cga_white,10,Math.random()*Math.PI*2);
        }
	  	}

	  	if(this.y < 0){

	  		console.log(this.direction);

	  		if(this.y <= 0) this.y=0;
	  		//while(this.y >= this.game.base_height) --this.y;
	  		
	  		if(this.direction >= 0 && this.direction <= Math.PI/2){
	  			this.direction = Math.PI*2-this.direction;
				}else if(this.direction > Math.PI/2 && this.direction <= Math.PI){
	  			this.direction = Math.PI+(Math.PI-this.direction);
				}/*else if(this.direction > Math.PI && this.direction <= Math.PI/2*3){
	  			this.direction = Math.PI/2+(Math.PI*3/2-this.direction);
				}else	if(this.direction > Math.PI*3/2 && this.direction < Math.PI*2){
	  			this.direction = (Math.PI*2-this.direction);
				}*/
	  		this.sn_bounce[Math.floor(Math.random() * this.sn_bounce.length)].play();
	  		this.game.screen_shake += 3;
        for(var i=0;i<10;++i){
          new Particle(this.x,this.y,2,4,this.cga_cyan,5,Math.random()*Math.PI*2);
          new Particle(this.x,this.y,1,6,this.cga_white,10,Math.random()*Math.PI*2);
        }

			}
	  	if(this.x <= 0 || this.x >= this.game.base_width){
	  		while(this.x <= 0) ++this.x;
	  		while(this.x >= this.game.base_width) --this.x;
	  		this.direction = Math.PI-this.direction;
	  		this.sn_bounce[Math.floor(Math.random() * this.sn_bounce.length)].play();
	  		this.game.screen_shake += 3;
        for(var i=0;i<10;++i){
          new Particle(this.x,this.y,2,4,this.cga_cyan,5,Math.random()*Math.PI*2);
          new Particle(this.x,this.y,1,6,this.cga_white,10,Math.random()*Math.PI*2);
        }
	  	}

	  }
}
