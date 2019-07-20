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
