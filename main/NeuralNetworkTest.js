try {
    var inputs = 4
    var innovationHistory = new InnovationHistory()
    var network = new Network(inputs, 4, innovationHistory)
    var network2 = new Network(inputs, 4, innovationHistory)
    var values = []
    var f = 0

    var child

    for (let i = 0; i < inputs; i++) {
        values.push(Math.random())
    }

    for (let i = 0; i < 1000; i++) {
        network.mutate(innovationHistory)
        network2.mutate(innovationHistory)

        network = network.crossover(network2)
    }

    network.printNodes()
    network2.printNodes()

    /*
    for (let i = 0; i < 10; i++) {
        document.writeln(network.feedForward(values) + "</br></br>")
    }
*/

} catch (e) {
    document.writeln("Error: " + e.name + "</br>")
    document.writeln("Error: " + e.message + "</br>")
    document.writeln("Error: " + e.stack + "</br>")

    network.printNodes()
    network2.printNodes()

    network.print()
    for (let i = 0; i < network.edges.length; i++) {
        if (network.edges[i].prevNode.number === undefined) {
            network.edges[i].print()
        }
    }
}