class Container {

    constructor() {
        this.container = document.createElement('div');
        this.container.classList.add('custom-container');
        this.container.classList.add('container-fluid');
        this.container.classList.add('mb-3');
    }

    addComponent(component) {
        this.container.appendChild(component);
    }

    render() {
        return this.container;
    }

}

export { Container }