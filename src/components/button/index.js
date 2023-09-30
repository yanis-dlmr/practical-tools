class Button {

    constructor(text) {
        this.text = text;
    }

    render() {
        const button = document.createElement('button');
        button.classList.add('btn', 'btn-primary');
        button.innerHTML = this.text;
        importButton.classList.add('mb-3');
        return button;
    }

}