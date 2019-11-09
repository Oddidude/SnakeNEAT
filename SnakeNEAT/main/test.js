var arr = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
        document.writeln(arr[i][j] + "</br>")
    }
}

for (let i = 0; i < 5; i++) {
    document.writeln(Math.floor(Math.random() * (10 - (4 + 1))) + (4 + 1))
}

document.writeln("</br></br>")

function test(hello = Math.random(-1, 1)) {
    document.writeln("&nbsp&nbsp&nbsp&nbsp" + hello + "</br>")
}

test(3)
test(4)
test()
test()
test()


class tester {
    constructor(num1, num2) {
        this.num1 = num1
        this.num2 = num2
    }

    add() {
        return this.num1 + this.num2
    }
}

var temp = 0
for (;;) {
    document.writeln("a")
    temp++
    if (temp === 30) break
}

for (var hello = 0; hello < 10; hello++) { }
document.writeln(hello)

document.writeln((1 / 250) * 1000)


document.writeln("</br>")

let hello2 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let hello2Copy = [...hello2]

hello2.splice(hello2.length / 2, hello2.length)
hello2Copy.splice(7, hello2Copy.length)

document.writeln(hello2)
document.writeln(hello2Copy)

for (let i = 0; i < 50; i++) {
    for (let j = 0; j < 2; j++) {
        document.writeln(j)
        break 
    }
    document.writeln(i)
}

document.writeln(Math.abs(5 - 11))