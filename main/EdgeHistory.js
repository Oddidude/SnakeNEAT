class EdgeHistory {
    constructor(prevNodeNumber, nextNodeNumber, innovationNumber, innovations = []) {
        this.prevNodeNumber = prevNodeNumber
        this.nextNodeNumber = nextNodeNumber
        this.innovationNumber = innovationNumber
        this.innovations = innovations
    }

    checkInnovationHistory(network, prevNode, nextNode) {
        if (network.edges.length === this.innovations.length &&
            prevNode.number === this.prevNodeNumber &&
            nextNode.number === this.nextNodeNumber
        ) {
            for (let i = 0; i < network.edges.length; i++) {
                if (!this.innovations.includes(network.edges[i].innovation)) return false
            }
            return true
        }
        return false
    }
}