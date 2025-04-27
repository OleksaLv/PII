<?php require APPROOT . '/views/inc/header.php'; ?>

  <div id="content">

  <?php require APPROOT . '/views/inc/navigation.php'; ?>

    <section>
      <h1><?= $data['title'] ?></h1>
      <div id="add">
        <button class="add-btn">+</button>
      </div>
      
      <div id="table-container">
        <table>
          <tr>
            <th>
              <label for="select-all" class="visually-hidden">Select all students</label>
              <input type="checkbox" id="select-all">
            </th>
            <th>Group</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Birthday</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        </table>
      </div>
      
      <div id="pagination">
        <?php
          $currentPage = isset($data['page']) ? (int)$data['page'] : 1; //Default is 1 page if not set
          $totalPages = isset($data['total_pages']) ? (int)$data['total_pages'] : 4; //Default is 4 pages if not set
          
          $prevPage = max(1, $currentPage - 1);
          echo '<a href="' . URLROOT . '/students/index/' . $prevPage . '" class="page-link' . ($currentPage == 1 ? ' disabled' : '') . '">&lt;</a>';
          
          $startPage = max(1, $currentPage - 2);
          $endPage = min($totalPages, $startPage + 4);
          
          //Adjust start page if we're near the end
          if ($endPage - $startPage < 4) {
            $startPage = max(1, $endPage - 4);
          }
          
          for ($i = $startPage; $i <= $endPage; $i++) {
            echo '<a href="' . URLROOT . '/students/index/' . $i . '" class="page-link' . ($i == $currentPage ? ' active' : '') . '">' . $i . '</a>';
          }
          
          $nextPage = min($totalPages, $currentPage + 1);
          echo '<a href="' . URLROOT . '/students/index/' . $nextPage . '" class="page-link' . ($currentPage == $totalPages ? ' disabled' : '') . '">&gt;</a>';
        ?>
      </div>
    </section>
  </div>

  <div id="delete-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <p>Warning</p>
        <button id="close-del-window">x</button>
      </div>
      <hr>
      <div class="modal-body">
        <p id="delete-message">Are you sure you want to delete this student?</p>
      </div>
      <hr>
      <div class="modal-footer">
        <button id="confirm-delete">Ok</button>
        <button id="cancel-delete">Cancel</button>
      </div>
    </div>
  </div>

  <div id="student-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <p id="modal-title">Student Form</p>
        <button id="close-modal-window" type="button">x</button>
      </div>
      <hr>
      <form id="student-form" novalidate>
        <div class="modal-body">
          <div style="display: none;">
            <input type="hidden" id="modal-student-id" name="modal-student-id">
          </div>
          <div>
            <label for="modal-group">Group</label>
            <select id="modal-group" name="modal-group" class="select-field" required>
              <option value="" disabled selected>Select group</option>
              <option value="PZ-31">PZ-31</option>
              <option value="PZ-32">PZ-32</option>
              <option value="PZ-33">PZ-33</option>
              <option value="PZ-34">PZ-34</option>
              <option value="PZ-35">PZ-35</option>
              <option value="PZ-36">PZ-36</option>
            </select>
          </div>
          <div>
            <label for="modal-first-name">First name</label>
            <input type="text" id="modal-first-name" name="modal-first-name" class="input-field" 
              required pattern="[A-Za-z']+([-][A-Za-z']+)*" minlength="2" maxlength="30" 
              title="First name should contain only letters, 2-30 characters long">
          </div>
          <div>
            <label for="modal-last-name">Last name</label>
            <input type="text" id="modal-last-name" name="modal-last-name" class="input-field" 
              required pattern="[A-Za-z']+([-][A-Za-z']+)*" minlength="2" maxlength="30"
              title="Last name should contain only letters, 2-30 characters long">
          </div>
          <div>
            <label for="modal-gender">Gender</label>
            <select id="modal-gender" name="modal-gender" class="select-field" required>
              <option value="" disabled selected>Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>
          <div>
            <label for="modal-birthday">Birthday</label>
            <input type="date" id="modal-birthday" name="modal-birthday" class="input-field" 
              required min="1900-01-01" max="2010-01-01">
          </div>
        </div>
        <hr>
        <div class="modal-footer">
          <button type="submit" id="confirm-modal">Submit</button>
          <button type="button" id="cancel-modal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
  
<?php require APPROOT . '/views/inc/footer.php'; ?>