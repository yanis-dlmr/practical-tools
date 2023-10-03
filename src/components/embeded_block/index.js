class EmbededBlock {

    constructor(text) {
        this.text = text;
    }

    render() { // render embeded block using highlight.js
        const pre = document.createElement('pre');
        pre.setAttribute('style', 'tab-size: 4;');
        pre.setAttribute('class', 'custom-pre');
        const code = document.createElement('code');
        code.setAttribute('class', 'language-javascript');
        code.innerHTML = this.text;
        pre.appendChild(code);
        return pre;
    }

}

export { EmbededBlock }