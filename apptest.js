console.log('hello world');

//set up a bi convex lens
//optical interactions
let nAir = 1.0;
let nGlass = 1.5;
let sd = 1;
let surf1 = new Surface(nAir,nGlass,-1 ,[0,0,1], 1,[0,0,1],sd,"refract","Convex Surface (L1)");
let surf2 = new Surface(nGlass,nAir,-0.5 ,[0,0,3], 2,[0,0,1],sd,"refract","Convex Surface (L2)");
let surf3 = new Surface(nAir,nAir,0 ,[0,0,4],2,math.normalize([0,1,1]),3*sd,"refract","detector");
//system
let opticalSystem = new System( [surf1,surf2,surf3] );


//Trace
let rayIn1 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
let rayIn2 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
let rayIn3 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
//make ray trace object
let trace = new Trace();
let raysOut = [
    trace.traceSystem(rayIn1, opticalSystem),
    trace.traceSystem(rayIn2, opticalSystem),
    trace.traceSystem(rayIn3, opticalSystem)
];
let rayField = new RayField(raysOut);
/// create a new plot obj
let plotSys = new SystemPlot(70,'systemPlot1',700,300);
plotSys.SystemYPlot(rayField, opticalSystem);