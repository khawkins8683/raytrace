//TODO ---- DONE?
// AOI for anit-parallel surfaces -  retro reflection - issue // think fix with mod pi/2
// need more tests for q and prt surface and total -- but looking good 
//  ability to use 0 as curvature
//  ability to relfect or refract
//  OpticalSystem object type

//TODO ---- urgent
//  diattenuation from PRT
//  retardance from PRT
//  Center the spherical surfaces at the vertex
//  plot retardance + diattenuation over fov
//  plot fresnel coefficients
//      verify answers --- check sign convention for refractive index
//  Organize to run server side
//  ability to use negative radius of curvature
        // i.e. calculate intersection with the front or the back of the sphere
//  ability to intercept function surface
//  ability to plot function
//  rayField object -> obj rays have a Q matrix that will rotate back to normal jones coordinate systemfor ellipse plots
//  double pole function
// ray eField plot
// system power
// system ep
// system exitp


//   Test --- Trace 1
let trace = new Trace();


//input parameters
let sd = 1;//semi diamtere
let type = "refract";
let nAl = math.complex(0.81257, 6.0481);
let nGlass = 1.5;
let nAir = 1;
//optical interactions
let surf1 = new Surface(nAir,nGlass,1,[0,0,2],1,[0,0,1],sd,"refract","Convex Surface (L1)");
let surf2 = new Surface(nGlass,nAir,0,[0,0,2],2,[0,0,1],sd,"refract","Plano Surface (L2)");
let surf3 = new Surface(nAir,nAl,   0,[0,-0.05,2.45],3,math.normalize([0,-1,1]),0.45,"reflect","Fold Mirror");
let surf4 = new Surface(nAir,nAir,  0,[0,0.65,2.5],4,[0,1,0],0.25,"refract","Detector");
//system
let opticalSystem = new System( [surf1,surf2,surf3,surf4] );//{1:surf1, 2:surf2, 3:surf3, 4:surf4};

let rayIn1 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
let rayIn2 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
let rayIn3 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
let raysOut = [
    trace.traceSystem(rayIn1, opticalSystem),
    trace.traceSystem(rayIn2, opticalSystem),
    trace.traceSystem(rayIn3, opticalSystem),
];
let rayField = new RayField(raysOut);
/// create a new plot obj
let plotSys = new SystemPlot(70,'systemPlot1',300);
plotSys.SystemYPlot(rayField, opticalSystem);


//full field
/*let raysIn = CollimatedWavefront(6,0.5,[0,0,0],[0,0,1],550);
raysOut = [];
for(let i =0; i<raysIn.length; i++){
    raysOut.push(trace.traceSystem(raysIn[i], opticalSystem));
}
rayField = new RayField(raysOut);
let testPath = raysOut[0];

/// create a new plot obj
let plotSys2 = new SystemPlot(70,'systemPlot2',300);
plotSys2.SystemYPlot(rayField, opticalSystem);

rayGrid = CollimatedWavefrontGrid(6,0.5,[0,0,0],[0,0,1],550);
*/
rayGrid = new CollimatedWavefrontGrid(6,0.5,[0,0,0],[0,0,1],550);
rayGrid.traceGrid(trace, opticalSystem);
let plotSys2 = new SystemPlot(70,'systemPlot2',300);
plotSys2.plotRayGrid(rayGrid, 1);

DiattenuationMap("diatPlot1",rayGrid,1);
DiattenuationMap("diatPlot2",rayGrid,2);
DiattenuationMap("diatPlot3",rayGrid,3);