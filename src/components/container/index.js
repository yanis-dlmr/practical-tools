class Container {

    constructor(proportion, position) {
        this.container = document.createElement('div');
        this.container.classList.add('custom-container');
        if (position == 'left') {
            this.container.style.paddingLeft = '3rem';
            this.container.style.paddingRight = '1rem';
        } else if (position == 'right') {
            this.container.style.paddingRight = '3rem';
            this.container.style.paddingLeft = '1rem';
        } else if (position == 'center') {
            this.container.style.paddingLeft = '3rem';
            this.container.style.paddingRight = '3rem';
        }
        //this.container.classList.add('container-fluid');
        this.container.classList.add('mb-3');
        this.container.classList.add('col-' + proportion);
    }

    addComponent(component) {
        this.container.appendChild(component);
    }

    render() {
        return this.container;
    }

}

export { Container }