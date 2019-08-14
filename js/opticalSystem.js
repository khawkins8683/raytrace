//TODO --- prototypical in heritance
// surface instance
// planar
// spherical
// conic

//------------------------------Surface --------------------------------------
function Surface(n1,n2,curv,r,id,eta,sd,type,label=""){
    this.id = id;//unique identifier
    this.n1 = n1;//incident material
    this.n2 = n2;//substrat material
    this.r = r;//three d postion vector
    this.k = eta;//todo allow this to be off axis
    this.semiDiameter = sd;//only circular for now 
    this.type = type;//"reflect" or "refract"
    this.label = label;
    
    //this is not needed for all surfaces
    this.curv = curv;// 1/radius of curvature in mm
    this.conicK = 0;
}

//Methods
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

Surface.prototype.sag = function(s){
    let num = this.curv*(s**2);
    let denom = 1 + math.sqrt(1-(1+this.conicK)*(this.curv**2)*(s**2));
    return num/denom;
}

//---------------------------SYSTEM----------------------------------------------
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

System.prototype.maxSemiDiamter = function(){
    let max = this.surfaces[1];
    for(let i=1; i<this.surfaces.length; i++){
        let sd = this.surfaces[i].semiDiameter;
        if(sd>max) max = sd;
    }
    return sd;
}