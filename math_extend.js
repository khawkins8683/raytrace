//convert degrees to radians
math.degree = (math.PI/180);

math.normalize = function(vector){
    return math.divide(vector,math.norm(vector));
}

math.rotationMatrix = function(theta){
    const matrixList = [
        [math.cos(theta),-1*math.sin(theta)],
        [math.sin(theta),math.cos(theta)]
    ];
    return matrixList;
}

math.vectorAngle = function(v1,v2){
    return math.acos(math.multiply(v1,v2)/(math.norm(v1)*math.norm(v2)));
}
