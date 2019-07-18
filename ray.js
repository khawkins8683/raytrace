///SEGMENT ------------------------------------------------------------------------------------------
///SEGMENT ------------------------------------------------------------------------------------------
///SEGMENT ------------------------------------------------------------------------------------------
///SEGMENT ------------------------------------------------------------------------------------------
/// We want the rayPath and possibly rayField to inherit diattenuation + retardance functions if possible

//todo set up defuatlts for eta opl, surfID,n and aoi
function RaySegment(r=[0,0,0],k=[0,0,1],lambda=550,eta=[0,0,1],d=0,surfID=0,nObj={n1:1,n2:1},aoi=0,type="refract"){
    //should probably add a unique id to each ray
    this.surfID = surfID;
    //this.n = n;//refractive index
    this.r = r;//3D location
    this.k = k;//3D propagation direction
    this.eta = eta;
    this.sIn = this.sOutVector();
    this.pIn = this.pOutVector();

    this.d = d;//prop distance, not OPL!
    this.flux = 1;//calculate absorbtion due to bbers law
    
    this.lambda = lambda;//nm
    //methods ray.rs ray.rp ray.PRT
    this.n = nObj;
    //this.n = {n1:n1,n2:n2};
    this.aoi = aoi;
    this.type = type;//either reflect or refract
}
//OPL Calculation
RaySegment.prototype.OPL = function(){
    let n = this.n.n1;
    //check for complex n
    if(typeof n == "object"){
        n = n.re;
    }
    return n*this.d;
}
//Fresnel Caclculus------------------------------------------------------------------------------------
//TODO - these need to be made into complex friendly index functions
//Coefficients
RaySegment.prototype.cosTheta2 = function(){
    let nfactor = math.divide(this.n.n1 , this.n.n2);
    let sin = math.sin(this.aoi);
    let sinFactor = math.chain(nfactor).multiply(sin).pow(2).done();
    return math.chain(1).subtract(sinFactor).sqrt().done();
}
//Reflection
RaySegment.prototype.rs = function(){
    let n1theta1 = math.multiply(this.n.n1, math.cos(this.aoi));
    let n2theta2 = math.multiply(this.n.n2, this.cosTheta2());
    let num = math.subtract(n1theta1, n2theta2);
    let denom = math.add(n1theta1, n2theta2);
    return math.divide(num,denom);
}
RaySegment.prototype.rp = function(){
    let n1theta2 = math.multiply(this.n.n1 , this.cosTheta2());
    let n2theta1 = math.multiply(this.n.n2 , math.cos(this.aoi));
    let num = math.subtract(n1theta2 , n2theta1);
    let denom = math.add(n1theta2 , n2theta1);
    return math.divide(num,denom);
}
RaySegment.prototype.Rs = function(){
    return math.norm(this.rs())**2
}
RaySegment.prototype.Rp = function(){
    return math.norm(this.rp())**2
}
//Transmission
RaySegment.prototype.ts = function(){
    let n1theta1 = math.multiply(this.n.n1,math.cos(this.aoi));
    let n2theta2 = math.multiply(this.n.n2,this.cosTheta2()); 
    let num = math.multiply(2, n1theta1); 
    let denom = math.add(n1theta1 , n2theta2);
    return math.divide(num,denom);
}
RaySegment.prototype.tp = function(){
    let n1theta1 = math.multiply(this.n.n1 , math.cos(this.aoi));
    let n1theta2 = math.multiply(this.n.n1 , this.cosTheta2());
    let n2theta1 = math.multiply(this.n.n2 , math.cos(this.aoi));
    let num = math.multiply(2,n1theta1);
    let denom = math.add(n1theta2 , n2theta1)
    return math.divide(num,denom);//(2*n1theta1) / (n1theta2 + n2theta1);
}
RaySegment.prototype.transmissionFactor = function(){
    let nfactor = math.divide(this.n.n2,this.n.n1);
    let cosfactor = math.divide(this.cosTheta2(),math.cos(this.aoi));
    return math.multiply(nfactor,cosfactor);
}
RaySegment.prototype.Ts = function(){
    return 1 - this.Rs();//this is the easy way but for coatings we might need to use transmissionFactor
}
RaySegment.prototype.Tp = function(){
    return 1 - this.Rp();
}

//// GEOMETRY ---------------------------------------------------------------
RaySegment.prototype.kInVector = function(){
    return math.cross(this.sIn,this.pIn);
}
RaySegment.prototype.sOutVector = function(){
    let len = math.chain(this.k).subtract(this.eta).norm().round(10).done();
    let sOut = [0,0,0];
    if(len == 0||len==2){//check if parallel or anti parallel
        sOut = [1,0,0];//TODO ---- if k and eta are x than this is bad
    }else{
        //console.log("in else");
        sOut = math.chain(this.k).cross(this.eta).normalize().done();
    }
    //console.log("Constructing sOut, at surface"+this.surfID,"sOut",sOut);
    return sOut;
}
RaySegment.prototype.pOutVector = function(){
    return math.cross(this.k, this.sOutVector() );
}
//for PRT -------------------------------------------------
RaySegment.prototype.oOut = function(){
    //console.log("Constructing oOut, at surface"+this.surfID,"sOut",this.sOutVector());
    //console.log("Constructing oOut, at surface"+this.surfID,"pOut",this.pOutVector());
    //console.log("Constructing oOut, at surface"+this.surfID,"kOut",this.k);
    return math.transpose([this.sOutVector(),this.pOutVector(),this.k]);
}
RaySegment.prototype.oInInverse = function(){
    return [this.sIn,this.pIn,this.kInVector()];
}
RaySegment.prototype.PRT = function(){
    let coefs = {};
    if(this.type == "reflect"){
        coefs.s = this.rs();
        coefs.p = this.rp();
    }else{
        coefs.s = this.ts();
        coefs.p = this.tp();       
    }
    //console.log("constructing prt at surface "+this.surfID,"{s,p}",coefs);
    let jm3D = [[coefs.s,0,0], [0,coefs.p,0], [0,0,1]];
    //console.log("constructing prt at surface "+this.surfID,"{oIn}", this.oInInverse());
    //console.log("constructing prt at surface "+this.surfID,"{oOut}", this.oOut());
    return math.chain(this.oOut()).multiply(jm3D).multiply(this.oInInverse()).done();
}
RaySegment.prototype.Q = function(){
    return math.chain(this.oOut()).multiply(math.identity(3)._data).multiply(this.oInInverse()).done();
}
///Polarization properties ------------------------------------------
RaySegment.prototype.retardance = function(){
    let coefs = {};
    if(this.type == "reflect"){
        coefs.s = this.rs();
        coefs.p = this.rp();
    }else{
        coefs.s = this.ts();
        coefs.p = this.tp();       
    }
    //these are complex valued
    //might need to take modulus - think
    return math.arg(coefs.s) - math.arg(coefs.p);
}
RaySegment.prototype.diattenuation = function(){
    let intensityCoefs = {};
    if(this.type == "reflect"){
        intensityCoefs.s = this.Rs();
        intensityCoefs.p = this.Rp();
    }else{
        intensityCoefs.s = this.Ts();
        intensityCoefs.p = this.Tp();       
    }
    //these are all real valued
    return math.abs(intensityCoefs.s - intensityCoefs.p) / (intensityCoefs.s + intensityCoefs.p);
}




/// Ray Path ------------------------------------------------------------------------------------
/// Ray Path ------------------------------------------------------------------------------------
/// Ray Path ------------------------------------------------------------------------------------
function RayPath(rayList){
    this.rayList = rayList;
}

RayPath.prototype.OPLTotal = function(){
    let rays = this.rayList;
    let opl = 0;
    for(let i=0; i<rays.length; i++){
        opl += rays[i].OPL();
    }
    return opl;
}
RayPath.prototype.PRTTotal = function(){
    let rays = this.rayList;
    let prt = math.identity(3)._data;
    for(let i=rays.length-1; i>=0; i--){
        prt = math.multiply(prt, rays[i].PRT());
    } 
    return prt;
}
RayPath.prototype.QTotal = function(){
    let rays = this.rayList;
    let q = math.identity(3)._data;
    for(let i=rays.length-1; i>=0; i--){
        q = math.multiply(q, rays[i].Q());
    } 
    return q;
}
RayPath.prototype.jonesMatrix = function(){
    let jones3D = math.chain(this.QTotal()).inv().multiply(this.PRTTotal()).done();
    //now take the first 4 elements
    let jones = [jones3D[0].slice(0,2), jones3D[1].slice(0,2)];
    return jones;
}
RayPath.prototype.retardance = function(){
    //step 1 - convert to jm
    let eigen = math.eigenValues2D(this.jonesMatrix());
    return math.arg(eigen[0]) - math.arg(eigen[1]);
}
RayPath.prototype.diattenuation = function(){
    //step 1 - convert to jm
    let eigen = math.eigenValues2D(this.jonesMatrix());
    let t1 = math.chain(eigen[0]).norm().pow(2).done();
    let t2 = math.chain(eigen[1]).norm().pow(2).done();
    return math.abs(t1-t2)/(t1+t2);
}


///// Ray Field 
function RayField(pathList){
    this.rayPaths = pathList;
}
//TODO - add field info
    //image height
    //obj distance
    //obj height
    //field angle