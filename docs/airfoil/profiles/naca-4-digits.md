# NACA 4-digits

## Introduction

The NACA 4-digits profile is a profile generated from 4 digits $MPXX$:
- The first digit $M$ is the maximum camber of the profile in percent of the chord, with $100 \times m = M$ ;
- The second digit $P$ is the position of the maximum camber of the profile in tenths of the chord, with $10 \times p = P$ ;
- The third and fourth digits $XX$ are the maximum thickness of the profile in percent of the chord, with $100 \times t = XX$.

## Camber line

The camber line is defined by the following equation:
$$
y_c = \left\{
    \begin{array}{ll}
        \frac{m}{p^2} \left( 2 p x - x^2 \right) & \text{if } 0 \leq x \leq p \\
        \frac{m}{(1-p)^2} \left( 1 - 2 p + 2 p x - x^2 \right) & \text{if } p \leq x \leq 1
    \end{array}
\right.
$$