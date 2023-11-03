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

::: details Table of the results

| Angle of attack | Thin Airfoil Theory | Vortex Panel Method | XFOIL | Experimental data |
| :-------------- | ------------------: | ------------------: | ----: | ----------------: |
| 0°              | 0.000               | 0.0014              | 0.0000 | 0.0603             |
| 5°              | 0.548               | 0.6027              | 0.6034 | 0.7400             |
| 8°              | 0.877               | 0.9559              | 0.9635 | 1.1873             |
| 10°             | 1.097               | 1.1858              | 1.2022 | 1.2707             |
| 12°             | 1.316               | 1.4099              | 1.4395 | 1.3887             |
| 15°             | 1.645               | 1.7329              | 1.7919 | 1.1701             |

:::

The results obtained with the tool are close to the results obtained with XFOIL and the experimental data. The differences are due to the assumptions made in the theorical approaches.
Our 2 approaches are validated for small angles of attack, inferior to the stall angle.
The Vortex Panel Method is more accurate than the Thin Airfoil Theory.

::: warning Limitations

The tool is not validated for angles of attack superior to the stall angle.
Indeed, turbulent and viscous phenomena are not taken into account in the different theorical approaches.

:::