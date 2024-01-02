/* Próximas features:
  - remover palavra
  - remover categoria
  - editar palavra
  - editar categoria
  - não adicionar categoria já existente
  - não adicionar palavra já existente
  - não adicionar tradução já existente
  - refatorar o sistema para seguir a estrutura do dictionary:
    {
      "categories": [
        {
          "name": "cores",
          "words": [
            {
              "word": "blue",
              "translation": "azul"
            }
          ]
        }
      ]
    }

    dictionary.categories[0].name;
    dictionary.categories[0].words[0].word;
    dictionary.categories[0].words[0].translation;
*/

// Variáveis globais

const dictionary = []; // Object
const categories = []; // String

// Mapeamento de elementos

const showNewWordButton = document.querySelector("#show-new-word-input");
const showNewCategoryButton = document.querySelector("#show-new-category-input");
const cancelNewWordButton = document.querySelector("#cancel-new-word-button");
const cancelNewCategoryButton = document.querySelector("#cancel-new-category-button");
const addNewWordButton = document.querySelector("#add-new-word-button");
const addNewCategoryButton = document.querySelector("#add-new-category-button");

// Funções auxiliares

function clearInputField(inputField) {
  inputField.value = inputField.value && "";
}

const getInputValue = (inputField) => inputField.value;
const capitalizeWord = (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

// Funções construtoras

function buildNewCategory(category) {
  let capitalizedCategory = capitalizeWord(category);

  return `<option value=${category}>${capitalizedCategory}</option>`;
}

function buildNewWord(word, translation) {
  let capitalizedWord = capitalizeWord(word)
  let capitalizedTranslation = capitalizeWord(translation);

  return (
    `<tr>
      <td>${capitalizedWord}</td>
      <td>${capitalizedTranslation}</td>
    </tr>`
  );
}

// Outras funções

function showNewWordInput() {
  const newWordInputWrap = document.querySelector("#new-word-input-wrap");

  newWordInputWrap.classList.remove("hidden");
  this.classList.add("hidden");
}

function cancelAddNewWord() {
  const showNewWordButton = document.querySelector("#show-new-word-input");
  const newWordInputWrap = document.querySelector("#new-word-input-wrap");

  newWordInputWrap.classList.add("hidden");
  showNewWordButton.classList.remove("hidden");
}

function showNewCategoryInput() {
  const newCategoryInputWrap = document.querySelector("#new-category-input-wrap");

  newCategoryInputWrap.classList.remove("hidden");
  this.classList.add("hidden");
}

function cancelAddNewCategory() {
  const showNewCategoryButton = document.querySelector("#show-new-category-input");
  const newCategoryInputWrap = document.querySelector("#new-category-input-wrap");

  newCategoryInputWrap.classList.add("hidden");
  showNewCategoryButton.classList.remove("hidden");
}

function addNewWord(word, translation, category) {
  const tbodyContainer = document.querySelector(`#${category}`);
  const wordInput = document.querySelector("#new-word-input");
  const selectInput = document.querySelector("select");
  const translationInput = document.querySelector("#new-translation-input");
  let capitalizedCategory = capitalizeWord(category);

  if (tbodyContainer) {
    const table = tbodyContainer.closest("table");
    const caption = table.querySelector("caption");
    const td = table.querySelector("tfoot td");
    let tr = buildNewWord(word, translation)

    caption.textContent = capitalizedCategory;
    tbodyContainer.innerHTML += tr;
    td.textContent = Number(td.textContent) + 1;
  } else {
    const container = document.querySelector("#strawberry");
    let capitalizedWord = capitalizeWord(word);
    let capitalizedTranslation = capitalizeWord(translation);
    
    let table =
      `<table>
        <caption>${capitalizedCategory}</caption>
        <thead>
          <th>Palavra</th>
          <th>Tradução</th>
        </thead>
        <tbody id=${category}>
          <tr>
            <td>${capitalizedWord}</td>
            <td>${capitalizedTranslation}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <th>Total</th>
            <td>1</td>
          </tr>
        </tfoot>
      </table>`;

    container.innerHTML += table;
  }

  clearInputField(wordInput);
  clearInputField(translationInput);
  wordInput.focus();

  newWordSuccess();
  saveWord(word, translation, category);
}

function newWordSuccess() {
  const TIME_DELAY_1 = 300;
  const TIME_DELAY_2 = 1500;
  const newWordSuccess = document.querySelector("#new-word-success");

  setTimeout(() => {
    newWordSuccess.classList.remove("hidden");
  }, TIME_DELAY_1);

  setTimeout(() => {
    newWordSuccess.classList.add("hidden");
  }, TIME_DELAY_2);
}

function newCategorySuccess() {
  const TIME_DELAY_1 = 300;
  const TIME_DELAY_2 = 1500;
  const newCategorySuccess = document.querySelector("#new-category-success");

  setTimeout(() => {
    newCategorySuccess.classList.remove("hidden");
  }, TIME_DELAY_1);

  setTimeout(() => {
    newCategorySuccess.classList.add("hidden");
  }, TIME_DELAY_2);
}

function addNewCategory(category) {
  const newCategoryInput = document.querySelector("#new-category-input");
  const container = document.querySelector("select");

  let option = buildNewCategory(category);

  container.innerHTML += option;
  clearInputField(newCategoryInput);
  newCategoryInput.focus();

  newCategorySuccess();
  saveCategory(category);
}

// Funções de armazenamento

function saveWord(word, translation, category) {
  dictionary.push({
    word: word,
    translation: translation,
    category: category
  });

  localStorage.setItem("dictionary", JSON.stringify(dictionary));
}

function saveCategory(category) {
  categories.push(category);

  localStorage.setItem("categories", JSON.stringify(categories));
}

function loadWords() {
  const storedDictionary = JSON.parse(localStorage.getItem("dictionary"));
  const storedCategories = JSON.parse(localStorage.getItem("categories"));

  if (storedDictionary) {
    for (const words of storedDictionary) {
      !dictionary && dictionary.push(words);

      const {word, translation, category} = words;
      addNewWord(word, translation, category);
    }
  }

  if (storedCategories) {
    storedCategories.forEach(storedCategory => {
      !categories && categories.push(storedCategory);
  
      addNewCategory(storedCategory);
    });
  }
}

// Eventos

showNewWordButton.addEventListener("click", showNewWordInput);
showNewCategoryButton.addEventListener("click", showNewCategoryInput);
cancelNewWordButton.addEventListener("click", cancelAddNewWord);
cancelNewCategoryButton.addEventListener("click", cancelAddNewCategory);
addNewWordButton.addEventListener("click", () => {
  const newWordInputField = document.querySelector("#new-word-input");
  const newTranslationInputField = document.querySelector("#new-translation-input");
  const selectInput = document.querySelector("select");

  let word = getInputValue(newWordInputField)
  let translation = getInputValue(newTranslationInputField);
  let category = getInputValue(selectInput);

  addNewWord(word, translation, category);
});
addNewCategoryButton.addEventListener("click", () => {
  const newCategoryInput = document.querySelector("#new-category-input");
  let category = newCategoryInput.value;

  addNewCategory(category);
});
window.addEventListener("load", () => {
  // Limpando campos de entrada
  const wordInput = document.querySelector("#new-word-input");
  const translationInput = document.querySelector("#new-translation-input");
  const selectInput = document.querySelector("select");

  clearInputField(wordInput);
  clearInputField(translationInput);
  clearInputField(selectInput);

  // Carregando dados do armazenamento
  loadWords();
});