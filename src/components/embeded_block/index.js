class EmbededBlock {

    constructor(array) {
        this.array = array;
    }

    render() { // render embeded block using highlight.js
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.setAttribute('class', 'language-javascript');
        code.innerHTML = this.array.join('\n');
        pre.appendChild(code);
        return pre;
    }

}

export { EmbededBlock }