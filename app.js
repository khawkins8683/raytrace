function raySegment(r,k,lambda){
    this.n = 1.0;//create ray in air for now 
    this.r = r;//3D location
    this.k = k;//3D propagation direction
    this.prt = math.identity(3);//IdentityMatrix(3);
    this.opl = 0;
    this.s = 1;//fresnel coefficient for s-polarized light
    this.p = 1;//fresnel coefficient for p-polarized light
    this.flux = 1;//calculate absorbtion due to bbers law
}

function surface(n1,n2,curv,r,k,id){
    this.id = id;//unique identifier
    this.n1 = n1;//incident material
    this.n2 = n2;//substrat material
    this.curv = curv;// 1/radius of curvature in mm
    this.r = r;//three d location vector
    this.k = k;//three d postion vector
}


///// utility functions/////----------------------------------

////// Fresnel --------------------
function rs(n1,n2,theta){
    let t1 = (n1*math.cos(theta));
    let t2 = ((n1/n2)*math.sin(theta))**2;
    let t3 = n2*math.sqrt(1-t2);

    return (t1-t3)/(t1+t3);
}

function rp(n1,n2,theta){
    let t1 = (n2*math.cos(theta));
    let t2 = ((n1/n2)*math.sin(theta))**2;
    let t3 = n1*math.sqrt(1-t2);

    return (t3-t1)/(t3+t1);
}

function AngleOfRefraction(n1, n2, thetai){
    return math.asin((n1/n2)*math.sin(thetai))
}


function SnellRefract(n1,n2,eta,k1){
    let mu = (n1/n2);
    let ni = math.dot(eta,k1);
    let t1 = math.sqrt(1-((mu**2)*(1-ni)**2));
    let k21 = math.multiply(t1,eta);
    let k22Vec = math.subtract(k1,math.multiply(ni,eta));
    let k22 = math.multiply(mu,k22Vec);
    return math.add(k21,k22);
}



function Rotation2D(theta){
    const matrixList = [
        [math.cos(theta),-1*math.sin(theta)],
        [math.sin(theta),math.cos(theta)]
    ];
    return math.matrix(matrixList);
}

//this is not needed
function IdentityMatrix(dim){
    let matrix = [];
    for(let i = 0; i<dim; i++){
        //for each row
        let row = [];
        for(let j = 0; j<dim; j++){
            //for each item
            if(i==j){
                row.push(1)
            }else{
                row.push(0)
            }
        }
        matrix.push(row);
    }
    return math.matrix(matrix);
}
