let lastPostion = Math.round(this.scrollY);
let $header = document.getElementsByTagName("header")[0];
let top1 = 0;
let scale1 = 1.75;

function scrollNavBar(current){
    //first step 
    let direction = lastPostion-current;
    top1 = top1 + (1/scale1)*direction;
    if(top1<-75){top1=-75}
    else if(top1>0){top1=0}
    $header.style.top = ( top1 )+"px";
    lastPostion = current;
}

function getSectionPositions(scrollSectionIDs){

	let heightList = [];

	for(let i=0; i<scrollSectionIDs.length; i++){
		//get the element offset width
		let div = document.getElementById(scrollSectionIDs[i]);
		heightList.push(div.offsetTop);
	}
	return heightList;
}

function setNavScroll(scrollSectionIDs,heightList){
        
	let sec ="";
	let li = null;
	let scrollPos = Math.round(this.scrollY);
	
	//get the current section
	for(let i = 0; i<scrollSectionIDs.length-1; i++){
		
		if(scrollPos>heightList[i]&&scrollPos<heightList[i+1]){
			//add high light to nav sec
			sec = scrollSectionIDs[i];
			li  = document.getElementById('nav'+ sec);
		}else if(scrollPos>heightList[heightList.length-1]){
			sec = scrollSectionIDs[heightList.length-1];
			li  = document.getElementById('nav'+ sec);
		}
	}
    // add highlight to current section
	for(let i = 0; i<scrollSectionIDs.length; i++){
		if(scrollSectionIDs[i]===sec){
            li.classList.add('navhighlight');
		}else{
			document.getElementById('nav'+ scrollSectionIDs[i]).classList.remove('navhighlight');
		}
	}


}

//now set the windows on scrole event
window.addEventListener('scroll', function(){
        // we round here to reduce a little workload
        let current = Math.round(this.scrollY);
        scrollNavBar(current);
        let scrollSectionIDs = ['overviewContainer','jonesContainer','fresnelContainer','prtContainer','systemContainer','analysisContainer','takeAwaysContainer','thanksContainer'];
        let heightList = getSectionPositions(scrollSectionIDs);
        //add class to nav item if scroll bar is in each section       
        setNavScroll(scrollSectionIDs,heightList)
    });

