// Estimators Configuration
const estimatorConfigs = {
    basement: {
        title: 'Basement Renovation Estimate',
        questionsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv55ohMX4Cqsur5DurayaUmpRSahkw2y9UoNmj34w3dG3u-0oFO0ZE1_sSzdC0daaOObIP9pI72ZQk/pub?gid=0&single=true&output=csv',
        optionsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSv55ohMX4Cqsur5DurayaUmpRSahkw2y9UoNmj34w3dG3u-0oFO0ZE1_sSzdC0daaOObIP9pI72ZQk/pub?gid=1753278799&single=true&output=csv',
        formspreeUrl: 'https://formspree.io/f/mankeljl'
    },
    bathroom: {
        title: '3pc Bathroom Renovation Estimate',
        questionsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTdSnVldfF_6gPt8foz2VEmotaW7xas83WiVk6vDIG283uQJi34YrUl4DiYcQ395zRS5HQHdFIe16q5/pub?gid=0&single=true&output=csv',
        optionsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTdSnVldfF_6gPt8foz2VEmotaW7xas83WiVk6vDIG283uQJi34YrUl4DiYcQ395zRS5HQHdFIe16q5/pub?gid=1753278799&single=true&output=csv',
        formspreeUrl: 'https://formspree.io/f/mankeljl'
    },
    powder: {
        title: 'Powder Room Renovation Estimate',
        questionsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRh2IQG4Q4_FSWuRudTlXwGHCFFBenafUXzf6IV37jkmUA20pSDuKcqyFCO-Xbt5GvPiFvWi8jv_uCU/pub?gid=735360720&single=true&output=csv',
        optionsUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRh2IQG4Q4_FSWuRudTlXwGHCFFBenafUXzf6IV37jkmUA20pSDuKcqyFCO-Xbt5GvPiFvWi8jv_uCU/pub?gid=1296307690&single=true&output=csv',
        formspreeUrl: 'https://formspree.io/f/mankeljl'
    }
};

// Tab switching
document.addEventListener('DOMContentLoaded', () => {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const estimatorContents = document.querySelectorAll('.estimator-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            estimatorContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${targetTab}-estimator`).classList.add('active');
        });
    });

    initializeEstimator('basement');
    initializeEstimator('bathroom');
    initializeEstimator('powder');

    const modal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-contact-modal-btn');

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
});

function initializeEstimator(type) {
    const config = estimatorConfigs[type];
    const form = document.getElementById(`quote-form-${type}`);
    const totalPriceEl = document.getElementById(`total-price-${type}`);
    const totalPriceFooterEl = document.getElementById(`total-price-footer-${type}`);
    const questionsContainer = document.getElementById(`dynamic-questions-container-${type}`);
    const loadingModal = document.getElementById(`loading-modal-${type}`);

    let basePrice = 0;
    let questionsData = [];
    let optionsData = [];
    let allQuestionElements = [];

    async function fetchCsv(url) {
        const cacheBustUrl = `${url}&_=${new Date().getTime()}`;
        const response = await fetch(cacheBustUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${url}`);
        const csvText = await response.text();

        const rows = csvText.split('\n').map(row => row.trim());
        if (rows.length < 2) return [];

        const header = rows[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < rows.length; i++) {
            if (!rows[i]) continue;

            const values = [];
            let inQuote = false;
            let currentField = '';
            for (const char of rows[i]) {
                if (char === '"') {
                    inQuote = !inQuote;
                } else if (char === ',' && !inQuote) {
                    values.push(currentField.trim().replace(/"/g, ''));
                    currentField = '';
                } else {
                    currentField += char;
                }
            }
            values.push(currentField.trim().replace(/"/g, ''));

            if (values.length === header.length) {
                const rowObject = {};
                header.forEach((colName, index) => {
                    let value = values[index];
                    if (colName.toLowerCase() === 'price') {
                        value = value.replace(/,/g, '');
                    }
                    rowObject[colName.trim()] = value ? value.trim() : '';
                });
                data.push(rowObject);
            }
        }
        return data;
    }

    function buildUI() {
        questionsData.forEach(question => {
            const questionID = question.QuestionID.trim();
            if (!questionID) return;

            const questionText = question.QuestionText;
            const questionType = question.QuestionType;
            const defaultSelection = question.DefaultSelection;
            const parentID = question.ParentQuestionID.trim();
            const parentValue = question.ParentRequiredValue;

            if (questionType === 'BasePrice') {
                basePrice = Number(defaultSelection) || 0;
                return;
            }

            if (questionType === 'Disclaimer') {
                const rawText = question.QuestionText.replace(/"/g, '');
                const formattedText = rawText.replace(/\|/g, '<br>');
                const disclaimerEl = document.getElementById(`disclaimer-text-container-${type}`);
                if (disclaimerEl) {
                    disclaimerEl.innerHTML = formattedText;
                }
                return;
            }

            let questionDiv = document.getElementById(`wrapper_${questionID}_${type}`);

            if (questionDiv) {
                if (parentID) {
                    const logicCount = parseInt(questionDiv.dataset.logicCount || 0, 10);
                    questionDiv.dataset[`logic${logicCount}Parent`] = parentID;
                    questionDiv.dataset[`logic${logicCount}Value`] = parentValue;
                    questionDiv.dataset.logicCount = logicCount + 1;
                }
                return;

            } else {
                questionDiv = document.createElement('div');
                questionDiv.className = 'question-wrapper';
                questionDiv.id = `wrapper_${questionID}_${type}`;

                if (parentID) {
                    questionDiv.dataset.logicCount = 1;
                    questionDiv.dataset.logic0Parent = parentID;
                    questionDiv.dataset.logic0Value = parentValue;
                    questionDiv.classList.add('hidden');
                }

                let content = `<h3 class="question-title">${questionText}</h3>`;

                if (questionType === 'YesNo') {
                    const yesID = `${questionID}_yes_${type}`;
                    const noID = `${questionID}_no_${type}`;

                    const optionYes = optionsData.find(o => o.QuestionID.trim() === questionID && o.OptionValue.trim() === 'yes');
                    const optionNo = optionsData.find(o => o.QuestionID.trim() === questionID && o.OptionValue.trim() === 'no');

                    const priceYes = optionYes ? optionYes.Price : '0';
                    const priceNo = optionNo ? optionNo.Price : '0';

                    content += `<div class="radio-group" data-question-id="${questionID}">`;
                    content += `
                                <input type="radio" id="${yesID}" name="${questionID}_${type}" value="yes" data-price="${priceYes}" ${defaultSelection === 'yes' ? 'checked' : ''}>
                                <label for="${yesID}" class="radio-label">Yes</label>
                                
                                <input type="radio" id="${noID}" name="${questionID}_${type}" value="no" data-price="${priceNo}" ${defaultSelection === 'no' ? 'checked' : ''}>
                                <label for="${noID}" class="radio-label">No</label>
                            `;
                    content += `</div>`;
                }
                else if (questionType === 'Dropdown') {
                    const optionsForThisQuestion = optionsData.filter(opt => opt.QuestionID.trim() === questionID);

                    content += `<select name="${questionID}_${type}" id="${questionID}_${type}" data-question-id="${questionID}" class="estimator-select">`;

                    if (optionsForThisQuestion.length === 0) {
                        content += `<option value="">Error: Options not found</option>`;
                    }

                    optionsForThisQuestion.forEach(opt => {
                        content += `
                            <option value="${opt.OptionValue}" 
                                    data-price="${opt.Price || 0}" 
                                    data-image-url="${opt.ImageURL || ''}"
                                    ${defaultSelection === opt.OptionValue ? 'selected' : ''}>
                                ${opt.OptionText}
                            </option>
                        `;
                    });
                    content += `</select>`;

                    content += `
                        <div id="preview_container_${questionID}_${type}" class="image-preview-container hidden">
                            <img id="preview_image_${questionID}_${type}" src="" alt="Item preview" class="image-preview">
                        </div>
                    `;
                }

                questionDiv.innerHTML = content;
                questionsContainer.appendChild(questionDiv);
                allQuestionElements.push(questionDiv);
            }
        });
    }

    function getInputValue(questionID) {
        const element = document.querySelector(`[name="${questionID.trim()}_${type}"]`);
        if (!element) return null;

        if (element.type === 'radio') {
            const checkedRadio = document.querySelector(`[name="${questionID.trim()}_${type}"]:checked`);
            return checkedRadio ? checkedRadio.value : null;
        } else if (element.tagName === 'SELECT') {
            return element.value;
        }
        return null;
    }

    function updateVisibility() {
        allQuestionElements.forEach(el => {
            const logicCount = parseInt(el.dataset.logicCount || 0, 10);

            if (logicCount === 0) {
                el.classList.remove('hidden');
                return;
            }

            let shouldShow = false;

            for (let i = 0; i < logicCount; i++) {
                const parentIdRaw = el.dataset[`logic${i}Parent`];
                const parentRequiredValuesRaw = el.dataset[`logic${i}Value`];

                if (!parentIdRaw) continue;

                const parentIds = parentIdRaw.split('&').map(id => id.trim());
                const requiredValuesGroups = parentRequiredValuesRaw.split('&').map(val => val.trim());

                if (parentIds.length !== requiredValuesGroups.length) {
                    continue;
                }

                let allConditionsMet = true;

                for (let j = 0; j < parentIds.length; j++) {
                    const pId = parentIds[j];
                    const pValues = requiredValuesGroups[j];

                    const parentWrapper = document.getElementById(`wrapper_${pId}_${type}`);
                    if (parentWrapper && parentWrapper.classList.contains('hidden')) {
                        allConditionsMet = false;
                        break;
                    }

                    const currentVal = getInputValue(pId);
                    const validOptions = pValues.split(',').map(v => v.trim());

                    if (!validOptions.includes(currentVal)) {
                        allConditionsMet = false;
                        break;
                    }
                }

                if (allConditionsMet) {
                    shouldShow = true;
                    break;
                }
            }

            if (shouldShow) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
                const previewContainer = el.querySelector(`[id^="preview_container_"]`);
                if (previewContainer) {
                    previewContainer.classList.add('hidden');
                }
            }
        });
    }

    function calculateTotal() {
        let total = basePrice;

        form.querySelectorAll('[data-question-id]').forEach(element => {
            const wrapper = element.closest('.question-wrapper');
            if (wrapper && wrapper.classList.contains('hidden')) {
                return;
            }

            if (element.tagName === 'DIV') {
                const selectedRadio = element.querySelector('input[type="radio"]:checked');
                if (selectedRadio) {
                    total += Number(selectedRadio.dataset.price) || 0;
                }
            }
            else if (element.tagName === 'SELECT') {
                const selectedOption = element.options[element.selectedIndex];
                if (selectedOption) {
                    total += Number(selectedOption.dataset.price) || 0;

                    const questionID = element.dataset.questionId;
                    const previewContainer = document.getElementById(`preview_container_${questionID}_${type}`);
                    const previewImage = document.getElementById(`preview_image_${questionID}_${type}`);
                    const imageUrl = selectedOption.dataset.imageUrl;

                    if (previewContainer && previewImage) {
                        if (imageUrl && imageUrl.trim() !== '' && imageUrl !== '(leave blank)') {
                            previewImage.src = imageUrl;
                            previewContainer.classList.remove('hidden');
                        } else {
                            previewImage.src = '';
                            previewContainer.classList.add('hidden');
                        }
                    }
                }
            }
        });

        const roundedTotal = Math.round(total / 5) * 5;
        const formattedTotal = `$${roundedTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        totalPriceEl.textContent = formattedTotal;
        totalPriceFooterEl.textContent = formattedTotal;
    }

    function generateSelectionsSummary(asHtml) {
        let summary = asHtml ? '<ul>' : '';

        allQuestionElements.forEach(el => {
            if (el.classList.contains('hidden')) {
                return;
            }

            const questionText = el.querySelector('h3').textContent;
            let selectedText = '';

            const radioGroup = el.querySelector('input[type="radio"]');
            const dropdown = el.querySelector('select');

            if (radioGroup) {
                const selectedRadio = el.querySelector('input[type="radio"]:checked');
                if (selectedRadio) {
                    selectedText = selectedRadio.value === 'yes' ? 'Yes' : 'No';
                }
            } else if (dropdown) {
                selectedText = dropdown.options[dropdown.selectedIndex].text;
            }

            if (selectedText) {
                if (asHtml) {
                    summary += `<li><strong>${questionText}</strong> ${selectedText}</li>`;
                } else {
                    summary += `${questionText} ${selectedText}\n`;
                }
            }
        });

        if (asHtml) {
            summary += '</ul>';
        }
        return summary.trim();
    }

    function onFormChange() {
        updateVisibility();
        calculateTotal();
    }

    async function initApp() {
        try {
            [questionsData, optionsData] = await Promise.all([
                fetchCsv(config.questionsUrl),
                fetchCsv(config.optionsUrl)
            ]);

            if (questionsData.length === 0) {
                throw new Error('Could not load questions from the sheet.');
            }

            buildUI();
            updateVisibility();
            calculateTotal();

            form.addEventListener('change', onFormChange);

            // Print/PDF button handler - AFTER buildUI
            const printBtn = document.querySelector(`.print-btn[data-estimator="${type}"]`);
            if (printBtn) {
                printBtn.addEventListener('click', () => {
                    const summaryText = generateSelectionsSummary(false);
                    const totalText = totalPriceEl.textContent;

                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>${config.title}</title>
                            <style>
                                body { font-family: Arial, sans-serif; padding: 40px; }
                                h1 { color: #C5A059; text-align: center; }
                                .total { font-size: 24px; color: #C5A059; text-align: center; margin: 20px 0; font-weight: bold; }
                                .selections { margin-top: 30px; line-height: 1.8; }
                                .selections h2 { color: #333; font-size: 18px; }
                            </style>
                        </head>
                        <body>
                            <h1>${config.title}</h1>
                            <div class="total">Total: ${totalText}</div>
                            <div class="selections">
                                <h2>Selections:</h2>
                                <pre style="white-space: pre-wrap; font-family: Arial;">${summaryText}</pre>
                            </div>
                        </body>
                        </html>
                    `);
                    printWindow.document.close();

                    setTimeout(() => {
                        printWindow.print();
                    }, 250);
                });
            }

            // Modal button handler - AFTER buildUI
            const modalBtn = document.querySelector(`.open-contact-modal-btn[data-estimator="${type}"]`);
            if (modalBtn) {
                modalBtn.addEventListener('click', () => {
                    const summaryText = generateSelectionsSummary(false);
                    const totalText = totalPriceEl.textContent;
                    const modal = document.getElementById('contact-modal');
                    const modalSelectionsTextarea = document.getElementById('modal-selections');

                    modalSelectionsTextarea.value = `${config.title.toUpperCase()}\nESTIMATE: ${totalText}\n\nSELECTIONS:\n${summaryText}`;
                    modal.classList.remove('hidden');
                });
            }

            loadingModal.classList.add('hidden');

        } catch (error) {
            console.error(`Failed to initialize ${type} estimator:`, error);
            loadingModal.innerHTML = '<div style="color: white; text-align: center;">Error loading data.<br>Please check console.</div>';
        }
    }

    initApp();
}
