class Edge {
    constructor(weight, prevNode, nextNode, innovation) {
        this.weight = weight //weight associated with the edge to determine strength of connection between nodes
        this.prevNode = prevNode //previous node that the edge is connected to
        this.nextNode = nextNode //next node that the edge is connected to
        this.innovation = innovation //innovation number of the edge
        this.enabled = true
    }

    //alters the value for the edge slightly or occasionally majorly
    mutate(bias) {
        if (this.prevNode.number !== bias) {
            if (Math.floor(Math.random * 100) + 1 <= 10) {
                this.weight = Math.random() * 2 - 1
            } else {
                this.weight += Math.random() * 2 - 1

                if (this.weight > 1) this.weight = 1;
                if (this.weight < -1) this.weight = -1;
            }
            if (Math.floor(Math.random * 100) + 1 === 1) {
                this.enabled = false
            }
        }
    }

    //returns a copy of the current edge
    clone(prevNode, nextNode) {
        var newEdge = new Edge(this.weight, prevNode, nextNode, this.innovation)
        newEdge.enabled = this.enabled
        return newEdge 
    }

    //prints the information in this edge
    print() {
        document.writeln("&nbsp&nbsp&nbsp&nbsp&nbsp")
        document.writeln("From: " + this.prevNode.number + "</br>")
        document.writeln("&nbsp&nbsp&nbsp&nbsp&nbsp")
        document.writeln("To: " + this.nextNode.number + "</br>")
        document.writeln("&nbsp&nbsp&nbsp&nbsp&nbsp")
        document.writeln("Weight: " + this.weight + "</br>")
        document.writeln("&nbsp&nbsp&nbsp&nbsp&nbsp")
        document.writeln("Innovation number: " + this.innovation + "</br>")
        document.writeln("&nbsp&nbsp&nbsp&nbsp&nbsp")
        document.writeln("Enabled: " + this.enabled + "</br></br>")
    }

    //prints the information in this edge
    printConsole() {
        console.log("\t\tFrom: " + this.prevNode.number + "\n")
        console.log("\t\tTo: " + this.nextNode.number + "\n")
        console.log("\t\tWeight: " + this.weight + "\n")
        console.log("\t\tInnovation number: " + this.innovation + "\n")
        console.log("\t\tEnabled: " + this.enabled + "\n\n")
    }
}