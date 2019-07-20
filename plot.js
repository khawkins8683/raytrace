
function SystemPlot(scale,id,s){
    this.plotScaleFactor = scale;//100
    this.draw = SVG(id).size(s,s);
}
//Ellipses
// ---- TODO - add arrow
SystemPlot.prototype.ellipse = function(jonesVector,center=[0,0],steps=25){
    let points = [];
    let theta = 0;
    for(let i=0; i<=25; i++){
        let point = math.chain(jonesVector).multiply(math.exp(math.multiply(math.i,theta))).add(center).multiply(this.plotScaleFactor).done();
        point.forEach((e,i) => {point[i]=e.re});
        points.push(math.add(center,point));
        theta += (2*math.PI/steps);
    }
    console.log("Calculated Ellipse pts",points);
    this.draw.polyline(points)
        .fill('none')
        .stroke({ width: 1 })
    return points;
}
// Layout ------------------------------------------------------------------
SystemPlot.prototype.plotRayGrid = function(rayGrid,offSet){
    let grid = rayGrid.rayGridOut;
    for(let i = 0; i<grid.length; i++){
        for(let j = 0; j<grid[i].length; j++){
            this.drawRayPath(grid[i][j].rayList ,offSet);
        }
    }
}
SystemPlot.prototype.SurfacesYPlot = function(opticalSystem){
    //First start by plotting the surfaces
    //get the max off set
    let surfs = opticalSystem.surfaces;
    let offSet = opticalSystem.maxSemiDiamter();
    for(let i = 0; i<surfs.length; i++){
        if(surfs[i].curv == 0){
            this.plotPlane(surfs[i].r, surfs[i].semiDiameter,surfs[i].k, offSet);
        }else{
            this.drawHalfCircle(surfs[i].r, 1/surfs[i].curv, offSet);
        }
    }
}    

SystemPlot.prototype.SystemYPlot = function(rayField,opticalSystem){
    //First start by plotting the surfaces
    //get the max off set
    let surfs = opticalSystem.surfaces;
    let offSet = opticalSystem.maxSemiDiamter();
    for(let i = 0; i<surfs.length; i++){
        if(surfs[i].curv == 0){
            this.plotPlane(surfs[i].r, surfs[i].semiDiameter,surfs[i].k, offSet);
        }else{
            this.drawHalfCircle(surfs[i].r, 1/surfs[i].curv, offSet);
        }
    }
    let paths = rayField.rayPaths;
    for(let i = 0; i<paths.length; i++){
        this.drawRayPath(paths[i].rayList ,offSet);
    }
}

SystemPlot.prototype.drawRayPath = function(rayList,offSet){

    let points = [];
    for(let i=0; i<rayList.length; i++){
        let pt = rayList[i].r.slice(1,3).reverse();
        pt[1] += offSet;
        pt = math.multiply(pt, this.plotScaleFactor);
        points.push(pt);//get y-z values
    }
    this.draw.polyline(points)
      .fill('none')
      .stroke({ width: 1 })
      //.move(0, offSet);
}


SystemPlot.prototype.drawHalfCircle = function(center,r,offSet){
 
    let CX = this.plotScaleFactor*center[2];
    let CY = this.plotScaleFactor*(center[1] + offSet);
    let R  = this.plotScaleFactor*r;
    
    //let path = draw.path("M"+(CX - R)+", "+CY+" a "+R+","+R+" 0 1,0 "+(R * 2)+",0");
    let path = this.draw.path("M"+CX+", "+(CY-R)+" a "+R+","+R+" 0 1,0 0,"+(R * 2)); 
    path.fill('none');
    path.stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' });
    //path.move(0, offSet);
}

SystemPlot.prototype.plotPlane = function(center,semiDiam,eta,offSet){

    let sign = [1,-1];
    let points = [];
    for(let i=0; i<sign.length; i++){
        let pt = math.chain([-1*eta[2], eta[1]]).multiply(sign[i]*semiDiam).add(center.slice(1,3)).done();
        //here add offset
        pt[0] += offSet;
        let ptOut = math.multiply(pt.reverse(), this.plotScaleFactor);  
        points.push(ptOut);//get y-z values
    }

    this.draw.polyline(points)
      .fill('none')
      .stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' })
      //.move(0, offSet);
   
}
//// MAPS ----------------------------------------------------
//// MAPS ----------------------------------------------------
//// MAPS ----------------------------------------------------
//// MAPS ----------------------------------------------------
//// MAPS ----------------------------------------------------

//Diattenuation maps ------- 
///// Using plotly.js
DiattenuationSurfaceMap = function(divID,rayGrid,surfaceID=1,title="Diattenuation Surface "+surfaceID){
    let valueGrid = [];
    let valueRow = [];   
    for(let i=0; i<rayGrid.rayGridOut.length; i++){
        valueRow = [];
        for(let j=0; j<rayGrid.rayGridOut[i].length; j++){
            //get the ray with the correct surfaceID
            let ray = rayGrid.rayGridOut[i][j].getSurfaceRay(surfaceID);
            valueRow.push(ray.diattenuation());
        }
        valueGrid.push(valueRow);    
    }
    let data = [{
        z: valueGrid,
        type: 'contour',
        colorscale: 'Jet',
      }];
      
    let layout = {
        title: title
      };
      
    Plotly.newPlot(divID, data, layout, {showSendToCloud: true});    
}
///// Using plotly.js
DiattenuationTotalMap = function(divID,rayGrid,surfaceID=1,title="Total Diattenuation Surf "+surfaceID){
    let valueGrid = [];
    let valueRow = [];   
    for(let i=0; i<rayGrid.rayGridOut.length; i++){
        valueRow = [];
        for(let j=0; j<rayGrid.rayGridOut[i].length; j++){
            //get the ray with the correct surfaceID
            let rayPath = rayGrid.rayGridOut[i][j];
            valueRow.push(rayPath.diattenuation(surfaceID));
        }
        valueGrid.push(valueRow);    
    }
    let data = [{
        z: valueGrid,
        type: 'contour',
        colorscale: 'Jet',
      }];
      
    let layout = {
        title: title
      };
      
    Plotly.newPlot(divID, data, layout, {showSendToCloud: true});    
}

//Retardance maps ------- 
///// Using plotly.js
RetardanceSurfaceMap = function(divID,rayGrid,surfaceID=1,title="Retardance Surface "+surfaceID){
    let valueGrid = [];
    let valueRow = [];   
    for(let i=0; i<rayGrid.rayGridOut.length; i++){
        valueRow = [];
        for(let j=0; j<rayGrid.rayGridOut[i].length; j++){
            //get the ray with the correct surfaceID
            let ray = rayGrid.rayGridOut[i][j].getSurfaceRay(surfaceID);
            valueRow.push(ray.retardance());
        }
        valueGrid.push(valueRow);    
    }
    let data = [{
        z: valueGrid,
        type: 'contour',
        colorscale: 'Jet',
      }];
      
    let layout = {
        title: title
      };
      
    Plotly.newPlot(divID, data, layout, {showSendToCloud: true});    
}
///// Using plotly.js
RetardanceTotalMap = function(divID,rayGrid,surfaceID=1,title="Total Retardance Surf "+surfaceID){
    let valueGrid = [];
    let valueRow = [];   
    for(let i=0; i<rayGrid.rayGridOut.length; i++){
        valueRow = [];
        for(let j=0; j<rayGrid.rayGridOut[i].length; j++){
            //get the ray with the correct surfaceID
            let rayPath = rayGrid.rayGridOut[i][j];
            valueRow.push(rayPath.retardance(surfaceID));
        }
        valueGrid.push(valueRow);    
    }
    let data = [{
        z: valueGrid,
        type: 'contour',
        colorscale: 'Jet',
      }];
      
    let layout = {
        title: title
      };
      
    Plotly.newPlot(divID, data, layout, {showSendToCloud: true});    
}


////// ----- Fresnel aberration Plot
PlotFresnelCoefficients = function (divID,n1=1.0,n2=1.5,steps=90){
    RsData = {    
        type: 'scatter',
        x: [],
        y: [],
        mode: 'lines',
        name: 'Rs',
        line: {
            color: 'rgb(219, 64, 82)',
            width: 3
        }
    };
    RpData = {    
        type: 'scatter',
        x: [],
        y: [],
        mode: 'lines',
        name: 'Rp',
        line: {
            color: 'rgb(219, 64, 82)',
            dash: 'dashdot',
            width: 3
        }
    };
    // Transmission
    TsData = {    
        type: 'scatter',
        x: [],
        y: [],
        mode: 'lines',
        name: 'Ts',
        line: {
            color: 'rgb(55, 128, 191)',
            width: 3
        }
    };
    TpData = {    
        type: 'scatter',
        x: [],
        y: [],
        mode: 'lines',
        name: 'Tp',
        line: {
            color: 'rgb(55, 128, 191)',
            dash: 'dashdot',
            width: 3
        }
    };
    // now loop through theta and calculate the fresnel coefficients
    let ray = new RaySegment();
    ray.n = {n1:n1, n2:n2};
    ray.aoi = 0;

    let x = [];
    for(let i=0; i<steps; i++){
        ray.aoi = (math.PI/2)*(i/steps);
        x.push(ray.aoi);
        //calculate y data
        RsData.y.push( ray.Rs() );
        RpData.y.push( ray.Rp() );        
        TsData.y.push( ray.Ts() );
        TpData.y.push( ray.Tp() );
    }
    RsData.x = x;
    RpData.x = x;       
    TsData.x = x;
    TpData.x = x;
    var data = [RsData,RpData,TsData,TpData];
    Plotly.newPlot(divID, data, {}, {showSendToCloud: true});
}
