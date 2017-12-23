"use strict";
// note, interval, and audio array
const notes = [
	{number: 0,
	sound: new Audio("wav/c1.wav")},
	{number: 1,
	sound: new Audio("wav/c1s.wav"),
	button: document.querySelector(".m2")},
	{number: 2,
	sound: new Audio("wav/d1.wav"),
	button: document.querySelector(".M2")},
	{number: 3,
	sound: new Audio("wav/d1s.wav"),
	button: document.querySelector(".m3")},
	{number: 4,
	sound: new Audio("wav/e1.wav"),
	button: document.querySelector(".M3")},
	{number: 5,
	sound: new Audio("wav/f1.wav"),
	button: document.querySelector(".P4")},
	{number: 6,
	sound: new Audio("wav/f1s.wav"),
	button: document.querySelector(".b5")},
	{number: 7,
	sound: new Audio("wav/g1.wav"),
	button: document.querySelector(".P5")},
	{number: 8,
	sound: new Audio("wav/g1s.wav"),
	button: document.querySelector(".m6")},
	{number: 9,
	sound: new Audio("wav/a1.wav"),
	button: document.querySelector(".M6")},
	{number: 10,
	sound: new Audio("wav/a1s.wav"),
	button: document.querySelector(".m7")},
	{number: 11,
	sound: new Audio("wav/b1.wav"),
	button: document.querySelector(".M7")}
];

//dom related
var refresh 		= document.querySelector(".refresh"),
 		ascending 	= document.querySelector(".ascending"),
 		descending 	= document.querySelector(".descending"),
 		mixed 			= document.querySelector(".mixed"),
 		firstNote,
 		secondNote;

//button animation related
const isMobile 	= window.navigator.userAgent.match(/Mobile/) && window.navigator.userAgent.match(/Mobile/)[0] === "Mobile",
			event 		= isMobile ? "touchstart" : "click",
			button 		= document.querySelectorAll('*[data-animation="ripple"]'),
			container = document.querySelector(".container");



ascending.addEventListener("click", function() {
	modeSelect(ascending, descending, mixed);
});

descending.addEventListener("click", function() {
	modeSelect(descending, ascending, mixed);
});

mixed.addEventListener("click", function() {
	modeSelect(mixed, ascending, descending);
});

refresh.addEventListener("click", function(){
	this.innerHTML = "Refresh";
	refreshAll();
});

// Assigns two random numbers between 0 and 11, each corresponding with a note
function generateNotes() {
	// Ascending Mode
	if(ascending.classList.contains("active")) {
		secondNote = Math.floor(Math.random() * 12);
		firstNote = Math.floor(Math.random() * secondNote);
	// Descending Mode
	} else if (descending.classList.contains("active")) {
			firstNote = Math.floor(Math.random() * 12);
			secondNote = Math.floor(Math.random() * firstNote);
		// Mixed Mode
		} else {
			firstNote = Math.floor(Math.random() * 12);
			secondNote = Math.floor(Math.random() * 12);
		}
	// Generate again if notes are the same
	if (firstNote === secondNote) {
		generateNotes();
	}
	console.log(firstNote);
	console.log(secondNote);
}

// Subtracts the numbers from each given note, converts to absolute value, and assigns event listener to corresponding interval button
function determineInterval() {
	for (var i = 0; i < notes.length; i++) {
		if (Math.abs(firstNote - secondNote) === notes[i].number) {
			notes[i].button.addEventListener("click", function finishClick() {
				this.removeEventListener("click", finishClick);
				refreshAll();								
			});
		}  
	}
}

// Plays the sound clip from the appropriate key in the notes object
function playNotes() {
	notes[firstNote].sound.play();
	console.log(notes[firstNote].sound);
	setTimeout(function() {
    notes[secondNote].sound.play();
    console.log(notes[secondNote].sound);       
	}, 700);
}

// Adds the active class to the mode selection buttons, allowing generateNotes() to determine what mode is selected
function modeSelect(modeToAdd, firstRemove, secondRemove) {
		modeToAdd.classList.add("active");
		firstRemove.classList.remove("active");
		secondRemove.classList.remove("active");
	}


//refreshes all functions. Timeout on playNotes is to prevent audio from stacking
function refreshAll() {
	generateNotes();
	determineInterval();
	setTimeout(function() {
	playNotes();
	}, 100)
}

// Button animation
for (var i = 0; i < button.length; i++) {
	const currentBtn = button[i];
	
	currentBtn.addEventListener(event, function(e) {
		
		e.preventDefault();
		const button = e.target,
					rect = button.getBoundingClientRect(),
					originalBtn = this,
					btnHeight = rect.height,
					btnWidth = rect.width;
		let posMouseX = 0,
				posMouseY = 0;
		
		if (isMobile) {
			posMouseX = e.changedTouches[0].pageX - rect.left;
			posMouseY = e.changedTouches[0].pageY - rect.top;
		} else {
			posMouseX = e.x - rect.left;
			posMouseY = e.y - rect.top;
		}
		
		const baseCSS =  `position: absolute;
											width: ${btnWidth * 2}px;
											height: ${btnWidth * 2}px;
											transition: all linear 700ms;
											transition-timing-function:cubic-bezier(0.250, 0.460, 0.450, 0.940);
											border-radius: 50%;
											background: var(--color-ripple);
											top:${posMouseY - btnWidth}px;
											left:${posMouseX - btnWidth}px;
											pointer-events: none;
											transform:scale(0)`
		
		var rippleEffect = document.createElement("span");
		rippleEffect.style.cssText = baseCSS;
		
		//prepare the dom
		currentBtn.style.overflow = "hidden";
		this.appendChild(rippleEffect);
		
		//start animation
		setTimeout( function() { 
			rippleEffect.style.cssText = baseCSS + `transform:scale(1); opacity: 0;`;
		}, 5);
		
		setTimeout( function() {
			rippleEffect.remove();
			//window.location.href = currentBtn.href;
		},700);
	})
}