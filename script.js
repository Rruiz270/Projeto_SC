// Estado global da aplicação
const state = {
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
    
    // Total do primeiro ano
    const totalFirstYear = yearlyStudents + teacherInvestment;
    
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
    
    // Calcular valores iniciais
    updateTotalStudents();
    calculateInvestment();
    updateEmploymentVisual();
});

// Função para exportar/imprimir
window.print = function() {
    window.print();
};