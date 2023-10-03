<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js"></script>
<script>
    hljs.addPlugin(
    new CopyButtonPlugin({
        hook: (text, el) => {
        if (el.dataset.copyright) {
            return `${text}\n\n${el.dataset.copyright}`;
        }
        if (el.dataset.highlight) {
            el.style.filter = "saturate(5)";
        }
        return text;
        },
        callback: (text, el) => {
        updateHistory({ el, text, ts: new Date() });
        },
    })
    );
    hljs.highlightAll();
</script>