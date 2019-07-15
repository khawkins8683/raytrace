////  Tracing functions --------------------
//Intercept with sphere
function Trace(){};

Trace.prototype.traceSurface = function(ray,surf){
    //find intercept distance 
    let d =0;
    if(surf.curv==0){
        d = this.planeInterceptDistance(ray.k, ray.r, surf.r, surf.k);
    }else{
        d = this.sphereInterceptDistance(ray.k,ray.r,surf.r, 1/surf.curv);
    }
    
    let newR = math.add(ray.r,math.multiply(ray.k,d));

    //find new propagation direction
    let eta = math.chain(surf.r).subtract( newR ).normalize().multiply(-1).done();
    let newK = this.refract3D(surf.n1,surf.n2,eta,ray.k);
    //Now create a new ray object
    let newRay = new RaySegment(newR,newK,eta,d*surf.n1,ray.lambda,surf.id);
    return newRay;
}

Trace.prototype.traceSystem = function(ray,system){
    let rayPath = [ray];
    let rayCurrent = ray;
    for (let surfId in system) {
        let newRay = this.traceSurface(rayCurrent,system[surfId]);
        rayPath.push(newRay);
        rayCurrent = newRay;
      }
    let pathObj = new RayPath(rayPath);
    return pathObj;
}

Trace.prototype.refract3D = function(n1,n2,eta,kin){

    let mu = (n1/n2);
    let etaXk = math.cross(eta,kin);
    let metaXk = math.cross(math.multiply(eta,-1),kin);

    let factor1 = math.multiply(mu,math.cross(eta,metaXk));
    let factor2 = math.multiply(eta, math.sqrt(1-((mu**2)*math.norm(etaXk)**2)));

    return math.subtract(factor1,factor2);
} 

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