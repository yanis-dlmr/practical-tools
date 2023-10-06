class Button {

    constructor(text) {
        this.text = text;
    }

    set_onclick(onclick) { // event listener for button
        this.onclick = onclick;
    }

    render() {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary');
        button.classList.add('amelia-button');
        button.innerHTML = this.text;
        button.classList.add('mb-3');
        button.style.width = '100%';
        if (this.onclick) {
            button.addEventListener('click', this.onclick);
        }
        return button;
    }

}

export { Button }