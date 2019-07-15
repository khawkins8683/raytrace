
function SystemPlot(scale,id,s){
    this.plotScaleFactor = scale;//100
    this.draw = SVG(id).size(s,s);
}


SystemPlot.prototype.drawRayPath = function(rayList){

    let points = [];
    for(let i=0; i<rayList.length; i++){
        let pt = math.multiply(rayList[i].r.slice(1,3).reverse(), this.plotScaleFactor);
        points.push(pt);//get y-z values
    }
    this.draw.polyline(points).fill('none').stroke({ width: 1 })
}


SystemPlot.prototype.drawHalfCircle = function(cX,cY,r){

    let CX = this.plotScaleFactor*cX;
    let CY = this.plotScaleFactor*cY;
    let R  = this.plotScaleFactor*r;
    
    //let path = draw.path("M"+(CX - R)+", "+CY+" a "+R+","+R+" 0 1,0 "+(R * 2)+",0");
    let path = this.draw.path("M"+CX+", "+(CY-R)+" a "+R+","+R+" 0 1,0 0,"+(R * 2)); 
    path.fill('none');
    path.stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' });
}

SystemPlot.prototype.plotPlane = function(center,semiDiam,eta){

    let sign = [1,-1];
    let points = [];
    for(let i=0; i<sign.length; i++){
        let pt = math.chain([-1*eta[2], eta[1]]).multiply(sign[i]*semiDiam).add(center.slice(1,3)).done();
        let ptOut = math.multiply(pt.reverse(), this.plotScaleFactor);  
        points.push(ptOut);//get y-z values
    }
    console.log("pts",points);
    this.draw.polyline(points).fill('none').stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' });
   
}

// function drawCircle(cX,cY,r){

//     let CX = plotScaleFactor*cX;
//     let CY = plotScaleFactor*cY;
//     let R = plotScaleFactor*r;
    
//     let path = draw.path("M"+(CX - R)+", "+CY+" a "+R+","+R+" 0 1,0 "+(R * 2)+",0 a "+R+","+R+" 0 1,0 -"+(R * 2)+",0") 
//     path.fill('none');
//     path.stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' });
// }

// function drawHalfCircle(cX,cY,r){

//     let CX = plotScaleFactor*cX;
//     let CY = plotScaleFactor*cY;
//     let R = plotScaleFactor*r;
    
//     //let path = draw.path("M"+(CX - R)+", "+CY+" a "+R+","+R+" 0 1,0 "+(R * 2)+",0");
//     let path = draw.path("M"+CX+", "+(CY-R)+" a "+R+","+R+" 0 1,0 0,"+(R * 2)); 
//     path.fill('none');
//     path.stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' });
// }

