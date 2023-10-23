class ChartJs {
    constructor(title, x_values, y_values, line_names) {
        this.title = title;
        this.x_values = x_values;
        this.y_values = y_values;
        this.line_names = line_names;
    }

    render() {
        var canvas = document.createElement('canvas');
        canvas.style.width = 300;
        canvas.style.height = 300;
        var ctx = canvas.getContext('2d');
        
        var chartData = {
            labels: this.x_values,
            datasets: []
        };
        
        for (let i = 0; i < this.line_names.length; i++) {
            chartData.datasets.unshift({
                label: this.line_names[i],
                data: this.y_values[i],
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
        };

        var chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: chartOptions,
        });
        
        return chart.canvas;
    }

    render_lists_x() { // for x_values = [x, x, x_top_profile, x_bottom_profile] and y_values = [yc, yt, y_bottom_profile, y_top_profile]
        var canvas = document.createElement('canvas');
        canvas.style.width = 300;
        canvas.style.height = 300;
        var ctx = canvas.getContext('2d');

        var chartData = {
            labels: this.x_values,
            datasets: []
        };

        for (let i = 0; i < this.line_names.length; i++) {
            chartData.datasets.unshift({
                label: this.line_names[i],
                data: this.y_values[i],
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
