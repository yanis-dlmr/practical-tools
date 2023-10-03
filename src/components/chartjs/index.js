class ChartJs {

    constructor (title, type, labels, data) {
        this.chart = document.createElement('canvas');
        this.chart.setAttribute('id', 'myChart');
        this.chart.setAttribute('width', '400');
        this.chart.setAttribute('height', '400');
        this.chart.setAttribute('class', 'custom-chart');
        this.chart.setAttribute('style', 'max-width: 100%;');
        this.chart.setAttribute('style', 'max-height: 100%;');

        this.title = title;
        this.type = type;
        this.labels = labels;
        this.data = data;
    }

    render() {
        const data = this.data;
        const ctx = this.chart.getContext('2d');
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: this.title
                    }
                }
            },
        };
        const myChart = new Chart(ctx, config);
        return this.chart;
    }

}