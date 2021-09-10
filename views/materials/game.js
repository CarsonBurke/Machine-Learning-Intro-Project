let defaults = {
    mapDimensions: "1000px",
    gridPartSize: "20px",
}

let
    map = { el: document.getElementById("map"), },
    hotkeys = {
        panUp: "w",
        panDown: "s",
        panLeft: "a",
        panRight: "d",
        stopPlacing: "x",
    },
    structures = {

    }

// Create map and implement values

map.el.style.width = defaults.mapDimensions
map.el.style.height = defaults.mapDimensions

// Dimensions / number of tiles will give size, size should be 10px

let gridSize = defaults.mapDimensions / defaults.gridPartSize

console.log(gridSize)

function createGrid() {

    let gridSize = 100
}

// Music

notMusicPlaying = true

document.addEventListener("mousedown", playMusic)
document.addEventListener("keydown", playMusic)

function playMusic() {

    if (notMusicPlaying) {

        let music = new Audio("materials/sounds/song1.mp4")
        music.loop = true
        music.play()

        notMusicPlaying = false
    }
}

// Allows user to scroll to zoom

let scale = 1

map.el.onwheel = function zoom(event) {

    event.preventDefault();

    scale += event.deltaY * -0.0005;

    scale = Math.min(Math.max(0.75, scale), 2);

    map.el.style.transform = "scale(" + scale + ")"
}

// Define events for when user presses a key

let upPos = 0
let leftPos = 0

window.onkeydown = function(e) {

    if (e.key == hotkeys.panUp) {

        startMove("up")
    } else if (e.key == hotkeys.panDown) {

        startMove("down")
    }
    if (e.key == hotkeys.panLeft) {

        startMove("left")
    } else if (e.key == hotkeys.panRight) {

        startMove("right")
    }
    if (e.key == hotkeys.stopPlacing) {

        stopPlacing()
    }
}

window.onkeyup = function(e) {

    if (e.key == hotkeys.panUp) {

        endMove("up")
    } else if (e.key == hotkeys.panDown) {

        endMove("down")
    } else if (e.key == hotkeys.panLeft) {

        endMove("left")
    } else if (e.key == hotkeys.panRight) {

        endMove("right")
    }
}

var move = false

function startMove(direction) {

    if (direction == "up") {

        move = {
            direction: "up",
            qualifier: "positive"
        }

    } else if (direction == "down") {

        move = {
            direction: "up",
            qualifier: "negative"
        }

    }
    if (direction == "left") {

        move = {
            direction: "left",
            qualifier: "positive"
        }

    } else if (direction == "right") {

        move = {
            direction: "left",
            qualifier: "negative"
        }
    }
}

function endMove() {

    move = false
}

setInterval(changeDirection, 100)

function changeDirection() {

    if (move && move.direction) {
        if (move.direction == "up") {

            if (move.qualifier == "positive") {

                upPos += 150

            } else {

                upPos -= 150
            }
        } else {

            if (move.qualifier == "positive") {

                leftPos += 150

            } else {

                leftPos -= 150
            }
        }

        map.el.style.top = upPos + "px"
        map.el.style.left = leftPos + "px"
    }
}