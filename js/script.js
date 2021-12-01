function showStatus(text) {
    box = document.getElementById("status-box");
    box.style.display = "block";
    box.innerHTML = text;
}

function removeStatus() {
    document.getElementById("status-box").style.display = "none";
}

function validateName(name) {
    validRegex = /[A-Za-z ]{1,255}/;
    return validRegex.test(name);
}

function getSelectedGender() {
    for (let element of document.getElementsByName('gender')) {
        if (element.checked)
            return element.value;
    }
    return null;
}

document.getElementById('submit-btn').onclick = (event) => {
    event.preventDefault();

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
};

document.getElementById('save-btn').onclick = (event) => {
    gender = getSelectedGender();
    console.log(gender);
    event.preventDefault();
};

document.getElementById('clear-btn').onclick = (event) => {
    event.preventDefault();
};