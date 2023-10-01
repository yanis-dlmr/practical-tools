class Button {

    constructor(text) {
        this.text = text;
    }

    render() {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary');
        button.innerHTML = this.text;
        button.classList.add('m-3');
        return button;
    }

}

export { Button }