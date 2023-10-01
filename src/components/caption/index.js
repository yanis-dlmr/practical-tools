class Caption {

    constructor(title) {
        this.caption = document.createElement("div");
        this.caption.textContent = title;
        this.caption.setAttribute("class", "h4");
        this.caption.classList.add('m-3');
    }

    render() {
        return this.caption;
    }

}

export { Caption }