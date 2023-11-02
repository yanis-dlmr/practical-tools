document.addEventListener('DOMContentLoaded', function() {
    init_home();
});

async function init_home() {

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('card');
    cardContainer.classList.add('custom-big-card');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');
    cardHeader.classList.add('custom-big-header')
    cardHeader.id = 'header';
    cardHeader.textContent = "Practical Tools"

    const cardBody = document.createElement('div');
    // put cardBody1 and cardBody2 next to each other
    cardBody.style.display = 'flex';
    cardBody.style.flexDirection = 'row';
    cardBody.style.flexWrap = 'wrap';
    cardBody.style.justifyContent = 'space-between';
    cardBody.style.alignItems = 'center';
    cardBody.style.textAlign = 'center';
    cardBody.style.margin = '0 auto';
    cardBody.style.marginBottom = '1rem';
    cardBody.style.padding = '0.5rem 1rem';

    const cardBody1 = document.createElement('div');
    cardBody1.classList.add('card-body');
    cardBody1.id = 'bloc';
    cardBody1.style.width = '70%';
    cardBody1.innerHTML = 
`<h4> Welcome ! </h4>
This site contains tools developed in order to help students during their practicals in the department Energetic and Propulsion.

<h4> The website is divided into 2 categories: </h4>
• A tool analyse <a class="custom-link" href="/airfoil">Airfoil</a> and do calculations on them following multiple methods <br>
• A tool to handle <a class="custom-link" href="/pictures">Pictures</a> and do treatments on them 

<h4> Disclaimer </h4>
The tools are still in development, some features may not work properly.
`
//cardBody2 next to cardBody1
    const cardBody2 = document.createElement('div');
    cardBody2.classList.add('card-body');
    cardBody2.id = 'bloc';
    cardBody2.style.width = '30%';
    //picture of the logo
    cardBody2.innerHTML =
    `
<img src="/src/assets/images/logo.ico" alt="logo" style="width: 100%; height: auto; margin-top: 1rem; margin-bottom: 1rem;">
    `   


    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');
    cardFooter.id = 'footer';
    cardFooter.setAttribute('style', 'text-align: center; font-size: 1rem; color: #2061ae; border-radius: 0.25rem; padding: 0.5rem 1rem; margin-top: 1rem;')
    cardFooter.innerHTML = 
    `
If you encounter any problems, please contact me on this e-mail adress: <a class="custom-link" href="mailto:yanis.delamare@insa-rouen.fr">yanis.delamare@insa-rouen.fr</a>
    `

    cardContainer.appendChild(cardHeader);
    cardBody.appendChild(cardBody2);
    cardBody.appendChild(cardBody1);
    cardContainer.appendChild(cardBody);
    cardContainer.appendChild(cardFooter);

    document.body.appendChild(cardContainer);
}