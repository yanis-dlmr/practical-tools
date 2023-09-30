class Caption {

    constructor(title) {
        this.caption = document.createElement("div");
        this.caption.textContent = title;
        this.caption.setAttribute("class", "h4"); 
        this.caption.setAttribute("margin-bottom", "10px")
    }

    render() {
        return this.caption;
    }

}

export { Caption }