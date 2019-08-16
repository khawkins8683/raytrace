

//set up a bi convex lens
//optical interactions
//let trace = new Trace();
let nAir = 1.0;
let nGlass = 1.5;
let sd = 1;
let s1,s2,s3,os,rayIn,rayIn1,rayIn2,rayIn3,rayOut;
///--------------------------------------------------------------------------------------------


//Planar Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Planar Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Planar Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Planar Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------

//Refract----------------------------------------
//Refract----------------------------------------

//normal ----------------
s1 = new Plane();
s1.init(nAir, nGlass,[0,0,1], [0,0,1],  sd,"refract",1,"Convex Surface (L1)");
s2 = new Plane();
s2.init(nGlass,nAir, [0,0,3], [0,0,1],  sd,"refract",2,"Convex Surface (L2)");
s3 = new Plane();
s3.init(nAir,  nAir, [0,0,4], [0,0,1],2*sd,"refract",3,"detector");
//system
os = new System( [s1,s2,s3] );
rayIn = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayOut = new RayField([os.traceSystem(rayIn)]);
let plotSys1 = new SystemPlot(70,'systemPlot1',300,300);
plotSys1.SystemYPlot(rayOut, os);



//Planar Surfaces + 45 -------------------
s1 = new Plane();
s1.init(nAir,nGlass,[0,0,1],math.normalize([0,1,1]),  sd,"refract",1,"Convex Surface (L1)");
s2 = new Plane();
s2.init(nGlass,nAir,[0,0,3],math.normalize([0,1,1]),  sd,"refract",2,"Convex Surface (L2)");
s3 = new Plane();
s3.init(nAir,nAir,  [0,0,4],[0,0,1],2*sd,"refract",3,"detector");
//system
os = new System( [s1,s2,s3] );
rayIn = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayOut = new RayField([os.traceSystem(rayIn)]);
let plotSys2 = new SystemPlot(70,'systemPlot2',300,300);
plotSys2.SystemYPlot(rayOut, os);
/*
//Planar Surfaces - 45-------------------------
s1 = new Surface(nAir,nGlass,0 ,[0,0,1], 1,math.normalize([0,-1,1]),  sd,"refract","Convex Surface (L1)");
s2 = new Surface(nGlass,nAir,0 ,[0,0,3], 2,math.normalize([0,-1,1]),  sd,"refract","Convex Surface (L2)");
s3 = new Surface(nAir,nAir,  0 ,[0,0,4], 3,[0,0,1],2*sd,"refract","detector");
//system
os = new System( [s1,s2,s3] );
rayIn = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn, os)]);
let plotSys3 = new SystemPlot(70,'systemPlot3',300,300);
plotSys3.SystemYPlot(rayOut, os);

//// Reflect -----------------------------------
//// Reflect ---------------------------------------

//Planar Surfaces +45 -------------------------
s1 = new Surface(nAir,nGlass,0 ,[0,0,1],1,math.normalize([0,-1,1]),  sd,"reflect","+45");
s2 = new Surface(nAir,nAir,  0, [0,1,1],2,[0,1,0],  sd,"refract","detector");
os = new System( [s1,s2] );
rayIn = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn, os)]);
let plotSys4 = new SystemPlot(70,'systemPlot4',300,300);
plotSys4.SystemYPlot(rayOut, os);
//Planar Surfaces -45 -------------------------
s1 = new Surface(nAir,nGlass,0 ,[0,0,1],1,math.normalize([0,1,1]),  sd,"reflect","+45");
s2 = new Surface(nAir,nAir,  0, [0,-1,1],2,[0,-1,0],  sd,"refract","detector");
os = new System( [s1,s2] );
rayIn = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn, os)]);
let plotSys5 = new SystemPlot(70,'systemPlot5',300,300);
plotSys5.SystemYPlot(rayOut, os);


//Positive Curv Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Positive Curv Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Positive Curv Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Positive Curv Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//normal
s1 = new Surface(nAir,nGlass,1 ,[0,0,1], 1,[0,0,1],  sd,"refract","Convex Surface (L1)");
s2 = new Surface(nGlass,nAir,0 ,[0,0,2], 2,[0,0,1],  sd,"refract","Planar (L2)");
s3 = new Surface(nAir,nAir,  0 ,[0,0,4], 3,[0,0,1],2*sd,"refract","detector");
//system
os = new System( [s1,s2,s3] );
rayIn1 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
rayIn2 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayIn3 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys6 = new SystemPlot(70,'systemPlot6',300,300);
plotSys6.SystemYPlot(rayOut, os);
//+45
sysa = math.normalize([0,1,1]);
s1 = new Surface(nAir,nGlass,1,[0,0,1], 1, sysa,  sd,"refract","Convex Surface (L1)");
s2 = new Surface(nGlass,nAir,0,math.chain(1).multiply(sysa).add([0,0,1]).done(), 2,sysa,  sd,"refract","Planar (L2)");
s3 = new Surface(nAir,nAir,  0,math.chain(3).multiply(sysa).add([0,0,1]).done(), 3,sysa,2*sd,"refract","detector");
//system
os = new System( [s1,s2,s3] );
rayIn1 = new RaySegment(math.rotationMatrixXFixed(-1*45*math.degree, [0,0,1], [0,-0.5,0]) , sysa,500);
rayIn2 = new RaySegment(math.rotationMatrixXFixed(-1*45*math.degree, [0,0,1], [0,0,0]),  sysa,500);
rayIn3 = new RaySegment(math.rotationMatrixXFixed(-1*45*math.degree, [0,0,1], [0,0.5,0]),  sysa,500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys7 = new SystemPlot(70,'systemPlot7',300,300);
plotSys7.SystemYPlot(rayOut, os);
//-45
sysa = math.normalize([0,-1,1]);
s1 = new Surface(nAir,nGlass,1,[0,0,1], 1, sysa,  sd,"refract","Convex Surface (L1)");
s2 = new Surface(nGlass,nAir,0,math.chain(1).multiply(sysa).add([0,0,1]).done(), 2,sysa,  sd,"refract","Planar (L2)");
s3 = new Surface(nAir,nAir,  0,math.chain(3).multiply(sysa).add([0,0,1]).done(), 3,sysa,2*sd,"refract","detector");
//system
os = new System( [s1,s2,s3] );
rayIn1 = new RaySegment(math.rotationMatrixXFixed(45*math.degree, [0,0,1], [0,-0.5,0]) , sysa,500);
rayIn2 = new RaySegment(math.rotationMatrixXFixed(45*math.degree, [0,0,1], [0,0,0]),  sysa,500);
rayIn3 = new RaySegment(math.rotationMatrixXFixed(45*math.degree, [0,0,1], [0,0.5,0]),  sysa,500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys8 = new SystemPlot(70,'systemPlot8',300,300);
plotSys8.SystemYPlot(rayOut, os);


//Negative Curv Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Negative Curv Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Negative Curv Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//Negative Curv Surfaces - --------------------------------------------------------------------------------------------------------------------------------------------------------------
//normal
s1 = new Surface(nAir,nGlass,-1 ,[0,0,1], 1,[0,0,1],  sd,"refract","Convex Surface (L1)");
s2 = new Surface(nGlass,nAir,0 ,[0,0,2], 2,[0,0,1],  sd,"refract","Planar (L2)");
s3 = new Surface(nAir,nAir,  0 ,[0,0,4], 3,[0,0,1],2*sd,"refract","detector");
//system
os = new System( [s1,s2,s3] );
rayIn1 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
rayIn2 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayIn3 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys9 = new SystemPlot(70,'systemPlot9',300,300);
plotSys9.SystemYPlot(rayOut, os);
//+45
sysa = math.normalize([0,1,1]);
s1 = new Surface(nAir,nGlass,-1,[0,0,1], 1, sysa,  sd,"refract","Convex Surface (L1)");
s2 = new Surface(nGlass,nAir,0,math.chain(1).multiply(sysa).add([0,0,1]).done(), 2,sysa,  sd,"refract","Planar (L2)");
s3 = new Surface(nAir,nAir,  0,math.chain(3).multiply(sysa).add([0,0,1]).done(), 3,sysa,2*sd,"refract","detector");
//system
os = new System( [s1,s2,s3] );
rayIn1 = new RaySegment(math.rotationMatrixXFixed(-1*45*math.degree, [0,0,1], [0,-0.5,0]) , sysa,500);
rayIn2 = new RaySegment(math.rotationMatrixXFixed(-1*45*math.degree, [0,0,1], [0,0,0]),  sysa,500);
rayIn3 = new RaySegment(math.rotationMatrixXFixed(-1*45*math.degree, [0,0,1], [0,0.5,0]),  sysa,500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys10 = new SystemPlot(70,'systemPlot10',300,300);
plotSys10.SystemYPlot(rayOut, os);
//-45
sysa = math.normalize([0,-1,1]);
s1 = new Surface(nAir,nGlass,-1,[0,0,1], 1, sysa,  sd,"refract","Convex Surface (L1)");
s2 = new Surface(nGlass,nAir,0,math.chain(1).multiply(sysa).add([0,0,1]).done(), 2,sysa,  sd,"refract","Planar (L2)");
s3 = new Surface(nAir,nAir,  0,math.chain(3).multiply(sysa).add([0,0,1]).done(), 3,sysa,2*sd,"refract","detector");
//system
os = new System( [s1,s2,s3] );
rayIn1 = new RaySegment(math.rotationMatrixXFixed(45*math.degree, [0,0,1], [0,-0.5,0]) , sysa,500);
rayIn2 = new RaySegment(math.rotationMatrixXFixed(45*math.degree, [0,0,1], [0,0,0]),  sysa,500);
rayIn3 = new RaySegment(math.rotationMatrixXFixed(45*math.degree, [0,0,1], [0,0.5,0]),  sysa,500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys11 = new SystemPlot(70,'systemPlot11',350,350);
plotSys11.SystemYPlot(rayOut, os);



/// now relfections case --- positive
//normal
s1 = new Surface(nAir,nGlass,0.5 ,[0,0,1], 1,[0,0,1],  sd,"reflect","Convex Surface (L1)");
s2 = new Surface(nAir,nAir,  0 ,[0,0,0], 3,[0,0,-1],2*sd,"refract","detector");
os = new System( [s1,s2] );
rayIn1 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
rayIn2 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayIn3 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys12 = new SystemPlot(70,'systemPlot12',300,300);
plotSys12.SystemYPlot(rayOut, os);
//+45
s1 = new Surface(nAir,nGlass,0.25 , [0,0,2],1, math.normalize([0,-1,1]),  sd,"reflect","Convex Surface (L1)");
s2 = new Surface(nAir,nAir,  0 ,[0,2,2], 3,[0,1,0],2*sd,"refract","detector");
os = new System( [s1,s2] );
rayIn1 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
rayIn2 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayIn3 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys13 = new SystemPlot(70,'systemPlot13',300,300);
plotSys13.SystemYPlot(rayOut, os);
//-45
s1 = new Surface(nAir,nGlass,0.25 , [0,0,2],1, math.normalize([0,1,1]),  sd,"reflect","Convex Surface (L1)");
s2 = new Surface(nAir,nAir,  0 ,[0,-2,2], 3,[0,-1,0],2*sd,"refract","detector");
os = new System( [s1,s2] );
rayIn1 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
rayIn2 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayIn3 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys14 = new SystemPlot(70,'systemPlot14',300,300);
plotSys14.SystemYPlot(rayOut, os);

/// now relfections case --negative
//normal
s1 = new Surface(nAir,nGlass,-0.5 ,[0,0,1], 1,[0,0,1],  sd,"reflect","Convex Surface (L1)");
s2 = new Surface(nAir,nAir,  0 ,[0,0,0], 3,[0,0,-1],2*sd,"refract","detector");
os = new System( [s1,s2] );
rayIn1 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
rayIn2 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayIn3 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys15 = new SystemPlot(70,'systemPlot15',300,300);
plotSys15.SystemYPlot(rayOut, os);
//+45
s1 = new Surface(nAir,nGlass,-0.25 , [0,0,2],1, math.normalize([0,-1,1]),  sd,"reflect","Convex Surface (L1)");
s2 = new Surface(nAir,nAir,  0 ,[0,2,2], 3,[0,1,0],2*sd,"refract","detector");
os = new System( [s1,s2] );
rayIn1 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
rayIn2 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayIn3 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);
rayOut = new RayField([trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os)]);
let plotSys16 = new SystemPlot(70,'systemPlot16',300,300);
plotSys16.SystemYPlot(rayOut, os);
//-45
s1 = new Surface(nAir,nGlass,-0.15 , [0,0,2],1, math.normalize([0,1,1]),  sd,"reflect","Convex Surface (L1)");
s2 = new Surface(nAir,nAir,  0 ,[0,-2,2], 3,[0,-1,0],2*sd,"refract","detector");
os = new System( [s1,s2] );
rayIn1 = new RaySegment([0,-0.5,0],math.normalize([0,0,1]),500);
rayIn2 = new RaySegment([0,0,0],math.normalize([0,0,1]),500);
rayIn3 = new RaySegment([0,0.5,0],math.normalize([0,0,1]),500);

rayIn4 = new RaySegment([0,-0.25,0],math.normalize([0,0,1]),500);
rayIn5 = new RaySegment([0,0.1,0],math.normalize([0,0,1]),500);
rayIn6 = new RaySegment([0,0.25,0],math.normalize([0,0,1]),500);

rayOut = new RayField([
    trace.traceSystem(rayIn1, os),trace.traceSystem(rayIn2, os),trace.traceSystem(rayIn3, os),
    trace.traceSystem(rayIn4, os),trace.traceSystem(rayIn5, os),trace.traceSystem(rayIn6, os)
]);
let plotSys17 = new SystemPlot(70,'systemPlot17',300,300);
plotSys17.SystemYPlot(rayOut, os);

*/