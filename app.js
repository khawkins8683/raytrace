//TODO ---- 
//  organize into Ray file System File Trace File and Plot file
//  Organize to run server side
//  ability to use negative radius of curvature
        // i.e. calculate intersection with the front or the back of the sphere
//  ability to use 0 as curvature
//  ability to relfect or refract
//  OpticalSystem object type

//  ability to intercept function surface
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
let rays = [
    trace.traceSystem(rayIn1, opticalSystem),
    trace.traceSystem(rayIn2, opticalSystem)
];
let rayField = new RayField(rays);

/// create a new plot obj
let plotSys = new SystemPlot(70,'systemPlot1',300);
plotSys.SystemYPlot(rayField, opticalSystem);
//test fresnel coefficients
let testRay = rays[0].rayList[1];
console.log("rs, rp",[testRay.rs(),  testRay.rp()]);
console.log("Rs, Rp",[testRay.Rs(),  testRay.Rp()]);
console.log("ts, tp",[testRay.ts(),  testRay.tp()]);
console.log("Ts, Tp",[testRay.Ts(),  testRay.Tp()]);
//.transmissionFactor
console.log("Ts 2, Tp 2",[testRay.transmissionFactor()*testRay.ts()**2,  testRay.transmissionFactor()*testRay.tp()**2]);
//test prt props
console.log("K vector: ",math.multiply(testRay.PRT(),[0,0,1]),testRay.k);
console.log("s vector: ",math.multiply(testRay.PRT(),testRay.sIn ),  math.multiply(testRay.sOutVector(), testRay.ts() ));
console.log("p vector: ",math.multiply(testRay.PRT(),testRay.pIn ),  math.multiply(testRay.pOutVector(), testRay.tp() ));
//polprops
console.log("Diattenuation",testRay.diattenuation());
console.log("Retardance", testRay.retardance());

//Ray Trace #2 Reflection
let rayIn = new RaySegment([0,0,0],math.normalize([0,0,1]),500,[0,0,1],0,0,{n1:1,n2:1},0);

sd = 3;//semi diamtere
type = "reflect";
nGlass = 2.5;
nAir = 1;
let surfR1 = new Surface(nAir,nGlass,0,[0,0,2],1,math.normalize([0,1,1]),sd,type);
let surfR2 = new Surface(nAir,nGlass,0,[0,-2,2],2,math.normalize([0,1,-1]),sd,type);
let surfR3 = new Surface(nAir,nGlass,0,[0,-2,0],3,math.normalize([0,0,1]),sd,type);
let opticalSystemR = new System( [surfR1,surfR2,surfR3] );
let raysReflected = [trace.traceSystem(rayIn, opticalSystemR)];
let rayFieldReflected = new RayField(raysReflected);

/// create a new plot obj
let plotSysR = new SystemPlot(70,'systemPlot2',300);
plotSysR.SystemYPlot(rayFieldReflected, opticalSystemR);



