class ChartJs {

    constructor (title, x_values, y_values, line_names) {
        this.title = title;
        this.x_values = x_values;
        this.y_values = y_values;
        this.line_names = line_names;
    }

    render () {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'chartjs');
        canvas.setAttribute('width', '400');
        canvas.setAttribute('height', '400');
        const ctx = canvas.getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.x_values,
                datasets: this.y_values
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
                },
                legend : {
                    display: true,
                    position: 'bottom',
                    labels: {
                        fontColor: '#000'
                    }
                }
            }
        });
        return canvas;
    }

}

export { ChartJs }