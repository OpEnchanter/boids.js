var boids = [];

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function degrees(radians) {
    return radians * (180 / Math.PI);
}

function radians(degrees) {
    return degrees * (Math.PI / 180);
}

class boid {
    constructor (flock_size, seperation_strength, alignment_strength, cohesion_strength, speed, ax, ay) {
        // Initialize position and rotation
        this._x = Math.random()*window.innerWidth;
        this._y = Math.random()*window.innerHeight;
        this._rotation = 0;

        // Boid behavior functions
        this.flock_size = flock_size;
        this.seperation_strength = seperation_strength;
        this.alignment_strength = alignment_strength;
        this.cohesion_strength = cohesion_strength;
        this.speed = speed;
        this.ax = ax;
        this.ay = ay;

        // Initialize model
        var model = document.createElement('div');
        model.id = "boid";
        this.model = document.body.appendChild(model);

    }

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get rotation() {
        return this._rotation;
    }

    update() {
        var direction_update = 0;
        
        // Get Nearby Boids
        var nearby_boids = [];
        boids.forEach(boid => {
            if (dist(this.x, this.y, boid.x, boid.y) <= this.flock_size) {
                nearby_boids.push(boid);
            }
        });

        // Seperation
        var angles = [];
        nearby_boids.forEach(boid => {
            var x = boid.x - this.x;
            var y = boid.y - this.y;
            angles.push(degrees(Math.atan2(y, x)));
        });

        var angle_sum = 0;
        angles.forEach(angle => {
            angle_sum += angle;
        });

        var average_heading = angle_sum / angles.length;

        direction_update += ((average_heading + 360) % 360) * this.seperation_strength;


        // Alignment
        var boid_directions = [];
        nearby_boids.forEach(boid => {
            boid_directions.push(boid.rotation);
        });

        var sum = 0;
        boid_directions.forEach(dir => {
            sum += dir;
        });

        var average_direction = sum / boid_directions.length;
        direction_update += (average_direction - this.rotation) * this.alignment_strength;


        // Cohesion
        var xsum = 0;
        var ysum = 0;

        nearby_boids.forEach(boid => {
            xsum += boid.x;
            ysum += boid.y;
        });

        var xavg = xsum / nearby_boids.length;
        var yavg = ysum / nearby_boids.length;

        var vx = xavg - this.x;
        var vy = yavg - this.y;

        var dir = degrees(Math.atan2(vy, vx));
        direction_update += dir * this.cohesion_strength;
        

        // Update Rotation and Position
        if (this.x < 0) {
            this._rotation += 180;
            this._x = 5;
        } else if (this.x > this.ax) {
            this._rotation += 180;
            this._x = this.ax - 5;
        }

        if (this.y < 0) {
            this._rotation += 180;
            this._y = 5;
        } else if (this.y > this.ay) {
            this._rotation += 180;
            this._y = this.ay - 5;
        }

        this._rotation += direction_update;
        this._x += Math.cos(radians(this.rotation)) * this.speed;
        this._y += Math.sin(radians(this.rotation)) * this.speed;

        this.model.style.top = `${this.y}px`
        this.model.style.left = `${this.x}px`

        this.model.style.transform = `rotateZ(${this.rotation}deg)`
    }
}

function update_boids() {
    boids.forEach(boid => {
        boid.update();
    });
}

function init_boids(num_boids, update_frequency, flock_size, seperation_strength, alignment_strength, cohesion_strength, boid_speed, area_x, area_y) {
    for (i = 0; i < num_boids; i++) { 
        boids.push(new boid(flock_size, seperation_strength, alignment_strength, cohesion_strength, boid_speed, area_x, area_y));
    }

    setInterval(update_boids, update_frequency);
}