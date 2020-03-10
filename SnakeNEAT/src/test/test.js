var arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

for (let i = 0; i < arr.length; i++) {
  for (let j = 0; j < arr[i].length; j++) {
    document.writeln(arr[i][j] + "</br>");
  }
}

for (let i = 0; i < 5; i++) {
  document.writeln(Math.floor(Math.random() * (10 - (4 + 1))) + (4 + 1));
}

document.writeln("</br></br>");

function test(hello = Math.random(-1, 1)) {
  document.writeln("&nbsp&nbsp&nbsp&nbsp" + hello + "</br>");
}

test(3);
test(4);
test();
test();
test();

class tester {
  constructor(num1, num2) {
    this.num1 = num1;
    this.num2 = num2;
  }

  add() {
    return this.num1 + this.num2;
  }
}

var temp = 0;
for (;;) {
  document.writeln("a");
  temp++;
  if (temp === 30) break;
}

for (var hello = 0; hello < 10; hello++) {}
document.writeln(hello);

document.writeln((1 / 250) * 1000);

document.writeln("</br>");

let hello2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let hello2Copy = [...hello2];

hello2.splice(hello2.length / 2, hello2.length);
hello2Copy.splice(7, hello2Copy.length);
document.writeln("</br>");

document.writeln(hello2);
document.writeln("</br>");
document.writeln(hello2Copy);
document.writeln("</br>");

document.writeln(hello2[hello2.length]);
document.writeln("</br>");

for (let i = 0; i < 50; i++) {
  for (let j = 0; j < 2; j++) {
    document.writeln(j);
    break;
  }
  document.writeln(i);
}

document.writeln(Math.abs(5 - 11));
document.writeln("</br>");

for (let i = 0, j = 8; i < j; i++) {
  document.writeln(i);
  document.writeln(j);
  document.writeln("</br>");
}

function quickSort(x) {
  let less = [];
  let pivotList = [];
  let more = [];

  if (x.length <= 1) return x;

  let pivot = x[0];
  for (let i of x) {
    if (i > pivot) {
      less.push(i);
    } else if (i < pivot) {
      more.push(i);
    } else {
      pivotList.push(i);
    }
  }
  less = this.quickSort(less);
  more = this.quickSort(more);
  return less.concat(pivotList.concat(more));
}

let sort = Array.from({ length: 40 }, () => Math.floor(Math.random() * 40));
document.writeln(quickSort(sort));
