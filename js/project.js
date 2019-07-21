//TODO ---- DONE?
// AOI for anit-parallel surfaces -  retro reflection - issue // think fix with mod pi/2
// need more tests for q and prt surface and total -- but looking good 
//  ability to use 0 as curvature
//  ability to relfect or refract
//  OpticalSystem object type
//  diattenuation from PRT
//  retardance from PRT
//  plot retardance + diattenuation over fov

//TODO ---- urgent
//  2D eigen vector calculator
// PRTCumulative(surfID)
//  Center the spherical surfaces at the vertex

//  plot fresnel coefficients
//      verify answers --- check sign convention for refractive index
//  Organize to run server side/nodeJS
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

//Fresnel Aberration Plots
    //Rs, Rp, Ts, Tp air glass
PlotFresnelCoefficients('airGlassPlot',1.0,1.5,55);    
    // Rs, Rp air Al
PlotFresnelCoefficients('airAlPlot',1.0,math.complex(0.81257, 6.0481),55);     
    //  diattenuation + retardance

/// Ray Trace - Optical System

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
//make ray trace object
let trace = new Trace();
let raysOut = [
    trace.traceSystem(rayIn1, opticalSystem),
    trace.traceSystem(rayIn2, opticalSystem),
    trace.traceSystem(rayIn3, opticalSystem),
];
let rayField = new RayField(raysOut);
/// create a new plot obj
let plotSys = new SystemPlot(70,'systemPlot1',300,150);
plotSys.SystemYPlot(rayField, opticalSystem);

console.log("ray Trace Start");
rayGrid = new CollimatedWavefrontGrid(16,0.5,[0,0,0],[0,0,1],550);
rayGrid.traceGrid(trace, opticalSystem);
console.log("ray Trace Done");


rayGridSmall = new CollimatedWavefrontGrid(6,0.5,[0,0,0],[0,0,1],550);
rayGridSmall.traceGrid(trace, opticalSystem);

let ePlot1 = new SystemPlot(18,'ePlot1',350,350);
ePlot1.ellipseGrid(rayGridSmall, [1,0] );

let ePlot2 = new SystemPlot(18,'ePlot2',350,350);
ePlot2.ellipseGrid(rayGridSmall, [0,1] );

let ePlot3 = new SystemPlot(18,'ePlot3',350,350);
ePlot3.ellipseGrid(rayGridSmall, math.normalize([1,1]) );





DiattenuationSurfaceMap("diatPlot1",rayGrid,1);
DiattenuationSurfaceMap("diatPlot2",rayGrid,2);
DiattenuationSurfaceMap("diatPlot3",rayGrid,3);

DiattenuationTotalMap("diatTotalPlot1",rayGrid,2);
DiattenuationTotalMap("diatTotalPlot2",rayGrid,3);
DiattenuationTotalMap("diatTotalPlot3",rayGrid,4);

RetardanceSurfaceMap("retPlot1",rayGrid,1);
RetardanceSurfaceMap("retPlot2",rayGrid,2);
RetardanceSurfaceMap("retPlot3",rayGrid,3);

RetardanceTotalMap("retTotalPlot1",rayGrid,2);
RetardanceTotalMap("retTotalPlot2",rayGrid,3);
RetardanceTotalMap("retTotalPlot3",rayGrid,4);

