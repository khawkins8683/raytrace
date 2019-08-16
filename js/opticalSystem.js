//TODO --- prototypical in heritance
// combine this with trace obj
// surface instance
// planar
// spherical
// conic

/*

// base object with methods including initialization
var Vehicle = {
  init: function(name) {
    this.name = name;
  },
  start: function() {
    return "engine of "+this.name + " starting...";
  }
}
// delegation link created between sub object and base object
var Car = Object.create(Vehicle);
// sub object method
Car.run = function() {
  console.log("Hello "+ this.start());
};
// instance object with delegation link point to sub object
var c1 = Object.create(Car);
c1.init('Fiesta');
var c2 = Object.create(Car);
c2.init('Baleno');
c1.run();   // "Hello engine of Fiesta starting..."
c2.run();   // "Hello engine of Baleno starting..."
*/



//------------------------------Surface -------------------------------------------------------------------
//------------------------------Surface -------------------------------------------------------------------
//------------------------------Surface -------------------------------------------------------------------
//------------------------------Surface -------------------------------------------------------------------
//------------------------------Surface -------------------------------------------------------------------
function Surface(){}
Surface.prototype.init = function(n1,n2,r,eta,sd,type="refract",id=1,label=""){
    this.id = id;//unique identifier
    this.n1 = n1;//incident material
    this.n2 = n2;//substrat material
    this.r = r;//three d postion vector
    this.k = eta;//todo allow this to be off axis
    this.semiDiameter = sd;//only circular for now 
    this.type = type;//"reflect" or "refract"
    this.label = label;
}
//Trace Methods   --------------------------------------------------------------------------------
Surface.prototype.traceSurface = function(ray){
    //First calculate ray intercept & aoi
    console.log("Tracing ray",ray);
    let d, newR, eta;
    d = this.interceptDistance(ray);
    newR = math.add(ray.r,math.multiply(ray.k,d));
    eta = this.surfaceNormal();
    console.log("Tracing surface d, newR, eta ,k",[d, newR, eta,ray.k]);
    //now make new ray segment -- with kIN to get the SIN and PIn vectors -- Important
    let newRay = new RaySegment(newR, ray.k, ray.lambda, eta);
    //this seems a little sketchy to me
    newRay.aoi = math.chain(eta).multiply(-1).vectorAngle(ray.k).mod(math.PI/2).done();
    newRay.type = this.type;
    newRay.surfID = this.id;
    newRay.n = {n1: this.n1, n2: this.n2};
    newRay.d = d;

    //now calculate newK 
    //switch here for reflect or refract surface   
    let newk = this.newRayDirection(eta,newRay/*ray or newRay*/);
    if(typeof newk == "number") {
        //stop status calculated
        newRay.status = newk;//returns stop status
    } else {
        //ray will contunue to propagate
        newRay.k = newk;
    }      
    return newRay;
}
Surface.prototype.newRayDirection = function(eta,ray){
    let newk;
    if(this.type == "refract"){
        newk = this.refract3D(this.n1, this.n2, eta, ray.k);
    }else if (this.type == "reflect"){
        newk = this.reflect3D(eta, ray.k);
    }else{
        console.log("Type Error ",this.type);
    }
    return newk;
}
Surface.prototype.refract3D = function(n1,n2,eta,kin){   
    let mu = (n1/n2);
    let etaXk = math.cross(eta,kin);
    let metaXk = math.cross(math.multiply(eta,-1),kin);

    let factor1 = math.multiply(mu,math.cross(eta,metaXk));
    let g1 = ((mu**2)*math.norm(etaXk)**2);
    //if g1>1 then we have TIR and kill the ray
    if(g1>1) return -2;
    let factor2 = math.multiply(eta, math.sqrt(1-g1));
    return math.subtract(factor1,factor2);
}
Surface.prototype.reflect3D = function(eta,kIn){
    //Reflect k accross eta
    let k = math.multiply(kIn,-1);
    let pLen = 2*math.multiply(eta,k);
    let kRef = math.chain(pLen).multiply(eta).subtract(k).done();
    return kRef;
} 
//default to planar surface distance
Surface.prototype.interceptDistance = function(ray){
    console.log("Plane Intercept D",ray.k, this.k);
    let rayToCenter = math.subtract(this.r, ray.r);
    let rayeta = math.multiply(ray.k, this.k);
    return math.chain(rayToCenter).multiply(this.k).divide(rayeta).done();
}
//Paraxial/first order Methods -----------------------------------------------------
    //surface power
Surface.prototype.power = function(){
    let p = 0;
    if(type == "refract"){
        p = (this.n2 - this.n1)*this.curv;
    }else{
        p = -2*this.n1*this.curv;
    }
    return p;
}    

Surface.prototype.EFL = function(){
    return 1/this.power();
}

Surface.prototype.sag = function(){
    return 0;
}
//---Inheritance Types ---------- Inheritance Types ---------------------------------------------------------------------------------
//---Inheritance Types ---------- Inheritance Types -----------------------------------------------------------------------
//---Inheritance Types ---------- Inheritance Types -----------------------------------------------------------------------
// TODO center + eta functions!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function applyPrototype(parent,child){
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = child;
}
// ---  ---- ----- --  Plane ---------------------------------------------------------------------------------------
function Plane(){}
applyPrototype(Surface, Plane);
Plane.prototype.center = function(){
    return this.r;
}
Plane.prototype.surfaceNormal = function(){
    return math.multiply(this.k,-1);
}

// --- Sphere -----------------------------------------------------------------------------------------------------------
function Sphere(curv = 0){	this.curv = curv; }
applyPrototype(Surface, Sphere);

//redefine the active methods
Sphere.prototype.center = function(){
    return math.chain(this.k).multiply((1/this.curv)).add(this.r).done();
}
Sphere.prototype.surfaceNormal = function(newR){
    return math.chain(this.center()).subtract( newR ).normalize().multiply(-1*math.sign(this.curv) ).done();
}
Sphere.prototype.interceptDistance = function(ray){
    //ISSUE ----- this assumes that the curvature is not 0
    let surfR = 1/this.curv;
    //get hyp for right triangle 1 
    let L = math.subtract( this.center() ,ray.r);
    //get side 1 for right triangle 1
    let dCenter = math.multiply(L,ray.k);

    // get side 2 for right triangle 1
    let z = math.sqrt( math.multiply(L, L) - math.multiply(dCenter, dCenter) );

    //solve for last distance - side 1 right trangle 2
    let dz = math.sqrt(surfR**2 - z**2);
    let dIntercept = /*math.norm(dCenter)*/dCenter - math.sign(surfR)*dz;
    return dIntercept;
}
Sphere.prototype.sag = function(s){
    let num = this.curv*(s**2);
    let denom = 1 + math.sqrt(1-(1+0)*(this.curv**2)*(s**2));
    return num/denom;
}
//---------------------------SYSTEM---------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------SYSTEM----------------------------------------------
//---------------------------SYSTEM----------------------------------------------
//---------------------------SYSTEM----------------------------------------------
//---------------------------SYSTEM---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------SYSTEM----------------------------------------------
//---------------------------SYSTEM----------------------------------------------
//---------------------------SYSTEM-----------------------------------------------------------------------------------------------------------------------------------------------------------------
function System(surfaces){
      
    let system = {};
    //note this is an object and the keys should be the unique surface ids -- this should be automatically done
    for(let i=0; i<surfaces.length; i++){
        surfaces[i].id = i+1;
        system[i+1] = surfaces[i];
    }
    this.system = system;
    this.surfaces = surfaces;
}
System.prototype.traceSystem = function(ray){
    let rayPath = [ray];
    let rayCurrent = ray;
    for (let surfId in this.system) {
        let surf = this.system[surfId];
        let newRay = surf.traceSurface(rayCurrent);
        rayPath.push(newRay);
        rayCurrent = newRay;
        if(rayCurrent.status<0) break;
      }
    let pathObj = new RayPath(rayPath);
    return pathObj;
}
System.prototype.maxSemiDiamter = function(){
    let max = this.surfaces[1].semiDiameter;
    for(let i=1; i<this.surfaces.length; i++){
        let sd = this.surfaces[i].semiDiameter;
        if(sd>max) max = sd;
    }
    return max;
}