document.addEventListener('DOMContentLoaded', function() {
    // Select all checkbox functionality
    const selectAllCheckbox = document.getElementById('select-all');
    const studentCheckboxes = document.querySelectorAll('.student-checkbox');
     
    selectAllCheckbox.addEventListener('change', function() {
      studentCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
      });
    });
      
    // Delete button functionality
    const deleteButtons = document.querySelectorAll('.delete-btn');
    const deleteModal = document.getElementById('delete-modal');
    const deleteForm = document.getElementById('delete-form');
    const studentIdsInput = document.getElementById('student-ids-input');
      
    deleteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the student ID from the clicked button
        const clickedStudentId = this.getAttribute('data-student-id');
        
        // Check if any checkboxes are selected
        const selectedCheckboxes = Array.from(studentCheckboxes).filter(checkbox => checkbox.checked);
        
        // If no checkboxes are selected, just use the clicked student's ID
        if (selectedCheckboxes.length === 0) {
          studentIdsInput.value = clickedStudentId;
          deleteForm.action = URLROOT + '/students/delete/' + clickedStudentId;
          document.getElementById('delete-message').textContent = 'Are you sure you want to delete this student?';
        } else {
          // Collect all selected student IDs
          const selectedIds = selectedCheckboxes.map(checkbox => checkbox.getAttribute('data-student-id'));
          
          // Update the hidden input with all selected IDs
          studentIdsInput.value = selectedIds.join(',');
          
          // Update the form action - using underscore (_) as separator instead of plus (+)
          deleteForm.action = URLROOT + '/students/delete/' + selectedIds.join('_');
          
          // Update the confirmation message
          document.getElementById('delete-message').textContent = `Are you sure you want to delete ${selectedIds.length} student(s)?`;
        }
        
        // Show the delete modal
        deleteModal.style.display = 'block';
      });
    });
   
    // Close modal when clicking the close button
    document.getElementById('close-del-window').addEventListener('click', function(e) {
      e.preventDefault();
      deleteModal.style.display = 'none';
    });
   
    // Close modal when clicking Cancel
    document.getElementById('cancel-delete').addEventListener('click', function(e) {
      e.preventDefault();
      deleteModal.style.display = 'none';
    });
});