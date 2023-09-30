<!-- Menu bar -->
<nav class="navbar navbar-expand-lg navbar-dark" style="background-color: #0B1321;">
    <div class="container-fluid">
        <!-- logo -->
        <a class="navbar-brand" href="/">
            <img style="height:30px;" src="/src/assets/images/logo.ico"> Practicals Tools
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">

            <ul class="navbar-nav" id="navbar-gauche">
            </ul>

            <ul class="navbar-nav ml-auto" id="navbar-droite">
            </ul>
        </div>
    </div>
</nav>

<script>

const menuU1 = document.getElementById("navbar-gauche");
const menuU2 = document.getElementById("navbar-droite");
fetch('/src/config/menu.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(item => {
            if (!('lvl' in item) || item.lvl <= <?php echo isset($_SESSION['lvl']) ? $_SESSION['lvl'] : 0 ?>) {
                const li = document.createElement("li");
                li.classList.add("nav-item");
                const a = document.createElement("a");
                a.classList.add("nav-link");
                a.href = item.url;
                if (item.icon) {
                    const img = document.createElement("img");
                    img.style.height = "30px";
                    img.src = item.icon;
                    a.appendChild(img);
                }
                const text = document.createTextNode(item.label);
                a.appendChild(text);
                li.appendChild(a);
                if (item.position == 'droite') {
                    if (item.contenu) {
                        const dropdown = document.createElement("li");
                        dropdown.classList.add("nav-item", "dropdown");
                        const dropdownLink = document.createElement("a");
                        dropdownLink.classList.add("nav-link", "dropdown-toggle");
                        dropdownLink.setAttribute("role", "button");
                        dropdownLink.setAttribute("data-bs-toggle", "dropdown");
                        dropdownLink.setAttribute("aria-expanded", "false");
                        dropdownLink.appendChild(document.createTextNode(item.label));
                        dropdown.appendChild(dropdownLink);
                        const dropdownMenu = document.createElement("ul");
                        dropdownMenu.classList.add("dropdown-menu");
                        dropdownMenu.classList.add("dropdown-menu-color");
                        item.contenu.forEach(contenuItem => {
                            if (!('lvl' in contenuItem) || contenuItem.lvl <= <?php echo isset($_SESSION['lvl']) ? $_SESSION['lvl'] : 0 ?>) {
                                const dropdownMenuItem = document.createElement("li");
                                dropdownMenuItem.classList.add("dropdown-item");
                                dropdownMenuItem.classList.add("dropdown-item-color");
                                const dropdownMenuLink = document.createElement("a");
                                dropdownMenuLink.classList.add("nav-link");
                                dropdownMenuLink.href = contenuItem.url;
                                if (contenuItem.icon) {
                                    const dropdownMenuIcon = document.createElement("img");
                                    dropdownMenuIcon.style.height = "10px";
                                    dropdownMenuIcon.style.margin = "5px"
                                    dropdownMenuIcon.src = contenuItem.icon;
                                    dropdownMenuIcon.classList.add("icon-menu");
                                    dropdownMenuLink.appendChild(dropdownMenuIcon);
                                }
                                dropdownMenuLink.appendChild(document.createTextNode(contenuItem.label));
                                dropdownMenuItem.appendChild(dropdownMenuLink);
                                dropdownMenu.appendChild(dropdownMenuItem);
                            }
                        });
                        dropdown.appendChild(dropdownMenu);
                        menuU2.insertBefore(dropdown, menuU2.firstChild);
                        dropdownLink.addEventListener("click", () => {
                            dropdownMenu.classList.toggle("show");
                        });
                    } else {
                        menuU2.insertBefore(li, menuU2.firstChild);
                    }
                } else if (item.position == 'gauche') {
                    if (item.contenu) {
                        const dropdown = document.createElement("li");
                        dropdown.classList.add("nav-item", "dropdown");
                        const dropdownLink = document.createElement("a");
                        dropdownLink.classList.add("nav-link", "dropdown-toggle");
                        dropdownLink.setAttribute("role", "button");
                        dropdownLink.setAttribute("data-bs-toggle", "dropdown");
                        dropdownLink.setAttribute("aria-expanded", "false");
                        dropdownLink.appendChild(document.createTextNode(item.label));
                        dropdown.appendChild(dropdownLink);
                        const dropdownMenu = document.createElement("ul");
                        dropdownMenu.classList.add("dropdown-menu");
                        dropdownMenu.classList.add("dropdown-menu-color");
                        item.contenu.forEach(contenuItem => {
                            if (!('lvl' in contenuItem) || contenuItem.lvl <= <?php echo isset($_SESSION['lvl']) ? $_SESSION['lvl'] : 0 ?>) {
                                const dropdownMenuItem = document.createElement("li");
                                dropdownMenuItem.classList.add("dropdown-item");
                                dropdownMenuItem.classList.add("dropdown-item-color");
                                const dropdownMenuLink = document.createElement("a");
                                dropdownMenuLink.classList.add("nav-link");
                                dropdownMenuLink.href = contenuItem.url;
                                if (contenuItem.icon) {
                                    const dropdownMenuIcon = document.createElement("img");
                                    dropdownMenuIcon.style.height = "30px";
                                    dropdownMenuIcon.src = contenuItem.icon;
                                    dropdownMenuIcon.classList.add("icon-menu");
                                    dropdownMenuLink.appendChild(dropdownMenuIcon);
                                }
                                dropdownMenuLink.appendChild(document.createTextNode(contenuItem.label));
                                dropdownMenuItem.appendChild(dropdownMenuLink);
                                dropdownMenu.appendChild(dropdownMenuItem);
                            }
                        });
                        dropdown.appendChild(dropdownMenu);
                        menuU1.appendChild(dropdown);
                        dropdownLink.addEventListener("click", () => {
                            dropdownMenu.classList.toggle("show");
                        });
                    } else {
                        menuU1.appendChild(li);
                    }
                };
            }
        });
    })
    .catch(error => console.log(error));


        
</script>