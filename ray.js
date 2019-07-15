///SEGMENT ----------------------------------------------------------------

function RaySegment(r,k,eta,opl,lambda,surfID){
    this.surfID = surfID;
    //this.n = n;//refractive index
    this.r = r;//3D location
    this.k = k;//3D propagation direction
    //this.prt = math.identity(3);//IdentityMatrix(3);
    this.opl = opl;//should probably be an input
    //probably will make these methods
    this.s = 1;//fresnel coefficient for s-polarized light
    this.p = 1;//fresnel coefficient for p-polarized light
    this.flux = 1;//calculate absorbtion due to bbers law
    this.eta = eta;
    this.lambda = lambda;//nm
    //methods ray.rs ray.rp ray.PRT
}

//we could get n1 from prvious ray, or from surface or store it in the ray object its self
RaySegment.prototype.rs = function(n1,n2,theta){

    let t1 = (n1*math.cos(theta));
    let t2 = ((n1/n2)*math.sin(theta))**2;
    let t3 = n2*math.sqrt(1-t2);

    return (t1-t3)/(t1+t3);
}

RaySegment.prototype.rp = function(n1,n2,theta){

    let t1 = (n2*math.cos(theta));
    let t2 = ((n1/n2)*math.sin(theta))**2;
    let t3 = n1*math.sqrt(1-t2);

    return (t3-t1)/(t3+t1);
}


/// Ray Path ----------------------------------------------------------------

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