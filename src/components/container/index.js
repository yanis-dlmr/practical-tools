class Container {

    constructor() {
        this.container = document.createElement('div');
        this.container.classList.add('container');
        this.container.classList.add('custom-container');
    }

    addComponent(component) {
        this.container.appendChild(component);
    }

    render() {
        return this.container;
    }

}

export { Container }