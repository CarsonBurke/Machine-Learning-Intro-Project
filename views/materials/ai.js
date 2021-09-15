function runAI(opts) {

    let gridPartSize = 20

    let objects = opts.objects

    function setPosition( object, iteration) {

        let id = object.type + (object.x * 50 + object.y)

        console.log(id)

        let el = document.getElementsByClassName(object.type)[iteration]

        if (el == null) return

        el.style.position = "absolute"

        el.style.top = gridPartSize * object.y + "px"
        el.style.left = gridPartSize * object.x + "px"
    }

    async function reachedGoal() {

        let goalReachedParent = document.getElementsByClassName("goalReachedParent")[0]

        console.log("1")

        goalReachedParent.classList.add("goalReachedParentShow")

        function wait() {
            return new Promise(resolve => {

                setTimeout(() => {
                    resolve()
                }, 2000)
                console.log('hi')
            })
        }

        await wait()

        console.log("2")

        goalReachedParent.classList.remove("goalReachedParentShow")
    }

    function movePlayer(player, direction, iteration) {

        if (!player) return "No player"

        if (direction == "up") {

            if (player.y <= 0) return

            player.y -= 1
        }
        if (direction == "left") {

            if (player.x <= 0) return

            player.x -= 1
        }
        if (direction == "down") {

            if (player.y >= 49) return

            player.y += 1
        }
        if (direction == "right") {

            if (player.x >= 49) return

            player.x += 1
        }

        setPosition(player, iteration)

        let goal = objects.goal

        if (player.x == goal.x && player.y == goal.y) {

            reachedGoal()
        }
    }

    function randomDirection() {

        let directions = ["up", "left", "down", "right"]

        let value = Math.floor(Math.random() * 4) + 1

        return directions[value - 1]
    }

    let goal = opts.goalPos
    let points = 0
    let options = {
        movePlayer: movePlayer,
    }

    let tick = 0

    setInterval(runTick, opts.tickSpeed)

    function runTick() {

        tick++
        console.log("Tick: " + tick)

        let iteration = 0

        for (let player of objects.player) {

            let direction = randomDirection()

            options.movePlayer(player, direction, iteration)

            iteration++
        }
    }
}

export { runAI }