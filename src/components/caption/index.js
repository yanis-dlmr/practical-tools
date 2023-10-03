class Caption {

    constructor(title) {
        this.caption = document.createElement("div");
        this.caption.textContent = title;
        this.caption.setAttribute("class", "h4");
        this.caption.classList.add('font-weight-bold');
        this.caption.classList.add('mt-3');
    }

    render() {
        return this.caption;
    }

}

export { Caption }