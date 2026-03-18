# Polynomial Curve Fitter

A browser-based tool for fitting polynomials to data using least squares regression

[**Link**](https://chrislaw123.github.io/curve-fitter-webapp/)

---

## Features

- Fit polynomials of degree 1–5 to any set of (x, y) data points
- Displays the fitted equation and R² value
- Plots the curve and raw data points side by side
- Approximate y for any x value using the fitted function
- Upload data from a `.csv` or `.txt` file

## How to Use

1. Enter data points in the format `x, y` (one per line) or upload a file
2. Select a polynomial degree
3. Click **Fit Curve**
4. Optionally enter an x value and click **Go** to approximate y

## Data Format

```
1, 4
2, 9
3, 16
4, 25
```

## How It Works

Given n data points, the app builds a Vandermonde matrix X and solves the normal equations:

```
(XᵀX)a = Xᵀy
```

Gaussian elimination is used to find the coefficient vector `a`. R² is then computed as:

```
R² = 1 - (SS_res / SS_tot)
```

All math is implemented from scratch with no external libraries.

## Tools & Languages Used

HTML · CSS · JavaScript · Chart.js
