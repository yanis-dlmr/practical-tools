class Button {

    constructor(text) {
        this.text = text;
    }

    render() {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary');
        button.innerHTML = this.text;
        button.classList.add('mb-3');
        return button;
    }

}

export { Button }