const voteOption = document.querySelector("#vote-option");
const signupOption = document.querySelector("#signup-option");
const consultOption = document.querySelector("#consult-option");

const voteContent = document.querySelector("#vote-content");
const signupContent = document.querySelector("#signup-content");
const consultContent = document.querySelector("#consult-content");

voteOption.addEventListener("click", function () {
  showContent(voteContent);
});

signupOption.addEventListener("click", function () {
  showContent(signupContent);
});

consultOption.addEventListener("click", function () {
  showContent(consultContent);
});

function showContent(contentToShow) {
  // Esconde todos os conteúdos
  voteContent.style.display = "none";
  signupContent.style.display = "none";
  consultContent.style.display = "none";

  // Mostra o conteúdo selecionado
  contentToShow.style.display = "block";
}

function toggleElement() {
  elementVisible =
    elementVisible === "hidden"
      ? (elementVisible = "visible")
      : (elementVisible = "hidden");

  voteContent.style.visiblity = elementVisible;
}
