window.onload = function (){
	var wrapper = document.getElementById('wrapper');
	var img = document.getElementsByTagName('img')[0];
	// console.log(img.src);	
	var timer = null;
	var img_num = 0;
	wrapper.addEventListener('mouseover',function(event){
		var id = event.target.id;
		clearInterval(timer);
		timer = setInterval(spin,20);
		function spin(){
			if(id == 'left'){
				img_num =(img_num+1)%77; 

			}
			else if(id == 'right'){
				img_num =(img_num-1)%77; 
				if(img_num < 0){
					img_num = 76;
				}

			}
			img.src = "img/"+img_num+".jpg"; 
		}

	},false);
	

	
};
