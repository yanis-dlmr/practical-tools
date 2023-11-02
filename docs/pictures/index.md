# Picture treatment tool  <Badge type="tip" text="^1.0.0" />

## Introduction

This tool has been developped in order to treat pictures from the stroboscopic camera used to analyse an injector.

::: info Example of picture as input

![Picture as input](/picture-treatment/picture-as-input.jpg)

:::

## How to use the tool

Different parameters are available in the tool. Here is a description of each parameter:

- **Display Only**: If this option is checked, only the original picture will be displayed.
- **Average Color**: If this option is checked, the average color of the picture will be displayed.
- **Average Pictures**: If this option is checked, the average of all the pictures will be computed and displayed.
- **Determine Axis**: If this option is checked, the axis of the injector will be determined.

Different parameters are available for the **Determine Axis** option:

- **Threshold minimum**: The minimum threshold for the 1st picture filter.
- **Threshold maximum**: The maximum threshold for the 1st picture filter.
- **Nb. of Axis**: The number of axis to determine.
- **Process light intensity along the axis to determine the length of the colored axis**: If this option is checked, the light intensity will be processed along the axis to determine the length of the colored axis. If checked you need to choose between 3 options:
    - **Max/Min derivative conditions**: The length of the colored axis will be determined by the max/min derivative conditions.
    - **Threshold**: The length of the colored axis will be determined by the threshold. The script will search from the left and right side of the picture and stop when the threshold is reached.
        - **Threshold value**: The threshold to reach.
    - **Smooth the light intensity** If this option is checked, the light intensity will be smoothed before processing it.
        - **Smooth factor**: The smoothing factor. The new value will be the average of the previous value and the previous value +/- the smoothing factor.

::: tip Graphical representation of the light intensity along the axis and his derivative

Here is a graphical representation of the light intensity along the axis and his derivative. Note that you can hide curves by clicking on the legend.

![Graph](/picture-treatment/graph.png)
:::

::: tip Example of picture as output

![Picture as output](/picture-treatment/output.png)

:::