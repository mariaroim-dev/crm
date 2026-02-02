async function getClientData() {
  const response = await fetch('http://localhost:3000/api/clients');

  return response.json();
}

async function postNewClient(clientData) {
  const response = await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify(clientData),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json();
}

async function updateClient(clientId, updatedClient) {
  const response = await fetch(`http://localhost:3000/api/clients/${clientId}`, {
    method: 'PATCH',
    body: JSON.stringify(updatedClient),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}

async function deleteClient(client) {
  await fetch(`http://localhost:3000/api/clients/${client.id}`, {
    method: 'DELETE',
  });
}

const addNewClient = document.getElementById('new-client');
const modal = document.getElementById('modal');
const modalContainer = document.getElementById('modal-container');
const modalForm = document.querySelector('#modal-form');
const contacts = document.querySelector('#contacts');
const closeModal = document.getElementById('modal-btn-close');
const cancelModal = document.getElementById('modal-btn-cancel');

const thId = document.getElementById('table-head-id');
const thFullName = document.getElementById('table-head-name');
const thCreation = document.getElementById('table-head-creation');
const thLastChange = document.getElementById('table-head-last-change');

const searchInput = document.getElementById('search-input');

function getClientItem(client) {
  const id = client.id;
  const fullName = `${client.surname} ${client.name} ${client.lastName}`;
  const createdAt = formatDate(client.createdAt);
  const updatedAt = formatDate(client.updatedAt);

  const tdId = document.createElement('td');
  tdId.classList.add('clients__table-data', 'clients__table-data--id');
  tdId.textContent = id;

  const tdFullName = document.createElement('td');
  tdFullName.classList.add('clients__table-data');
  tdFullName.textContent = fullName;

  const tdCreatedAt = document.createElement('td');
  tdCreatedAt.classList.add('clients__table-data');
  tdCreatedAt.appendChild(createdAt);

  const tdUpdatedAt = document.createElement('td');
  tdUpdatedAt.classList.add('clients__table-data');
  tdUpdatedAt.appendChild(updatedAt);

  const tdContacts = document.createElement('td');
  tdContacts.classList.add('clients__table-data');
  const iconGroupWrapper = document.createElement('div');
  iconGroupWrapper.classList.add('clients__table-contacts', 'flex');

  client.contacts.forEach(contact => {
    const { type, value } = contact;
    const tooltipText = `${type}: ${value}`;

    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('clients__table-contact');
    iconWrapper.setAttribute('data-tooltip', tooltipText);
    iconWrapper.setAttribute('tabindex', '0');

    const svgIcon = getSvgIcon(contact.type);
    iconWrapper.innerHTML = svgIcon;

    iconGroupWrapper.appendChild(iconWrapper);
  });

  const tdActionsBtn = document.createElement('td');
  tdActionsBtn.classList.add('clients__table-data', 'clients__table-data--actions');
  tdActionsBtn.setAttribute('collspan', '2');

  const actionsBtnwrapper = document.createElement('div');
  actionsBtnwrapper.classList.add('clients__actions-btn-wrapper', 'flex');

  const modifyBtnWrapper = document.createElement('div');
  const modifyBtn = document.createElement('button');
  modifyBtnWrapper.classList.add('clients__table-btn-wrapper', 'flex');
  modifyBtn.classList.add('clients__table-btn', 'clients__table-update-btn');
  modifyBtnWrapper.innerHTML =
    `  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.7" clip-path="url(#clip0_121_2280)">
<path d="M2 11.5V14H4.5L11.8733 6.62662L9.37333 4.12662L2 11.5ZM13.8067 4.69329C14.0667 4.43329 14.0667 4.01329 13.8067 3.75329L12.2467 2.19329C11.9867 1.93329 11.5667 1.93329 11.3067 2.19329L10.0867 3.41329L12.5867 5.91329L13.8067 4.69329Z" fill="#9873FF"/>
</g>
<defs>
<clipPath id="clip0_121_2280">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>`;
  modifyBtn.textContent = 'Изменить';

  const deleteBtnWrapper = document.createElement('div');
  const deleteBtn = document.createElement('button');
  deleteBtnWrapper.classList.add('clients__table-btn-wrapper', 'flex')
  deleteBtn.classList.add('clients__table-btn', 'clients__table-delete-btn');
  deleteBtnWrapper.innerHTML =
    `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.7" clip-path="url(#clip0_121_2305)">
<path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#F06A4D"/>
</g>
<defs>
<clipPath id="clip0_121_2305">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>`;
  deleteBtn.textContent = 'Удалить';

  const tr = document.createElement('tr');
  tr.classList.add('clients__table-row');

  tdContacts.appendChild(iconGroupWrapper);
  modifyBtnWrapper.appendChild(modifyBtn);
  deleteBtnWrapper.appendChild(deleteBtn);
  actionsBtnwrapper.appendChild(modifyBtnWrapper);
  actionsBtnwrapper.appendChild(deleteBtnWrapper);
  tdActionsBtn.appendChild(actionsBtnwrapper);

  tr.appendChild(tdId);
  tr.appendChild(tdFullName);
  tr.appendChild(tdCreatedAt);
  tr.appendChild(tdUpdatedAt);
  tr.appendChild(tdContacts);
  tr.appendChild(tdActionsBtn);

  modifyBtn.addEventListener('click', () => {
    createEditModal(client);
  });

  deleteBtn.addEventListener('click', () => {
    createDeleteModal(client);
    modalOpen();
  });

  return tr;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  const optionsDate = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const optionsTime = { hour: '2-digit', minute: '2-digit' };

  const datePart = date.toLocaleDateString('ru-RU', optionsDate);
  const timePart = date.toLocaleTimeString('ru-RU', optionsTime);

  const dateSpan = document.createElement('span');
  dateSpan.classList.add('clients__table-date');
  dateSpan.textContent = datePart;

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('clients__table-time');
  timeSpan.textContent = timePart;

  const container = document.createElement('div');
  container.classList.add('clients__date-time-container', 'flex');

  container.appendChild(dateSpan);
  container.appendChild(timeSpan);

  return container;
}

function getSvgIcon(type) {
  let svgIcon = '';

  switch (type) {
    case 'Телефон':
      svgIcon =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g
      opacity="0.7">
      <circle cx="8" cy="8" r="8" fill="#9873FF"/>
      <path d="M11.56 9.50222C11.0133 9.50222 10.4844 9.41333 9.99111 9.25333C9.83556 9.2 9.66222 9.24 9.54222 9.36L8.84444 10.2356C7.58667 9.63556 6.40889 8.50222 5.78222 7.2L6.64889 6.46222C6.76889 6.33778 6.80444 6.16444 6.75556 6.00889C6.59111 5.51556 6.50667 4.98667 6.50667 4.44C6.50667 4.2 6.30667 4 6.06667 4H4.52889C4.28889 4 4 4.10667 4 4.44C4 8.56889 7.43556 12 11.56 12C11.8756 12 12 11.72 12 11.4756V9.94222C12 9.70222 11.8 9.50222 11.56 9.50222Z" fill="white"/>
      </g
      </svg>`;
      break;
    case 'Email':
      svgIcon =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM4 5.75C4 5.3375 4.36 5 4.8 5H11.2C11.64 5 12 5.3375 12 5.75V10.25C12 10.6625 11.64 11 11.2 11H4.8C4.36 11 4 10.6625 4 10.25V5.75ZM8.424 8.1275L11.04 6.59375C11.14 6.53375 11.2 6.4325 11.2 6.32375C11.2 6.0725 10.908 5.9225 10.68 6.05375L8 7.625L5.32 6.05375C5.092 5.9225 4.8 6.0725 4.8 6.32375C4.8 6.4325 4.86 6.53375 4.96 6.59375L7.576 8.1275C7.836 8.28125 8.164 8.28125 8.424 8.1275Z" fill="#9873FF"/>
      </svg>`;
      break;
    case 'Facebook':
      svgIcon =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g
        opacity="0.7">
        <path d="M7.99999 0C3.6 0 0 3.60643 0 8.04819C0 12.0643 2.928 15.3976 6.75199 16V10.3775H4.71999V8.04819H6.75199V6.27309C6.75199 4.25703 7.94399 3.14859 9.77599 3.14859C10.648 3.14859 11.56 3.30121 11.56 3.30121V5.28514H10.552C9.55999 5.28514 9.24799 5.90362 9.24799 6.53815V8.04819H11.472L11.112 10.3775H9.24799V16C11.1331 15.7011 12.8497 14.7354 14.0879 13.2772C15.3261 11.819 16.0043 9.96437 16 8.04819C16 3.60643 12.4 0 7.99999 0Z" fill="#9873FF"/>
        </g>
        </svg>`;
      break;
    case 'VK':
      svgIcon =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g
      opacity="0.7">
      <path d="M8 0C3.58187 0 0 3.58171 0 8C0 12.4183 3.58187 16 8 16C12.4181 16 16 12.4183 16 8C16 3.58171 12.4181 0 8 0ZM12.058 8.86523C12.4309 9.22942 12.8254 9.57217 13.1601 9.97402C13.3084 10.1518 13.4482 10.3356 13.5546 10.5423C13.7065 10.8371 13.5693 11.1604 13.3055 11.1779L11.6665 11.1776C11.2432 11.2126 10.9064 11.0419 10.6224 10.7525C10.3957 10.5219 10.1853 10.2755 9.96698 10.037C9.87777 9.93915 9.78382 9.847 9.67186 9.77449C9.44843 9.62914 9.2543 9.67366 9.1263 9.90707C8.99585 10.1446 8.96606 10.4078 8.95362 10.6721C8.93577 11.0586 8.81923 11.1596 8.43147 11.1777C7.60291 11.2165 6.81674 11.0908 6.08606 10.6731C5.44147 10.3047 4.94257 9.78463 4.50783 9.19587C3.66126 8.04812 3.01291 6.78842 2.43036 5.49254C2.29925 5.2007 2.39517 5.04454 2.71714 5.03849C3.25205 5.02817 3.78697 5.02948 4.32188 5.03799C4.53958 5.04143 4.68362 5.166 4.76726 5.37142C5.05633 6.08262 5.4107 6.75928 5.85477 7.38684C5.97311 7.55396 6.09391 7.72059 6.26594 7.83861C6.45582 7.9689 6.60051 7.92585 6.69005 7.71388C6.74734 7.57917 6.77205 7.43513 6.78449 7.29076C6.82705 6.79628 6.83212 6.30195 6.75847 5.80943C6.71263 5.50122 6.53929 5.30218 6.23206 5.24391C6.07558 5.21428 6.0985 5.15634 6.17461 5.06697C6.3067 4.91245 6.43045 4.81686 6.67777 4.81686L8.52951 4.81653C8.82136 4.87382 8.88683 5.00477 8.92645 5.29874L8.92808 7.35656C8.92464 7.47032 8.98521 7.80751 9.18948 7.88198C9.35317 7.936 9.4612 7.80473 9.55908 7.70112C10.0032 7.22987 10.3195 6.67368 10.6029 6.09801C10.7279 5.84413 10.8358 5.58142 10.9406 5.31822C11.0185 5.1236 11.1396 5.02785 11.3593 5.03112L13.1424 5.03325C13.195 5.03325 13.2483 5.03374 13.3004 5.04274C13.6009 5.09414 13.6832 5.22345 13.5903 5.5166C13.4439 5.97721 13.1596 6.36088 12.8817 6.74553C12.5838 7.15736 12.2661 7.55478 11.9711 7.96841C11.7001 8.34652 11.7215 8.53688 12.058 8.86523Z" fill="#9873FF"/>
      </g>
      </svg>`;
      break;
    case 'Доп контакт':
      svgIcon =
        `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.7" fill-rule="evenodd" clip-rule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM3 8C3 5.24 5.24 3 8 3C10.76 3 13 5.24 13 8C13 10.76 10.76 13 8 13C5.24 13 3 10.76 3 8ZM9.5 6C9.5 5.17 8.83 4.5 8 4.5C7.17 4.5 6.5 5.17 6.5 6C6.5 6.83 7.17 7.5 8 7.5C8.83 7.5 9.5 6.83 9.5 6ZM5 9.99C5.645 10.96 6.75 11.6 8 11.6C9.25 11.6 10.355 10.96 11 9.99C10.985 8.995 8.995 8.45 8 8.45C7 8.45 5.015 8.995 5 9.99Z" fill="#9873FF"/>
</svg>`;
  }

  return svgIcon;
}

async function renderClientsTable(clients = null) {
  const tBody = document.getElementById('clients-table-body');
  tBody.innerHTML = '';

  let clientsData;

  if (clients) {
    clientsData = clients;
  } else {
    clientsData = await getClientData();
  }

  clientsData.forEach(client => {
    const clientRow = getClientItem(client);

    tBody.appendChild(clientRow);
  });
}

async function showLoadingAndRenderTable(delay = 2000) {
  const loadingTable = document.getElementById('loading-table');

  setTimeout(async () => {
    loadingTable.classList.add('hidden');
    addNewClient.classList.add('visible');
    await renderClientsTable();
  }, delay);
}

showLoadingAndRenderTable();


function modalOpen() {
  modal.classList.add('visible');
}

function modalClose() {
  modal.classList.remove('visible');
  modalContainer.innerHTML = '';

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.remove('visible');
      modalContainer.innerHTML = '';
    }
  });
}

function createModalTitle(title, clientData = null) {
  const modalTitle = document.createElement('h2');
  modalTitle.classList.add('modal__title');
  modalTitle.textContent = title;

  const modalId = document.createElement('span');
  modalId.classList.add('clients__table-data--id');

  if (clientData && clientData.id) {
    modalId.textContent = `ID: ${clientData.id}`;
  }

  modalTitle.appendChild(modalId);

  return modalTitle;
}

function createModalCloseBtn() {
  const button = document.createElement('button');
  const span = document.createElement('span');
  button.classList.add('modal__btn-close');

  button.appendChild(span);

  button.addEventListener('click', modalClose);

  return button;
}

function createModalForm(submitButton, actionButton, clientData = null) {
  const form = document.createElement('form');
  form.id = 'modal-form';

  const inputContainer = document.createElement('div');
  inputContainer.classList.add('modal__container');

  const fields = [
    { id: 'surname', label: 'Фамилия', required: true },
    { id: 'name', label: 'Имя', required: true },
    { id: 'lastName', label: 'Отчество', required: false }
  ];

  fields.forEach((field) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('modal__input-wrapper');

    const input = document.createElement('input');
    input.classList.add('modal__input');
    input.id = field.id;
    input.type = 'text';
    input.placeholder = '';

    const label = document.createElement('label');
    label.classList.add('modal__input-label');
    label.setAttribute('for', field.id);
    label.textContent = field.label;

    if (field.required) {
      const requiredSpan = document.createElement('span');
      requiredSpan.classList.add('modal__input-required');
      requiredSpan.textContent = '*';
      label.appendChild(requiredSpan);
    }

    if (clientData) {
      if (clientData[field.id]) {
        input.value = clientData[field.id];
      }
    }

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    inputContainer.appendChild(wrapper);
  });

  const contactsWrapper = document.createElement('div');
  contactsWrapper.classList.add('modal__contacts-wrapper');
  contactsWrapper.id = 'contacts-wrapper';

  const contacts = document.createElement('div');
  contacts.id = 'contacts';

  contactsWrapper.appendChild(contacts);

  const addContactBtn = document.createElement('button');
  addContactBtn.classList.add('modal__add-contact-btn', 'flex');
  addContactBtn.id = 'add-contact';
  addContactBtn.type = 'button';
  addContactBtn.textContent = 'Добавить контакт';
  contactsWrapper.appendChild(addContactBtn);

  if (clientData && clientData.contacts) {
    clientData.contacts.forEach(contact => {
      addContactToForm(contacts, contact);
    });
  }

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('modal__container', 'modal__btn-wrapper', 'flex');

  const errorMessage = document.createElement('div');
  errorMessage.classList.add('modal__error-message');
  errorMessage.textContent = '';

  const submitBtn = document.createElement('button');
  submitBtn.classList.add('modal__btn-submit');
  submitBtn.type = 'submit';
  submitBtn.textContent = submitButton;

  const actionBtn = document.createElement('button');
  actionBtn.classList.add('modal__btn-action');
  actionBtn.textContent = actionButton;

  btnContainer.appendChild(errorMessage);
  btnContainer.appendChild(submitBtn);
  btnContainer.appendChild(actionBtn);

  form.appendChild(inputContainer);
  form.appendChild(contactsWrapper);
  form.appendChild(btnContainer);


  addContactBtn.addEventListener('click', () => {
    addContactToForm(contacts);

    toggleAddContactButton(contacts, addContactBtn);
  });

  actionBtn.addEventListener('click', async () => {
    if (actionButton === 'Отмена') {
      actionBtn.type = 'button';

        modalClose();

    } else if (actionButton === 'Удалить клиента' && clientData) {
      actionBtn.type = 'submit';
      await deleteClient(clientData);
      const updatedClients = await getClientData();
      renderClientsTable(updatedClients);
      modalClose();
    }
  });

  return {
    form,
    addContactBtn,
    btnContainer,
    errorMessage,
    submitBtn,
    actionBtn
  };
}

function addContactToForm(contactsContainer, contactData = null) {
  const contactWrapper = document.createElement('div');
  contactWrapper.classList.add('modal__contact-wrapper', 'flex');

  const customSelect = document.createElement('div');
  customSelect.classList.add('modal__custom-select');
  customSelect.setAttribute('tabindex', '0');

  const optionsData = ['Телефон', 'Доп контакт', 'Email', 'VK', 'Facebook'];
  const usedOptions = new Set();

  function createOption(optionText, isActive = false) {
    const option = document.createElement('div');
    option.classList.add('modal__custom-select-option', 'flex');
    option.setAttribute('tabindex', '0');
    option.textContent = optionText;

    if (isActive) {
      option.classList.add('active');
    }

    option.addEventListener('click', () => {
      usedOptions.delete(selected.textContent);
      selected.textContent = optionText;
      usedOptions.add(optionText);

      document.querySelector('.modal__custom-select-options .modal__custom-select-option.active')?.classList.remove('active');
      option.classList.add('active');
      options.classList.remove('show');
    });

    return option;
  }

  const selected = document.createElement('div');
  selected.textContent = contactData ? contactData.type : optionsData[0];
  usedOptions.add(selected.textContent);

  const options = document.createElement('div');
  options.classList.add('modal__custom-select-options');

  optionsData.forEach((optionText, index) => {
    const isActive = index === 0;
    const option = createOption(optionText, isActive);
    options.appendChild(option);
  });

  function refreshOptions() {
    options.innerHTML = '';

    optionsData.forEach((optionText) => {
      if (!usedOptions.has(optionText)) {
        const option = createOption(optionText);
        options.appendChild(option);
      }
    });
  }

  customSelect.addEventListener('click', () => {
    customSelect.classList.toggle('open');
    refreshOptions();
    options.classList.toggle('show');
  });

  document.addEventListener('click', (event) => {
    if (!customSelect.contains(event.target)) {
      options.classList.remove('show');
    }
  });

  customSelect.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      customSelect.click();
    }
  });

  customSelect.appendChild(selected);
  customSelect.appendChild(options);
  contactWrapper.appendChild(customSelect);

  const contactInput = document.createElement('input');
  contactInput.classList.add('modal__contacts-input');
  contactInput.type = 'text';
  if(contactData) {
    contactInput.placeholder = contactData.value;
  } else if (window.innerWidth <= 320) {
    contactInput.placeholder = 'Введите данные';
  } else {
    contactInput.placeholder = 'Введите данные контакта';
  }
  if (contactData) {
    contactInput.value = contactData.value;
  }

  contactWrapper.appendChild(contactInput);

  const contactCancelBtn = document.createElement('button');
  contactCancelBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g clip-path="url(#clip0_121_1495)">
  <path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/>
  </g>
  <defs>
  <clipPath id="clip0_121_1495">
  <rect width="16" height="16" fill="white"/>
  </clipPath>
  </defs>
  </svg>`;
  contactCancelBtn.classList.add('modal__contacts-cancel-btn', 'flex');
  contactCancelBtn.type = 'button';
  contactCancelBtn.setAttribute('data-tooltip', 'Удалить контакт');

  contactCancelBtn.addEventListener('click', () => {
    contactsContainer.removeChild(contactWrapper);
    usedOptions.delete(selected.textContent);
    const addContactBtn = document.querySelector('#add-contact');
    toggleAddContactButton(contactsContainer, addContactBtn);
    updatePadding();
  });

  contactInput.addEventListener('input', () => {
    if (contactInput.value.trim() !== '') {
      contactCancelBtn.style.display = 'inline';
    } else {
      contactCancelBtn.style.display = 'none';
    }
  });

  if (contactData && contactData.value.trim() !== '') {
    contactCancelBtn.style.display = 'inline';
  }

  contactWrapper.appendChild(contactCancelBtn);
  contactsContainer.appendChild(contactWrapper);

  updatePadding();
}

function toggleAddContactButton(contacts, addContactBtn) {
  if (contacts.childElementCount >= 10) {
    addContactBtn.style.display = 'none';
  } else {
    addContactBtn.style.display = 'block';
  }
}

function updatePadding() {
  const contactsWrapper = document.querySelector('#contacts-wrapper');
  if (!contactsWrapper) return;
  const hasContacts = contactsWrapper.querySelectorAll('.modal__contact-wrapper').length > 0;

  if (hasContacts) {
    contactsWrapper.style.paddingTop = '25px';
    contactsWrapper.style.paddingBottom = '25px';
  } else {
    contactsWrapper.style.paddingTop = '8px';
    contactsWrapper.style.paddingBottom = '8px';
  }
}

function createModalDeleteMessage() {
  const confirmWrapper = document.createElement('div');
  confirmWrapper.classList.add('modal-container', 'modal__warpper-delete-confirm', 'flex');
  const confirm = document.createElement('p');
  confirm.classList.add('modal__delete-confirm');
  confirm.textContent = 'Вы действительно хотите удалить данного клиента?'

  confirmWrapper.appendChild(confirm);

  return confirmWrapper;
}

function createClientModal({ title, actionButton, clientData = null }) {
  const modalTitle = createModalTitle(title, clientData);
  const modalCloseBtn = createModalCloseBtn();
  const modalForm = createModalForm('Сохранить', actionButton, clientData);

  const wrapper = document.createElement('div');
  wrapper.classList.add('modal__container', 'modal__wrapper', 'flex');

  wrapper.appendChild(modalTitle);
  wrapper.appendChild(modalCloseBtn);
  modalContainer.appendChild(wrapper);
  modalContainer.appendChild(modalForm.form);

  modalForm.form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const surnameInput = document.getElementById('surname');
    const nameInput = document.getElementById('name');
    const lastNameInput = document.getElementById('lastName');

    let surname = surnameInput.value.trim();
    let name = nameInput.value.trim();
    let lastName = lastNameInput.value.trim();

    function formValidation(surname, name, lastName) {
      isValid = true;
      const lettersOnlyRegex = /^[A-Za-zА-Яа-яЁё]+$/;
      surnameInput.style.borderBottomColor = '';
      nameInput.style.borderBottomColor = '';

      if (!surname || !lettersOnlyRegex.test(surname)) {
        surnameInput.style.borderBottomColor = '#F06A4D';
        isValid = false;
      }
      if (!name || !lettersOnlyRegex.test(name)) {
        nameInput.style.borderBottomColor = '#F06A4D';
        isValid = false;
      }
      if (lastName && !lettersOnlyRegex.test(lastName)) {
        lastNameInput.style.borderBottomColor = '#F06A4D';
      }

      return isValid;
    }

    surname = surname.charAt(0).toUpperCase() + surname.slice(1).toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase();

    surnameInput.value = surname;
    nameInput.value = name;
    lastNameInput.value = lastName;

    surnameInput.addEventListener('input', () => {
      surnameInput.style.borderBottomColor = '';
    });
    nameInput.addEventListener('input', () => {
      nameInput.style.borderBottomColor = '';
    });
    lastNameInput.addEventListener('input', () => {
      lastNameInput.style.borderBottomColor = '';
    });

    const isFormValid = formValidation(surname, name, lastName);
    if (!isFormValid) return;

    const contacts = [];
    const contactWrappers = document.querySelectorAll('#contacts > .modal__contact-wrapper');
    contactWrappers.forEach(wrapper => {
      const type = wrapper.querySelector('.modal__custom-select > div:first-child').textContent;
      const value = wrapper.querySelector('input').value.trim();
      if (type && value) {
        contacts.push({ type, value });
      }
    });

    const client = {
      surname,
      name,
      lastName,
      contacts,
    };

    const errorContainer = document.querySelector('.modal__error-message');

    if(errorContainer) errorContainer.textContent = '';

    try {
      if (clientData) {
          await updateClient(clientData.id, client);
      } else {
          await postNewClient(client);
      }

      renderClientsTable();
      modalClose();

  } catch (error) {
      console.error('Ошибка при сохранении:', error);

      if (errorContainer) {
          let errorMessage = 'Что-то пошло не так';

          if (error.response && error.response.errors) {
              errorMessage = error.response.errors.map(err => err.message).join('; ');
          }

          errorContainer.textContent = errorMessage;
      }
  }
  });

  return modalForm.form;
}

addNewClient.addEventListener('click', () => {
  createClientModal({ title: 'Новый клиент', actionButton: 'Отмена' });
  modalOpen();
});

function createEditModal(client) {
  createClientModal({
    title: 'Изменить данные',
    actionButton: 'Удалить клиента',
    clientData: client,
  });

  modalOpen();

  updatePadding();
}

function createDeleteModal(client) {
  const modalTitle = createModalTitle('Удалить клиента');
  modalTitle.classList.add('modal__title-delete');
  const modalCloseBtn = createModalCloseBtn();
  const modalConfirm = createModalDeleteMessage();
  const modalForm = createModalForm('Удалить', 'Отмена');

  const wrapper = document.createElement('div');
  wrapper.classList.add('modal__container', 'modal__wrapper', 'modal__wrapper-delete', 'flex');

  wrapper.appendChild(modalTitle);
  wrapper.appendChild(modalCloseBtn);
  modalContainer.appendChild(wrapper);
  modalContainer.appendChild(modalConfirm);
  modalContainer.appendChild(modalForm.btnContainer);

  modalForm.submitBtn.addEventListener('click', async function () {
    const clientData = {
      id: client.id
    };
    await deleteClient(clientData);
    const updatedClients = await getClientData();
    renderClientsTable(updatedClients);
    modalClose();
  });
}

const sortClients = (arr, prop, dir = false) => arr.sort((a, b) => (!dir ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1);
let sortDir = false;


function toggleArrowRotation(button) {
  const arrow = button.querySelector('.clients__arrow-icon');
  if (arrow) {
    arrow.classList.toggle('clients__arrow-icon--rotated');
  }
}

thId.addEventListener('click', async function () {
  const clients = await getClientData();
  sortDir = !sortDir;
  sortClients(clients, 'id', sortDir);

  renderClientsTable(clients);

  toggleArrowRotation(this);
});

thFullName.addEventListener('click', async function () {
  const clients = await getClientData();

  clients.forEach(client => {
    client.fullName = `${client.surname} ${client.name} ${client.lastName}`;
  });

  sortDir = !sortDir;
  sortClients(clients, 'fullName', sortDir);

  renderClientsTable(clients);

  toggleArrowRotation(this);
});

thCreation.addEventListener('click', async function () {
  const clients = await getClientData();
  sortDir = !sortDir;
  sortClients(clients, 'createdAt', sortDir);

  renderClientsTable(clients);

  toggleArrowRotation(this);
});

thLastChange.addEventListener('click', async function () {
  const clients = await getClientData();
  sortDir = !sortDir;
  sortClients(clients, 'updatedAt', sortDir);

  renderClientsTable(clients);

  toggleArrowRotation(this);
});

function filterArr(arr, prop, value) {
  let result = [];
  for (const item of arr) {
    if (String(item[prop]).toLowerCase().includes(value.toLowerCase())) {
      result.push(item);
    }
  }
  return result;
}

let searchTimeout;

searchInput.addEventListener('input', async function () {
  const query = searchInput.value.trim();

  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(async () => {
    const clients = await getClientData();
    clients.forEach(client => {
      client.fullName = `${client.surname} ${client.name} ${client.lastName}`;
    });

    const filtredClients = query ? filterArr(clients, 'fullName', query) : clients;
    renderClientsTable(filtredClients);
  }, 300);
});
