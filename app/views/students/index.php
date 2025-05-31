<?php require APPROOT . '/views/inc/header.php'; ?>

  <div id="content">

  <?php require APPROOT . '/views/inc/navigation.php'; ?>

    <section>
      <h1><?= $data['title'] ?></h1>
      <?php flash('student_message'); ?>
      <div id="add">
        <a href="<?= URLROOT ?>/students/add" class="add-btn">+</a>
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
          <?php foreach($data['students'] as $student): ?>
      <tr>
        <td>
          <label for="select-student-<?= $student->id ?>" class="visually-hidden">Select <?= $student->name ?></label>
          <input type="checkbox" class="student-checkbox" id="select-student-<?= $student->id ?>" data-student-id="<?= $student->id ?>">
        </td>
        <td><?= $student->group_name ?></td>
        <td><?= $student->first_name . " " . $student->last_name ?></td>
        <td><?= ($student->gender == 'male') ? 'M' : 'F' ?></td>
        <td><?= $student->birthday ?></td>
        <td><div class="offline"></div></td>
        <td>
          <a href="<?= URLROOT ?>/students/edit/<?= $student->id ?>" class="edit-btn">✎</a>
          <a href="javascript:void(0);" class="delete-btn" data-student-id="<?= $student->id ?>">x</a>
        </td>
      </tr>
    <?php endforeach; ?>
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

  <!-- Delete Modal -->
  <div id="delete-modal" class="modal" style="display: <?= (isset($data['modal_window']) && ($data['modal_window'] == 'delete')) ? 'block' : 'none'?>">
    <div class="modal-content">
      <div class="modal-header">
        <p>Warning</p>
        <a href="<?= URLROOT ?>/students" id="close-del-window">x</a>
      </div>
      <hr>
      <div class="modal-body">
        <p id="delete-message">Are you sure you want to delete the selected student(s)?</p>
      </div>
      <hr>
      <div class="modal-footer">
        <form action="<?= URLROOT ?>/students/delete/" method="post" id="delete-form">
          <input type="hidden" name="student_ids" id="student-ids-input">
          <button type="submit" id="confirm-delete">Delete</button>
          <a href="<?= URLROOT ?>/students" id="cancel-delete">Cancel</a>
        </form>
      </div>
    </div>
  </div>

  <!-- Add/Edit Student Modal -->
  <div id="student-modal" class="modal" style="display: 
  <?= (isset($data['modal_window']) && ($data['modal_window'] == 'add' || $data['modal_window'] == 'edit')) ? 'block' : 'none'?>">
    <div class="modal-content">
      <div class="modal-header">
        <p id="modal-title"><?= (isset($data['modal_window']) && $data['modal_window'] == 'edit') ? 'Edit Student' : 'Add Student' ?></p>
        <a href="<?= URLROOT ?>/students" id="close-modal-window" type="button">x</a>
      </div>
      <hr>
      <form action="<?= URLROOT ?>/students/<?= (isset($data['modal_window']) && $data['modal_window'] == 'edit') ? 'edit/' . $data['student_id'] : 'add' ?>" method="post" id="student-form">
        <div class="modal-body">
          <div>
            <label for="modal-group">Group<sup>*</sup></label>
            <select id="modal-group" name="modal-group" class="select-field <?= (!empty($data['group_id_err'])) ? 'is-invalid' : '' ?>">
              <option value="" disabled <?= empty($data['group_id']) ? 'selected' : '' ?>>Select group</option>
              <?php if(isset($data['groups'])): ?>
                <?php foreach($data['groups'] as $group): ?>
                  <option value="<?= $group->id ?>" <?= (isset($data['group_id']) && $data['group_id'] == $group->id) ? 'selected' : '' ?>><?= $group->name ?></option>
                <?php endforeach; ?>
              <?php endif; ?>
            </select>
            <span class="invalid-feedback"><?= $data['group_id_err'] ?? '' ?></span>
          </div>
          <div>
            <label for="modal-first-name">First name<sup>*</sup></label>
            <input type="text" id="modal-first-name" name="modal-first-name" 
              class="input-field <?= (!empty($data['name_err'])) ? 'is-invalid' : '' ?>" 
              value="<?= $data['first_name'] ?? '' ?>"
              pattern="[A-Za-z']+([-][A-Za-z']+)*" minlength="2" maxlength="30" 
              title="First name should contain only letters, 2-30 characters long">
            <span class="invalid-feedback"><?= $data['name_err'] ?? '' ?></span>
          </div>
          <div>
            <label for="modal-last-name">Last name<sup>*</sup></label>
            <input type="text" id="modal-last-name" name="modal-last-name" 
              class="input-field <?= (!empty($data['name_err'])) ? 'is-invalid' : '' ?>" 
              value="<?= $data['last_name'] ?? '' ?>"
              pattern="[A-Za-z']+([-][A-Za-z']+)*" minlength="2" maxlength="30"
              title="Last name should contain only letters, 2-30 characters long">
          </div>
          <div>
            <label for="modal-gender">Gender<sup>*</sup></label>
            <select id="modal-gender" name="modal-gender" 
              class="select-field <?= (!empty($data['gender_err'])) ? 'is-invalid' : '' ?>">
              <option value="" disabled <?= empty($data['gender']) ? 'selected' : '' ?>>Select gender</option>
              <option value="female" <?= (isset($data['gender']) && $data['gender'] == 'female') ? 'selected' : '' ?>>Female</option>
              <option value="male" <?= (isset($data['gender']) && $data['gender'] == 'male') ? 'selected' : '' ?>>Male</option>
            </select>
            <span class="invalid-feedback"><?= $data['gender_err'] ?? '' ?></span>
          </div>
          <div>
            <label for="modal-birthday">Birthday<sup>*</sup></label>
            <input type="date" id="modal-birthday" name="modal-birthday" 
              class="input-field <?= (!empty($data['birthday_err'])) ? 'is-invalid' : '' ?>" 
              value="<?= $data['birthday'] ?? '' ?>"
              min="1900-01-01" max="2010-01-01">
            <span class="invalid-feedback"><?= $data['birthday_err'] ?? '' ?></span>
          </div>
        </div>
        <hr>
        <div class="modal-footer">
          <button type="submit" id="confirm-modal"><?= (isset($data['modal_window']) && $data['modal_window'] == 'edit') ? 'Update' : 'Submit' ?></button>
          <a href="<?= URLROOT ?>/students" id="cancel-modal" class="btn-cancel">Cancel</a>
        </div>
      </form>
    </div>
  </div>

  <script src="<?= URLROOT ?>/js/students/index.js"></script>
<?php require APPROOT . '/views/inc/footer.php'; ?>