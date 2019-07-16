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
let rayIn1 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500,[0,0,1],0,0,{n1:1,n2:1},0);
let rayIn2 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500,[0,0,1],0,0,{n1:1,n2:1},0);

//RayTrace #1 Refraction
let sd = 1;//semi diamtere
let type = "refract";
let nGlass = 1.5;
let nAir = 1;
let surf1 = new Surface(nAir,nGlass,1,[0,0,2],1,[0,0,1],sd,type);
let surf2 = new Surface(nGlass,nAir,0,[0,0,2],2,[0,0,1],sd,type);
let surf3 = new Surface(nAir,nAir,0,[0,0,4],2,[0,0,1],sd,type);
//let surf3 = new Surface(nAir,nGlass,1,[0,0,4],3,[0,0,1],sd,type);
//let surf4 = new Surface(nGlass,nAir,0,[0,0,4],4,math.normalize([0,-0.6,1]),sd,type);

let opticalSystem = new System( [surf1,surf2,surf3/*,surf3,surf4*/] );//{1:surf1, 2:surf2, 3:surf3, 4:surf4};
let rayField = new RayField([
    trace.traceSystem(rayIn1, opticalSystem),
    trace.traceSystem(rayIn2, opticalSystem)
]);

/// create a new plot obj
let plotSys = new SystemPlot(100,'systemPlot',500);
plotSys.SystemYPlot(rayField, opticalSystem);


//Ray Trace #2 Reflection



