class Select {

    constructor(options) {
        this.options = options;
    }

    render() {
        const select = document.createElement('select');
        select.classList.add('form-control');
        select.classList.add('mb-3');
        this.options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            select.appendChild(optionElement);
        });
        return select;
    }

}

export { Select }