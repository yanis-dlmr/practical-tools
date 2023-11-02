# Theorical approach

## Introduction

Different approaches are used in order to analyse the airfoil. Two approaches are available in the tool:

- The Thin Airfoil Theory ([Thin Airfoil Theory](./thin/))
- The Vortex Panel Method ([Vortex Panel Method](./vortex-panel/))

## Hypothesis

The following hypothesis are made in order to analyse the airfoil:

- The flow is bidimensional
- The flow is stationary
- The flow is inviscid
- Turbulent phenomena are not represented

## Validation

The results obtained for a NACA 0012 profil with the differents approches are compared with the results obtained with XFOIL and some experimental data. 

The comparison is done for different angles of attack. The results are presented in the following graph:

![Comparison](/airfoil/comparison_cl.png)

The results obtained with the tool are close to the results obtained with XFOIL and the experimental data. The differences are due to the assumptions made in the theorical approaches.
Our 2 approaches are validated for small angles of attack, inferior to the stall angle.
The Vortex Panel Method is more accurate than the Thin Airfoil Theory.