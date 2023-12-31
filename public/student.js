let color_bar = document.getElementsByClassName("color_bar");
let length = color_bar.length;
if (length !== 0) {
  for (let i = 0; i < length; i++) {
    let value = color_bar[`${i}`].innerText;
    color_bar[`${i}`].style.width = value;
    console.log(value);
  }
  console.log("width set");
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
  console.log("Dropdown Head Set");
}

let countSubjects = 1;
let button = document.getElementById("add_subject_above");
if (button) {
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
  <div class="valid-feedback">Looks good!</div>
  <div class="invalid-feedback">Enter Subject Name</div>`;
    let parent = button.parentElement;
    parent.insertBefore(div, button);
  });
}
