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

The airfoil is divided into $N$ panels. Each panel is defined by:

- $a$: the number of the panel
- $(XB_i, YB_i)$: the beginning of the panel
- $(XB_{i+1}, YB_{i+1})$: the end of the panel
- $(XC_a, YC_a)$: the center of the panel with:
$$
XC_a = \frac{XB_i + XB_{i+1}}{2}
YC_a = \frac{YB_i + YB_{i+1}}{2}
$$
- $S_a$: the length of the panel with:
$$
S_a = \sqrt{\left( XB_{i+1} - XB_i \right)^2 + \left( YB_{i+1} - YB_i \right)^2}
$$

Angle of the panel:

- $\phi_a$: Angle from positive x-axis to inside surface of panel
- $\delta_a$: Angle from positive x-axis to outward normal vector of panel ($n_a$)
- $\beta_a$: Angle between freestream vector ($V_\infty$) and outward normal vector of panel ($n_a$)


The geometry is defined by the previous equations detailed in the section [Profiles](./profiles/).

The following figure shows the geometry of the panels for a NACA 0012 profil:

![Panel Geometry](/airfoil/panels.png)

::: tip Note
The panels are oriented from the trailing edge to the leading edge in the clockwise direction : 
![Panel Orientation](/airfoil/1st_panels.png)
:::

::: danger Accuracy issue
The panels are generated using the following equation:
$$
\frac{x}{c} = \frac{1}{2} \left( 1 + \cos \left( \theta \right) \right), \theta \in \left[ 0, 2\pi \right]
$$
The definition of theses panels is very important for the calculation of the pressure coefficient. If the panels are not defined correctly, the pressure coefficient will not be calculated correctly and we will see a "yoyo" effect on the graph.
From 0 up to 160 panels, the accuracy of the pressure coefficient increases. After 160 panels, the accuracy of the pressure coefficient is constant.
The most optimal number of panels seems to be 170. But we still see a "yoyo" effect on the graph.

![Yoyo Effect](/airfoil/yoyo_effect.png)

Take note that the "yoyo" effect doesn't affect the lift coefficient and the moment coefficient.

:::

## Vortex Panel Method

### System of equations

In order to calculate the lift coefficient and the moment coefficient, we need to calculate the pressure coefficient along the airfoil.
For that we need to solve multiple equations. The variables to be computed are the following:

$$
K_{ij} = \frac{C_n}{2} \left[ \ln \left( \frac{S_j^2 + 2AS_j + B}{B} \right) \right] + \frac{D_n - AC_n}{E} \left[ \tan^{-1} \left( \frac{S_j + A}{E} \right) - \tan^{-1} \left( \frac{A}{E} \right) \right]
$$

$$
L_{ij} = \frac{C_t}{2} \left[ \ln \left( \frac{S_j^2 + 2AS_j + B}{B} \right) \right] + \frac{D_t - AC_t}{E} \left[ \tan^{-1} \left( \frac{S_j + A}{E} \right) - \tan^{-1} \left( \frac{A}{E} \right) \right]
$$

With:

$$
A = - (x_i - X_j) \cos \phi_j - (y_i - Y_j) \sin \phi_j
$$

$$
B = (x_i - X_j)^2 + (y_i - Y_j)^2
$$

$$
C_n = - \cos ( \phi_i - \phi_j )
$$

$$
D_n = (x_i - X_j) \cos \phi_i - (y_i - Y_j) \sin \phi_i
$$

$$
C_t = \sin ( \phi_j - \phi_i )
$$

$$
D_t = (x_i - X_j) \sin \phi_i - (y_i - Y_j) \cos \phi_i
$$

$$
E = \sqrt{B - A^2}
$$

Then we need to solve the following system of equations:

$$
A \cdot \gamma = B
$$

With:

$$
A_{ij} = \begin{cases}
0 & \text{if } i = j \\
- K_{ij} & \text{if } i \neq j
\end{cases}
$$

$$
B_i = - V_\infty \cdot 2 \pi \cos \beta_i
$$

::: tip Kutta Condition
The Kutta condition is a condition that must be respected in order to have a correct calculation of the lift coefficient and the moment coefficient. It is defined by the following equation:
$$
\gamma_1 + \gamma_N = 0
$$

In order to respect this condition, we need to edit the matrix $A$ and the vector $B$.

For the matrix $A$, we need to edit the last row. Put a 1 at the beginning and at the end of the row. Put 0 everywhere else in the row.

For the vector $B$, we need to edit the last value. Put 0.
:::

The system of matrix equations is then the following:

$$
\begin{bmatrix}
0 & -K_{12} & \cdots & -K_{1(N-1)} & -K_{1N} \\
-K_{21} & 0 & \cdots & -K_{2(N-1)} & -K_{2N} \\
\vdots & \vdots & \ddots & \vdots & \vdots \\
-K_{(N-1)1} & -K_{(N-1)2} & \cdots & 0 & -K_{(N-1)N} \\
1 & 0 & \cdots & 0 & 1
\end{bmatrix}
\begin{bmatrix}
\gamma_1 \\
\gamma_2 \\
\vdots \\
\gamma_{N-1} \\
\gamma_N
\end{bmatrix}
=
\begin{bmatrix}
- V_\infty \cdot 2 \pi \cos \beta_1 \\
- V_\infty \cdot 2 \pi \cos \beta_2 \\
\vdots \\
- V_\infty \cdot 2 \pi \cos \beta_{N-1} \\
0
\end{bmatrix}
$$

### Panel Velocities

The panel velocities are calculated with the following equation:

$$
V_{t_i} = V_\infty \cdot \sin \beta_i + \frac{\gamma_i}{2} + \sum_{j=1, j \neq i}^{N} \frac{ - \gamma_j}{2 \pi} \cdot L_{ij}
$$

### Pressure Coefficient

The pressure coefficient is calculated with the following equation:

$$
C_{p_i} = 1 - \left( \frac{V_{t_i}}{V_\infty} \right)^2
$$

### Lift Coefficient

The lift coefficient is calculated with the following equation:

$$
C_l = 2 \cdot \sum_{j=1}^{N} \gamma_j \cdot S_j
$$

## Validation

The pressure coefficients obtained for a NACA 0012 profil with the Vortex Panel Method are compared with the results obtained with experimental data.

The comparison is done for a NACA 0012 profil with an angle of attack of 8°. The results are presented in the following graph:

![Comparison](/airfoil/comparison_cp.png)