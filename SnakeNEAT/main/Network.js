class Network {
        constructor(inputs = -1, outputs, innovationHistory) {
        if (inputs > 0) {
            //2d array used to store the nodes in their respective layers
            this.nodes = [
                [],
                []
            ]

            //array of all connections between nodes
            this.edges = []

            //number used to uniquely identify nodes
            this.nodeNumber = 0

            //add a node to the first layer for each type of input
            for (let i = 0; i < inputs; i++) {
                this.nodes[0].push(new Node(this.nodeNumber))
                this.nodes[0][i].layer = 0
                this.nodeNumber++
            }

            //add a node to the last layer for each type of output
            for (let i = 0; i < outputs; i++) {
                this.nodes[1].push(new Node(this.nodeNumber))
                this.nodes[1][i].layer = 1
                this.nodeNumber++
            }
            
            //creation of the bias node
            this.biasNode = new Node(this.nodeNumber)
            this.biasNode.layer = 0
            this.nodes[0].push(this.biasNode)
            this.nodeNumber++

            //create a single starter connection
            this.randomEdge(innovationHistory)
        } else {
            //creates an empty network
            this.nodes = []
            this.edges = []
            this.nodeNumber
            this.biasNode
        }
    }

    //add a new node to the network between two currenlty connected nodes as a mutation
    addNode(innovationHistory) {
        let interceptedEdge
        do {
            //gets a random existing edge so that a node can be placed in the middle of it
            interceptedEdge = this.edges[Math.floor(Math.random() * this.edges.length)]
        } while (interceptedEdge.prevNode === this.biasNode)

        let oldPrevNode = this.findNode(interceptedEdge.prevNode.number)
        let oldNextNode = this.findNode(interceptedEdge.nextNode.number)

        var newNode = new Node(this.nodeNumber)
        this.nodeNumber++

        if (oldPrevNode.layer + 1 === oldNextNode.layer) {
            this.nodes.splice(oldNextNode.layer, 0, [])

            for (let newLayer = oldNextNode.layer + 1; newLayer < this.nodes.length; newLayer++) {
                for (let node = 0; node < this.nodes[newLayer].length; node++) {
                    this.nodes[newLayer][node].layer++
                }
            }
        }

        this.addEdge(innovationHistory, oldPrevNode, newNode, 1)

        this.addEdge(innovationHistory, newNode, oldNextNode, interceptedEdge.weight)

        //selects a random layer in which to place the new node that is between and not equal to the layers of the previous and next nodes
        newNode.layer = Math.floor(Math.random() * (
            oldNextNode.layer - (oldPrevNode.layer + 1)
            )) + (oldPrevNode.layer + 1) 

        this.nodes[newNode.layer].push(newNode)

        //disables the old edge
        interceptedEdge.enabled = false

        this.addEdge(innovationHistory, this.biasNode, newNode, 1)
    }

    //add a connection between two existing nodes
    addEdge(innovationHistory, prevNode, nextNode, weight = Math.random() * 2 - 1) {
        if (!this.isFullyConnected()) {
            let newEdge
            let innovationNumber = this.getInnovationNumber(innovationHistory, prevNode, nextNode)

            newEdge = new Edge(weight, prevNode, nextNode, innovationNumber)
            this.edges.push(newEdge)
            prevNode.outputs.push(newEdge)
        }
    }

    //add random connection
    randomEdge(innovationHistory) {
        if (!this.isFullyConnected()) {
            let random1 = this.findNode(Math.floor(Math.random() * this.nodeNumber))
            let random2
            do {
                random2 = this.findNode(Math.floor(Math.random() * this.nodeNumber))
            } while(random1.layer === random2.layer || random1.connectedTo(random2) || random2.connectedTo(random1))
            if (random1.layer < random2.layer) {
                this.addEdge(innovationHistory, random1, random2)
            } else {
                this.addEdge(innovationHistory, random2, random1)
            }
        }
    }

    //checks if a connection has previously existed otherwise adds the new conenction to the innovation history
    getInnovationNumber(innovationHistory, prevNode, nextNode) {
        let innovationNumber

        for (let i = 0; i < innovationHistory.history.length; i++) {
            if (innovationHistory.history[i].checkInnovationHistory(this, prevNode, nextNode)) {
                return innovationHistory.history[i].innovationNumber
            }
        }

        let innovations = []
        innovationNumber = innovationHistory.newInnovation()

        for (let i = 0; i < this.edges.length; i++) {
            innovations.push(this.edges[i].innovation)
        }
        innovationHistory.history.push(new EdgeHistory(prevNode.number, nextNode.number, innovationNumber, innovations))
        return innovationNumber
    }

    //checks whether or not the network is fully connected
    isFullyConnected() {
        let max = 0
        for (let current = 0; current < this.nodes.length; current++) {
            for (let ahead = current + 1; ahead < this.nodes.length; ahead++) {
                max += this.nodes[current].length * this.nodes[ahead].length
            }
        }
        return max === this.edges.length
    }

    //mutates the network
    mutate(innovationHistory) {
        //75% chance to change the weights on edges
        if (Math.random() <= 0.80) {
            for (let edge = 0; edge < this.edges.length; edge++) this.edges[edge].mutate(this.biasNode.number)
        }

        //5% chance of adding a new edge
        if (Math.random() <= 0.05) {
            this.randomEdge(innovationHistory)
        }

        //1% chance of adding a new node
        if (Math.random() <= 0.01) {
            this.addNode(innovationHistory)
        }
    }

    //sets all node inputs to 0 for a fresh run
    resetNodes() {
        for (let layer = 0; layer < this.nodes.length; layer++) {
            for (let node = 0; node < this.nodes[layer].length; node++) {
                this.nodes[layer][node].input = 0
                this.nodes[layer][node].weight = 0
            }
        }
        this.biasNode.weight = 1
    }

    //sends the input signals through the network
    feedForward(inputVals) {
        this.resetNodes()

        for (let i = 0; i < inputVals.length; i++) this.nodes[0][i].weight += inputVals[i]
        
        for (let layer = 0; layer < this.nodes.length; layer++) {
            for (let node = 0; node < this.nodes[layer].length; node++) {
                this.nodes[layer][node].activate()
            }
        }

        var outputLayer = this.nodes[this.nodes.length - 1]
        var outputVals = []

        for (let node = 0; node < outputLayer.length; node++) outputVals.push(outputLayer[node].input)

        return outputVals
    }

    //sees whether a edge is in both parent networks
    matchingEdge(otherNetwork, innovation) {
        for (let i = 0; i < otherNetwork.edges.length; i++) {
            if (otherNetwork.edges[i].innovation === innovation) return i
        }
        return -1
    }
    //combines two networks
    crossover(otherNetwork) {
        let child = new Network()
        child.nodeNumber = this.nodeNumber

        let inherited = []
        let enabled = []

        for (let i = 0; i < this.edges.length; i++) {
            let innovationNumber = this.matchingEdge(otherNetwork, this.edges[i].innovation)

            if (innovationNumber !== -1) {
                if (Math.random() < 0.5) {
                    inherited.push(this.edges[i])
                    enabled.push(this.edges[i].enabled)
                } else {
                    inherited.push(otherNetwork.edges[innovationNumber])
                    enabled.push(otherNetwork.edges[innovationNumber].enabled)
                }

                if (!this.edges[i].enabled || !otherNetwork.edges[innovationNumber].enabled) {
                    enabled[i] = Math.random() < 0.75
                }
            } else {
                inherited.push(this.edges[i])
                enabled.push(this.edges[i].enabled)
            }
        }

        for (let layer = 0; layer < this.nodes.length; layer++) {
            child.nodes.push([])

            for (let node = 0; node < this.nodes[layer].length; node++) {
                child.nodes[layer].push(this.nodes[layer][node].clone())
            }
        }

        for (let i = 0; i < inherited.length; i++) {
            child.edges.push(inherited[i].clone(child.findNode(inherited[i].prevNode.number), child.findNode(inherited[i].nextNode.number)))
            child.edges[i].enabled = enabled[i]

            child.edges[i].prevNode.outputs.push(child.edges[i])
        }

        child.biasNode = child.findNode(this.biasNode.number)

        return child
    }

    //returns a copy of the network
    clone() { 
        var newNetwork = new Network()

        newNetwork.nodeNumber = this.nodeNumber

        for (let layer = 0; layer < this.nodes.length; layer++) {
            newNetwork.nodes.push([])

            for (let node = 0; node < this.nodes[layer].length; node++) {
                newNetwork.nodes[layer].push(this.nodes[layer][node].clone())
            }
        }

        for (let i = 0; i < this.edges.length; i++) {
            let edge = this.edges[i]
            newNetwork.edges.push(edge.clone(newNetwork.findNode(edge.prevNode.number), newNetwork.findNode(edge.nextNode.number)))
            newNetwork.edges[i].prevNode.outputs.push(newNetwork.edges[i])
        }

        newNetwork.biasNode = newNetwork.findNode(this.biasNode.number)
        
        return newNetwork
    }

    //finds a specific node in the nodes array using its node number
    findNode(number) {
        for (let layer = 0; layer < this.nodes.length; layer++) {
            for (let node = 0; node < this.nodes[layer].length; node++) {
                if (this.nodes[layer][node].number === number) return this.nodes[layer][node]
            }
        }
        return false
    }

    //prints the entire network
    print() {
        for (let layer = 0; layer < this.nodes.length; layer++) {
            for (let node = 0; node < this.nodes[layer].length; node++) this.nodes[layer][node].print()
        }
    }

    //prints the entire network in console
    printConsole() {
        for (let layer = 0; layer < this.nodes.length; layer++) {
            for (let node = 0; node < this.nodes[layer].length; node++) this.nodes[layer][node].printConsole()
        }
    }

    //prints the nodes in a pretty way
    printNodes() {
        for (let layer = 0; layer < this.nodes.length; layer++) {
            for (let node = 0; node < this.nodes[layer].length; node++) {
                document.writeln(this.nodes[layer][node].number + " | ")
            }
            document.writeln("</br>")
        }
        document.writeln("----------------------------------------------------------------</br>")
    }
}