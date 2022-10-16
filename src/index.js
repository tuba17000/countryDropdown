// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function countriesDropdown() {
  // Get countries from API, Populate, and add events.
  try {
    // Get countries.
    const response = await fetch(
      'https://restcountries.com/v2/all?fields=name,callingCodes,flags,alpha3Code,alpha2Code'
    );
    let countries = await response.json();
    // eslint-disable-next-line no-console
    console.log(countries);
    //Needed variables through out the code.
    const field = document.getElementById('selectedCode');
    const selectFlag = document.getElementById('selectedFlag');
    const select = document.getElementById('list');
    select.role = 'List of countries calling codes';
    //Get user's location if permission is given.
    window.navigator.geolocation.getCurrentPosition(sucessful, includeCountries);
    //Sort by alphabetic order of alpha 2 code the countries array with priority for user's country if given.
    function sortCountries(country) {
      // eslint-disable-next-line no-console
      countries = countries.sort((a, b) => {
        switch (country) {
          case a:
            return -1;
          case b:
            return 1;
          default:
            return a.alpha2Code.localeCompare(b.alpha2Code);
        }
      });
    }
    //Get user's country from location and set user's location as default option if given.
    async function sucessful(position) {
      const { latitude, longitude } = position.coords;
      const responseCountry = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=fd62e61af1c9405ea82b78729b6fb1af`
      );
      // eslint-disable-next-line no-console
      const geolocation = await responseCountry.json();
      const originCountry = geolocation.results[0].components['ISO_3166-1_alpha-3'];
      const country = countries.find((country) => country.alpha3Code === originCountry);
      // eslint-disable-next-line no-console
      selectFlag.src = country.flags.svg;
      field.innerText = `+${country.callingCodes[0]}`;
      sortCountries(country);
      includeCountries();
    }
    // Populate the dropdown with countries from API request and onclick event for each option.
    function includeCountries() {
      countries.forEach((country) => {
        const option = document.createElement('li');
        const newOption = document.createElement('div');
        const code = document.createElement('p');
        const flagImg = document.createElement('img');
        newOption.append(flagImg);
        newOption.append(code);
        option.append(newOption);
        select.append(option);
        code.value = `+${country.callingCodes[0]}`;
        option.className = 'options';
        option.role = `Option ${country.name}`;
        flagImg.src = `${country.flags.svg}`;
        flagImg.className = 'flags';
        flagImg.id = 'flag';
        flagImg.alt = `${country.name} flag`;
        code.id = `+${country.callingCodes[0]}`;
        code.className = 'textBlock';
        newOption.className = 'box2';
        newOption.value = `${country.name}`;
        code.innerText = `${country.alpha2Code}`;
        // event for selecting each option of the dropdown (didn't work on the event.js)
        option.onclick = function () {
          field.innerHTML = code.id;
          // select.classList.toggle('hide');
          selectFlag.src = flagImg.src;
        };
      });
      select.children[0].querySelector('div').classList.toggle('current');
    } // eslint-disable-next-line no-console
    //Variables specifically needed for events
    let active = 0;
    const options = select.children;
    // const selector = document.getElementById('selected');
    //Event to open the dropdown not needed in webflow
    // selector.onclick = function () {
    //   select.classList.toggle('hide');
    // };
    //Navigation through keyboard event:
    document.addEventListener('keydown', function (e) {
      switch (e.code) {
        case 'ArrowDown':
          if (active < options.length - 1) {
            // eslint-disable-next-line no-plusplus
            active++;
            select.scrollBy({
              top: 40,
              behavior: 'smooth',
            });
            options[active].querySelector('div').classList.toggle('current');
            options[active - 1].querySelector('div').classList.toggle('current');
          }
          break;
        case 'ArrowUp':
          if (active > 0) {
            // eslint-disable-next-line no-plusplus
            active--;
            select.scrollBy({
              top: -40,
              behavior: 'smooth',
            });
            options[active].querySelector('div').classList.toggle('current');
            options[active + 1].querySelector('div').classList.toggle('current');
          }
          break;
        case 'Enter':
          field.innerHTML = `${options[active].querySelector('p').id}`;
          // select.classList.toggle('hide');
          selectFlag.src = options[active].querySelector('img').src;
      }
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
countriesDropdown();
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-console
