class Card {

    constructor(title) {
        this.card = document.createElement('div');
        this.card.classList.add('card');
        this.card.classList.add('custom-card')

        this.setTitle(title);

        this.cardBody = document.createElement('div');
        this.cardBody.classList.add('card-body');
        this.cardBody.classList.add('custom-card-body');
        this.card.appendChild(this.cardBody);
    }

    setTitle(title) {
        this.cardHeader = document.createElement('h3');
        this.cardHeader.classList.add('card-header');
        this.cardHeader.classList.add('card-title');
        this.cardHeader.innerText = title;
        this.card.appendChild(this.cardHeader);
    }

    addComponent(component) {
        this.cardBody.appendChild(component);
    }

    render() {
        return this.card;
    }

}

export { Card }