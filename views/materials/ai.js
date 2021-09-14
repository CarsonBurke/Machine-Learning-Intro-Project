function runAI(opts) {

    let goal = opts.goalPos
    let points = 0
    let options = {
        move: function(direction) {

            if (direction == "top") {


                return
            }
            if (direction == "left") {

                return
            }
            if (direction == "bottom") {

                return
            }
            if (direction == "right") {

                return
            }
        },
    }

    let aiPos = { x: 1, y: 2 }

    function randomDirection() {

        let directions = ["up", "left", "down", "right"]

        let value = Math.floor(Math.random() * 4) + 1

        return directions[value - 1]
    }

    let tick = 0

    //setInterval(runTick, opts.tickSpeed)

    function runTick() {

        tick++

        console.log("Tick: " + tick)

        let direction = randomDirection()

        console.log(direction)

        if (aiPos == goal) return "Reached goal"
    }
}

export { runAI }