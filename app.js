let coeffs;
let myGraph;
function fit() {
    // Get input
    let text = document.getElementById('points').value;
    let degree = parseInt(document.getElementById('degree').value);
    
    // Parse data
    let lines = text.split('\n');
    let data = [];
    
    for (let line of lines) {
        let parts = line.split(',');
        let x = parseFloat(parts[0]);
        let y = parseFloat(parts[1]);
        if (!isNaN(x) && !isNaN(y)) {
            data.push([x, y]);
        }
    }
    
    if (data.length < degree + 1) {
        alert('Need at least ' + (degree + 1) + ' points for degree ' + degree);
        return;
    }
    
    // Fit polynomial
    coeffs = polynomialFit(data, degree);
    
    // Calculate R²
    let r2 = calculateR2(data, coeffs);
    
    // Format equation
    let equation = formatEquation(coeffs, degree);
    
    // Display result
    let output = '<h3>Result:</h3>';
    output += '<p>' + equation + '</p>';
    output += '<p>R² = ' + r2.toFixed(4) + '</p>';
    
    document.getElementById('result').innerHTML = output;
    drawGraph(data,coeffs);
}

// Build Vandermonde matrix
function buildVandermonde(data, degree) {
    let n = data.length;
    let X = [];

    for(let i = 0; i < n; i++){
        let row = [];
        for(let j = 0; j < degree + 1; j++){
            row.push(Math.pow(data[i][0], j));
        }
        X.push(row);
    }

    return X;
}

// Matrix transpose
function transpose(matrix) {
    let rows = matrix.length;
    let columns = matrix[0].length;
    let result = [];

    for(let i = 0; i < columns; i++){
        let row = [];
        for(let j = 0; j < rows; j++){
            row.push(matrix[j][i]);
        }
        result.push(row);
    }

    return result;
}

// Matrix multiplication
function matrixMultiply(A, B) {
    let rowsA = A.length;
    let colsA = A[0].length;
    let colsB = B[0].length;
    let result = [];

    for(let i = 0; i < rowsA; i++){
        let row = [];
        for(let j = 0; j < colsB; j++){
            let sum = 0;
            for(let k = 0; k < colsA; k++){
                sum += A[i][k] * B[k][j];
            }
            row.push(sum);
        }
        result.push(row);
    }

    return result;
}

// Solve system using Gaussian elimination
function gaussianElimination(A, b) {
    let n = A.length;
    let augmented = [];

    for(let i = 0; i < n; i++){
        augmented[i] = A[i].slice();
        augmented[i].push(b[i][0]);
    }

    for(let col = 0;  col < n; col++){
        let maxRow = col;
        for(let row = col + 1; row < n; row++){
            if(Math.abs(augmented[row][col]) > Math.abs(augmented[maxRow][col])){
                maxRow = row;
            }
        }

        let temp = augmented[col];
        augmented[col] = augmented[maxRow];
        augmented[maxRow] = temp;

        for(let row = col + 1; row < n; row++){
            let  factor = augmented[row][col] / augmented[col][col];
            for(let j = col; j <= n; j++ ){
                augmented[row][j] -= factor * augmented[col][j];   
            }
        }
    }

    let x = new Array(n);
    for(let i = n -1; i >= 0; i--){
        x[i] = augmented[i][n];
        for(let j = i + 1; j < n; j++){
            x[i] -= augmented[i][j] * x[j];
        }
        x[i] /= augmented[i][i];
    }

    return x;
}

// Main polynomial fit function
function polynomialFit(data, degree) {
    // Build Vandermonde matrix
    let X = buildVandermonde(data, degree);
    
    // Extract y values
    let y = data.map(point => [point[1]]);
    
    // Compute X^T
    let XT = transpose(X);
    
    // Compute X^T * X
    let XTX = matrixMultiply(XT, X);
    
    // Compute X^T * y
    let XTy = matrixMultiply(XT, y);
    
    // Solve (X^T X) * coeffs = X^T y
    let coeffs = gaussianElimination(XTX, XTy);
    
    return coeffs;
}

// Evaluate polynomial at x using Horner's method
function evaluatePolynomial(coeffs, x) {
    let result = coeffs[coeffs.length -1];
    for(let i = coeffs.length - 2; i >= 0; i--){
        result = result * x + coeffs[i];
    }

    return result;
}

// Calculate R²
function calculateR2(data, coeffs) {
    let n = data.length;
    let meanY = 0;

    for(let i = 0; i < n; i++){
        meanY += data[i][1];
    }

    meanY /= n;

    let ssTot = 0;
    let ssRes = 0;

    for(let i = 0; i < n; i++){
        let actualY = data[i][1];
        let predictedY = evaluatePolynomial(coeffs,data[i][0]);
        ssTot += Math.pow(actualY - meanY, 2);
        ssRes += Math.pow(actualY - predictedY, 2);
    }

    return 1 - (ssRes / ssTot);
}

// Format equation
function formatEquation(coeffs, degree) {
    let equation = 'y = ';
    let first = true;

    for(let i = degree; i >= 0; i--){
        let coef = coeffs[i];
        if(coef > 0){
            if(!first){
                equation += ' + ';
            }
            first = false;
            if(coef !== 1){
                equation += coef.toFixed(3);
            }else if((coef == 1) && (i == 0)){
                equation += '1';
            }
        }else if (coef < 0){
            first = false;
            equation += ' - ';
            if(coef !== -1){
                equation += Math.abs(coef).toFixed(3);
            }
        }

        if((coef !== 0) && (i >= 2)) {
            equation += 'x^' + i;
        }else if ((coef !== 0) && (i == 1)){
            equation += 'x';
        }
    }

    return equation;
}

function drawGraph(data, coeffs){
    let xVals = data.map(point =>point[0]);
    let xMin = Math.min(...xVals);
    let xMax = Math.max(...xVals);

    let curvePoints = [];

    //100 points to draw function
    for(let i = 0; i < 100; i++){
        let x = (xMax-xMin)/99 * i + xMin;
        let y = evaluatePolynomial(coeffs, x);

        curvePoints.push({x: x,y: y});
    }

    let scatterPoints = data.map(point => ({x:point[0], y: point[1]}));

    //clear existing graph
    if(myGraph){
        myGraph.destroy();
    }

    let canvas = document.getElementById("graph");
    let ctx = canvas.getContext('2d');
    myGraph = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Fitted Curve', 
                    data: curvePoints, 
                    showLine: true,
                    pointRadius: 0,
                    borderColor: 'blue'
                },
                {
                    label: 'Data Points',
                    data: scatterPoints,
                    pointRadius: 5,
                    borderColor: 'red',
                    backgroundColor: 'red'
                }
            ]
        }
    });
}

function approximate(){
    let x = parseFloat(document.getElementById("xInput").value);

    if(!coeffs || isNaN(x)){
        document.getElementById("approxResult").innerHTML = "Fit a curve first or enter a valid number"
        return;
    }
    let result = evaluatePolynomial(coeffs, x);
    document.getElementById("approxResult").innerHTML = 'y = ' + result.toFixed(4);
}