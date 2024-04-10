export function shuffleArray(data: any[]): any[] {
    for (var i = data.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = data[j];
        data[j] = data[i];
        data[i] = temp;
    }
    return data;
}