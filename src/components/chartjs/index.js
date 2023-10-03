class ChartJs {

    constructor (title, x_values, y_values, line_names) {
        this.title = title;
        this.x_values = x_values;
        this.y_values = y_values;
        this.line_names = line_names;
    }

    render () {
        // x_values, y_values, line_names should have the same length
        // this length is the number of lines in the chart
        // for line 1 we have x_values, y_values[0], line_names[0] etc.
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'chartjs');
        canvas.setAttribute('width', '400');
        canvas.setAttribute('height', '400');
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.x_values,
                datasets: []
            },
            options: {
                title: {
                    display: true,
                    text: this.title
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
        for (let i = 0; i < this.line_names.length; i++) {
            chart.data.datasets.push({
                label: this.line_names[i],
                data: this.y_values[i],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                yAxisID: 'y-axis-' + i
            });
            chart.options.scales['y-axis-' + i] = {
                type: 'linear',
                position: 'left',
                ticks: {
                    beginAtZero: true
                }
            };
        }
        
        chart.update();
        return canvas;
    }

}

export { ChartJs }