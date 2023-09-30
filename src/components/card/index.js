class Card {

    constructor() {
        this.card = document.createElement('div');
        this.card.classList.add('card');

        this.cardBody = document.createElement('div');
        this.cardBody.classList.add('card-body');
        this.card.appendChild(this.cardBody);
    }

    setTitle(title) {
        this.cardTitle = document.createElement('h5');
        this.cardTitle.classList.add('card-title');
        this.cardTitle.innerText = title;
        this.cardBody.appendChild(this.cardTitle);
    }

    render() {
        return this.card;
    }

}

export { Card }