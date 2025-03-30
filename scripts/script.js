let errorAlertTimers = [];
let studentsData = [];
let currentModalOperation = '';
let currentRow = null;
let currentStudentName = '';
let currentStudentId = '';

function addStudentToTable(student, table, profileName) {    
    //Online status if the student is the current user
    if(student.name === profileName){
        student.status = 'online';
    }
    else{ 
        student.status = 'offline';
    }

    const cssFormatedName = student.name.toLowerCase().replace(' ', '-');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <label for="${cssFormatedName}-checkbox" class="visually-hidden">Select ${cssFormatedName}</label>
            <input type="checkbox" class="student-checkbox" id="${cssFormatedName}-checkbox">
        </td>
        <td>${student.group}</td>
        <td>${student.name}</td>
        <td>${student.gender}</td>
        <td>${student.birthday}</td>
        <td><div class="${student.status}"></div></td>
        <td>
            <button class="edit-btn" data-id="${student.id}">✎</button>
            <button class="delete-btn" data-id="${student.id}" data-name="${student.name}">x</button>
        </td>
    `;

    table.appendChild(row);
    return row;
}

function updateRowWithStudentData(student) {
    if (!currentRow) {
        console.error("Row reference is null or undefined");
        return;
    }
    
    console.log("Updating student in the table:", student);
    
    //Update the table row cells
    currentRow.cells[1].textContent = student.group;
    currentRow.cells[2].textContent = student.name;
    currentRow.cells[3].textContent = student.gender;
    currentRow.cells[4].textContent = student.birthday;
    
    //Update button data attributes
    const editBtn = currentRow.querySelector('.edit-btn');
    const deleteBtn = currentRow.querySelector('.delete-btn');
    
    if (editBtn) editBtn.setAttribute('data-id', student.id);
    if (deleteBtn) {
        deleteBtn.setAttribute('data-id', student.id);
        deleteBtn.setAttribute('data-name', student.name);
    }

    //Update the checkbox ID and label to match the updated name
    const checkbox = currentRow.querySelector('.student-checkbox');
    const label = currentRow.querySelector('label');
    
    if (checkbox && label) {
        const cssFormatedName = student.name.toLowerCase().replace(' ', '-');
        checkbox.id = `${cssFormatedName}-checkbox`;
        label.setAttribute('for', `${cssFormatedName}-checkbox`);
        label.textContent = `Select ${cssFormatedName}`;
    }
}

function addEditDelListeners(row, originalData, studentModal, modalTitle, modalGroupField, 
    modalFirstNameField, modalLastNameField, modalGenderField, modalBirthdayField, 
    deleteModal, deleteMessage, modalStudentId, studentsData) {
    row.querySelector('.edit-btn').addEventListener('click', function() {
        currentRow = row;
        const checkbox = row.querySelector('.student-checkbox');
        const allCheckboxes = document.querySelectorAll('.student-checkbox');
        const checkedCheckboxes = Array.from(allCheckboxes).filter(cb => cb.checked);
        
        if (!checkbox.checked || checkedCheckboxes.length > 1) {
            alert('Select only this student to edit');
            return;
        }

        //Store the student ID for editing
        const studentId = this.getAttribute('data-id');
        originalData.id = studentId;
        
        //Find the student by ID in the students data
        const student = studentsData.find(student => student.id === studentId);
        
        if (!student) {
            console.error('Student not found with ID:', studentId);
            return;
        }

        //Store original values
        originalData.group = student.group;
        originalData.firstName = student.name.split(' ')[0];
        originalData.lastName = student.name.split(' ')[1];
        originalData.gender = student.gender === 'M' ? 'Male' : 'Female';
        originalData.birthday = student.birthday;

        //Set form fields with current values
        modalGroupField.value = originalData.group;
        modalFirstNameField.value = originalData.firstName;
        modalLastNameField.value = originalData.lastName;
        modalGenderField.value = originalData.gender;
        modalStudentId.value = studentId;

        //Convert birthday format from dd.mm.yyyy to yyyy-mm-dd
        const birthdayParts = originalData.birthday.split('.');
        const formattedBirthday = `${birthdayParts[2]}-${birthdayParts[1]}-${birthdayParts[0]}`;
        modalBirthdayField.value = formattedBirthday;

        //Configure modal for edit operation
        modalTitle.textContent = 'Edit Student';
        currentModalOperation = 'edit';
        studentModal.style.display = 'block';
    });

    row.querySelector('.delete-btn').addEventListener('click', function() {
        const checkbox = row.querySelector('.student-checkbox');
        if (!checkbox.checked) {
            alert('Select it first');
            return;
        }
        
        currentRow = row;
        const studentId = this.getAttribute('data-id');
        const studentName = this.getAttribute('data-name');
        
        const allCheckboxes = document.querySelectorAll('.student-checkbox');
        const allChecked = Array.from(allCheckboxes).filter(cb => cb.checked);
        
        //Store student ID for deletion
        currentStudentId = studentId;
        currentStudentName = allChecked.length === 1 ? studentName : 'ALL selected students';           

        deleteMessage.textContent = `Are you sure you want to delete ${currentStudentName}?`;
        deleteModal.style.display = 'block';
    });
}

function addCheckboxListener(checkbox) {
    checkbox.addEventListener('change', function() {
        if (!this.checked) {
            document.getElementById('select-all').checked = false;
        } else {
            //If all checkboxes are checked, check the header checkbox
            const allCheckboxes = document.querySelectorAll('.student-checkbox');
            const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
            document.getElementById('select-all').checked = allChecked;
        }
    });
}

function resetModalFields(modalGroupField, modalFirstNameField, modalLastNameField, 
    modalGenderField, modalBirthdayField, modalStudentId) {
    modalGroupField.value = '';
    modalFirstNameField.value = '';
    modalLastNameField.value = '';
    modalGenderField.value = '';
    modalBirthdayField.value = '';
    modalStudentId.value = '';
}

function validateForm(modalGroupField, modalFirstNameField, modalLastNameField, 
    modalGenderField, modalBirthdayField) {
    clearValidationErrors();
    let isValid = true;
    
    //Birthday validation
    if (!modalBirthdayField.value) {
        showError(modalBirthdayField, 'Birthday is required');
        isValid = false;
    } else if (!modalBirthdayField.validity.valid) {
        showError(modalBirthdayField, 'Birthday must be between 1900-01-01 and 2010-01-01');
        isValid = false;
    } else {
        const birthDate = new Date(modalBirthdayField.value);
        const minDate = new Date('1900-01-01');
        const maxDate = new Date('2010-01-01');
        
        if (birthDate < minDate || birthDate > maxDate) {
            showError(modalBirthdayField, 'Birthday must be between 1900-01-01 and 2010-01-01');
            isValid = false;
        }
    }

    //Gender validation
    if (!modalGenderField.value) {
        showError(modalGenderField, 'Please select a gender');
        isValid = false;
    }

    //Last name validation
    if (!modalLastNameField.value) {
        showError(modalLastNameField, 'Last name is required');
        isValid = false;
    } else if (!modalLastNameField.validity.valid) {
        showError(modalLastNameField, modalLastNameField.title || 'Last name should contain only letters, 2-30 characters long');
        isValid = false;
    } else if (!/^[A-Za-z]{2,30}$/.test(modalLastNameField.value)) {
        showError(modalLastNameField, 'Last name must contain only letters, 2-30 characters long');
        isValid = false;
    }
    
    //First name validation
    if (!modalFirstNameField.value) {
        showError(modalFirstNameField, 'First name is required');
        isValid = false;
    } else if (!modalFirstNameField.validity.valid) {
        showError(modalFirstNameField, modalFirstNameField.title || 'First name should contain only letters, 2-30 characters long');
        isValid = false;
    } else if (!/^[A-Za-z]{2,30}$/.test(modalFirstNameField.value)) {
        showError(modalFirstNameField, 'First name must contain only letters, 2-30 characters long');
        isValid = false;
    }

    //Group validation
    if (!modalGroupField.value) {
        showError(modalGroupField, 'Please select a group');
        isValid = false;
    }

    return isValid;
}

function showError(inputElement, errorMessage) {
    //Add error class to input element
    inputElement.classList.add('error-input');
    
    //Create error alert
    const alertElement = document.createElement('div');
    alertElement.className = 'error-alert';
    alertElement.textContent = errorMessage;
    
    //Position the alert near the top of the form
    const form = document.getElementById('student-form');
    form.parentNode.insertBefore(alertElement, form);
    
    //Animate the alert
    setTimeout(() => alertElement.classList.add('show'), 10);
    
    //Set timeout to remove the alert after 3 seconds
    const timerId = setTimeout(() => {
        alertElement.classList.remove('show');
        
        //Remove element after fade-out animation completes
        setTimeout(() => alertElement.remove(), 300);
        
        //Remove the timer ID from our tracking array
        errorAlertTimers = errorAlertTimers.filter(id => id !== timerId);
    }, 3000);
    
    //Track the timer
    errorAlertTimers.push(timerId);
}

function clearValidationErrors() {
    //Clear all error alert timers
    errorAlertTimers.forEach(timerId => clearTimeout(timerId));
    errorAlertTimers = [];
    
    //Remove all error alerts
    const errorAlerts = document.querySelectorAll('.error-alert');
    errorAlerts.forEach(alert => alert.remove());
    
    //Remove error styling from inputs
    const errorInputs = document.querySelectorAll('.error-input');
    errorInputs.forEach(input => input.classList.remove('error-input'));
}

function generateUniqueId() {
    //Generate a unique ID 
    return 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('DOMContentLoaded', function() {
    const table = document.querySelector('#table-container table');
    const profileName = document.getElementById('profile-name').textContent;

    // Delete modal
    const deleteModal = document.getElementById('delete-modal');
    const deleteMessage = document.getElementById('delete-message');
    const confirmDelete = document.getElementById('confirm-delete');
    const cancelDelete = document.getElementById('cancel-delete');
    const closeDeleteWindow = document.getElementById('close-del-window');

    // Student modal
    const studentModal = document.getElementById('student-modal');
    const modalTitle = document.getElementById('modal-title');
    const cancelModal = document.getElementById('cancel-modal');
    const closeModalWindow = document.getElementById('close-modal-window');
    const modalGroupField = document.getElementById('modal-group');
    const modalFirstNameField = document.getElementById('modal-first-name');
    const modalLastNameField = document.getElementById('modal-last-name');
    const modalGenderField = document.getElementById('modal-gender');
    const modalBirthdayField = document.getElementById('modal-birthday');
    const modalStudentId = document.getElementById('modal-student-id');
    
    let originalData = {};

    //Get and fill table data (Works only with live server)
    fetch('data/students.json')
        .then(response => response.json())
        .then(data => {
            studentsData = data;
            data.forEach(student => { 
                const row = addStudentToTable(student, table, profileName);
                
                //Add event listeners to edit and delete buttons of row
                addEditDelListeners(row, originalData, studentModal, modalTitle, modalGroupField, 
                    modalFirstNameField, modalLastNameField, modalGenderField, modalBirthdayField, 
                    deleteModal, deleteMessage, modalStudentId, studentsData);
                
                //Add event listener to checkbox
                addCheckboxListener(row.querySelector('.student-checkbox'));
            });

            //Add event listener to the header checkbox
            const selectAllCheckbox = document.getElementById('select-all');
            selectAllCheckbox.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.student-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = selectAllCheckbox.checked;
                });
            });
        })
        .catch(error => console.error('Error loading student data:', error));

    //Delete modal logic
    cancelDelete.addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });

    confirmDelete.addEventListener('click', function() {
        const rows = table.querySelectorAll('tr:not(:first-child)');
        const checkedRows = Array.from(rows).filter(row => {
            return row.querySelector('.student-checkbox').checked;
        });

        if (checkedRows.length > 0) {
            checkedRows.forEach(row => {
                const deleteBtn = row.querySelector('.delete-btn');
                if (deleteBtn) {
                    const studentId = deleteBtn.getAttribute('data-id');
                    
                    if (studentId) {
                        //Remove from data array by ID
                        studentsData = studentsData.filter(s => s.id !== studentId);
                        
                        //Remove the row from the table
                        row.remove();
                    }
                }
            });

            //Reset state variables
            currentStudentName = '';
            currentStudentId = '';
            currentRow = null;
            
            //Simulate saving the updated data to Students.json
            console.log('Updated Students.json:', JSON.stringify(studentsData, null, 2));
        }

        //Hide the delete modal
        deleteModal.style.display = 'none';
    });

    closeDeleteWindow.addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });

    //Student modal logic
    document.querySelector('.add-btn').addEventListener('click', function() {
        resetModalFields(modalGroupField, modalFirstNameField, modalLastNameField,
             modalGenderField, modalBirthdayField, modalStudentId);
        modalTitle.textContent = 'Add Student';
        currentModalOperation = 'add';
        studentModal.style.display = 'block';
    });

    cancelModal.addEventListener('click', function() {
        studentModal.style.display = 'none';
        clearValidationErrors();
    });

    closeModalWindow.addEventListener('click', function() {
        studentModal.style.display = 'none';
        clearValidationErrors();
    });

    //Form submission handler
    const studentForm = document.getElementById('student-form');
    studentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        console.log("Form submitted, operation:", currentModalOperation || "unknown");
        
        //Validation
        if (validateForm(modalGroupField, modalFirstNameField, modalLastNameField, 
            modalGenderField, modalBirthdayField)) {
            
            //Convert birthday format from yyyy-mm-dd to dd.mm.yyyy
            const birthdayParts = modalBirthdayField.value.split('-');
            const formattedBirthday = `${birthdayParts[2]}.${birthdayParts[1]}.${birthdayParts[0]}`;
            
            if (currentModalOperation === 'add') {
                //Generate a unique ID for the new student
                const studentId = generateUniqueId();
                
                //Add new student
                const newStudent = {
                    id: studentId,
                    group: modalGroupField.value,
                    name: `${modalFirstNameField.value} ${modalLastNameField.value}`,
                    gender: modalGenderField.value === 'Male' ? 'M' : 'F',
                    birthday: formattedBirthday,
                    status: 'offline'
                };
                
                //Add the new student to the local data
                studentsData.push(newStudent);
                
                //Add the new student to the table
                const newRow = addStudentToTable(newStudent, table, profileName);
                
                //Add event listeners to the new row
                addEditDelListeners(newRow, originalData, studentModal, modalTitle, modalGroupField, 
                    modalFirstNameField, modalLastNameField, modalGenderField, modalBirthdayField, 
                    deleteModal, deleteMessage, modalStudentId, studentsData);
                
                //Add checkbox listener to new row
                addCheckboxListener(newRow.querySelector('.student-checkbox'));
                
                //Simulate saving the updated data to Students.json
                console.log('Updated Students.json:', JSON.stringify(studentsData, null, 2));  
            } else if (currentModalOperation === 'edit') {
                console.log("Processing edit operation");
                
                //Get student ID from hidden field
                const studentId = modalStudentId.value;
                console.log("Editing student with ID:", studentId);
                
                if (!studentId) {
                    console.error('No student ID found for edit operation');
                    return;
                }
                
                //Find the student by ID
                const studentIndex = studentsData.findIndex(student => student.id === studentId);
                console.log("Found student at index:", studentIndex);
                console.log("Current students data:", studentsData);
                
                if (studentIndex !== -1) {
                    //Create updated student object
                    const updatedName = `${modalFirstNameField.value} ${modalLastNameField.value}`;
                    const updatedGender = modalGenderField.value === 'Male' ? 'M' : 'F';
                    
                    const updatedStudent = {
                        id: studentId,
                        group: modalGroupField.value,
                        name: updatedName,
                        gender: updatedGender,
                        birthday: formattedBirthday,
                        status: studentsData[studentIndex].status //Keep the original status
                    };
                    
                    console.log("Updated student in data:", updatedStudent);
                    
                    //Update the data array and table
                    studentsData[studentIndex] = updatedStudent;
                    updateRowWithStudentData(updatedStudent);
                    
                    //Simulate saving the updated data to Students.json
                    console.log('Updated Students.json:', JSON.stringify(studentsData, null, 2));
                } else {
                    console.error("Student not found in data array with ID:", studentId);
                }
            } 

            studentModal.style.display = 'none';
            clearValidationErrors();

            currentRow = null;   
        }
    });

    //Notification popup
    const notifications = document.getElementById('notifications');
    const notificationsPopup = document.getElementById('notifications-popup');

    if (notifications && notificationsPopup) {
        notifications.addEventListener('mouseenter', function() {
            if (profilePopup) profilePopup.style.display = 'none';
            notificationsPopup.style.display = 'block';
        });

        notificationsPopup.addEventListener('mouseleave', function() {
            notificationsPopup.style.display = 'none';
        });
    }

    //Profile popup
    const profile = document.getElementById('profile');
    const profilePopup = document.getElementById('profile-popup');

    if (profile && profilePopup) {
        profile.addEventListener('mouseenter', function() {
            if (notificationsPopup) notificationsPopup.style.display = 'none';
            profilePopup.style.display = 'block';
        });

        profilePopup.addEventListener('mouseleave', function() {
            profilePopup.style.display = 'none';
        });
    }
});