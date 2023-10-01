class Caption {

    constructor(title) {
        this.caption = document.createElement("div");
        this.caption.textContent = title;
        this.caption.setAttribute("class", "h4");
        this.caption.classList.add('mb-3');
    }

    render() {
        return this.caption;
    }

}

export { Caption }