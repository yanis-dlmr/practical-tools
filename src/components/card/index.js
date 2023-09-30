class Card {

    constructor() {
        this.card = document.createElement('div');
        this.card.classList.add('card');
        this.card.classList.add('custom-card')

        this.cardBody = document.createElement('div');
        this.cardBody.classList.add('card-body');
        this.card.appendChild(this.cardBody);
    }

    setTitle(title) {
        this.cardHeader = document.createElement('h3');
        this.cardHeader.classList.add('card-header');
        this.cardHeader.classList.add('card-title');
        this.cardHeader.innerText = title;
        this.cardBody.appendChild(this.cardHeader);
    }

    render() {
        return this.card;
    }

}

export { Card }