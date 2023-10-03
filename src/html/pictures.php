<?php include '../utils/start.php'; ?>

<!DOCTYPE html>
<html>
    <head>
        <title>Practical Tools | Pictures</title>
        <?php include '../utils/head.php'; ?>
    </head>

    <body>
<pre><code class="language-js">hljs.addPlugin(new CopyButtonPluginClass({
    hook: (text, el) => text.toUpperCase()
}));</code></pre>

        <script async src="/src/includes/pictures/opencv.js" type="text/javascript"></script>
        <?php include '../utils/header.php'; ?>
    </body>

    <script type="module" src="/src/includes/pictures/index.js"></script>

</html>