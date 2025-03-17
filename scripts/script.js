document.addEventListener('DOMContentLoaded', function() {
    let studentsData = [];
    const table = document.querySelector('#table-container table');
    const profileName = document.getElementById('profile-name').textContent;

    //Delete modal
    const deleteModal = document.getElementById('delete-modal');
    const deleteMessage = document.getElementById('delete-message');
    const confirmDelete = document.getElementById('confirm-delete');
    const cancelDelete = document.getElementById('cancel-delete');
    const closeDeleteWindow = document.getElementById('close-del-window');
    let currentStudentName = '';
    let currentRow = null;

    //Student modal
    const studentModal = document.getElementById('student-modal');
    const modalTitle = document.getElementById('modal-title');
    const confirmModal = document.getElementById('confirm-modal');
    const cancelModal = document.getElementById('cancel-modal');
    const closeModalWindow = document.getElementById('close-modal-window');
    const modalGroupField = document.getElementById('modal-group');
    const modalFirstNameField = document.getElementById('modal-first-name');
    const modalLastNameField = document.getElementById('modal-last-name');
    const modalGenderField = document.getElementById('modal-gender');
    const modalBirthdayField = document.getElementById('modal-birthday');
    
    //Current modal operation
    let currentModalOperation = '';
    let originalData = {};

    //Get and fill table data (Works only with live server)
    fetch('data/students.json')
        .then(response => response.json())
        .then(data => {
            studentsData = data;
            data.forEach(student => { 
                const row = addStudentToTable(student);
                
                // Add event listeners to edit and delete buttons of row
                addEditDelListeners(row);
                
                // Add event listener to checkbox
                addCheckboxListener(row.querySelector('.student-checkbox'));
            });

            // Add event listener to the header checkbox
            const selectAllCheckbox = document.getElementById('select-all');
            selectAllCheckbox.addEventListener('change', function() {
                const checkboxes = document.querySelectorAll('.student-checkbox');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = selectAllCheckbox.checked;
                });
            });
        })
        .catch(error => console.error('Error loading student data:', error));

    // Delete modal logic
    cancelDelete.addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });

    confirmDelete.addEventListener('click', function() {
        const rows = table.querySelectorAll('tr:not(:first-child)');
            const checkedRows = Array.from(rows).filter(row => {
            return row.querySelector('.student-checkbox').checked;
        });

        if(checkedRows.length > 1) {
            //Remove the students from the local data
            checkedRows.forEach(row => {
                const studentName = row.cells[2].textContent;
                studentsData = studentsData.filter(student => student.name !== studentName);

                row.remove();
            });
            currentStudentName = '';
            currentRow = null;
        } else if (currentRow) {
             // Remove the student from the local data
             studentsData = studentsData.filter(student => student.name !== currentStudentName);
 
             // Remove the row from the table
             currentRow.remove();
             currentStudentName = '';
             currentRow = null;
        }

        // Simulate saving the updated data to Students.json
        console.log('Updated Students.json:', JSON.stringify(studentsData, null, 2));        

        deleteModal.style.display = 'none';
    });

    closeDeleteWindow.addEventListener('click', function() {
        deleteModal.style.display = 'none';
    });

    //Student modal logic
    document.querySelector('.add-btn').addEventListener('click', function() {
        resetModalFields();
        modalTitle.textContent = 'Add Student';
        currentModalOperation = 'add';
        studentModal.style.display = 'block';
    });

    cancelModal.addEventListener('click', function() {
        studentModal.style.display = 'none';
    });
    
    closeModalWindow.addEventListener('click', function() {
        studentModal.style.display = 'none';
    });
    
    confirmModal.addEventListener('click', function() {
        if (modalGroupField.value && modalFirstNameField.value && modalLastNameField.value && modalGenderField.value && modalBirthdayField.value) {
            // Convert birthday format from yyyy-mm-dd to dd.mm.yyyy
            const birthdayParts = modalBirthdayField.value.split('-');
            const formattedBirthday = `${birthdayParts[2]}.${birthdayParts[1]}.${birthdayParts[0]}`;
            
            if (currentModalOperation === 'add') {
                // Add new student
                const newStudent = {
                    group: modalGroupField.value,
                    name: `${modalFirstNameField.value} ${modalLastNameField.value}`,
                    gender: modalGenderField.value === 'Male' ? 'M' : 'F',
                    birthday: formattedBirthday,
                    status: 'offline'
                };
                
                // Add the new student to the local data
                studentsData.push(newStudent);
    
                // Simulate saving the updated data to Students.json
                console.log('Updated Students.json:', JSON.stringify(studentsData, null, 2));
    
                // Add the new student to the table and get the row
                const newRow = addStudentToTable(newStudent);
    
                // Add event listener to the new checkbox
                const newCheckbox = newRow.querySelector('.student-checkbox');
                addCheckboxListener(newCheckbox);
                
                // Check new checkbox if all checkboxes are checked
                if(document.getElementById('select-all').checked){
                    newCheckbox.checked = true;
                }
    
                // Add event listeners to the new buttons
                addEditDelListeners(newRow);
                
            } else if (currentModalOperation === 'edit') {
                // Check if any data has changed
                if (
                    modalGroupField.value === originalData.group &&
                    modalFirstNameField.value === originalData.firstName &&
                    modalLastNameField.value === originalData.lastName &&
                    modalGenderField.value === originalData.gender &&
                    formattedBirthday === originalData.birthday
                ) {
                    // No changes made, just close the modal
                    studentModal.style.display = 'none';
                    return;
                }
                
                // Update the student
                const studentIndex = studentsData.findIndex(student => 
                    student.name === `${originalData.firstName} ${originalData.lastName}`);
                
                if (studentIndex !== -1) {
                    studentsData[studentIndex] = {
                        group: modalGroupField.value,
                        name: `${modalFirstNameField.value} ${modalLastNameField.value}`,
                        gender: modalGenderField.value === 'Male' ? 'M' : 'F',
                        birthday: formattedBirthday,
                        status: studentsData[studentIndex].status // Keep the original status
                    };

                    // Update the table row
                    currentRow.cells[1].textContent = modalGroupField.value;
                    currentRow.cells[2].textContent = `${modalFirstNameField.value} ${modalLastNameField.value}`;
                    currentRow.cells[3].textContent = modalGenderField.value === 'Male' ? 'M' : 'F';
                    currentRow.cells[4].textContent = formattedBirthday;
                    
                    // Update delete button data-name attribute
                    currentRow.querySelector('.delete-btn').setAttribute('data-name', 
                        `${modalFirstNameField.value} ${modalLastNameField.value}`);

                    // Simulate saving the updated data to Students.json
                    console.log('Updated Students.json:', JSON.stringify(studentsData, null, 2));
                }
            }
            
            // Hide the modal
            studentModal.style.display = 'none';
        } else {
            alert('Please fill in all required fields.');
        }
    });

    // Notification popup
    const notifications = document.getElementById('notifications');
    const notificationsPopup = document.getElementById('notifications-popup');

    notifications.addEventListener('mouseenter', function() {
        profilePopup.style.display = 'none';
        notificationsPopup.style.display = 'block';
    });

    notificationsPopup.addEventListener('mouseleave', function() {
        notificationsPopup.style.display = 'none';
    });

    // Profile popup
    const profile = document.getElementById('profile');
    const profilePopup = document.getElementById('profile-popup');

    profile.addEventListener('mouseenter', function() {
        notificationsPopup.style.display = 'none';
        profilePopup.style.display = 'block';
    });

    profilePopup.addEventListener('mouseleave', function() {
        profilePopup.style.display = 'none';
    });

    //Notification icon animation
    const notificationIcon = document.getElementById('notification-icon');
    const icons = ['icons/bell.png', 'icons/bell-active.png'];
    let currentIconIndex = 0;

    const switchIcon = () => {
        notificationIcon.style.opacity = 0; 
        setTimeout(() => { //Wait for 0.3 seconds and then show other icon
            currentIconIndex = (currentIconIndex + 1) % icons.length;
            notificationIcon.src = icons[currentIconIndex];
            notificationIcon.style.opacity = 1;
        }, 300);
    };

    const intervalId = setInterval(switchIcon, 600); //Do SeitchIcon every 0.6 seconds

    setTimeout(() => {
        clearInterval(intervalId); //Stop animation after 2 seconds
        currentIconIndex = 0;
        notificationIcon.src = icons[0]; 
        notificationIcon.style.opacity = 1;
    }, 2000);

    function addStudentToTable(student) {    

        //Online status if the student is the current user
        if(student.name === profileName){
            student.status = 'online';
        }
        else{ 
            student.status = 'offline';
        }

        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="student-checkbox"></td>
            <td>${student.group}</td>
            <td>${student.name}</td>
            <td>${student.gender}</td>
            <td>${student.birthday}</td>
            <td><div class="${student.status}"></div></td>
            <td>
                <button class="edit-btn"><img src="icons/edit.png" alt="edit"></button>
                <button class="delete-btn" data-name="${student.name}"><img src="icons/delete.png" alt="delete"></button>
            </td>
        `;

        table.appendChild(row);
        return row;
    }
    
    function addEditDelListeners(row) {
        row.querySelector('.edit-btn').addEventListener('click', function() {
            const checkbox = row.querySelector('.student-checkbox');
            const allCheckboxes = document.querySelectorAll('.student-checkbox');
            const checkedCheckboxes = Array.from(allCheckboxes).filter(cb => cb.checked);
            
            if (!checkbox.checked || checkedCheckboxes.length > 1) {
                alert('Select only this student to edit');
                return;
            }

            originalData = {
                group: row.cells[1].textContent,
                firstName: row.cells[2].textContent.split(' ')[0],
                lastName: row.cells[2].textContent.split(' ')[1],
                gender: row.cells[3].textContent === 'M' ? 'Male' : 'Female',
                birthday: row.cells[4].textContent
            };

            //Set form fields with current values
            modalGroupField.value = originalData.group;
            modalFirstNameField.value = originalData.firstName;
            modalLastNameField.value = originalData.lastName;
            modalGenderField.value = originalData.gender;

            //Convert birthday format from dd.mm.yyyy to yyyy-mm-dd
            const birthdayParts = originalData.birthday.split('.');
            const formattedBirthday = `${birthdayParts[2]}-${birthdayParts[1]}-${birthdayParts[0]}`;
            modalBirthdayField.value = formattedBirthday;

            //Configure modal for edit operation
            modalTitle.textContent = 'Edit Student';
            currentModalOperation = 'edit';
            studentModal.style.display = 'block';
            currentRow = row;
        });

        row.querySelector('.delete-btn').addEventListener('click', function() {
            const checkbox = row.querySelector('.student-checkbox');
            if (!checkbox.checked) {
                alert('Select it first');
                return;
            }
            currentRow = row;
            const allCheckboxes = document.querySelectorAll('.student-checkbox');
            const allChecked = Array.from(allCheckboxes).filter(cb => cb.checked);
            currentStudentName = allChecked.length === 1 ? this.getAttribute('data-name') :'ALL selected students';           

            deleteMessage.textContent = `Are you sure you want to delete ${currentStudentName}?`;
            deleteModal.style.display = 'block';
        });
    }

    function addCheckboxListener(checkbox){
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

    function resetModalFields() {
        modalGroupField.value = '';
        modalFirstNameField.value = '';
        modalLastNameField.value = '';
        modalGenderField.value = '';
        modalBirthdayField.value = '';
    }
});