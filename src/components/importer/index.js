class Importer {

    constructor(kind) {
        if (kind == 'multiple pictures') {
            this.importer = document.createElement('input');
            this.importer.setAttribute('type', 'file');
            this.importer.setAttribute('multiple', 'multiple');
            this.importer.classList.add('custom-importer');
    
            this.label = document.createElement('label');
            this.label.classList.add('custom-label');
            this.label.innerText = 'Select a bunch of pictures';
            this.label.appendChild(this.importer);
        }
    }

    render() {
        return this.label;
    }    
}

export { Importer }