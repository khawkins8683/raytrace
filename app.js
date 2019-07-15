//TODO ---- 
//  organize into Ray file System File Trace File and Plot file
//  Organize to run server side
//  ability to use negative radius of curvature
        // i.e. calculate intersection with the front or the back of the sphere
//  ability to use 0 as curvature
//  ability to relfect or refract
//  OpticalSystem object type

//  ability to intercept function
//  ability to plot function

//  verify answers 

//   Test --- Trace 1
let trace = new Trace();
let rayIn = new RaySegment([0,0,0],math.normalize([0,0.3,1]),[0,0,1],0,500,0);

let surf1 = new Surface(1,1.75,1,[0,0,2],1,[0,0,1]);
let surf2 = new Surface(1.75,1,1,[0,0,3],2,[0,0,1]);
let surf3 = new Surface(1,1.75,1,[0,0,4],3,[0,0,1]);
let surf4 = new Surface(1.75,1,0,[0,0,4],4,math.normalize([0,-0.6,1]));

let opticalSystem = {1:surf1, 2:surf2, 3:surf3, 4:surf4}
let raysOut = trace.traceSystem(rayIn,opticalSystem);

/// create a new plot obj
let plotSys = new SystemPlot(100,'systemPlot',500);
plotSys.drawRayPath(raysOut.rayList);
plotSys.drawHalfCircle(surf1.r[2],surf1.r[1],surf1.curv);
plotSys.drawHalfCircle(surf2.r[2],surf2.r[1],surf2.curv);
plotSys.drawHalfCircle(surf3.r[2],surf3.r[1],surf3.curv);
plotSys.plotPlane(surf4.r,1,surf4.k)//center,semiDiam,eta

//let draw = SVG('systemPlot').size(500,500);
// drawRayPath(raysOut.rayList);
// drawHalfCircle(surf1.r[2],surf1.r[1],surf1.curv);
// drawHalfCircle(surf2.r[2],surf2.r[1],surf2.curv);
// drawHalfCircle(surf3.r[2],surf3.r[1],surf3.curv);





////// Optics Functions----MOVE TO RAY METHODS --------------------
function Optics () { /*...*/ };

Optics.prototype.rs = function(n1,n2,theta){

    let t1 = (n1*math.cos(theta));
    let t2 = ((n1/n2)*math.sin(theta))**2;
    let t3 = n2*math.sqrt(1-t2);

    return (t1-t3)/(t1+t3);
}

Optics.prototype.rp = function(n1,n2,theta){

    let t1 = (n2*math.cos(theta));
    let t2 = ((n1/n2)*math.sin(theta))**2;
    let t3 = n1*math.sqrt(1-t2);

    return (t3-t1)/(t3+t1);
}

Optics.prototype.angleOfRefraction = function(n1, n2, thetai){
    return math.asin((n1/n2)*math.sin(thetai))
}

let optics = new Optics();

/*
let ray1 = new RaySegment([0,0,0],[0,0,1],[0,0,1],1,500)
let ray2 = new RaySegment([0,1,1],[0,0,1],[0,0,1],1,500)
let ray3 = new RaySegment([0,0,3],[0,0,1],[0,0,1],1,500)
let ray4 = new RaySegment([0,0,5],[0,0,1],[0,0,1],1,500)
let rList = [ray1,ray2,ray3,ray4];

let draw = SVG('systemPlot').size(500,500);
drawRayPath(rList)
drawCircle(5,0,2)
*/

/*
<path
    d="
      M (CX - R), CY
      a R,R 0 1,0 (R * 2),0
      a R,R 0 1,0 -(R * 2),0
    "
/>

*/