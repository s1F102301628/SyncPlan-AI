let total = 0;

for (let N = 1; N <= 7777; N++) {
    const syou = Math.floor(77777/N);
    const amari = 77777 % N;
    total = syou + amari;
}

console.log(total);
