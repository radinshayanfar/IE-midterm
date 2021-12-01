// Stores last fetched data
let lastFetchData;

// Displays status text in a red box on the bottom
function showStatus(text) {
    box = document.getElementById("status-box");
    box.style.display = "block";
    box.innerHTML = text;
}

// Removes status box
function removeStatus() {
    document.getElementById("status-box").style.display = "none";
}

// Validates input name by regex
function validateName(name) {
    validRegex = /^[A-Za-z ]{1,255}$/;
    return validRegex.test(name);
}

// Returns selected radio box value or null if nothing is selected
function getSelectedGender() {
    for (let element of document.getElementsByName('gender')) {
        if (element.checked)
            return element.value;
    }
    return null;
}

// Displays saved section with the given gender
function showSavedBox(saved) {
    document.getElementById('saved-res').innerHTML = saved;
    document.getElementById('saved-box').style.display = 'block';
}

// Clears previous submit results from string
function clearResults() {
    document.getElementById('genderResult').innerHTML = null;
    document.getElementById('probResult').innerHTML = null;
    document.getElementById('saved-box').style.display = 'none';
    for (let element of document.getElementsByName('gender')) {
        element.checked = false;
    }
}

// Event handler for Submit button onClick
document.getElementById('submit-btn').onclick = (event) => {
    event.preventDefault();
    // Removing focus from button
    event.target.blur();
    clearResults();

    // Validating name
    nameField = document.getElementById('name-field');
    if (!validateName(nameField.value)) {
        showStatus('Name must be between 1 and 255 characters and can only contains letters and spaces.');
        return;
    }

    // Fetching from the API
    showStatus('Fetching...');
    const apiUrl = 'https://api.genderize.io/';
    let params = new URLSearchParams({
        "name": nameField.value,
    });
    fetch(apiUrl + '?' + params.toString())
        .then((resp) => {
            if (!resp.ok) {
                throw new Error('Network response was not ok');
            }
            return resp.json();
        })
        .then((data) => {
            console.log(data);
            lastFetchData = data;

            // Displaying result or status to user
            if (data.gender === null) {
                showStatus(`No data available for ${data.name}`);
                return;
            }
            document.getElementById('genderResult').innerHTML = data.gender;
            document.getElementById('probResult').innerHTML = data.probability;
            removeStatus();
        })
        .catch(error => {
            showStatus(error);
        });

    // Displaying saved name - if any
    saved = localStorage.getItem(nameField.value);
    if (saved !== null) {
        showSavedBox(saved);
    }
};

// Event handler for Save button onClick
document.getElementById('save-btn').onclick = (event) => {
    event.preventDefault();
    event.target.blur();

    // Saves from radio box choice if available. otherwise saves fetched result
    gender = getSelectedGender();
    if (gender !== null) {
        localStorage.setItem(lastFetchData.name, gender);
        showStatus(`${gender} saved for ${lastFetchData.name}`);
    } else if (lastFetchData.gender !== null) {
        localStorage.setItem(lastFetchData.name, lastFetchData.gender);
        showStatus(`${lastFetchData.gender} saved for ${lastFetchData.name}`);
    } else {
        return;
    }
    showSavedBox(localStorage.getItem(lastFetchData.name));
};

// Event handler for Clear button onClick
document.getElementById('clear-btn').onclick = (event) => {
    event.preventDefault();

    document.getElementById('saved-box').style.display = 'none';
    localStorage.removeItem(lastFetchData.name);
    showStatus(`Data cleared for ${lastFetchData.name}`);
};