(async () => {
  const dom = {
    select: document.querySelector.bind(document),
    slectAll: document.querySelectorAll.bind(document)
  };
  const username = 'Beniio';

  const response = await fetch(
    `https://api.github.com/users/${username}/repos`,
    {
      headers: {
        'User-Agent': 'request'
      }
    }
  );

  const json = await response.json();
  const insertHypenationHintsForCamelCase = (string) =>
    string.replace(/([a-z])([A-Z])/g, '$1\u00AD$2');

  const textColorFromBackgroundColor = (color) => {
    if (color.length < 5) {
      color += color.slice(1);
    }

    return parseInt(color.replace('#', '0x'), 16) >
      0xffffff / 2
      ? '#333'
      : '#fff';
  };

  const template = dom.select('#latest-repos-template');
  const container = dom.select('#latest-repos-container');

  for (const repo of json.reverse()) {
    if (!repo.description) {
      continue;
    }
    const content = template.cloneNode(true).content;
    const a = content.querySelector('.latest-repos-title');
    a.href = repo.html_url;
    a.textContent = insertHypenationHintsForCamelCase(
      repo.name
    );
    const lang = content.querySelector(
      '.latest-repos-language'
    );
    var urlColors =
      'https://raw.githubusercontent.com/ozh/github-colors/master/colors.json';

    var colors = await fetch(urlColors).then((res) =>
      res.json()
    );
    var color = colors[repo.language].color;

    if (repo.language) {
      lang.textContent = repo.language;
      lang.style.color =
        textColorFromBackgroundColor(color);
      lang.style.backgroundColor = color;
      const query = `user:Beniio user:chalk user:avajs user:xojs language:${repo.language.toLowerCase()} archived:false`;
      const url = new URL('https://github.com/search');
      url.searchParams.append('q', query);
      lang.href = url;
    } else {
      lang.classList.add('is-unclickable');
    }

    content.querySelector(
      '.latest-repos-description'
    ).textContent = repo.description;

    container.appendChild(
      document.importNode(content, true)
    );
  }

  dom.select('#projects').style.opacity = 1;
})();

const languageColor = () => {};
