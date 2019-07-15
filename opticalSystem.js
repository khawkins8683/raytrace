//TODO - need to add in an aperture
//TODO - need to add in a direction
function Surface(n1,n2,curv,r,id,eta){
    this.id = id;//unique identifier
    this.n1 = n1;//incident material
    this.n2 = n2;//substrat material
    this.curv = curv;// 1/radius of curvature in mm
    this.r = r;//three d postion vector
    this.k = eta;//todo allow this to be off axis
}