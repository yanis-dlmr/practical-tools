class EmbededBlock {

    constructor(array) {
        this.array = array;
    }

    render() { // render embeded block using Code Highlight <pre><code> &lt;script> YOUR_CODE &lt;script> </code></pre>
        const pre = document.createElement('pre');
        const code = document.createElement('code');
        code.setAttribute('fs-codehighlight-element', 'code');
        code.innerHTML = this.array.join('\n');
        pre.appendChild(code);
        return pre;
    }

}

export { EmbededBlock }