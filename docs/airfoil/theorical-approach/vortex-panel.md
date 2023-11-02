# The Vortex Panel Method

## Introduction

The Vortex Panel Method is a theorical approach used to analyse airfoils. It is more accurate than the Thin Airfoil Theory but still don't take into account the viscous and turbulent effects.

The objective of this approach is to calculate the lift coefficient and the moment coefficient of the airfoil but also the pressure coefficient along the airfoil.
It can only compute for a given angle of attack.

## Source

You can find some information about the Vortex Panel Method in the following source: 

- Youtube Playlist: [Panel Methods](https://youtube.com/playlist?list=PLxT-itJ3HGuUDVMuWKBxyoY8Dm9O9qstP&si=NaV9lmTT6M3ymNyZ).
- Github Repository of the previous Youtube Playlist: [Panel Methods](https://github.com/jte0419/Panel_Methods).

## Panel Geometry

The airfoil is divided into $N$ panels. Each panel is defined by its two extremities: $P_i$ and $P_{i+1}$.

The following figure shows the geometry of the panels for a NACA 0012 profil:

![Panel Geometry](/airfoil/panels.png)

::: warning Note
The panels are oriented from the trailing edge to the leading edge in the clockwise direction : 
![Panel Orientation](/airfoil/1st_panels.png)
:::

::: danger Accuracy
The panels are generated using the following equation:
$$
\frac{x}{c} = \frac{1}{2} \left( 1 + \cos \left( \theta \right) \right), \theta \in \left[ 0, 2\pi \right]
$$
The definition of theses panels is very important for the calculation of the pressure coefficient. If the panels are not defined correctly, the pressure coefficient will not be calculated correctly and we will see a "yoyo" effect on the graph.
From 0 up to 160 panels, the accuracy of the pressure coefficient increases. After 160 panels, the accuracy of the pressure coefficient is constant.
The most optimal number of panels seems to be 170. But we still see a "yoyo" effect on the graph.

![Yoyo Effect](/airfoil/yoyo_effect.png)

:::

## Validation

The pressure coefficients obtained for a NACA 0012 profil with the Vortex Panel Method are compared with the results obtained with experimental data.

The comparison is done for a NACA 0012 profil with an angle of attack of 8°. The results are presented in the following graph:

![Comparison](/airfoil/comparison_cp.png)