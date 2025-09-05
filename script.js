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
        
        // Atualizar gráficos se necessário
        if (section === 'investimento') {
            updateInvestmentChart();
        } else if (section === 'kpis') {
            updateKPICharts();
        }
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
    
    updateInvestmentChart();
}

// Gráfico de investimento
let investmentChart = null;

function updateInvestmentChart() {
    const ctx = document.getElementById('investmentChart');
    if (!ctx) return;
    
    if (investmentChart) {
        investmentChart.destroy();
    }
    
    const monthlyStudents = 
        (state.students.fundamental * state.budget.fundamental) +
        (state.students.medio * state.budget.medio) +
        (state.students.tecnico * state.budget.tecnico);
    
    const data = {
        labels: ['Ensino Fundamental', 'Ensino Médio', 'Ensino Técnico', 'Formação Professores'],
        datasets: [{
            label: 'Investimento (R$)',
            data: [
                state.students.fundamental * state.budget.fundamental * 12,
                state.students.medio * state.budget.medio * 12,
                state.students.tecnico * state.budget.tecnico * 12,
                state.teachers * (state.budget.teacherAI + state.budget.teacherEnglish)
            ],
            backgroundColor: [
                'rgba(37, 99, 235, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderWidth: 0
        }]
    };
    
    investmentChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'R$ ' + context.raw.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return 'R$ ' + (value / 1000000).toFixed(1) + 'M';
                        }
                    }
                }
            }
        }
    });
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
                updateKPICharts();
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

// Gráficos KPI
let academicChart = null;
let employabilityChart = null;
let projectionChart = null;

function updateKPICharts() {
    // Gráfico Acadêmico
    const academicCtx = document.getElementById('academicChart');
    if (academicCtx) {
        if (academicChart) academicChart.destroy();
        
        academicChart = new Chart(academicCtx, {
            type: 'line',
            data: {
                labels: ['Atual', '6 meses', '1 ano', '2 anos', '3 anos'],
                datasets: [{
                    label: 'Melhoria IDEB (%)',
                    data: [0, 
                           state.kpis.idebImprovement * 0.3, 
                           state.kpis.idebImprovement * 0.6, 
                           state.kpis.idebImprovement * 0.85, 
                           state.kpis.idebImprovement],
                    borderColor: 'rgb(37, 99, 235)',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4
                }, {
                    label: 'Taxa de Aprovação (%)',
                    data: [75, 
                           75 + (state.kpis.approvalRate - 75) * 0.3,
                           75 + (state.kpis.approvalRate - 75) * 0.6,
                           75 + (state.kpis.approvalRate - 75) * 0.85,
                           state.kpis.approvalRate],
                    borderColor: 'rgb(16, 185, 129)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Gráfico Empregabilidade
    const employCtx = document.getElementById('employabilityChart');
    if (employCtx) {
        if (employabilityChart) employabilityChart.destroy();
        
        employabilityChart = new Chart(employCtx, {
            type: 'doughnut',
            data: {
                labels: ['Empregados', 'Em busca'],
                datasets: [{
                    data: [state.kpis.jobPlacement, 100 - state.kpis.jobPlacement],
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(229, 231, 235, 0.8)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Gráfico de Projeção
    const projCtx = document.getElementById('projectionChart');
    if (projCtx) {
        if (projectionChart) projectionChart.destroy();
        
        projectionChart = new Chart(projCtx, {
            type: 'bar',
            data: {
                labels: ['2025', '2026', '2027', '2028', '2029'],
                datasets: [{
                    label: 'Alunos com Certificação',
                    data: [
                        state.pilotStudents,
                        state.students.tecnico * 0.8,
                        (state.students.tecnico + state.students.medio * 0.3) * 0.8,
                        (state.students.tecnico + state.students.medio * 0.5) * 0.8,
                        (state.students.tecnico + state.students.medio * 0.7) * 0.8
                    ],
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderWidth: 0
                }, {
                    label: 'Professores Capacitados',
                    data: [
                        state.teachers * 0.2,
                        state.teachers * 0.5,
                        state.teachers * 0.75,
                        state.teachers * 0.9,
                        state.teachers
                    ],
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return (value / 1000).toFixed(0) + 'k';
                            }
                        }
                    }
                }
            }
        });
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
        updateKPICharts();
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
    updateKPICharts();
    
    // Atualizar gráficos quando a janela for redimensionada
    window.addEventListener('resize', function() {
        if (investmentChart) investmentChart.resize();
        if (academicChart) academicChart.resize();
        if (employabilityChart) employabilityChart.resize();
        if (projectionChart) projectionChart.resize();
    });
});

// Função para exportar/imprimir
window.print = function() {
    window.print();
};