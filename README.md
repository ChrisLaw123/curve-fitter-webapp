**Polynomial Curve Fitter Web App**

A browser-based application that performs polynomial curve fitting using a manual implementation of least squares regression.

Users can enter (x, y) data points, choose a polynomial degree, and instantly compute the best-fit equation along with its R² value.

Try it out here: (setup link soon)

**Features**

Input data as (x, y) pairs

Polynomial degrees 1–5 (capped to prevent overfitting)

Least squares implementation to find curve of best fit

Matrix construction and equation solving in JavaScript

Displays fitted equation

Computes R² (goodness of fit)

Runs directly in the browser

**Technologies Used**

HTML5

CSS3

JavaScript (ES6)

**How to Use**

Open the live demo link: (setup link soon)

Enter data points in the format:

x 
1, 2
2, 5
3, 10


Select a polynomial degree.

Click Fit Curve.

View the equation, curve with plot points, and R² instantly.

**How It Works**

For a polynomial of degree k:

y = a₀ + a₁x + a₂x² + ... + aₖxᵏ

Given input data, the app:

Constructs the Vandermonde matrix X

Forms the normal equations:

(XᵀX)a = Xᵀy

Solves for the coefficient vector a using matrix operations

Computes predicted values and evaluates:

R² = 1 − (SS_res / SS_tot)

This minimizes the sum of squared residuals:

Σ (yᵢ − ŷᵢ)²

**Example**

Input

1, 1
2, 4
3, 9
4, 16


Output (Degree 2)

y = x²
R² = 1.0000
