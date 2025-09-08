// Estado global da aplicação
const state = loadState() || {
    students: {
        fundamental: 280000,
        medio: 240000,
        tecnico: 30000
    },
    budget: {
        fundamental: 150,
        medio: 180,
        tecnico: 250,
        teacherAI: 800,
        teacherEnglish: 1200
    },
    teachers: 51000,
    pilotStudents: 50000,
    products: {
        inglesGeral: { active: true, price: 120 },
        inglesCarreiras: { active: true, price: 150 },
        espanhol: { active: false, price: 100 },
        ia: { active: true, price: 180 },
        coding: { active: true, price: 200 }
    },
    modality: 'hibrido',
    modalityCostModifier: 1,
    kpis: {
        idebImprovement: 15,
        approvalRate: 92,
        englishCert: 75,
        teacherFluency: 85,
        jobPlacement: 82,
        salaryIncrease: 35
    },
    tests: {
        ingles: { active: true, price: 10, students: 0 },
        espanhol: { active: false, price: 10, students: 0 },
        coding: { active: true, price: 10, students: 0 },
        ia: { active: true, price: 10, students: 0 }
    }
};

// Navegação entre seções
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.dataset.section;
        
        // Atualizar botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Atualizar seções
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
    });
});

// Controles de alunos
function setupStudentControls() {
    const fundamentalRange = document.getElementById('fundamental');
    const fundamentalNumber = document.getElementById('fundamental-number');
    const medioRange = document.getElementById('medio');
    const medioNumber = document.getElementById('medio-number');
    const tecnicoRange = document.getElementById('tecnico');
    const tecnicoNumber = document.getElementById('tecnico-number');
    
    // Sincronizar range e number inputs
    function syncInputs(range, number, key) {
        range.addEventListener('input', function() {
            number.value = this.value;
            state.students[key] = parseInt(this.value);
            updateTotalStudents();
            calculateInvestment();
        });
        
        number.addEventListener('input', function() {
            range.value = this.value;
            state.students[key] = parseInt(this.value);
            updateTotalStudents();
            calculateInvestment();
        });
    }
    
    syncInputs(fundamentalRange, fundamentalNumber, 'fundamental');
    syncInputs(medioRange, medioNumber, 'medio');
    syncInputs(tecnicoRange, tecnicoNumber, 'tecnico');
}

function updateTotalStudents() {
    const total = state.students.fundamental + state.students.medio + state.students.tecnico;
    document.getElementById('total-alunos').textContent = total.toLocaleString('pt-BR');
}

// Controles de orçamento
function setupBudgetControls() {
    document.getElementById('budget-fundamental').addEventListener('input', function() {
        state.budget.fundamental = parseFloat(this.value);
        calculateInvestment();
    });
    
    document.getElementById('budget-medio').addEventListener('input', function() {
        state.budget.medio = parseFloat(this.value);
        calculateInvestment();
    });
    
    document.getElementById('budget-tecnico').addEventListener('input', function() {
        state.budget.tecnico = parseFloat(this.value);
        calculateInvestment();
    });
    
    document.getElementById('teacher-ai').addEventListener('input', function() {
        state.budget.teacherAI = parseFloat(this.value);
        calculateInvestment();
    });
    
    document.getElementById('teacher-english').addEventListener('input', function() {
        state.budget.teacherEnglish = parseFloat(this.value);
        calculateInvestment();
    });
    
    document.getElementById('teachers-count').addEventListener('input', function() {
        state.teachers = parseInt(this.value);
        calculateInvestment();
    });
}

function calculateInvestment() {
    // Calcular investimento mensal dos alunos
    const monthlyStudents = 
        (state.students.fundamental * state.budget.fundamental) +
        (state.students.medio * state.budget.medio) +
        (state.students.tecnico * state.budget.tecnico);
    
    // Aplicar modificador de modalidade
    const monthlyWithModality = monthlyStudents * state.modalityCostModifier;
    
    // Calcular investimento anual
    const yearlyStudents = monthlyWithModality * 12;
    
    // Calcular investimento em professores
    const teacherInvestment = state.teachers * (state.budget.teacherAI + state.budget.teacherEnglish);
    
    // Calcular custo dos testes
    let testsCost = 0;
    if (state.tests) {
        // Recalcular custos dos testes se necessário
        let totalTestsCost = 0;
        
        if (state.tests.ingles.active) {
            const englishTeachers = Math.round(state.teachers * 0.2);
            const englishStudents = Math.round((state.students.fundamental + state.students.medio) * 0.3);
            const technicalStudents = state.students.tecnico;
            totalTestsCost += (englishTeachers + englishStudents + technicalStudents) * state.tests.ingles.price;
        }
        
        if (state.tests.espanhol.active) {
            const spanishStudents = Math.round((state.students.fundamental + state.students.medio) * 0.1);
            totalTestsCost += spanishStudents * state.tests.espanhol.price;
        }
        
        if (state.tests.coding.active) {
            const codingStudents = Math.round((state.students.medio + state.students.tecnico) * 0.2);
            totalTestsCost += codingStudents * state.tests.coding.price;
        }
        
        if (state.tests.ia.active) {
            const iaStudents = Math.round((state.students.medio + state.students.tecnico) * 0.15);
            totalTestsCost += (state.teachers + iaStudents) * state.tests.ia.price;
        }
        
        testsCost = totalTestsCost;
    }
    
    // Total do primeiro ano
    const totalFirstYear = yearlyStudents + teacherInvestment + testsCost;
    
    // Atualizar interface
    document.getElementById('monthly-investment').textContent = 
        'R$ ' + monthlyWithModality.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.getElementById('yearly-investment').textContent = 
        'R$ ' + yearlyStudents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.getElementById('teacher-investment').textContent = 
        'R$ ' + teacherInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    document.getElementById('total-investment').textContent = 
        'R$ ' + totalFirstYear.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    // Atualizar slide de apresentação
    const slideInvestment = document.getElementById('slide-total-investment');
    if (slideInvestment) {
        slideInvestment.textContent = 'R$ ' + totalFirstYear.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    updateSimpleChart();
}

// Gráfico simples em CSS
function updateSimpleChart() {
    const fundamentalValue = state.students.fundamental * state.budget.fundamental * 12;
    const medioValue = state.students.medio * state.budget.medio * 12;
    const tecnicoValue = state.students.tecnico * state.budget.tecnico * 12;
    const teachersValue = state.teachers * (state.budget.teacherAI + state.budget.teacherEnglish);
    
    // Encontrar o máximo para escalar as barras
    const maxValue = Math.max(fundamentalValue, medioValue, tecnicoValue, teachersValue);
    
    // Atualizar valores
    const chartFundamental = document.getElementById('chart-fundamental');
    const chartMedio = document.getElementById('chart-medio');
    const chartTecnico = document.getElementById('chart-tecnico');
    const chartTeachers = document.getElementById('chart-teachers');
    
    if (chartFundamental) {
        chartFundamental.textContent = 'R$ ' + (fundamentalValue / 1000000).toFixed(1) + 'M';
        const bar = chartFundamental.parentElement.querySelector('.bar-fill');
        if (bar) bar.style.height = Math.max(20, (fundamentalValue / maxValue) * 100) + '%';
    }
    
    if (chartMedio) {
        chartMedio.textContent = 'R$ ' + (medioValue / 1000000).toFixed(1) + 'M';
        const bar = chartMedio.parentElement.querySelector('.bar-fill');
        if (bar) bar.style.height = Math.max(20, (medioValue / maxValue) * 100) + '%';
    }
    
    if (chartTecnico) {
        chartTecnico.textContent = 'R$ ' + (tecnicoValue / 1000000).toFixed(1) + 'M';
        const bar = chartTecnico.parentElement.querySelector('.bar-fill');
        if (bar) bar.style.height = Math.max(20, (tecnicoValue / maxValue) * 100) + '%';
    }
    
    if (chartTeachers) {
        chartTeachers.textContent = 'R$ ' + (teachersValue / 1000000).toFixed(1) + 'M';
        const bar = chartTeachers.parentElement.querySelector('.bar-fill');
        if (bar) bar.style.height = Math.max(20, (teachersValue / maxValue) * 100) + '%';
    }
}

// Controle de produtos
function setupProductControls() {
    // Checkboxes de produtos
    document.getElementById('ingles-geral').addEventListener('change', function() {
        state.products.inglesGeral.active = this.checked;
        calculateProductsCost();
    });
    
    document.getElementById('ingles-carreiras').addEventListener('change', function() {
        state.products.inglesCarreiras.active = this.checked;
        calculateProductsCost();
    });
    
    document.getElementById('espanhol').addEventListener('change', function() {
        state.products.espanhol.active = this.checked;
        calculateProductsCost();
    });
    
    document.getElementById('ia').addEventListener('change', function() {
        state.products.ia.active = this.checked;
        calculateProductsCost();
    });
    
    document.getElementById('coding').addEventListener('change', function() {
        state.products.coding.active = this.checked;
        calculateProductsCost();
    });
    
    // Preços dos produtos
    document.querySelectorAll('.product-price').forEach((input, index) => {
        input.addEventListener('input', function() {
            const products = ['inglesGeral', 'inglesCarreiras', 'espanhol', 'ia', 'coding'];
            if (products[index]) {
                state.products[products[index]].price = parseFloat(this.value);
                calculateProductsCost();
            }
        });
    });
    
    // Modalidades
    document.querySelectorAll('input[name="modalidade"]').forEach(radio => {
        radio.addEventListener('change', function() {
            state.modality = this.value;
            updateModalityCost();
        });
    });
}

function updateModalityCost() {
    switch(state.modality) {
        case 'presencial':
            state.modalityCostModifier = 1.2;
            break;
        case 'online':
            state.modalityCostModifier = 0.7;
            break;
        default: // hibrido
            state.modalityCostModifier = 1;
    }
    calculateInvestment();
}

function calculateProductsCost() {
    // Esta função pode ser expandida para calcular custos específicos por produto
    calculateInvestment();
}

// Controle de KPIs
function setupKPIControls() {
    const kpiControls = [
        { id: 'ideb-improvement', key: 'idebImprovement', suffix: '%' },
        { id: 'approval-rate', key: 'approvalRate', suffix: '%' },
        { id: 'english-cert', key: 'englishCert', suffix: '%' },
        { id: 'teacher-fluency', key: 'teacherFluency', suffix: '%' },
        { id: 'job-placement', key: 'jobPlacement', suffix: '%' },
        { id: 'salary-increase', key: 'salaryIncrease', suffix: '%' }
    ];
    
    kpiControls.forEach(control => {
        const element = document.getElementById(control.id);
        if (element) {
            element.addEventListener('input', function() {
                state.kpis[control.key] = parseInt(this.value);
                const valueSpan = this.parentElement.querySelector('.kpi-value');
                if (valueSpan) {
                    valueSpan.textContent = (control.id === 'ideb-improvement' || control.id === 'salary-increase' ? '+' : '') + 
                                          this.value + control.suffix;
                }
                updateEmploymentVisual();
            });
        }
    });
    
    // Controle de horas de treinamento
    const trainingHours = document.getElementById('training-hours');
    if (trainingHours) {
        trainingHours.addEventListener('input', function() {
            const impact = Math.min(Math.round(this.value * 1.125), 100);
            const resultSpan = this.parentElement.querySelector('.impact-result');
            if (resultSpan) {
                resultSpan.textContent = `+${impact}% engajamento`;
            }
        });
    }
}

// Atualizar visualizações simples
function updateEmploymentVisual() {
    const employmentFill = document.querySelector('.employment-fill');
    const employmentPercentage = document.querySelector('.employment-text .percentage');
    const salaryValue = document.querySelector('.employment-stats .stat:first-child .value');
    
    if (employmentFill) {
        employmentFill.style.setProperty('--percentage', state.kpis.jobPlacement);
    }
    
    if (employmentPercentage) {
        employmentPercentage.textContent = state.kpis.jobPlacement + '%';
    }
    
    if (salaryValue) {
        salaryValue.textContent = '+' + state.kpis.salaryIncrease + '%';
    }
}

// Controle de apresentação
let currentSlide = 1;
const totalSlides = 8;

function setupPresentationControls() {
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 1) {
                currentSlide--;
                updateSlide();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateSlide();
            }
        });
    }
}

function updateSlide() {
    // Atualizar contador
    document.getElementById('currentSlide').textContent = currentSlide;
    
    // Atualizar slides
    document.querySelectorAll('.slide').forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide - 1);
    });
    
    // Desabilitar botões quando necessário
    document.getElementById('prevSlide').disabled = currentSlide === 1;
    document.getElementById('nextSlide').disabled = currentSlide === totalSlides;
}

// Controles do cronograma
function setupTimelineControls() {
    document.getElementById('piloto-alunos').addEventListener('input', function() {
        state.pilotStudents = parseInt(this.value);
    });
}

// Controles regionais
function setupRegionalControls() {
    // Aqui podem ser adicionados controles específicos para as regiões
    document.querySelectorAll('.region-controls input').forEach(input => {
        input.addEventListener('input', function() {
            // Lógica para atualizar dados regionais
        });
    });
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    setupStudentControls();
    setupBudgetControls();
    setupProductControls();
    setupKPIControls();
    setupPresentationControls();
    setupTimelineControls();
    setupRegionalControls();
    setupSaveButton();
    setupTestControls();
    
    // Restaurar valores salvos se existirem
    if (loadState()) {
        restoreFormValues();
    }
    
    // Calcular valores iniciais
    updateTotalStudents();
    calculateInvestment();
    updateEmploymentVisual();
    calculateTestsCosts();
});

// Restaurar valores do formulário a partir do estado
function restoreFormValues() {
    // Alunos
    document.getElementById('fundamental').value = state.students.fundamental;
    document.getElementById('fundamental-number').value = state.students.fundamental;
    document.getElementById('medio').value = state.students.medio;
    document.getElementById('medio-number').value = state.students.medio;
    document.getElementById('tecnico').value = state.students.tecnico;
    document.getElementById('tecnico-number').value = state.students.tecnico;
    
    // Orçamentos
    document.getElementById('budget-fundamental').value = state.budget.fundamental;
    document.getElementById('budget-medio').value = state.budget.medio;
    document.getElementById('budget-tecnico').value = state.budget.tecnico;
    document.getElementById('teacher-ai').value = state.budget.teacherAI;
    document.getElementById('teacher-english').value = state.budget.teacherEnglish;
    document.getElementById('teachers-count').value = state.teachers;
    
    // Produtos
    document.getElementById('ingles-geral').checked = state.products.inglesGeral.active;
    document.getElementById('ingles-carreiras').checked = state.products.inglesCarreiras.active;
    document.getElementById('espanhol').checked = state.products.espanhol.active;
    document.getElementById('ia').checked = state.products.ia.active;
    document.getElementById('coding').checked = state.products.coding.active;
    
    // KPIs
    document.getElementById('ideb-improvement').value = state.kpis.idebImprovement;
    document.getElementById('approval-rate').value = state.kpis.approvalRate;
    document.getElementById('english-cert').value = state.kpis.englishCert;
    document.getElementById('teacher-fluency').value = state.kpis.teacherFluency;
    document.getElementById('job-placement').value = state.kpis.jobPlacement;
    document.getElementById('salary-increase').value = state.kpis.salaryIncrease;
    
    // Testes
    if (state.tests) {
        document.getElementById('test-ingles').checked = state.tests.ingles.active;
        document.getElementById('test-espanhol').checked = state.tests.espanhol.active;
        document.getElementById('test-coding').checked = state.tests.coding.active;
        document.getElementById('test-ia').checked = state.tests.ia.active;
        
        document.getElementById('price-test-ingles').value = state.tests.ingles.price;
        document.getElementById('price-test-espanhol').value = state.tests.espanhol.price;
        document.getElementById('price-test-coding').value = state.tests.coding.price;
        document.getElementById('price-test-ia').value = state.tests.ia.price;
    }
}

// Sistema de salvamento
function saveState() {
    localStorage.setItem('projetoEducacaoSC', JSON.stringify(state));
    
    // Feedback visual
    const saveBtn = document.getElementById('saveButton');
    if (saveBtn) {
        saveBtn.classList.add('saved');
        saveBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Salvo!
        `;
        
        setTimeout(() => {
            saveBtn.classList.remove('saved');
            saveBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"></path>
                    <polyline points="17 21 17 13 7 13 7 21"></polyline>
                    <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                Salvar Configurações
            `;
        }, 2000);
    }
}

function loadState() {
    const saved = localStorage.getItem('projetoEducacaoSC');
    return saved ? JSON.parse(saved) : null;
}

// Controle do botão de salvar
function setupSaveButton() {
    const saveBtn = document.getElementById('saveButton');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveState);
    }
}

// Controles de testes e avaliações
function setupTestControls() {
    // Checkbox dos testes
    document.getElementById('test-ingles').addEventListener('change', function() {
        state.tests.ingles.active = this.checked;
        calculateTestsCosts();
    });
    
    document.getElementById('test-espanhol').addEventListener('change', function() {
        state.tests.espanhol.active = this.checked;
        calculateTestsCosts();
    });
    
    document.getElementById('test-coding').addEventListener('change', function() {
        state.tests.coding.active = this.checked;
        calculateTestsCosts();
    });
    
    document.getElementById('test-ia').addEventListener('change', function() {
        state.tests.ia.active = this.checked;
        calculateTestsCosts();
    });
    
    // Preços dos testes
    document.getElementById('price-test-ingles').addEventListener('input', function() {
        state.tests.ingles.price = parseFloat(this.value);
        calculateTestsCosts();
    });
    
    document.getElementById('price-test-espanhol').addEventListener('input', function() {
        state.tests.espanhol.price = parseFloat(this.value);
        calculateTestsCosts();
    });
    
    document.getElementById('price-test-coding').addEventListener('input', function() {
        state.tests.coding.price = parseFloat(this.value);
        calculateTestsCosts();
    });
    
    document.getElementById('price-test-ia').addEventListener('input', function() {
        state.tests.ia.price = parseFloat(this.value);
        calculateTestsCosts();
    });
}

// Calcular custos dos testes
function calculateTestsCosts() {
    let totalTests = 0;
    let totalCost = 0;
    let testsByType = {
        ingles: 0,
        espanhol: 0,
        coding: 0,
        ia: 0
    };
    
    // Calcular testes de Inglês
    if (state.tests.ingles.active) {
        // Professores de inglês (estimativa 20% dos 51k)
        const englishTeachers = Math.round(state.teachers * 0.2);
        // Alunos no curso de inglês (estimativa)
        const englishStudents = Math.round((state.students.fundamental + state.students.medio) * 0.3);
        // Todos os alunos técnicos
        const technicalStudents = state.students.tecnico;
        
        testsByType.ingles = englishTeachers + englishStudents + technicalStudents;
        totalTests += testsByType.ingles;
        totalCost += testsByType.ingles * state.tests.ingles.price;
    }
    
    // Calcular testes de Espanhol
    if (state.tests.espanhol.active) {
        // Estimativa de alunos de espanhol
        const spanishStudents = Math.round((state.students.fundamental + state.students.medio) * 0.1);
        testsByType.espanhol = spanishStudents;
        totalTests += testsByType.espanhol;
        totalCost += testsByType.espanhol * state.tests.espanhol.price;
    }
    
    // Calcular testes de Coding
    if (state.tests.coding.active) {
        // Alunos no curso de coding
        const codingStudents = Math.round((state.students.medio + state.students.tecnico) * 0.2);
        testsByType.coding = codingStudents;
        totalTests += testsByType.coding;
        totalCost += testsByType.coding * state.tests.coding.price;
    }
    
    // Calcular testes de IA
    if (state.tests.ia.active) {
        // Todos os professores + alunos de IA
        const iaStudents = Math.round((state.students.medio + state.students.tecnico) * 0.15);
        testsByType.ia = state.teachers + iaStudents;
        totalTests += testsByType.ia;
        totalCost += testsByType.ia * state.tests.ia.price;
    }
    
    // Atualizar interface
    document.getElementById('total-tests').textContent = totalTests.toLocaleString('pt-BR');
    
    const avgCost = totalTests > 0 ? totalCost / totalTests : 0;
    document.getElementById('avg-test-cost').textContent = 'R$ ' + avgCost.toFixed(2);
    
    document.getElementById('annual-test-cost').textContent = 
        'R$ ' + totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    // Atualizar distribuição
    updateTestDistribution(testsByType, totalTests);
    
    // Atualizar investimento total incluindo testes
    calculateInvestment();
}

// Atualizar visualização da distribuição de testes
function updateTestDistribution(testsByType, totalTests) {
    const maxTests = Math.max(...Object.values(testsByType));
    
    // Inglês
    document.getElementById('dist-ingles').textContent = testsByType.ingles.toLocaleString('pt-BR');
    const inglesBar = document.querySelector('.dist-fill.ingles');
    if (inglesBar && maxTests > 0) {
        inglesBar.style.width = (testsByType.ingles / maxTests * 100) + '%';
    }
    
    // Espanhol
    document.getElementById('dist-espanhol').textContent = testsByType.espanhol.toLocaleString('pt-BR');
    const espanholBar = document.querySelector('.dist-fill.espanhol');
    if (espanholBar && maxTests > 0) {
        espanholBar.style.width = (testsByType.espanhol / maxTests * 100) + '%';
    }
    
    // Coding
    document.getElementById('dist-coding').textContent = testsByType.coding.toLocaleString('pt-BR');
    const codingBar = document.querySelector('.dist-fill.coding');
    if (codingBar && maxTests > 0) {
        codingBar.style.width = (testsByType.coding / maxTests * 100) + '%';
    }
    
    // IA
    document.getElementById('dist-ia').textContent = testsByType.ia.toLocaleString('pt-BR');
    const iaBar = document.querySelector('.dist-fill.ia');
    if (iaBar && maxTests > 0) {
        iaBar.style.width = (testsByType.ia / maxTests * 100) + '%';
    }
}

// Função para exportar/imprimir
window.print = function() {
    window.print();
};