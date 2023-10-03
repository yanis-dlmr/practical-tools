class ChartJs {
    constructor(title, x_values, y_values, line_names) {
        this.title = title;
        this.x_values = x_values;
        this.y_values = y_values;
        this.line_names = line_names;
    }

    render() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'chartjs');
        parent.appendChild(canvas);
        const ctx = canvas.getContext('2d');
        
        const chartData = {
            labels: this.x_values,
            datasets: []
        };
        
        for (let i = 0; i < this.line_names.length; i++) {
            chartData.datasets.push({
                label: this.line_names[i],
                data: this.y_values[i],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
            });
        }
        
        const chartOptions = {
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
        };

        const chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions,
        });
        
        chart.update();
        return canvas;
    }
}

export { ChartJs };
