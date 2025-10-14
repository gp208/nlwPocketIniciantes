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
	btnSave: document.getElementById('btn-save'),
	list: document.getElementById('prompt-list'),
	search: document.getElementById('search-input'),
	btnNew: document.getElementById('btn-new')
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
		const existingPrompt = state.prompts.find(p => p.id === state.selectedId)
		if (existingPrompt) {
			existingPrompt.title = title || 'Sem título'
			existingPrompt.content = content || 'Sem conteúdo'
		}
	} else { // Criando um novo prompt
		const newPrompt = {id: Date.now().toString(36), title, content}
		state.prompts.unshift(newPrompt)
		state.selectedId = newPrompt.id
	}

	renderList(elements.search.value)
	persist()
}

function persist() {
	try {localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts))}
	catch (error) {console.error('Erro ao salvar no localStorage:', error)}
}

function load() {
	try {
		const stored = localStorage.getItem(STORAGE_KEY)
		state.prompts = stored ? JSON.parse(stored) : []
		state.selectedId = null
	} catch (error) {console.error('Erro ao carregar do localStorage:', error)}
}

function createPromptItem(prompt) {
	return `
		<li class='prompt-item' data-id='${prompt.id}' data-action='select'>
			<div class='prompt-item-content'>
				<span class='prompt-item-title'>${prompt.title}</span>
				<span class='prompt-item-description'>${prompt.content}</span>
			</div>

			<button class='btn-icon' title='Remover' data-action='remove'>
				<img src='assets/remove.svg' alt='Remover' class='icon icon-trash' />
			</button>
		</li>
	`
}

function renderList(filterText = '') {
	const filteredPrompts = state.prompts.filter((prompt) =>
		prompt.title.toLowerCase().includes(filterText.toLowerCase().trim())
	).map((p) => createPromptItem(p)).join('')
	elements.list.innerHTML = filteredPrompts
}

function newPrompt() {
	state.selectedId = null
	elements.promptTitle.textContent = ''
	elements.promptContent.textContent = ''
	updateAllEditableStates()
	elements.promptTitle.focus()
}
// Eventos
elements.btnSave.addEventListener('click', save)
elements.btnNew.addEventListener('click', newPrompt)
elements.search.addEventListener('input', (event) => {renderList(event.target.value)})
elements.list.addEventListener('click', (event) => {
	const removeBtn = event.target.closest('button[data-action="remove"]')
	const item = event.target.closest('[data-id]')
	if (!item) return
	const id = item.getAttribute('data-id')
	state.selectedId = id
	if (removeBtn) { // Remover prompt
		state.prompts = state.prompts.filter(p => p.id !== id)
		renderList(elements.search.value)
		persist()
		return
	}
	if (event.target.closest('[data-action="select"]')) { // Selecionar prompt
		const prompt = state.prompts.find(p => p.id === id)
		if (prompt) {
			elements.promptTitle.textContent = prompt.title
			elements.promptContent.innerHTML = prompt.content
			updateAllEditableStates()
		}
	}
})

function init() {
	load()
	renderList('')
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