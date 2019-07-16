
function SystemPlot(scale,id,s){
    this.plotScaleFactor = scale;//100
    this.draw = SVG(id).size(s,s);
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
