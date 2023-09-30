class Importer {

    constructor(kind) {
        if (kind == 'multiple pictures') {
            this.fileInput = document.createElement('input');
            this.fileInput.classList.add('form-control');
            this.fileInput.type = 'file';
            this.fileInput.accept = '.BMP, .jpg, .jpeg, .png';
            this.fileInput.classList.add('mb-3');
            this.fileInput.multiple = true;
        }
    }

    render() {
        return this.fileInput;
    }    
}

export { Importer }