// Particle`.js

/** @class Particle
  * A Particle in a Breakout game
  */
export default class Particle {
	  constructor(x,y,size,speed,color,life,dir) {

	    if ( typeof Particle.counter == 'undefined' ) {
        Particle.counter = 0;
        Particle.particles = {};
    	}

	  	this.id = Particle.counter;
	  	++Particle.counter;
	  	Particle.particles[this.id] = this;
	  	this.life = life;
	  	this.x = x;
	  	this.y = y;
	  	this.size = size;
	  	this.vx = Math.cos(dir)*Math.random()*speed;
	  	this.vy = -Math.sin(dir)*Math.random()*speed;
	  	this.color = color;
	  }
	  update(){
	  	--this.life;
	  	if(this.life <= 0){
	  		delete Particle.particles[this.id];
	  	}
	  	this.x += this.vx;
	  	this.y += this.vy;
	  }
	  render(ctx){
    	ctx.fillStyle = this.color;
	    ctx.fillRect(this.x-this.size/2,this.y-this.size/2,this.size,this.size);	
	  }
}


