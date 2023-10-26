class Table {

    constructor(headers, data) {
        this.headers = headers;
        this.data = data;
    }

    render() {
        const table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'table-hover');

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

}

export { Table };