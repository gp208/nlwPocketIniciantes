// Chave para identificar dados salvos pela aplicação no navegaor
const STORAGE_KEY = 'prompt-storage'
// Estado para carregar prompts salvos e exibir
const state = {
	prompts: [],
	selectedId: null
}
// Seletores dos elementos HTML por ID
const elements = {
	promptTitle: document.getElementById('prompt-title'),
	promptContent: document.getElementById('prompt-content'),
	titleWrapper: document.getElementById('title-wrapper'),
	contentWrapper: document.getElementById('content-wrapper'),
	btnOpen: document.getElementById('btn-open'),
	btnCollapse: document.getElementById('btn-collapse'),
  sidebar: document.querySelector('.sidebar'),
	btnSave: document.getElementById('btn-save')
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

function save() {
	const title = elements.promptTitle.textContent.trim()
  const content = elements.promptContent.innerHTML.trim()
  const hasContent = elements.promptContent.textContent.trim()

  if (!title || !hasContent) {
    alert('Título e conteúdo não podem estar vazios.')
    return
  }

	if (state.selectedId) { // Editando um prompt existente
	} else { // Criando um novo prompt
		const newPrompt = {id: Date.now().toString(36), title, content}
		state.prompts.unshift(newPrompt)
		state.selectedId = newPrompt.id
	}

	persist()
}

function persist() {
	try {localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts))}
	catch (error) {console.error('Erro ao salvar no localStorage:', error)}
}
// Eventos dos botões
elements.btnSave.addEventListener('click', save)

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