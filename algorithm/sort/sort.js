window.addEventListener('load',onLoadHandler,false);
function onLoadHandler (argument) {
	// sortTest();

	unitTest();

}
function sortTest(){
	var samples = genRandArr(500,1,100);
	var m = new MergeSort();
	var b = new BubbleSort();
	var c = new Draw(getCanvas(),1000,600);
	// samples = [0,3,5,7,2,4,6,3,4];
	MergeSort.prototype.mergeSort3(samples);

	// BubbleSort.prototype.bubbleSort(samples);
	// console.log(samples); 
	insert_sort(samples);
	c.plot_arr(samples);
	CompareSortAlg(50,2000);

}

function getCanvas(){
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	return ctx;
}
function compare(a,b){
	return a-b;
}
function genRandArr(N,min,max){
	if(min == undefined || max == undefined){
		min = 1;
		max = 100;
	}
	var arr = [];
	for(var i=0;i<N;i++){
		arr.push(randBetween(min,max));
	}
	return arr;
}
function randBetween(min,max){
	return min + parseInt(Math.random()*(max-min));
}

//canvas 绘图类
function Draw(ctx,width,height){
	this.width = width;
	this.height = height;
	this.ctx = ctx;
	this.ctx.fillStyle = '#0092C7';
	Draw.prototype.plot_arr = function (arr){
		var widthStep = parseInt(this.width/arr.length);
		var columnRatio = 0.618;
		var heightRatio = 0.618;
		var max = Math.max.apply(null,arr);
		// console.log('max '+max);
		for(var i=0; i<arr.length; i++){
			this.ctx.moveTo(i*widthStep,0);
			this.ctx.fillRect(i*widthStep,
				this.height-heightRatio*this.height*arr[i]/max,
				columnRatio*widthStep,
				heightRatio*this.height*arr[i]/max);

		}
	};
}


//归并排序
function MergeSort(){
	//自上而下的归并排序
	MergeSort.prototype.mergeSort = function(arr){
		MergeSort.prototype.sort(arr,0,arr.length-1);

	};
	//自下而上的归并排序
	MergeSort.prototype.mergeSort2 = function(arr){
		for(var size = 1; size<arr.length; size +=size){
			for(var lo=0; lo<arr.length;lo += size*2){
				var hi = (lo+size*2-1)<(arr.length-1)?(lo+size*2-1):(arr.length-1);
				var mid = lo+size-1;
				MergeSort.prototype.merge(arr,lo,mid,hi);
				// console.log('merge '+lo+" "+hi+" "+mid+"|"+arr);
			}
		}

	};
	//从原数组中找到已经是升序的子数组,再归并
	MergeSort.prototype.mergeSort3 = function(arr){
		var lo,mid,hi;
		lo = 0;
		mid = MergeSort.prototype.getSorted(arr,lo);
		while(true){
			hi = MergeSort.prototype.getSorted(arr,mid+1);
			MergeSort.prototype.merge(arr,lo,mid,hi);
			mid = hi;
			if(hi == arr.length-1){
				break;
			}
		}
	}
	//找到已排序的字串,返回末尾index
	MergeSort.prototype.getSorted = function(arr,start){
		for(var end = start;end<arr.length-1;end++){
			if(arr[end] > arr[end+1]){
				return end;
			}
		}
		return arr.length-1;
	}


	MergeSort.prototype.merge = function(arr,lo,mid,hi){
		var i = lo;
		var j = mid+1;
		var aux = [];
		//!!!!!!!!!耗费资源最多
		for(var k=lo;k<=hi;k++){
			aux.push(arr[k]);
		}
		for(var k=lo;k<=hi;k++){
			if(i>mid){
				arr[k] = aux[j-lo];
				j++;
			}
			else if(j>hi){
				arr[k] = aux[i-lo];
				i++;
			}
			else if(aux[i-lo]>aux[j-lo]){
				arr[k] = aux[j-lo];
				j++;
			}
			else{
				arr[k] = aux[i-lo];
				i++;
			}
		}
	};
	MergeSort.prototype.sort = function(arr,lo,hi){
		if(hi<=lo){
			return -1;
		}
		var mid = parseInt((lo+hi)/2);
		MergeSort.prototype.sort(arr,lo,mid);
		MergeSort.prototype.sort(arr,mid+1,hi);
		MergeSort.prototype.merge(arr,lo,mid,hi);
	};
	//利用js的特性写出的自上而下的归并
	MergeSort.prototype.mergeSort4 = function(arr){
		var len = arr.length;
		if(len<2){
			return arr;
		}
		var mid = Math.floor(len/2);
		// var mid = Math.floor((lo+hi)/2);
		var left = arr.slice(0,mid);
		var right = arr.slice(mid);
		return MergeSort.prototype.mergeArr(left,right);

	};
	MergeSort.prototype.mergeArr = function(left,right){
		var iL=0,iR=0;
		var res = [];
		for(var k=0;k<left.length+right.length;k++){
			if(iL>=left.length) res.push(right[iR++]);
			else if(iR >= right.length) res.push(left[iL++]);
			else if(left[iL] > right[iR]) res.push(right[iR++]);
			else res.push(left[iL++]);
		}
		return res;
	};
}


function BubbleSort(){
	BubbleSort.prototype.bubbleSort = function(arr){
		for(var i=0;i<arr.length-1;i++){
			for(j=0;j<arr.length-2;j++){
				if(arr[j] > arr[j+1]){
					var temp = arr[j];
					arr[j] = arr[j+1];
					arr[j+1] = temp;
				}
			}
		}
	}
}
//插入排序
function insert_sort (nums) {
	for(var i=1; i<nums.length; i++){
		for(var j=0; j<=i-1; j++){
			if(nums[i] <= nums[j]){
				var temp = nums[i];
				for(var cnt=i;cnt>=j;cnt--){
					nums[cnt] = nums[cnt-1];
				}
				nums[j] = temp;
				// console.log(nums);
				break;
			}
		}
	}
	return nums;
}
function select_sort (nums){
	for(var i=0;i<nums.length;i++){
		//从i到nums.length找最小值
		var min = nums[i];
		var min_index = i;
		for(var j=i+1;j<nums.length;j++){
			if(nums[j]<min){
				min = nums[j];
				min_index = j;
			}
		}
		for(var cnt=min_index;cnt>=i+1;cnt--){
			nums[cnt] = nums[cnt-1];
		}
		nums[i] = min;
		// console.log(nums);
	}
	return nums;
}

function CompareSortAlg(times,N){
	// this.times = times;
	var time1 = 0;
	var time2 = 0;
	for(var i=0; i<times; i++){
		var arr = [];
		var arr2 = [];
		for(var j=0;j<N;j++){
			arr.push(Math.random());
			arr2.push(Math.random());
		}


		//开始计时
		var start1 = new Date();
		// MergeSort.prototype.mergeSort(arr);
		// BubbleSort.prototype.bubbleSort(arr);
		arr.sort(function(a,b){
			return a-b;
		});
		var end1 = Date.now();
		time1 += (end1 - start1.getTime())/1000.0;

		var start2 = new Date();
		MergeSort.prototype.mergeSort4(arr2);
		// insert_sort(arr2);
		// select_sort(arr2);
		// BubbleSort.prototype.bubbleSort(arr2);

		var end2 = Date.now();
		time2 += (end2 - start2.getTime())/1000.0;

	}
	console.log('algorithm1:'+time1+'秒');
	console.log('algorithm2:'+time2+'秒');
}

function shuffle(arr){
	var len = arr.length;
	// var N = len*2;
	for(var i=len-1; i>=0; i--){
		var temp;
		var randIndex = Math.floor(i*Math.random());
		temp = arr[i];
		arr[i] = arr[randIndex];
		arr[randIndex] = temp;

	}

}

function unitTest(){
	var arr = genRandArr(300,0,9999).sort(compare);
	// console.log(arr);
	var c = new Draw(getCanvas(),1000,600);
	// c.plot_arr(arr);
	shuffle(arr);
	c.plot_arr(arr);


}