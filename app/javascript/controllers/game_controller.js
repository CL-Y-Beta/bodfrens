import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="game"
export default class extends Controller {
  static targets = ["button", "bar", "timer", "xp", "barExp", "barFinalExp", "bonusButton"];

  static values = {
    secondsUntilEnd: Number,
    end: Number,
    room: Number,
    user: Number,
    dataId: Number,
    secondsLeft: Number,
    xp: Number,
    timeTaken: Number,
    bonus: Boolean,
    circuit: Boolean
  }

  connect() {
    console.log(`this is the seconds left value=${this.secondsLeftValue}`)
    // set audio files
    this.startSound = new Audio("/audios/start.mp3")
    this.buttonSound = new Audio("/audios/clicksound.mp3")
    this.finishSound = new Audio("/audios/Finish.wav")

    this.startSound.play() // plays the start sound on connect

    this.XPvalue = this.xpValue; // XP Value tracks how much the XP user has gathered so far in a game room.

    if (this.circuitValue === true) {
      this.endValue = this.endValue * 3
      this.exerciseCounter = 0
      this.setCounter = 1
    };

    this.csrfToken = document.querySelector("meta[name='csrf-token']").content
    // bunch of logs to check if the data being sent is correct...
    // console.log(`this is the user_id connected to the room = ${this.userValue}`)
    // console.log(`this is the ID of the user_game_data = ${this.dataIdValue}`)
    // console.log(`this is the room ID = ${this.roomValue}`);
    // console.log(`this is the end value= ${this.endValue}`);
    // console.log("The game is now connected");
    // console.log(`This is the XP value of the room = ${this.xpValue}` )
    // console.log(`This is the time taken from the other room = ${this.timeTakenValue}` )
    // timer settings:
    ///// this.secondsUntilEnd = this.data.get("seconds-until-end-value");
    this.Modal = document.getElementById("bonusPromptModal");

    this.secondsUntilEnd = this.secondsLeftValue
    console.log(this.secondsUntilEnd); // to check the data value after each interval

    this.countdown = setInterval(this.countdown.bind(this), 1000) // sets the interval for countdown to reload every 1 second

    //set values for the bar calculations
    this.barEndNumber = this.endValue - this.XPvalue
    this.barWidth = 0

    //set the final EXP printed at the bottom via innerHTML
    this.barFinalExpTarget.innerHTML = `/${this.barEndNumber} XP EARNED`

    if (this.circuitValue == true) {
      this.firstSection = document.getElementById("exercise-section-1")
      this.firstSection.style = "display: flex"
    }
  }

  markComplete(e) {
    e.preventDefault()
    this.buttonSound.play()
    this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);
    // console.log(`the XP value is = ${this.XPvalue}`)

    //change the icon
    const h5Element = e.currentTarget.querySelector("h5")
    // Changing the colors of the buttons depending on their value (negative or positive)
    if (e.currentTarget.value > 0) {
      e.currentTarget.classList.remove("button");
      e.currentTarget.classList.add("button-regular-done");

      //Mark the XP as earned
      h5Element.innerHTML = "XP\ngained";
      if (this.circuitValue === true) {
        this.exerciseCounter += 1
      };
    } else {
      e.currentTarget.classList.remove("button-regular-done");
      e.currentTarget.classList.add("button");

      //Mark the XP as earned
      h5Element.textContent = `${e.currentTarget.value * -1}XP`;

      if (this.circuitValue === true) {
        this.exerciseCounter -= 1
      };
    }

    // Increasing the width of the bar
    this.barWidth += parseInt(e.currentTarget.value,10);
    this.barTarget.style.width = `${(this.barWidth / this.barEndNumber) * 100}%`

    // Update the exp value printed at the bottom
    this.barExpTarget.innerHTML = `${this.barWidth}`

    // Change the value of the button to negative
    e.currentTarget.value = e.currentTarget.value * -1

    // End Game with Finish
    if (this.XPvalue == this.endValue) {
      this.finishSound.play()
      this.updateUserGameDatumWithFinish();
      console.log("REGULAR GAME FINISH");
      this.showBonusModal();
    };

    //add to the exercise counter if the room is a circuit room
    this.trackSections()
  }

  trackSections() {
  // to track which section the room should display
    if (this.exerciseCounter == 5 && this.bonusValue == false) {
      this.firstSection.style = "display: none";
      this.secondSection = document.getElementById("exercise-section-2");
      this.secondSection.style = "display:flex";
      this.setCounter += 1;
      const counter = document.querySelector(".set-counter");
      counter.innerHTML = `Set ${this.setCounter}/3`;
    };

    if (this.exerciseCounter == 10 && this.bonusValue == false) {
      this.secondSection.style = "display: none";
      this.thirdSection = document.getElementById("exercise-section-3");
      this.thirdSection.style = "display: flex";
      this.setCounter += 1;
      const counter = document.querySelector(".set-counter");
      counter.innerHTML = `Set ${this.setCounter}/3`;
    };

    if (this.exerciseCounter == 3 && this.bonusValue == true) {
      this.firstSection.style = "display: none";
      this.secondSection = document.getElementById("exercise-section-2");
      this.secondSection.style = "display:flex";
      this.setCounter += 1;
      const counter = document.querySelector(".set-counter");
      counter.innerHTML = `Set ${this.setCounter}/3`;
    };

    if (this.exerciseCounter == 6 && this.bonusValue == true) {
      this.secondSection.style = "display: none";
      this.thirdSection = document.getElementById("exercise-section-3");
      this.thirdSection.style = "display:flex";
      this.setCounter += 1;
      const counter = document.querySelector(".set-counter");
      counter.innerHTML = `Set ${this.setCounter}/3`;
    };
  }



  countdown() {
    // ends the countdown when the round is over.
    if (this.XPvalue == this.endValue) {
      clearInterval(this.countdown);
      this.timerTarget.innerHTML = "Round End"
      return
    }

    if (this.secondsUntilEnd <= 0) {
      clearInterval(this.countdown); // guard clause - this should call the modal
      this.timerTarget.innerHTML = "Time's Up!";
      if (this.bonusValue == true) {
        this.updateUserGameDatumWithBonusTimesUp();
      } else {
        this.updateUserGameDatumWithTimesUp()
      }
      return
    }

    const minutesLeft = Math.floor(this.secondsUntilEnd / 60)
    const secondsLeft = Math.floor(this.secondsUntilEnd % 60).toString().padStart(2, '0')

    this.timerTarget.innerHTML = `${minutesLeft} : ${secondsLeft}`
    this.secondsUntilEnd = this.secondsUntilEnd - 1;


  }

  updateUserGameDatumWithTimesUp() {
    // Update the data to the ruby controller
      fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({game_xp: this.XPvalue, finish: false, time_taken: this.secondsLeftValue - this.secondsUntilEnd, user_game_datum_id: this.dataIdValue})
      })
      .then(response => {
        if (response.ok) {
          window.location.href = `/room/${this.roomValue}/game_complete`;
        } else {
          // Handle errors if needed
          console.error("Failed to update user game data.");
        }
      })
    }

  updateUserGameDatumWithBonusTimesUp() {
    // Update the data to the ruby controller
      fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({game_xp: this.XPvalue, finish: true, time_taken: this.secondsLeftValue - this.secondsUntilEnd + this.timeTakenValue, user_game_datum_id: this.dataIdValue})
      })
      .then(response => {
        if (response.ok) {
          window.location.href = `/room/${this.roomValue}/game_complete`;
        } else {
          // Handle errors if needed
          console.error("Failed to update user game data.");
        }
      })
    }



  updateUserGameDatumWithFinish() {
  // Update the data to the ruby controller
    fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": this.csrfToken
      },
      body: JSON.stringify({game_xp: this.XPvalue, finish: true, time_taken: this.secondsLeftValue - this.secondsUntilEnd, user_game_datum_id: this.dataIdValue})
    });
  }


  updateUserGameDatumWithQuit(e) {
    // Update the data to the ruby controller
      e.preventDefault()
      fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({game_xp: this.XPvalue - 100, finish: false, time_taken: this.secondsLeftValue - this.secondsUntilEnd, bonus_finish: false, user_game_datum_id: this.dataIdValue})
      })
      .then(response => {
        if (response.ok) {
          window.location.href = `/room/${this.roomValue}/game_complete`;
        } else {
          // Handle errors if needed
          console.error("Failed to update user game data.");
        }
      })

    }

  showBonusModal() {
    // Currently it shows buttons but it needs to show modals
    this.Modal.classList.remove("hidden-modal");
    this.Modal.classList.add("game-modal");

  }

  changeRoomToBonus() {
    // Update the data to the ruby controller
      fetch(`/room/${this.roomValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({bonus: true})
      })
      .then(response => {
        if (response.ok) {
          location.reload()
        } else {
          // Handle errors if needed
          console.error("Failed to update user game data.");
        }
      })
    }


  markBonusComplete(e) {
    e.preventDefault()
    this.buttonSound.play()
    this.XPvalue = this.XPvalue + parseInt(e.currentTarget.value,10);
    // console.log(`the XP value is = ${this.XPvalue}`)

    // Changing the colors of the buttons depending on their value (negative or positive)
    const h5Element = e.currentTarget.querySelector("h5")
    if (e.currentTarget.value > 0) {
      e.currentTarget.classList.remove("button");
      e.currentTarget.classList.add("button-bonus-done");
      //Mark the XP as earned
      h5Element.innerHTML = "XP\ngained"
      if (this.circuitValue === true) {
        this.exerciseCounter += 1
      };

    } else {
      e.currentTarget.classList.remove("button-bonus-done");
      e.currentTarget.classList.add("button")
      //Mark the XP as earned
      h5Element.textContent = `${e.currentTarget.value * -1}XP`
      if (this.circuitValue === true) {
        this.exerciseCounter -= 1
      };
    }

    // Increasing the width of the bar
    this.barWidth += parseInt(e.currentTarget.value,10);
    this.barTarget.style.width = `${(this.barWidth / this.barEndNumber) * 100}%`
    console.log(this.barWidth)

    // Change the value at the XP bottom
    this.barExpTarget.innerHTML = `${this.barWidth}`

    // Change the value of the button to negative
    e.currentTarget.value = e.currentTarget.value * -1

    // End Game with Finish
    if (this.XPvalue == this.endValue) {
      this.updateUserGameDatumWithBonusFinish();
      console.log("BONUS FINISH")
    }

    this.trackSections()

  }

  updateUserGameDatumWithBonusFinish() {
    // Update the data to the ruby controller
      fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({game_xp: this.XPvalue, finish: true, bonus_finish: true, time_taken: (this.secondsLeftValue - this.secondsUntilEnd) + this.timeTakenValue, user_game_datum_id: this.dataIdValue})
      })
      .then(response => {
        if (response.ok) {
          window.location.href = `/room/${this.roomValue}/game_complete`;
        } else {
          // Handle errors if needed
          console.error("Failed to update user game data.");
        }
      })
    };

  updateUserGameDatumWithBonusEnd(e) {
    // Update the data to the ruby controller

      e.preventDefault()
      fetch(`/room/${this.roomValue}/user_game_data/${this.dataIdValue}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": this.csrfToken
        },
        body: JSON.stringify({game_xp: this.XPvalue, finish: true, bonus_finish: false, time_taken: (this.secondsLeftValue - this.secondsUntilEnd) + this.timeTakenValue, user_game_datum_id: this.dataIdValue})
      })
      .then(response => {
        if (response.ok) {
          window.location.href = `/room/${this.roomValue}/game_complete`;
        } else {
          // Handle errors if needed
          console.error("Failed to update user game data.");
        }
      })
    };


  startBonus(e) {
    e.preventDefault()
    this.changeRoomToBonus();
  }

}
