# The Vortex Panel Method

## Introduction

The Vortex Panel Method is a theorical approach used to analyse airfoils. It is more accurate than the Thin Airfoil Theory but still don't take into account the viscous and turbulent effects.

The objective of this approach is to calculate the lift coefficient and the moment coefficient of the airfoil but also the pressure coefficient along the airfoil.
It can only compute for a given angle of attack.

## Source

You can find some information about the Vortex Panel Method in the following source: 

- Youtube Playlist: [Panel Methods](https://youtube.com/playlist?list=PLxT-itJ3HGuUDVMuWKBxyoY8Dm9O9qstP&si=NaV9lmTT6M3ymNyZ).

## Panel Geometry

The airfoil is divided into $N$ panels. Each panel is defined by its two extremities: $P_i$ and $P_{i+1}$.

The following figure shows the geometry of the panels for a NACA 0012 profil:

![Panel Geometry](/airfoil/panels.png)

::: note Note
The panels are oriented from the trailing edge to the leading edge in the clockwise direction : 
![Panel Orientation](/airfoil/1st_panels.png)
:::

## Validation

The pressure coefficients obtained for a NACA 0012 profil with the Vortex Panel Method are compared with the results obtained with experimental data.

The comparison is done for a NACA 0012 profil with an angle of attack of 8°. The results are presented in the following graph:

![Comparison](/airfoil/comparison_cp.png)