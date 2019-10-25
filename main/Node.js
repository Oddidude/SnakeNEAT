class Node {
    constructor(number) {
        this.input = 0 //total of input signals from other nodes
        this.outputs = [] //array of connections to nodes in the next layer
        this.weight = 0 //output signal
        this.layer //layer in the neural network in which the node is located
        this.number = number //number associated with the node so that it can be uniquely identified
    }

    //sends a signal to the next node based on the inputs to the current node
    activate() {
        if (this.layer != 0) {
            this.weight += this.sigmoidFunction(this.input)
        }
        for (let i = 0; i < this.outputs.length; i++) {
            if (this.outputs[i].enabled) this.outputs[i].nextNode.input += this.weight * this.outputs[i].weight
        }
    }

    //converts the total input signal into a more scalable value for the network
    sigmoidFunction(weight) {
        return 1 / (1 + Math.pow(Math.E, -weight))
    }
    
    //alternative activation function that outputs 0 if the input is 0 or below
    tanhFunction(weight) {
        return Math.tanh(weight)
    }

    //checks whether this node has an existing connection to another node
    connectedTo(otherNode) {
        for (let i = 0; i < this.outputs.length; i++) {
            if (this.outputs.nextNode === otherNode) return true
        }
        return false
    }

    //returns a copy of the current node
    clone() {
        var newNode = new Node(this.number)
        newNode.layer = this.layer
        return newNode
    }

    //prints the information in the node
    print() {
        document.writeln("Node: " + this.number + "</br>")
        document.writeln("Layer: " + this.layer + "</br>")

        for (let edge = 0; edge < this.outputs.length; edge++) {
            this.outputs[edge].print()
        }

        document.writeln("</br>")
    }

    //prints information in the node to console
    printConsole() {
        console.log("Node: " + this.number + "\n")
        console.log("Layer: " + this.layer + "\n")

        for (let edge = 0; edge < this.outputs.length; edge++) {
            this.outputs[edge].printConsole()
        }

        console.log("\n")
    }
}