const BASE_URL = 'https://www.swapi.co/api/people';

// XMLHttpRequest Handler
function getChars(url = BASE_URL) {
  const people = localStorage.getItem('people');
  return new Promise(function(resolve, reject) {
    if (people && url === BASE_URL) {
      resolve(JSON.parse(people));
    } else {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState !== 4) {
          renderElem.innerText = 'Loading...';
        } else if (this.readyState === 4 && this.status === 200) {
          renderElem.innerText = null;
          localStorage.setItem('people', this.responseText);
          const response = JSON.parse(this.responseText);
          resolve(response);
        }
      };
      xhttp.open('GET', url, true);
      xhttp.send();
    }
  });
}

// Container for our character cards
const CharContainer = chars => {
  const { results } = chars;
  const elem = document.createElement('div');
  const cardGrp = document.createElement('div');
  const buttonGrp = document.createElement('div');

  elem.setAttribute(
    'style',
    `display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column`
  );

  cardGrp.setAttribute(
    'style',
    `display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;`
  );

  const characters = results ? results.map(CharCard) : CharCard(chars);

  if (!Array.isArray(characters)) {
    cardGrp.appendChild(characters);
    elem.appendChild(cardGrp);
  } else {
    characters.forEach(val => cardGrp.appendChild(val));
    const nextBtn = new Button('next', chars.next);
    const prevBtn = new Button(
      'prev',
      !(parseInt(chars.next[chars.next.length - 1]) - 2)
        ? BASE_URL
        : chars.next.slice(0, -1) +
          `${parseInt(chars.next[chars.next.length - 1]) - 2}`
    );

    buttonGrp.appendChild(prevBtn.render());
    buttonGrp.appendChild(nextBtn.render());
    elem.appendChild(cardGrp);
    elem.appendChild(buttonGrp);
  }

  return elem;
};
