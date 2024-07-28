let color_bar = document.getElementsByClassName("color_bar");
let length = color_bar.length;
if (length !== 0) {
  for (let i = 0; i < length; i++) {
    let value = color_bar[`${i}`].innerText;
    color_bar[`${i}`].style.width = value;
  }
}

let drop_down_head = document.getElementsByClassName("drop_down_head");
length = drop_down_head.length;
if (length !== 0) {
  for (let i = 0; i < length; i++) {
    let ele = drop_down_head[i];
    ele.addEventListener("click", () => {
      let drop_down_item = ele.nextElementSibling.nextElementSibling;

      if (drop_down_item.classList.contains("drop_down_show")) {
        drop_down_item.classList.remove("drop_down_show");
      } else {
        drop_down_item.setAttribute("class", "drop_down_item drop_down_show");
      }
    });
  }
}

let button = document.getElementById("add_subject_above");
if (button) {
  let countSubjects = 1;
  button.addEventListener("click", (event) => {
    countSubjects++;
    let div = document.createElement("div");
    div.setAttribute("class", "mb-3");
    div.innerHTML = `<label for="subject${countSubjects}" class="form-label">Subject-${countSubjects}</label>
  <input
    id="subject${countSubjects}"
    class="form-control"
    type="text"
    name="subject${countSubjects}"
    required
  />
  
  <div class="invalid-feedback">Enter Subject Name</div>`;
    let parent = button.parentElement;
    parent.insertBefore(div, button);
  });
}

let edit_add_subject_button = document.getElementById("add_subject_above_edit");
if (edit_add_subject_button) {
  let countSubjects = 0;
  edit_add_subject_button.addEventListener("click", (event) => {
    countSubjects++;
    let div = document.createElement("div");
    div.setAttribute("class", "edit_box");
    div.innerHTML = `
          <div class="text-center fs-4 text-decoration-underline">
            New Subject${countSubjects}
          </div>

         <div class="row" style="color: black">
            <div class="col-12 col-md-4 mb-3">
              <label for="newSubject${countSubjects}[_name]" class="form-label">
                Subject Name
              </label>
              <input
                name="newSubject${countSubjects}[_name]"
                type="text"
                class="form-control"
                id="newSubject${countSubjects}[_name]"
                required
              />
              <div class="invalid-feedback">Please Fill Info</div>
            </div>
            <div class="col-12 col-md-4 mb-3">
              <label for="newSubject${countSubjects}[_TotalDays]" class="form-label">
                Total Lectures
              </label>
              <input
                name="newSubject${countSubjects}[_TotalDays]"
                value="0"
                type="number"
                class="form-control"
                id="newSubject${countSubjects}[_TotalDays]"
                required
              />
              <div class="invalid-feedback">Please Fill Info</div>
            </div>
            <div class="col-12 col-md-4 mb-3">
              <label for="newSubject${countSubjects}[_AttendDays]" class="form-label">
                Lectures Attended
              </label>
              <input
                name="newSubject${countSubjects}[_AttendDays]"
                value="0"
                type="number"
                class="form-control"
                id="newSubject${countSubjects}[_AttendDays]"
                required
              />
              <div class="invalid-feedback">Please Fill Info</div>
            </div>
          </div>
    `;
    let parent = edit_add_subject_button.parentElement;
    parent.insertBefore(div, edit_add_subject_button);

    let hr = document.createElement("hr");
    parent.insertBefore(hr, edit_add_subject_button);
  });
}

function getName() {
  let website = window.location.href;
  let parts = website.split("/");
  let WEBSITE_NAME = parts[2];
  console.log(WEBSITE_NAME);
  return WEBSITE_NAME;
}

let input_subject = document.getElementsByClassName("input_check_box1");
if (input_subject.length > 0) {
  for (let input of input_subject) {
    input.addEventListener("change", () => {
      let studentId = input.id;
      let subjectId = input.name;
      let website_name = getName();
      if (input.checked) {
        const present = async () => {
          let response = await axios.post(
            `https://${website_name}/sent/${studentId}/present/${subjectId}`
          );
        };

        present();
      } else {
        const removePresent = async () => {
          let response = await axios.post(
            `https://${website_name}/sent/${studentId}/removePresent/${subjectId}`
          );
        };

        removePresent();
      }
    });
  }
}

let input_subject2 = document.getElementsByClassName("input_check_box2");
if (input_subject2.length > 0) {
  for (let input of input_subject2) {
    input.addEventListener("change", () => {
      let studentId = input.id;
      let subjectId = input.name;
      let website_name = getName();
      if (input.checked) {
        const absent = async () => {
          let response = await axios.post(
            `https://${website_name}/sent/${studentId}/absent/${subjectId}`
          );
        };

        absent();
      } else {
        const removeAbsent = async () => {
          let response = await axios.post(
            `https://${website_name}/sent/${studentId}/removeAbsent/${subjectId}`
          );
        };

        removeAbsent();
      }
    });
  }
}

let saveButton = document.getElementById("save_Button");
if (saveButton) {
  saveButton.addEventListener("click", () => {
    location.reload();
  });
}
