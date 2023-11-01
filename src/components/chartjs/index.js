class ChartJs {
    constructor(title, x_labels, x_values, y_values, line_names, x_label, y_label, options = {marker : false}) {
        this.title = title;
        this.x_labels = x_labels;
        this.x_values = x_values;
        this.y_values = y_values;
        this.line_names = line_names;
        this.x_label = x_label;
        this.y_label = y_label;
        this.options = options;
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
            let data_to_add = {
                data: data,
                label: this.line_names[i],
                fill: false,
                tension: 0.1,
                pointRadius: 0,
            };
            if (this.options.marker) {
                data_to_add.pointRadius = 5;
            }
            if (this.options.fill != undefined && this.options.fill[i] == true) {
                data_to_add.fill = true;
                data_to_add.fill.target = 'origin';
                data_to_add.fill.borderColor = 'rgba(0, 0, 255)';
                data_to_add.fill.backgroundColor = 'rgba(0, 0, 255)';
            }
            chartData.datasets.unshift(data_to_add);
        }
        
        var chartOptions = {
            plugins: {
                title: {
                    display: true,
                    text: this.title,
                },
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

        if ((this.options.showLegend != undefined) && (this.options.showLegend == false)) {
            let legend = {
                display: this.options.showLegend,
            };
            chartOptions.plugins.legend = legend;
        }

        var chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions,
        });
        
        return chart.canvas;
    }

}

export { ChartJs };
