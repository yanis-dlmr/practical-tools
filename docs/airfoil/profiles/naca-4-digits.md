# NACA 4-digits

## Introduction

The NACA 4-digits profile is a profile generated from 4 digits $MPXX$:
- The first digit $M$ is the maximum camber of the profile in percent of the chord, with:
$$
100 \times m = M
$$
- The second digit $P$ is the position of the maximum camber of the profile in tenths of the chord, with: 
$$
10 \times p = P
$$ 
- The third and fourth digits $XX$ are the maximum thickness of the profile in percent of the chord, with: 
$$
100 \times t = XX
$$

## Camber line

The camber line is defined by the following equation:
$$
y_c = \left\{
    \begin{array}{ll}
        m\frac{x}{p^2} \left( 2p - \frac{x}{c} \right), & \text{if } 0 \leq x \lt pc \\
        m\frac{c-x}{(1-p)^2} \left( 1 + \frac{x}{c} - 2 p \right), & \text{if } pc \leq x \leq c
    \end{array}
\right.
$$

## Thickness line

The thickness line is defined by the following equation:
$$
y_t = \frac{t}{0.2} \left[ 0.2969 \sqrt{\frac{x}{c}} - 0.1260 \left( \frac{x}{c} \right) - 0.3516 \left( \frac{x}{c} \right)^2 + 0.2843 \left( \frac{x}{c} \right)^3 - 0.1015 \left( \frac{x}{c} \right)^4 \right]
$$

## Intrados and extrados

The intrados and the extrados are defined by the following equations. Their coordinates are respectively $(x_L, y_L)$ and $(x_U, y_U)$.

### Intrados

$$
\left\{
    \begin{array}{ll}
        x_L = x + y_t \sin \theta \\
        y_L = y_c - y_t \cos \theta
    \end{array}
\right.
$$

### Extrados

$$
\left\{
    \begin{array}{ll}
        x_U = x - y_t \sin \theta \\
        y_U = y_c + y_t \cos \theta
    \end{array}
\right.
$$

### Angle $\theta$

$$
\theta = \arctan \left( \frac{dy_c}{dx} \right)
$$

### Derivative $\frac{dy_c}{dx}$

$$
\frac{dy_c}{dx} = \left\{
    \begin{array}{ll}
        \frac{2m}{p^2} \left( p - \frac{x}{c} \right), & \text{if } 0 \leq x \lt pc \\
        \frac{2m}{(1-p)^2} \left( p - \frac{x}{c} \right), & \text{if } pc \leq x \leq c
    \end{array}
\right.
$$