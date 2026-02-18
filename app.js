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
    let coeffs = polynomialFit(data, degree);
    
    // Calculate R²
    let r2 = calculateR2(data, coeffs);
    
    // Format equation
    let equation = formatEquation(coeffs, degree);
    
    // Display result
    let output = '<h3>Result:</h3>';
    output += '<p>' + equation + '</p>';
    output += '<p>R² = ' + r2.toFixed(4) + '</p>';
    
    document.getElementById('result').innerHTML = output;
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