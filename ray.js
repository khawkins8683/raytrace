///SEGMENT ------------------------------------------------------------------------------------------
///SEGMENT ------------------------------------------------------------------------------------------
///SEGMENT ------------------------------------------------------------------------------------------
///SEGMENT ------------------------------------------------------------------------------------------
//todo set up defuatlts for eta opl, surfID,n and aoi
function RaySegment(r=[0,0,0],k=[0,0,1],lambda=550,eta=[0,0,1],opl=0,surfID=0,nObj={n1:1,n2:1},aoi=0){
    //should probably add a unique id to each ray
    this.surfID = surfID;
    //this.n = n;//refractive index
    this.r = r;//3D location
    this.k = k;//3D propagation direction
    this.eta = eta;
    this.sIn = this.sOutVector();
    this.pIn = this.pOutVector();

    //this.prt = math.identity(3);//IdentityMatrix(3);
    this.opl = opl;//should probably be an input
    this.flux = 1;//calculate absorbtion due to bbers law
    
    this.lambda = lambda;//nm
    //methods ray.rs ray.rp ray.PRT
    this.n = nObj;
    //this.n = {n1:n1,n2:n2};
    this.aoi = aoi;
}

//Fresnel Caclculus------------------------------------------------------------------------------------
//TODO - these need to be made into complex friendly index functions
//Coefficients
RaySegment.prototype.cosTheta2 = function(){
    return  math.sqrt(1 - ((this.n.n1 / this.n.n2) * math.sin(this.aoi))**2);
}
//Reflection
RaySegment.prototype.rs = function(){
    let n1theta1 = this.n.n1*math.cos(this.aoi);
    let n2theta2 = this.n.n2*this.cosTheta2();
    return (n1theta1 - n2theta2)/(n1theta1 + n2theta2);
}
RaySegment.prototype.rp = function(){
    let n1theta2 = this.n.n1 * this.cosTheta2();
    let n2theta1 = this.n.n2 * math.cos(this.aoi);
    return (n1theta2 - n2theta1) / (n1theta2 + n2theta1);
}
RaySegment.prototype.Rs = function(){
    return math.norm(this.rs())**2
}
RaySegment.prototype.Rp = function(){
    return math.norm(this.rp())**2
}
//Transmission
RaySegment.prototype.ts = function(){
    let n1theta1 = this.n.n1*math.cos(this.aoi);
    let n2theta2 = this.n.n2*this.cosTheta2();  
    return (2 * n1theta1)/(n1theta1 + n2theta2);  
}
RaySegment.prototype.tp = function(){
    let n1theta1 = this.n.n1 * math.cos(this.aoi);
    let n1theta2 = this.n.n1 * this.cosTheta2();
    let n2theta1 = this.n.n2 * math.cos(this.aoi);
    return (2*n1theta1) / (n1theta2 + n2theta1);
}
RaySegment.prototype.transmissionFactor = function(){
    let nfactor = math.divide(this.n.n2,this.n.n1);
    let cosfactor = math.divide(this.cosTheta2(),math.cos(this.aoi));
    return math.multiply(nfactor,cosfactor);
}
RaySegment.prototype.Ts = function(){
    return 1 - this.Rs();
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
    if(len == 0){
        sOut = [1,0,0];//TODO ---- if k and eta are x than this is bad
    }else{
        sOut = math.chain(this.k).cross(this.eta).normalize().done();
    }
    return sOut;
}
RaySegment.prototype.pOutVector = function(){
    return math.cross(this.k, this.sOutVector() );
}


/// Ray Path ------------------------------------------------------------------------------------
/// Ray Path ------------------------------------------------------------------------------------
/// Ray Path ------------------------------------------------------------------------------------
function RayPath(rayList){
    this.rayList = rayList;
}

RayPath.prototype.OPLCumulative = function(){
    let rays = this.rayList;
    let opl = 0;
    for(let i=0; i<rays.length; i++){
        opl += rays[i].opl;
    }
    return opl;
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