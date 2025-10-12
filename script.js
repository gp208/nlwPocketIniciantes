// Seletores dos elementos HTML por ID
const elements = {
	promptTitle: document.getElementById('prompt-title'),
	promptContent: document.getElementById('prompt-content'),
	titleWrapper: document.getElementById('title-wrapper'),
	contentWrapper: document.getElementById('content-wrapper'),
}
// Atualiza o estado do wrapper baseado no conteúdo do elemento
function updateEditableWrapperState(element, wrapper) {
	const hasContent = element.textContent.trim().length > 0
  wrapper.classList.toggle('is-empty', !hasContent)
}
// Atualiza o estado de todos os elementos editáveis
function updateAllEditableStates() {
	updateEditableWrapperState(elements.promptTitle, elements.titleWrapper);
	updateEditableWrapperState(elements.promptContent, elements.contentWrapper);
}
// Adiciona ouvintes de input para atualizar wrappers em tempo real
function attachAllEditableHandlers() {
  elements.promptTitle.addEventListener('input', () => {
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  })

  elements.promptContent.addEventListener('input', () => {
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
  })
}

function init() {
	attachAllEditableHandlers()
	updateAllEditableStates()
}

init()