class Table {

    constructor(headers, data, precision = 3) {
        this.headers = headers;
        this.data = data;
        this.precision = precision;
    }

    render() {
        const table = document.createElement('table');
        table.classList.add('table', 'table-responsive', 'table-hover');

        const thead = document.createElement('thead');
        const tr = document.createElement('tr');
        for (let i = 0; i < this.headers.length; i++) {
            const th = document.createElement('th');
            th.innerHTML = this.headers[i];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        for (let i = 0; i < this.data.length; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < this.data[i].length; j++) {
                const td = document.createElement('td');
                td.innerHTML = this.data[i][j];
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        return table;
    }

    render_left_headers() { // put headers on the left side of the table instead of the top
        const table = document.createElement('table');
        table.classList.add('table', 'table-responsive', 'table-dark-custom', 'table-borderless');

        const thead = document.createElement('thead');
        let i = 0;
        const tr = document.createElement('tr');
        const th = document.createElement('th');
        th.innerHTML = this.headers[i];
        th.classList.add('table-header-cell');
        tr.appendChild(th);
        for (let j = 0; j < this.data[i].length; j++) {
            const th = document.createElement('th');
            th.classList.add('table-value-cell');
            th.innerHTML = this.data[i][j];
            tr.appendChild(th);
        }
        thead.appendChild(tr);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');
        for (let i = 1; i < this.data.length; i++) {
            const tr = document.createElement('tr');
            const th = document.createElement('th');
            th.classList.add('table-header-cell');
            th.innerHTML = this.headers[i];
            tr.appendChild(th);
            for (let j = 0; j < this.data[i].length; j++) {
                const td = document.createElement('td');
                td.classList.add('table-value-cell');
                //rounded data
                td.innerHTML = Math.round(this.data[i][j] * 10**this.precision) / 10**this.precision;
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        table.appendChild(tbody);

        return table;
    }

}

export { Table };