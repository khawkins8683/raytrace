////  Tracing functions --------------------
function Trace(){};

//Tracing functions
//ToDO 
// -- figure out [0,0,1], curv =-1 bug
    // --- I think this might happen with TIR or missed surface - d is complex
    // --- AOI for reflection
// put trace methods in the surface obj - diffferent routines for  different surfaces  
// Missed surface status
//  -- make the trace object less contrived
//  -- make an eigen vector calculator
//  -- make an svd or polar decomposition function
//  -- set up trace so that we can get back to z k vector but not have this inside the Q matrix --- geometrical transformation 
// -- place the surface at the vertex no the center of the circle
// -- bug with semiDiamter > 1

Trace.prototype.traceSurface = function(ray,surf){
    //First calculate ray intercept & aoi
    let d, newR, eta;
    if(surf.curv==0){
        d = this.planeInterceptDistance(ray.k, ray.r, surf.r, surf.k);
        newR = math.add(ray.r,math.multiply(ray.k,d));
        eta = math.multiply(surf.k,-1);
    }else{
        //this needs to call a differe t ray intercept routine if we have a negative curvatrue
        let center = math.chain(surf.k).multiply((1/surf.curv)).add(surf.r).done();
        d = this.sphereInterceptDistance(ray.k,ray.r, center, 1/surf.curv);
        newR = math.add(ray.r, math.multiply(ray.k,d));
        eta = math.chain(center).subtract( newR ).normalize().multiply(-1*math.sign(surf.curv) ).done();
    }
    //now make new ray segment -- with kIN to get the SIN and PIn vectors -- Important
    let newRay = new RaySegment(newR, ray.k, ray.lambda, eta);
    //this seems a little sketchy to me
    newRay.aoi = math.chain(eta).multiply(-1).vectorAngle(ray.k).mod(math.PI/2).done();
    newRay.type = surf.type;
    newRay.surfID = surf.id;
    newRay.n = {n1: surf.n1, n2: surf.n2};
    newRay.d = d;

    //now calculate newK 
    //switch here for reflect or refract surface    
    if(surf.type == "refract"){
        let newk = this.refract3D(surf.n1, surf.n2, eta, ray.k);
        if(typeof newk == "number") {
            //call reflect 3D if we want the ray to TIR
            newRay.status = newk;//returns stop status
        }
        newRay.k = newk;
    }else{
        newRay.k = this.reflect3D(eta, ray.k);
    }    
    
    return newRay;
}
Trace.prototype.traceSystem = function(ray,system){

    let rayPath = [ray];
    let rayCurrent = ray;
    for (let surfId in system.system) {
        let newRay = this.traceSurface(rayCurrent,system.system[surfId]);
        rayPath.push(newRay);
        rayCurrent = newRay;
        if(rayCurrent.status<0) break;
      }
    let pathObj = new RayPath(rayPath);
    return pathObj;
}
///TODO traceField --- makes a new RayField(pathList) obj



//Utility functions
//-----K vector-----
Trace.prototype.refract3D = function(n1,n2,eta,kin){
    
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
Trace.prototype.reflect3D = function(eta,kIn){
    //Reflect k accross eta
    //eta = math.multiply(eta,-1);
    let k = math.multiply(kIn,-1);
    let pLen = 2*math.multiply(eta,k);
    let kRef = math.chain(pLen).multiply(eta).subtract(k).done();
    return kRef;
} 

//------Intercepts-------
Trace.prototype.sphereInterceptDistance = function(rayK,rayR,center,surfR){
    //get hyp for right triangle 1 
    let L = math.subtract(center ,rayR);
    //get side 1 for right triangle 1
    let dCenter = math.multiply(L,rayK);

    // get side 2 for right triangle 1
    let z = math.sqrt( math.multiply(L, L) - math.multiply(dCenter, dCenter) );

    //solve for last distance - side 1 right trangle 2
    let dz = math.sqrt(surfR**2 - z**2);
    let dIntercept = /*math.norm(dCenter)*/dCenter - math.sign(surfR)*dz;
    return dIntercept;
}

Trace.prototype.planeInterceptDistance = function(rayK,rayR,surfR,surfK){
    let rayToCenter = math.subtract(surfR,rayR);
    let rayeta = math.multiply(rayK,surfK);
    return math.chain(rayToCenter).multiply(surfK).divide(rayeta).done();
}