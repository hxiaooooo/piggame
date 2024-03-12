"use strict";

function disableScroll(event) {
	event.preventDefault();
}
window.addEventListener("wheel", disableScroll, { passive: false });
window.addEventListener("touchmove", disableScroll, { passive: false });

// Selecting elements
const namePickingEl = document.querySelector(".name-picking");

const username0El = document.getElementById("name--0");
const username1El = document.getElementById("name--1");

let username0, username1;

const player0El = document.querySelector(".player--0");
const player1El = document.querySelector(".player--1");

const score0El = document.querySelector("#score--0");
const score1El = document.getElementById("score--1");

const current0El = document.getElementById("current--0");
const current1El = document.getElementById("current--1");

const winGoalEl = document.getElementById("win__goal");
const winWinnerEl = document.getElementById("win__winner");
const winLoserEl = document.getElementById("win__loser");
const winDistanceEl = document.getElementById("win__distance");
const winOsEl = document.getElementById("win__os");
const popupBtn = document.getElementById("help__btn--popup");

let winWinner, winLoser, winDistance, winOs;

const diceEl = document.querySelector(".dice");

const btnForm = document.querySelector(".form__btn");
const btnNew = document.querySelector(".btn--new");
const btnRoll = document.querySelector(".btn--roll");
const btnHold = document.querySelector(".btn--hold");
const btnWin = document.getElementById("btn--win");
const btnHelp = document.getElementById("help");

const winMessageWindown = document.querySelector(".win-message");
const overlay = document.querySelector(".overlay");

const helpPopup = document.querySelector(".help--popup");
const helpGoal = document.getElementById("help__goal");

let scores, currentScore, activePlayer, playing;
let goal = 50;

// Pick username
const usernamePicking = function () {
	username0 = "Player 1";
	username1 = "Player 2";

	namePickingEl.classList.remove("hidden");

	btnForm.addEventListener("click", function () {
		username0 = document.getElementById("input--0").value;
		username1 = document.getElementById("input--1").value;

		if (username0 === username1) {
			alert("Cant use the same username");
		} else if (username0.length === 0 || username1.length === 0) {
			alert("Cant leave it alone");
		} else if (username0.length > 11 || username1.length > 11) {
			alert("Max length is 11");
		} else {
			username0El.textContent = `${username0}`;
			username1El.textContent = `${username1}`;
			namePickingEl.classList.add("hidden");
		}
	});
};

// Starting conditions
const init = function () {
	overlay.classList.add("hidden");
	winMessageWindown.classList.add("hidden");

	document.getElementById("input--0").value = username0;
	document.getElementById("input--1").value = username1;

	diceEl.classList.add("hidden");

	scores = [0, 0];
	currentScore = 0;
	activePlayer = 0;
	playing = true;

	current0El.textContent = "0";
	current1El.textContent = "0";

	score0El.textContent = 0;
	score1El.textContent = 0;

	player0El.classList.remove("player--winner");
	player1El.classList.remove("player--winner");
	player0El.classList.add("player--active");
	player1El.classList.remove("player--active");

	btnRoll.style.pointerEvents = "initial";
	btnRoll.style.opacity = "initial";
	btnHold.style.pointerEvents = "initial";
	btnHold.style.opacity = "initial";
};

const rollDice = function () {
	if (playing) {
		// 1. Generating a random dice roll
		const dice = Math.trunc(Math.random() * 6) + 1;

		// 2. Display the dice
		diceEl.classList.remove("hidden");
		diceEl.src = `dice-${dice}.png`;

		// 3. Check for rolled 1, if true: switch to next player
		if (dice !== 1) {
			// Add dice to current score
			currentScore += dice;
			document.getElementById(`current--${activePlayer}`).textContent =
				currentScore;
		} else {
			// Switch to next player
			switchPlayer();
		}
	}
};

const hold = function () {
	if (playing && currentScore) {
		// 1. Add current score to active player score
		scores[activePlayer] += currentScore;

		document.getElementById(`score--${activePlayer}`).textContent =
			scores[activePlayer];

		// 2. Check if player's score is >= 100
		if (scores[activePlayer] >= goal) {
			// Finish the game
			playing = false;
			current0El.textContent = "0";
			current1El.textContent = "0";

			diceEl.classList.add("hidden");

			document
				.querySelector(`.player--${activePlayer}`)
				.classList.add("player--winner");
			document
				.querySelector(`.player--${activePlayer}`)
				.classList.remove("player--active");

			btnRoll.style.pointerEvents = "none";
			btnRoll.style.opacity = "0.5";
			btnHold.style.pointerEvents = "none";
			btnHold.style.opacity = "0.5";

			overlay.classList.remove("hidden");
			winMessageWindown.classList.remove("hidden");

			confetti();

			winGoalEl.textContent = goal;

			winWinnerEl.textContent =
				activePlayer === 0 ? username0 : username1;

			winLoserEl.textContent = activePlayer === 0 ? username1 : username0;

			if (activePlayer === 0)
				winDistanceEl.textContent = scores[0] - scores[1];
			else winDistanceEl.textContent = scores[1] - scores[0];

			winOs = scores[activePlayer] - goal;
			if (winOs === 0) {
				winOsEl.style.color = "red";
				winOsEl.textContent = "No";
			} else {
				winOsEl.style.color = "#b2b2b2";
				winOsEl.textContent = winOs;
			}

			btnWin.addEventListener("click", function () {
				overlay.classList.add("hidden");
				winMessageWindown.classList.add("hidden");
			});

			document.addEventListener("keydown", function (e) {
				if (
					e.key === "Escape" &&
					!winMessageWindown.classList.contains("hidden")
				) {
					overlay.classList.add("hidden");
					winMessageWindown.classList.add("hidden");
				}
			});
		} else {
			// Switch to the next player
			switchPlayer();
		}
	} else {
		alert("Cant hold nothing!!!");
	}
};

usernamePicking();
init();

const switchPlayer = function () {
	document.getElementById(`current--${activePlayer}`).textContent = 0;

	activePlayer = activePlayer === 0 ? 1 : 0;
	currentScore = 0;

	player0El.classList.toggle("player--active");
	player1El.classList.toggle("player--active");
};

// Rolling dice functionality
btnRoll.addEventListener("click", rollDice);
document.addEventListener("keydown", function (e) {
	if (e.key === "f" && e.key === "F") {
		rollDice();
	}
});

btnHold.addEventListener("click", hold);
document.addEventListener("keydown", function (e) {
	if (e.key === "h" && e.key === "H") {
		hold();
	}
});

btnNew.addEventListener("click", init);
btnHelp.addEventListener("click", function () {
	helpPopup.classList.remove("hidden");
	helpGoal.textContent = goal;
});

popupBtn.addEventListener("click", function () {
	helpPopup.classList.add("hidden");
});
document.addEventListener("keydown", function (e) {
	if (e.key === "Escape" && !helpPopup.classList.contains("hidden")) {
		helpPopup.classList.add("hidden");
	}
});
