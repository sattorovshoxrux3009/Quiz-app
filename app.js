//DOM elements 
const answersDoc=document.querySelector('#answers')
const questionDoc=document.querySelector('#question')
const nextbtn=document.querySelector('#next-btn')
const answers=document.querySelectorAll('.item')
const text=document.querySelector('.text');
const modal=document.querySelector('.modal')
const resetBtn=document.querySelector('#reset-btn')
const modalTitle=document.querySelector('.modal-title')
const loader=document.querySelector('.loader')
const item=document.querySelectorAll('.item');


// App variables
let datas=[];
let countQuestion=0;
let lock=0;
let correctIndex;
let score=0;


// Request sender function
const getdata = async (url)=>{
	loader.classList.remove('hide');
	const request = await fetch(url);
	const data = await request.json();
	loader.classList.add('hide');
	return data;
}


// Send request when user visit and start again 
function restart(){
	getdata('https://opentdb.com/api.php?amount=10')
  .then((data)=>{
	if(data.response_code===0){
	data.results.map(loadedQuestion=>{
		const formattedQuestion={
			question: loadedQuestion
		}
		answerChoices=[...loadedQuestion.incorrect_answers]
		formattedQuestion.answer=getRandomInt(1,4);
		answerChoices.splice(formattedQuestion.answer-1,0,loadedQuestion.correct_answer);
		answerChoices.forEach((choice,index)=>{
			formattedQuestion["choice"+(index+1)]=choice
		})
		datas=[...datas,formattedQuestion];
	})
	}
	else{
		alert('Error!')
	}
  })
  .then(()=>{
	start();
	console.log(datas)
  })
}


// Random numbers generator
function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}


// Write questions and answers on HTML page from Data
function start(){
	questionDoc.textContent=countQuestion+1+"."+datas[countQuestion].question.question;
	answersDoc.children[0].textContent=datas[countQuestion].choice1;
	answersDoc.children[1].textContent=datas[countQuestion].choice2;
	answersDoc.children[2].textContent=datas[countQuestion].choice3;
	answersDoc.children[3].textContent=datas[countQuestion].choice4;
	text.textContent=countQuestion+1+'/'+datas.length;
	correctIndex=datas[countQuestion].answer
}


// Check answer correct or uncorrect
answers.forEach((element,index)=>{
	element.addEventListener('click',(e)=>{
		if(!lock){
			if(datas[countQuestion].answer===index+1){
				answersDoc.children[correctIndex-1].classList.add('correct');
				score=score+1;
			}
			else{
				answersDoc.children[correctIndex-1].classList.add('correct');
				answersDoc.children[index].classList.add('uncorrect');
			}
			lock=1;
		}
	})
})


// Move on to the next question
nextbtn.addEventListener('click',()=>{
	if(lock && countQuestion!=datas.length-1){
		countQuestion=countQuestion+1;
		start();
		lock=0;
		resetColors();
	}
	else if(lock && countQuestion==datas.length-1){
		modal.classList.remove('hide')
		modalTitle.textContent='You answered '+score+' question correctly';
	}
})


// Restart quiz
resetBtn.addEventListener('click',()=>{
	countQuestion=0;
	lock=0;
	score=0;
	modal.classList.add('hide')
	restart();
	datas=[];
	resetColors();
})


// reset answers red and green colors
function resetColors(){
	item.forEach((element)=>{
		element.classList.remove('correct')
		element.classList.remove('uncorrect')
	})
}


// Call restart function when first opened
restart();
