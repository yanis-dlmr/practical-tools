class ChartJs {
    constructor(title, x_labels, x_values, y_values, line_names, x_label, y_label) {
        this.title = title;
        this.x_labels = x_labels;
        this.x_values = x_values;
        this.y_values = y_values;
        this.line_names = line_names;
        this.x_label = x_label;
        this.y_label = y_label;
    }

    render() {
        var canvas = document.createElement('canvas');
        canvas.style.width = 300;
        canvas.style.height = 300;
        var ctx = canvas.getContext('2d');
        
        var chartData = {
            labels: this.x_labels,
            datasets: [],
        };
        
        for (let i = 0; i < this.line_names.length; i++) {
            var data = [];
            for (let j = 0; j < this.x_values[i].length; j++) {
                data.push({
                    x: this.x_values[i][j],
                    y: this.y_values[i][j],
                });
            }
            chartData.datasets.unshift({
                label: this.line_names[i],
                data: data,
                fill: false,
                tension: 0.1,
                pointRadius: 0,
            });
        }
        
        var chartOptions = {
            plugins: {
                title: {
                    display: true,
                    text: this.title,
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: this.x_label,
                    },
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: this.y_label,
                    },
                },
            },
        };

        var chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions,
        });
        
        return chart.canvas;
    }

}

export { ChartJs };
