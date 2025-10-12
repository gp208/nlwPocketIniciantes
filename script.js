// Seletores dos elementos HTML por ID
const elements = {
	promptTitle: document.getElementById('prompt-title'),
	promptContent: document.getElementById('prompt-content'),
	titleWrapper: document.getElementById('title-wrapper'),
	contentWrapper: document.getElementById('content-wrapper'),
	btnOpen: document.getElementById('btn-open'),
	btnCollapse: document.getElementById('btn-collapse'),
  sidebar: document.querySelector('.sidebar'),
}
// Atualiza o estado do wrapper baseado no conteúdo do elemento
function updateEditableWrapperState(element, wrapper) {
	const hasContent = element.textContent.trim().length > 0
  wrapper.classList.toggle('is-empty', !hasContent)
}
// Abre e fecha a sidebar
function openSidebar() {
  elements.sidebar.style.display = 'flex'
  elements.btnOpen.style.display = 'none'
}

function closeSidebar() {
  elements.sidebar.style.display = 'none'
  elements.btnOpen.style.display = 'block'
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
  // Estado inicial: sidebar aberta, botão de abrir oculto
  elements.sidebar.style.display = ''
  elements.btnOpen.style.display = 'none'
  // Eventos para abrir, fechar sidebar
  elements.btnOpen.addEventListener('click', openSidebar)
  elements.btnCollapse.addEventListener('click', closeSidebar)
}

init()