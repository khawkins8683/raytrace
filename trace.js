////  Tracing functions --------------------
//Intercept with sphere
function Trace(){};

//Tracing functions
Trace.prototype.traceSurface = function(ray,surf){
    //find intercept distance 
    let d =0;
    let newR = [0,0,0];
    let eta = [0,0,1];
    if(surf.curv==0){
        d = this.planeInterceptDistance(ray.k, ray.r, surf.r, surf.k);
        newR = math.add(ray.r,math.multiply(ray.k,d));
        eta = math.multiply(surf.k,-1);
    }else{
        d = this.sphereInterceptDistance(ray.k,ray.r,surf.r, 1/surf.curv);
        newR = math.add(ray.r,math.multiply(ray.k,d));
        eta = math.chain(surf.r).subtract( newR ).normalize().multiply(-1).done();
    }
    //switch here for reflect or refract surface
    let newK = this.refract3D(surf.n1,surf.n2,eta,ray.k);
    console.log("newK",newK,"curv",surf.curv,{"new Eta":eta,"old eta":ray.eta});
    //Now create a new ray object
    let aoi = 0;//math.chain(eta).vectorAngle(ray.k).mod(math.PI/2).done();//theta in
    let newRay = new RaySegment(newR, newK, ray.lambda, eta, d*surf.n1, surf.id, {n1:surf.n1, n2:surf.n2}, aoi);
    return newRay;
}

Trace.prototype.traceSystem = function(ray,system){

    let rayPath = [ray];
    let rayCurrent = ray;
    for (let surfId in system.system) {
        let newRay = this.traceSurface(rayCurrent,system.system[surfId]);
        rayPath.push(newRay);
        rayCurrent = newRay;
      }
    let pathObj = new RayPath(rayPath);
    return pathObj;
}
///TODO traceField --- makes a new RayField(pathList) obj



//Utility functions

//-----K vector-----
Trace.prototype.refract3D = function(n1,n2,eta,kin){
    console.log("Calculating Refraction Inputs",{"n1":n1,"n2":n2},"eta",eta,kin);
    let mu = (n1/n2);
    let etaXk = math.cross(eta,kin);
    let metaXk = math.cross(math.multiply(eta,-1),kin);

    let factor1 = math.multiply(mu,math.cross(eta,metaXk));
    let factor2 = math.multiply(eta, math.sqrt(1-((mu**2)*math.norm(etaXk)**2)));

    return math.subtract(factor1,factor2);
}
Trace.prototype.reflect3D = function(eta,kIn){
    //Reflect k accross eta
    let k = math.multiply(kIn,-1);
    let pLen = 2*math.multiply(eta,k);
    return math.chain(pLen).multiply(eta).subtract(k).done();
} 

//------Intercepts-------
Trace.prototype.sphereInterceptDistance = function(rayK,rayR,surfC,surfR){
    //get hyp for right triangle 1 
    let L = math.subtract(surfC ,rayR);
    //get side 1 for right triangle 1
    let dCenter = math.multiply(L,rayK);
    //if(dCenter<=0){return false}
    // get side 2 for right triangle 1
    let z = math.sqrt( math.multiply(L, L) - math.multiply(dCenter, dCenter) );
    //if(z<=0){return false}//no intersection

    //solve for last distance - side 1 right trangle 2
    let dz = math.sqrt(surfR**2 - z**2);
    let dIntercept = math.norm(dCenter) - dz;
    return dIntercept;
}

Trace.prototype.planeInterceptDistance = function(rayK,rayR,surfR,surfK){
    let rayToCenter = math.subtract(surfR,rayR);
    let rayeta = math.multiply(rayK,surfK);
    return math.chain(rayToCenter).multiply(surfK).divide(rayeta).done();
}