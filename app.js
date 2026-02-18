function fit() {
    // Get the data from textarea
    let text = document.getElementById('points').value;
    let degree = document.getElementById('degree').value;
    
    // Parse it into [[x,y], [x,y], ...]
    let lines = text.split('\n');
    let data = [];
    
    for (let line of lines) {
        let parts = line.split(',');
        let x = parseFloat(parts[0]);
        let y = parseFloat(parts[1]);
        data.push([x, y]);
    }
    
    // Use the library to fit
    let result = regression.polynomial(data, { order: parseInt(degree) });
    
    // Show the result
    let output = '<h3>Result:</h3>';
    output += '<p>' + result.string + '</p>';
    output += '<p>R² = ' + result.r2.toFixed(4) + '</p>';
    
    document.getElementById('result').innerHTML = output;
}