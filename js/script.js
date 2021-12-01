let lastFetchData;

function showStatus(text) {
    box = document.getElementById("status-box");
    box.style.display = "block";
    box.innerHTML = text;
}

function removeStatus() {
    document.getElementById("status-box").style.display = "none";
}

function validateName(name) {
    validRegex = /^[A-Za-z ]{1,255}$/;
    return validRegex.test(name);
}

function getSelectedGender() {
    for (let element of document.getElementsByName('gender')) {
        if (element.checked)
            return element.value;
    }
    return null;
}

function showSavedBox(saved) {
    document.getElementById('saved-res').innerHTML = saved;
    document.getElementById('saved-box').style.display = 'block';
}

function clearResults() {
    document.getElementById('genderResult').innerHTML = null;
    document.getElementById('probResult').innerHTML = null;
    document.getElementById('saved-box').style.display = 'none';
    for (let element of document.getElementsByName('gender')) {
        element.checked = false;
    }
}

document.getElementById('submit-btn').onclick = (event) => {
    event.preventDefault();
    event.target.blur();
    clearResults();

    nameField = document.getElementById('name-field');
    if (!validateName(nameField.value)) {
        showStatus('Name must be between 1 and 255 characters and can only contain letters and spaces.');
        return;
    }

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

    saved = localStorage.getItem(nameField.value);
    if (saved !== null) {
        showSavedBox(saved);
    }
};

document.getElementById('save-btn').onclick = (event) => {
    event.preventDefault();
    event.target.blur();

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

document.getElementById('clear-btn').onclick = (event) => {
    event.preventDefault();

    document.getElementById('saved-box').style.display = 'none';
    localStorage.removeItem(lastFetchData.name);
    showStatus(`Data cleared for ${lastFetchData.name}`);
};