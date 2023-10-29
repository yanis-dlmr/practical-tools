# Thin airfoil theory

## Introduction

The thin airfoil theory is a theorical approach used to analyse airfoils. It is based on the following assumptions:

- The airflow is bidimensional
- The airfoil is thin, which means that the thickness of the airfoil is small compared to the chord (relative thickness: $\frac{e}{L} \leq 10 \%$) and that the camber of the airfoil is small compared to the chord (relative camber: $\frac{f}{L} \leq 5 \%$)
- The flow is incompressible
- The flow is stationary

## Lift coefficient

In order to calculate the lift coefficient, we need to calculate different coefficients:

- First coefficient:
$$
\alpha - A_0 = \frac{1}{\pi} \int_{0}^{\pi} \frac{dy_c}{dx}\left( \theta \right) d\theta
$$
- Higher order coefficients:
$$
A_n = \frac{2}{\pi} \int_{0}^{\pi} \frac{dy_c}{dx}\left( \theta \right) \cos \left( n \theta \right) d\theta 
$$

The lift coefficient is then calculated using the following equation:
$$
C_L = \pi \left( 2 A_0 + A_1 \right)
$$

## Drag coefficient

The drag coefficient is calculated using the following equation:
$$
C_D = \frac{C_L^2}{\pi A_1}
$$

## Moment coefficient

The moment coefficient is calculated using the following equation:
$$
C_{M,BA} = - \frac{\pi}{2} \left( A_0 + A_1 - \frac{1}{2} A_2 \right)
$$

$$
C_{M,c/4} = \frac{\pi}{4} \left( A_2 - A_1 \right)
$$