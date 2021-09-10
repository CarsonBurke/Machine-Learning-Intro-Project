function runAI(aiOpts) {

    let goal = aiOpts.goalPos
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

        let directions = ["top", "left", "bottom", "right"]

        let value = Math.floor(Math.random() * 10) * 4

        return directions[value - 1]
    }

    setInterval(runTick, 1000)

    function runTick() {

        if (aiPos == goal) return "Reached goal"


    }
}

export { runAI }