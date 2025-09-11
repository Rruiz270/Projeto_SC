// Estado padrão
const defaultState = {
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
        inglesGeral: { active: true, price: 120, students: 0, teachers: 0 },
        inglesCarreiras: { active: true, price: 150, students: 0, teachers: 0 },
        espanhol: { active: false, price: 100, students: 0, teachers: 0 },
        ia: { active: true, price: 180, students: 0, teachers: 0 },
        coding: { active: true, price: 200, students: 0, teachers: 0 }
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
    },
    cities: {
        florianopolis: { 
            schools: 85, 
            segment: 'todos', 
            yearData: {
                2025: { students: 8000, teachers: 400 },
                2026: { students: 10000, teachers: 800 },
                2027: { students: 12000, teachers: 1000 },
                2028: { students: 16000, teachers: 1300 },
                2029: { students: 20000, teachers: 1600 }
            }
        },
        joinville: { 
            schools: 95, 
            segment: 'todos',
            yearData: {
                2025: { students: 9000, teachers: 450 },
                2026: { students: 12000, teachers: 900 },
                2027: { students: 15000, teachers: 1200 },
                2028: { students: 18000, teachers: 1500 },
                2029: { students: 22000, teachers: 1800 }
            }
        },
        outras: { 
            schools: 825, 
            segment: 'todos',
            yearData: {
                2025: { students: 8000, teachers: 400 },
                2026: { students: 80000, teachers: 6000 },
                2027: { students: 150000, teachers: 12000 },
                2028: { students: 200000, teachers: 16000 },
                2029: { students: 250000, teachers: 20000 }
            }
        }
    },
    currentYear: '2025' // Ano atual selecionado
};

// Estado global da aplicação
const state = loadState() || defaultState;

// Garantir que as cidades sempre existam
if (!state.cities) {
    state.cities = defaultState.cities;
}

// Navegação entre seções
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.dataset.section;
        console.log('Navegando para seção:', section);
        
        // Atualizar botões
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // Atualizar seções
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        document.getElementById(section).classList.add('active');
        
        // Sincronizar dados baseado na seção
        if (section === 'apresentacao') {
            updatePresentationData();
        } else if (section === 'produtos') {
            console.log('Navegou para Produtos - forçando sincronização...');
            setTimeout(() => {
                syncPlanningToProducts();
            }, 100);
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
            console.log('Mudança no controle de alunos:', key, '=', this.value);
            updateAllSections(); // Atualizar todas as seções
        });
        
        number.addEventListener('input', function() {
            range.value = this.value;
            state.students[key] = parseInt(this.value);
            console.log('Mudança no controle de alunos (número):', key, '=', this.value);
            updateAllSections(); // Atualizar todas as seções
        });
    }
    
    syncInputs(fundamentalRange, fundamentalNumber, 'fundamental');
    syncInputs(medioRange, medioNumber, 'medio');
    syncInputs(tecnicoRange, tecnicoNumber, 'tecnico');
}

function updateTotalStudents() {
    const total = state.students.fundamental + state.students.medio + state.students.tecnico;
    const totalElement = document.getElementById('total-alunos');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString('pt-BR');
        console.log('Total de alunos atualizado para:', total.toLocaleString('pt-BR'));
    }
}

// Controles de orçamento
function setupBudgetControls() {
    // Estes elementos foram removidos do planejamento, então só configura se existirem
    const budgetFundamental = document.getElementById('budget-fundamental');
    if (budgetFundamental) {
        budgetFundamental.addEventListener('input', function() {
            state.budget.fundamental = parseFloat(this.value);
            calculateInvestment();
        });
    }
    
    const budgetMedio = document.getElementById('budget-medio');
    if (budgetMedio) {
        budgetMedio.addEventListener('input', function() {
            state.budget.medio = parseFloat(this.value);
            calculateInvestment();
        });
    }
    
    const budgetTecnico = document.getElementById('budget-tecnico');
    if (budgetTecnico) {
        budgetTecnico.addEventListener('input', function() {
            state.budget.tecnico = parseFloat(this.value);
            calculateInvestment();
        });
    }
    
    const teacherAI = document.getElementById('teacher-ai');
    if (teacherAI) {
        teacherAI.addEventListener('input', function() {
            state.budget.teacherAI = parseFloat(this.value);
            calculateInvestment();
        });
    }
    
    const teacherEnglish = document.getElementById('teacher-english');
    if (teacherEnglish) {
        teacherEnglish.addEventListener('input', function() {
            state.budget.teacherEnglish = parseFloat(this.value);
            calculateInvestment();
        });
    }
    
    const teachersCount = document.getElementById('teachers-count');
    if (teachersCount) {
        teachersCount.addEventListener('input', function() {
            state.teachers = parseInt(this.value);
            calculateInvestment();
        });
    }
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
    
    // Atualizar interface - verificar se elementos existem primeiro
    const monthlyEl = document.getElementById('monthly-investment');
    if (monthlyEl) {
        monthlyEl.textContent = 'R$ ' + monthlyWithModality.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    const yearlyEl = document.getElementById('yearly-investment');
    if (yearlyEl) {
        yearlyEl.textContent = 'R$ ' + yearlyStudents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    const teacherEl = document.getElementById('teacher-investment');
    if (teacherEl) {
        teacherEl.textContent = 'R$ ' + teacherInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    const totalEl = document.getElementById('total-investment');
    if (totalEl) {
        totalEl.textContent = 'R$ ' + totalFirstYear.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    updateSimpleChart();
    
    // Atualizar apresentação com novos dados
    updatePresentationData();
    
    // Atualizar dashboard de investimento
    if (document.getElementById('investment-year')) {
        calculateCompiledInvestments();
    }
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
    
    // Atualizar KPIs na apresentação
    updatePresentationKPIs();
}

// Controle de apresentação
let currentSlide = 1;
const totalSlides = 12; // Updated to match new professional presentation

function setupPresentationControls() {
    console.log('Configurando controles da apresentação...');
    
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    console.log('Botão anterior encontrado:', !!prevBtn);
    console.log('Botão próximo encontrado:', !!nextBtn);
    
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Clique no botão anterior. Slide atual:', currentSlide);
            if (currentSlide > 1) {
                currentSlide--;
                console.log('Mudando para slide:', currentSlide);
                updateSlide();
            } else {
                console.log('Já está no primeiro slide');
            }
        });
    } else {
        console.error('Botão prevSlide não encontrado!');
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Clique no botão próximo. Slide atual:', currentSlide);
            if (currentSlide < totalSlides) {
                currentSlide++;
                console.log('Mudando para slide:', currentSlide);
                updateSlide();
            } else {
                console.log('Já está no último slide');
            }
        });
    } else {
        console.error('Botão nextSlide não encontrado!');
    }
    
    // Inicializar apresentação
    console.log('Inicializando apresentação no slide 1');
    updateSlide();
}

function updateSlide() {
    console.log('Atualizando slide para:', currentSlide);
    
    // Atualizar contador
    const currentSlideEl = document.getElementById('currentSlide');
    if (currentSlideEl) {
        currentSlideEl.textContent = currentSlide;
        console.log('Contador atualizado para:', currentSlide);
    }
    
    // Atualizar progress bar
    const progressBar = document.getElementById('slideProgress');
    if (progressBar) {
        const progressPercent = (currentSlide / totalSlides) * 100;
        progressBar.style.width = progressPercent + '%';
    }
    
    // Atualizar slides
    const slides = document.querySelectorAll('.slide');
    console.log('Total de slides encontrados:', slides.length);
    console.log('Slides HTML encontrados:', slides);
    
    slides.forEach((slide, index) => {
        const isActive = index === currentSlide - 1;
        const hadActive = slide.classList.contains('active');
        
        slide.classList.toggle('active', isActive);
        
        if (isActive) {
            console.log(`Slide ativo: ${index + 1}`, slide);
            console.log(`Classes do slide ativo:`, slide.classList.toString());
            console.log(`Altura do slide:`, slide.offsetHeight + 'px');
            console.log(`Display computado:`, window.getComputedStyle(slide).display);
            
            // Verificar se há conteúdo visível
            const hasVisibleContent = slide.querySelector('.slide-header, .slide-content, .slide-content-cover, .slide-content-final');
            console.log(`Tem conteúdo visível:`, !!hasVisibleContent);
            
            if (hasVisibleContent) {
                console.log(`Primeiro elemento de conteúdo:`, hasVisibleContent.tagName, hasVisibleContent.textContent.substring(0, 100));
            }
            
            // Debug específico para slide 12
            if (index + 1 === 12) {
                console.log('=== DEBUG SLIDE 12 ===');
                console.log('Classes:', slide.className);
                console.log('Background:', window.getComputedStyle(slide).background);
                console.log('Color:', window.getComputedStyle(slide).color);
                const finalContent = slide.querySelector('.slide-content-final');
                console.log('Final content found:', !!finalContent);
                if (finalContent) {
                    console.log('Final content display:', window.getComputedStyle(finalContent).display);
                    console.log('Final content color:', window.getComputedStyle(finalContent).color);
                }
                console.log('=== END DEBUG SLIDE 12 ===');
            }
        } else if (hadActive) {
            console.log(`Slide ${index + 1} ficou inativo`);
        }
    });
    
    // Desabilitar botões quando necessário
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides;
    }
    
    // Atualizar dados dinâmicos da apresentação
    updatePresentationData();
}

function updatePresentationData() {
    // Obter totais atualizados
    const totalAvailableStudents = getTotalAvailableStudents();
    const totalAvailableTeachers = getTotalAvailableTeachers();
    
    // Slide 2 - Situação Atual (Interactive)
    const slideCurrentTeachers = document.getElementById('slide-current-teachers');
    const slideCurrentStudents = document.getElementById('slide-current-students');
    if (slideCurrentTeachers) slideCurrentTeachers.textContent = totalAvailableTeachers.toLocaleString('pt-BR');
    if (slideCurrentStudents) slideCurrentStudents.textContent = totalAvailableStudents.toLocaleString('pt-BR');
    
    // Slide 4 - Nossa Proposta (Interactive) 
    const slideTotalStudents = document.getElementById('slide-total-students');
    if (slideTotalStudents) slideTotalStudents.textContent = totalAvailableStudents.toLocaleString('pt-BR');
    
    // Slide 5 - Planejamento por Cidades (Interactive)
    const slideCurrentYear = document.getElementById('slide-current-year');
    if (slideCurrentYear) slideCurrentYear.textContent = state.currentYear;
    
    // Atualizar dados específicos das cidades para o ano atual
    if (state.cities && state.cities.florianopolis && state.cities.florianopolis.yearData && state.cities.florianopolis.yearData[state.currentYear]) {
        const floripaStudents = document.getElementById('slide-floripa-students');
        const floripaTeachers = document.getElementById('slide-floripa-teachers');
        if (floripaStudents) floripaStudents.textContent = state.cities.florianopolis.yearData[state.currentYear].students.toLocaleString('pt-BR');
        if (floripaTeachers) floripaTeachers.textContent = state.cities.florianopolis.yearData[state.currentYear].teachers.toLocaleString('pt-BR');
    }
    
    if (state.cities && state.cities.joinville && state.cities.joinville.yearData && state.cities.joinville.yearData[state.currentYear]) {
        const joinvilleStudents = document.getElementById('slide-joinville-students');
        const joinvilleTeachers = document.getElementById('slide-joinville-teachers');
        if (joinvilleStudents) joinvilleStudents.textContent = state.cities.joinville.yearData[state.currentYear].students.toLocaleString('pt-BR');
        if (joinvilleTeachers) joinvilleTeachers.textContent = state.cities.joinville.yearData[state.currentYear].teachers.toLocaleString('pt-BR');
    }
    
    if (state.cities && state.cities.blumenau && state.cities.blumenau.yearData && state.cities.blumenau.yearData[state.currentYear]) {
        const blumenauStudents = document.getElementById('slide-blumenau-students');
        const blumenauTeachers = document.getElementById('slide-blumenau-teachers');
        if (blumenauStudents) blumenauStudents.textContent = state.cities.blumenau.yearData[state.currentYear].students.toLocaleString('pt-BR');
        if (blumenauTeachers) blumenauTeachers.textContent = state.cities.blumenau.yearData[state.currentYear].teachers.toLocaleString('pt-BR');
    }
    
    // Resumo regional
    const slideRegionalStudents = document.getElementById('slide-regional-students');
    const slideRegionalTeachers = document.getElementById('slide-regional-teachers');
    if (slideRegionalStudents) slideRegionalStudents.textContent = totalAvailableStudents.toLocaleString('pt-BR');
    if (slideRegionalTeachers) slideRegionalTeachers.textContent = totalAvailableTeachers.toLocaleString('pt-BR');
    
    // Slide 6 - Investimento (Interactive)
    const slideInvestment = document.getElementById('slide-total-investment');
    const slideStudentsInvestment = document.getElementById('slide-students-investment');
    if (slideInvestment && slideStudentsInvestment) {
        // Calcular investimento baseado nos dados atuais
        const monthlyStudents = 
            (state.students.fundamental * state.budget.fundamental) +
            (state.students.medio * state.budget.medio) +
            (state.students.tecnico * state.budget.tecnico);
        const monthlyWithModality = monthlyStudents * state.modalityCostModifier;
        const yearlyStudents = monthlyWithModality * 12;
        const teacherInvestment = totalAvailableTeachers * (state.budget.teacherAI + state.budget.teacherEnglish);
        const totalFirstYear = yearlyStudents + teacherInvestment;
        
        slideInvestment.textContent = 'R$ ' + (totalFirstYear / 1000000).toFixed(0) + '.000.000';
        slideStudentsInvestment.textContent = 'R$ ' + (yearlyStudents / 1000000).toFixed(0) + 'M';
    }
    
    // Slide 7 - Resultados e KPIs (Interactive)
    const slideEnglishCert = document.getElementById('slide-english-cert');
    const slideEmployment = document.getElementById('slide-employment');
    if (slideEnglishCert) slideEnglishCert.textContent = state.kpis.englishCert + '%';
    if (slideEmployment) slideEmployment.textContent = state.kpis.jobPlacement + '%';
    
    // Slide 9 - Cronograma (Interactive) 
    const slidePilotStudents = document.getElementById('slide-pilot-students');
    if (slidePilotStudents) {
        const pilotSize = Math.min(totalAvailableStudents, state.pilotStudents);
        slidePilotStudents.textContent = `Piloto com ${pilotSize.toLocaleString('pt-BR')} alunos`;
    }
}

function updatePresentationKPIs() {
    // Slide 7 - KPIs dinâmicos
    const kpiElements = {
        'slide-ideb': state.kpis.idebImprovement,
        'slide-approval': state.kpis.approvalRate,
        'slide-english': state.kpis.englishCert,
        'slide-teacher-fluency': state.kpis.teacherFluency,
        'slide-employment': state.kpis.jobPlacement,
        'slide-salary': state.kpis.salaryIncrease
    };
    
    Object.keys(kpiElements).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const value = kpiElements[id];
            const isImprovement = id === 'slide-ideb' || id === 'slide-salary';
            element.textContent = (isImprovement ? '+' : '') + value + '%';
        }
    });
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
    console.log('DOM loaded, initializing app...');
    
    setupStudentControls();
    setupBudgetControls();
    setupProductControls();
    setupKPIControls();
    setupPresentationControls();
    initializeCityControls();
    setupTimelineControls();
    setupRegionalControls();
    setupSaveButton();
    setupTestControls();
    setupProductYearControls();
    
    // Restaurar valores salvos se existirem
    if (loadState()) {
        restoreFormValues();
    }
    
    // Calcular valores iniciais
    updateTotalStudents();
    calculateInvestment();
    updateEmploymentVisual();
    calculateTestsCosts();
    
    // Garantir que a apresentação esteja atualizada
    updatePresentationData();
    
    // Garantir sincronização inicial de cidades para produtos
    console.log('Fazendo sincronização inicial na inicialização...');
    setTimeout(() => {
        syncPlanningToProducts();
    }, 300);
    
    // Garantir que dashboard de investimento esteja atualizado
    setTimeout(() => {
        if (document.getElementById('investment-year')) {
            calculateCompiledInvestments();
        }
    }, 500);
    
    // Fallback para o botão de salvar - tentar novamente após tudo carregar
    setTimeout(() => {
        const saveBtn = document.getElementById('saveButton');
        console.log('Fallback check - save button found:', !!saveBtn);
        if (saveBtn) {
            console.log('Adding fallback onclick handler');
            
            // Limpar qualquer listener anterior
            saveBtn.onclick = null;
            
            // Adicionar handler direto
            saveBtn.onclick = function(e) {
                e.preventDefault();
                console.log('Fallback onclick triggered!');
                
                // Forçar salvamento das cidades primeiro
                console.log('Current cities state before save:', state.cities);
                
                // Pegar valores atuais dos inputs das cidades
                document.querySelectorAll('.city-students-year, .city-teachers-year').forEach(input => {
                    const city = input.dataset.city;
                    const year = input.dataset.year;
                    const field = input.classList.contains('city-students-year') ? 'students' : 'teachers';
                    const value = parseInt(input.value) || 0;
                    
                    if (state.cities[city] && state.cities[city].yearData && state.cities[city].yearData[year]) {
                        state.cities[city].yearData[year][field] = value;
                        console.log('Force updated:', city, year, field, value);
                    }
                });
                
                console.log('Final cities state for save:', state.cities);
                
                saveState();
                return false;
            };
            
            console.log('Fallback handler added successfully');
        } else {
            console.error('Fallback: Save button still not found!');
        }
    }, 500);
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
    
    // Orçamentos (só restaura se os elementos existirem)
    const budgetFundamental = document.getElementById('budget-fundamental');
    if (budgetFundamental) budgetFundamental.value = state.budget.fundamental;
    
    const budgetMedio = document.getElementById('budget-medio');
    if (budgetMedio) budgetMedio.value = state.budget.medio;
    
    const budgetTecnico = document.getElementById('budget-tecnico');
    if (budgetTecnico) budgetTecnico.value = state.budget.tecnico;
    
    const teacherAI = document.getElementById('teacher-ai');
    if (teacherAI) teacherAI.value = state.budget.teacherAI;
    
    const teacherEnglish = document.getElementById('teacher-english');
    if (teacherEnglish) teacherEnglish.value = state.budget.teacherEnglish;
    
    const teachersCount = document.getElementById('teachers-count');
    if (teachersCount) teachersCount.value = state.teachers;
    
    // Produtos
    document.getElementById('ingles-geral').checked = state.products.inglesGeral.active;
    document.getElementById('ingles-carreiras').checked = state.products.inglesCarreiras.active;
    document.getElementById('espanhol').checked = state.products.espanhol.active;
    document.getElementById('ia').checked = state.products.ia.active;
    document.getElementById('coding').checked = state.products.coding.active;
    
    // Testes
    document.getElementById('test-ingles').checked = state.tests.ingles.active;
    document.getElementById('test-espanhol').checked = state.tests.espanhol.active;
    document.getElementById('test-coding').checked = state.tests.coding.active;
    document.getElementById('test-ia').checked = state.tests.ia.active;
    
    // Restaurar alocações de alunos e professores
    document.querySelectorAll('.product-students').forEach(input => {
        const productKey = input.dataset.product;
        if (state.products[productKey]) {
            input.value = state.products[productKey].students || 0;
        }
    });
    
    document.querySelectorAll('.product-teachers').forEach(input => {
        const productKey = input.dataset.product;
        if (state.products[productKey]) {
            input.value = state.products[productKey].teachers || 0;
        }
    });
    
    // Restaurar ano selecionado
    const yearDropdown = document.getElementById('year-view');
    if (yearDropdown && state.currentYear) {
        yearDropdown.value = state.currentYear;
    }
    
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
    console.log('SaveState function called!');
    
    try {
        // Verificar se as cidades estão no estado
        console.log('Cities in state before save:', state.cities);
        
        // Tentar serializar o estado primeiro
        const stateJson = JSON.stringify(state);
        console.log('State JSON length:', stateJson.length);
        console.log('Cities data in JSON:', stateJson.includes('cities'));
        
        // Salvar no localStorage
        localStorage.setItem('projetoEducacaoSC', stateJson);
        console.log('Estado salvo com sucesso no localStorage');
        
        // Verificar se foi realmente salvo
        const testLoad = localStorage.getItem('projetoEducacaoSC');
        if (testLoad) {
            const testParsed = JSON.parse(testLoad);
            console.log('Verificação: dados foram salvos corretamente:', !!testParsed.cities);
        } else {
            console.error('ERRO: Dados não foram salvos no localStorage!');
        }
        
        // Feedback visual
        const saveBtn = document.getElementById('saveButton');
        if (saveBtn) {
            console.log('Atualizando feedback visual do botão');
            
            // Salvar o HTML original se ainda não foi salvo
            if (!saveBtn.dataset.originalHtml) {
                saveBtn.dataset.originalHtml = saveBtn.innerHTML;
                console.log('HTML original salvo:', saveBtn.dataset.originalHtml);
            }
            
            saveBtn.classList.add('saved');
            saveBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Salvo!
            `;
            
            // Desabilitar temporariamente para evitar cliques múltiplos
            saveBtn.disabled = true;
            console.log('Botão desabilitado temporariamente');
            
            setTimeout(() => {
                console.log('Restaurando botão');
                saveBtn.classList.remove('saved');
                saveBtn.innerHTML = saveBtn.dataset.originalHtml;
                saveBtn.disabled = false;
            }, 2500);
        } else {
            console.error('Save button not found for visual feedback');
        }
        
        console.log('SaveState completed successfully');
        return true;
        
    } catch (error) {
        console.error('Erro detalhado ao salvar estado:', error);
        console.error('Stack trace:', error.stack);
        
        // Mostrar erro no botão
        const saveBtn = document.getElementById('saveButton');
        if (saveBtn) {
            saveBtn.innerHTML = '❌ Erro ao salvar';
            setTimeout(() => {
                saveBtn.innerHTML = saveBtn.dataset.originalHtml || 'Salvar Configurações';
            }, 2000);
        }
        
        return false;
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('projetoEducacaoSC');
        if (saved) {
            const parsed = JSON.parse(saved);
            console.log('Estado carregado do localStorage:', parsed);
            
            // Garantir que as propriedades essenciais existem
            if (!parsed.cities) {
                console.log('Cidades não encontradas no estado salvo, usando padrão');
                parsed.cities = defaultState.cities;
            }
            
            return parsed;
        }
    } catch (error) {
        console.error('Erro ao carregar estado do localStorage:', error);
    }
    
    console.log('Usando estado padrão');
    return null;
}

// Controle do botão de salvar
function setupSaveButton() {
    const saveBtn = document.getElementById('saveButton');
    console.log('Setup save button:', !!saveBtn);
    
    if (saveBtn) {
        // Remover listeners existentes
        saveBtn.removeEventListener('click', saveState);
        
        // Adicionar novo listener
        saveBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Save button clicked!');
            saveState();
        });
        
        console.log('Save button listener attached successfully');
    } else {
        console.error('Save button not found!');
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

// Função para calcular investimentos compilados
function calculateCompiledInvestments() {
    console.log('Calculando investimentos compilados...');
    
    const yearDropdown = document.getElementById('investment-year');
    if (!yearDropdown) {
        console.error('Dropdown de ano não encontrado!');
        return;
    }
    
    const selectedYear = yearDropdown.value;
    console.log('Ano selecionado:', selectedYear);
    
    // Calcular investimentos base
    const studentInvestment = calculateStudentInvestment();
    const teacherInvestment = calculateTeacherInvestment();
    const infrastructureInvestment = calculateInfrastructureInvestment();
    const testInvestment = calculateTestInvestment();
    
    console.log('Investimentos base:', {
        students: studentInvestment,
        teachers: teacherInvestment,
        infrastructure: infrastructureInvestment,
        tests: testInvestment
    });
    
    // Calcular por ano ou total
    let yearMultiplier = 1;
    if (selectedYear !== 'total') {
        const year = parseInt(selectedYear);
        // Aplicar lógica de distribuição por ano (exemplo: crescimento gradual)
        switch(year) {
            case 2025: yearMultiplier = 0.15; break; // Piloto
            case 2026: yearMultiplier = 0.20; break;
            case 2027: yearMultiplier = 0.25; break;
            case 2028: yearMultiplier = 0.20; break;
            case 2029: yearMultiplier = 0.20; break;
        }
    }
    
    console.log('Multiplicador do ano:', yearMultiplier);
    
    // Atualizar valores das categorias
    const studentsTotal = studentInvestment * yearMultiplier;
    const teachersTotal = teacherInvestment * yearMultiplier;
    const infrastructureTotal = infrastructureInvestment * yearMultiplier;
    const testsTotal = testInvestment * yearMultiplier;
    
    console.log('Investimentos finais:', {
        students: studentsTotal,
        teachers: teachersTotal,
        infrastructure: infrastructureTotal,
        tests: testsTotal
    });
    
    updateInvestmentCategory('students-investment', studentsTotal);
    updateInvestmentCategory('teachers-investment', teachersTotal);
    updateInvestmentCategory('infrastructure-investment', infrastructureTotal);
    updateInvestmentCategory('tests-investment', testsTotal);
    
    // Calcular total
    const total = studentsTotal + teachersTotal + infrastructureTotal + testsTotal;
    console.log('Total de investimento:', total);
    
    const totalElement = document.querySelector('.investment-total-value');
    if (totalElement) {
        totalElement.textContent = 'R$ ' + total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        console.log('Total atualizado na interface');
    } else {
        console.error('Elemento de total não encontrado!');
    }
    
    // Atualizar gráfico de timeline
    updateInvestmentTimeline();
    
    // Atualizar grid de cidades
    updateCityInvestmentGrid(selectedYear);
    
    // Atualizar tabela de breakdown
    updateInvestmentBreakdown(selectedYear);
}

function calculateStudentInvestment() {
    // Calcular investimento total em alunos baseado nos valores definidos no planejamento
    let total = 0;
    
    // Usar os valores de orçamento definidos por segmento
    const fundamentalTotal = state.students.fundamental * state.budget.fundamental * 12;
    const medioTotal = state.students.medio * state.budget.medio * 12;
    const tecnicoTotal = state.students.tecnico * state.budget.tecnico * 12;
    
    total = fundamentalTotal + medioTotal + tecnicoTotal;
    
    // Aplicar modificador de modalidade
    return total * state.modalityCostModifier;
}

function calculateTeacherInvestment() {
    // Investimento em capacitação de professores
    let total = 0;
    
    // Curso de IA para professores (one-time)
    if (state.products.ia.active) {
        const aiTeachers = Math.round(state.teachers * (state.budget.teacherAI / 100));
        total += aiTeachers * 300; // R$ 300 por professor (curso único)
    }
    
    // Curso de Inglês para professores (mensal)
    if (state.products.inglesGeral.active || state.products.inglesCarreiras.active) {
        const englishTeachers = Math.round(state.teachers * (state.budget.teacherEnglish / 100));
        total += englishTeachers * 50 * 12; // R$ 50/mês por professor
    }
    
    // Adicionar custos de certificação
    const certificationCost = state.teachers * 0.2 * 500; // 20% dos professores por ano, R$ 500 cada
    
    return total + certificationCost;
}

function calculateInfrastructureInvestment() {
    // Infraestrutura não é considerada neste cálculo de investimento
    // O estado irá fornecer a infraestrutura necessária
    return 0;
}

function calculateTestInvestment() {
    // Usar cálculo existente de testes
    let totalCost = 0;
    
    if (state.tests.ingles.active) {
        const englishTeachers = Math.round(state.teachers * 0.2);
        const englishStudents = Math.round((state.students.fundamental + state.students.medio) * 0.3);
        const technicalStudents = state.students.tecnico;
        const englishTotal = (englishTeachers + englishStudents + technicalStudents) * state.tests.ingles.price;
        totalCost += englishTotal;
    }
    
    if (state.tests.espanhol.active) {
        const spanishStudents = Math.round((state.students.fundamental + state.students.medio) * 0.1);
        const spanishTotal = spanishStudents * state.tests.espanhol.price;
        totalCost += spanishTotal;
    }
    
    if (state.tests.coding.active) {
        const codingStudents = Math.round((state.students.medio + state.students.tecnico) * 0.2);
        const codingTotal = codingStudents * state.tests.coding.price;
        totalCost += codingTotal;
    }
    
    if (state.tests.ia.active) {
        const iaStudents = Math.round((state.students.medio + state.students.tecnico) * 0.15);
        const iaTotal = (state.teachers + iaStudents) * state.tests.ia.price;
        totalCost += iaTotal;
    }
    
    return totalCost;
}

function updateInvestmentCategory(elementId, value) {
    console.log('Atualizando categoria:', elementId, 'valor:', value);
    const element = document.getElementById(elementId);
    if (element) {
        const displayValue = 'R$ ' + (value / 1000000).toFixed(1) + 'M';
        element.textContent = displayValue;
        console.log('Categoria', elementId, 'atualizada para:', displayValue);
    } else {
        console.error('Elemento não encontrado:', elementId);
    }
}

function updateInvestmentTimeline() {
    // Criar visualização da timeline de investimentos
    const timeline = document.querySelector('.investment-timeline');
    if (!timeline) return;
    
    const years = [2025, 2026, 2027, 2028, 2029];
    const yearlyInvestments = years.map(year => {
        let multiplier;
        switch(year) {
            case 2025: multiplier = 0.15; break;
            case 2026: multiplier = 0.20; break;
            case 2027: multiplier = 0.25; break;
            case 2028: multiplier = 0.20; break;
            case 2029: multiplier = 0.20; break;
        }
        const total = calculateStudentInvestment() + calculateTeacherInvestment() + 
                     calculateInfrastructureInvestment() + calculateTestInvestment();
        return total * multiplier;
    });
    
    const maxInvestment = Math.max(...yearlyInvestments);
    
    // Limpar timeline existente
    timeline.innerHTML = '<h3>Timeline de Investimentos</h3><div class="timeline-bars"></div>';
    const barsContainer = timeline.querySelector('.timeline-bars');
    
    years.forEach((year, index) => {
        const barHeight = (yearlyInvestments[index] / maxInvestment) * 100;
        const barElement = document.createElement('div');
        barElement.className = 'timeline-bar';
        barElement.innerHTML = `
            <div class="bar-fill" style="height: ${barHeight}%"></div>
            <div class="bar-value">R$ ${(yearlyInvestments[index] / 1000000).toFixed(1)}M</div>
            <div class="bar-year">${year}</div>
        `;
        barsContainer.appendChild(barElement);
    });
}

function updateCityInvestmentGrid(selectedYear) {
    const grid = document.querySelector('.city-investment-grid');
    if (!grid) return;
    
    // Lista de principais cidades de SC
    const cities = [
        { name: 'Florianópolis', students: 45000, schools: 80 },
        { name: 'Joinville', students: 65000, schools: 110 },
        { name: 'Blumenau', students: 42000, schools: 75 },
        { name: 'São José', students: 30000, schools: 55 },
        { name: 'Criciúma', students: 28000, schools: 50 },
        { name: 'Chapecó', students: 35000, schools: 60 },
        { name: 'Itajaí', students: 25000, schools: 45 },
        { name: 'Lages', students: 22000, schools: 40 }
    ];
    
    // Limpar grid existente
    grid.innerHTML = '<h3>Investimento por Cidade/Região</h3><div class="city-cards"></div>';
    const cardsContainer = grid.querySelector('.city-cards');
    
    // Calcular investimento proporcional por cidade
    const totalStateStudents = state.students.fundamental + state.students.medio + state.students.tecnico;
    
    cities.forEach(city => {
        const cityProportion = city.students / totalStateStudents;
        const cityInvestment = (calculateStudentInvestment() + calculateTeacherInvestment()) * cityProportion;
        
        let yearlyInvestment = cityInvestment;
        if (selectedYear !== 'total') {
            const year = parseInt(selectedYear);
            let multiplier;
            switch(year) {
                case 2025: multiplier = 0.15; break;
                case 2026: multiplier = 0.20; break;
                case 2027: multiplier = 0.25; break;
                case 2028: multiplier = 0.20; break;
                case 2029: multiplier = 0.20; break;
            }
            yearlyInvestment *= multiplier;
        }
        
        const card = document.createElement('div');
        card.className = 'city-card';
        card.innerHTML = `
            <h4>${city.name}</h4>
            <div class="city-stats">
                <div class="stat">
                    <span class="label">Alunos:</span>
                    <span class="value">${city.students.toLocaleString('pt-BR')}</span>
                </div>
                <div class="stat">
                    <span class="label">Escolas:</span>
                    <span class="value">${city.schools}</span>
                </div>
                <div class="stat investment">
                    <span class="label">Investimento:</span>
                    <span class="value">R$ ${(yearlyInvestment / 1000000).toFixed(2)}M</span>
                </div>
            </div>
        `;
        cardsContainer.appendChild(card);
    });
}

// Controle do dropdown de ano em produtos
function setupProductYearControls() {
    const yearDropdown = document.getElementById('year-view');
    if (yearDropdown) {
        yearDropdown.addEventListener('change', updateProductsByYear);
        // Atualizar dados iniciais
        updateProductsByYear();
    }
}

function updateProductsByYear() {
    const yearDropdown = document.getElementById('year-view');
    if (!yearDropdown) {
        // Se não existe o dropdown, usar o ano padrão
        state.currentYear = state.currentYear || '2025';
    } else {
        const selectedYear = yearDropdown.value;
        state.currentYear = selectedYear;
    }
    
    console.log('Atualizando produtos por ano:', state.currentYear);
    
    // Usar dados das cidades em vez do cálculo antigo
    let availableStudents = 0;
    let availableTeachers = 0;
    
    if (state.currentYear === 'total') {
        // Somar todos os anos de todas as cidades
        Object.values(state.cities).forEach(city => {
            if (city.yearData) {
                Object.values(city.yearData).forEach(yearData => {
                    availableStudents += yearData.students || 0;
                    availableTeachers += yearData.teachers || 0;
                });
            }
        });
    } else {
        // Usar dados das cidades para o ano específico
        Object.values(state.cities).forEach(city => {
            if (city.yearData && city.yearData[state.currentYear]) {
                availableStudents += city.yearData[state.currentYear].students || 0;
                availableTeachers += city.yearData[state.currentYear].teachers || 0;
            }
        });
    }
    
    console.log('Totais calculados - Alunos:', availableStudents, 'Professores:', availableTeachers);
    
    // Atualizar displays principais
    updateAvailableTotals(availableStudents, availableTeachers);
    
    // Configurar controles de alocação se estiverem na página de produtos
    if (document.querySelector('.product-students')) {
        setupAllocationControls();
    }
}

function updateAvailableTotals(availableStudents, availableTeachers) {
    // Calcular quantos já foram alocados
    let allocatedStudents = 0;
    let allocatedTeachers = 0;
    
    Object.keys(state.products).forEach(productKey => {
        const product = state.products[productKey];
        console.log(`Produto ${productKey}: active=${product.active}, students=${product.students}, teachers=${product.teachers}`);
        if (product.active) {
            allocatedStudents += product.students || 0;
            allocatedTeachers += product.teachers || 0;
        }
    });
    
    // Calcular restantes e porcentagens
    const remainingStudents = Math.max(0, availableStudents - allocatedStudents);
    const remainingTeachers = Math.max(0, availableTeachers - allocatedTeachers);
    const studentsPercent = availableStudents > 0 ? Math.round((allocatedStudents / availableStudents) * 100) : 0;
    const teachersPercent = availableTeachers > 0 ? Math.round((allocatedTeachers / availableTeachers) * 100) : 0;
    
    console.log('Atualizando totais disponíveis - Restantes:', remainingStudents, 'de', availableStudents);
    
    // Atualizar contadores principais
    const totalStudentsEl = document.getElementById('products-total-students');
    const totalTeachersEl = document.getElementById('products-total-teachers');
    
    if (totalStudentsEl) {
        totalStudentsEl.textContent = remainingStudents.toLocaleString('pt-BR');
        totalStudentsEl.style.color = remainingStudents === 0 ? '#10b981' : remainingStudents < availableStudents * 0.1 ? '#f59e0b' : '';
        console.log('Total de alunos atualizado para:', remainingStudents.toLocaleString('pt-BR'));
    } else {
        console.log('Elemento products-total-students não encontrado (normal se não estiver na aba Produtos)');
    }
    
    if (totalTeachersEl) {
        totalTeachersEl.textContent = remainingTeachers.toLocaleString('pt-BR');
        totalTeachersEl.style.color = remainingTeachers === 0 ? '#10b981' : remainingTeachers < availableTeachers * 0.1 ? '#f59e0b' : '';
        console.log('Total de professores atualizado para:', remainingTeachers.toLocaleString('pt-BR'));
    } else {
        console.log('Elemento products-total-teachers não encontrado (normal se não estiver na aba Produtos)');
    }
    
    // Atualizar barras de progresso - sempre tentar
    updateProgressBars(studentsPercent, teachersPercent, remainingStudents, remainingTeachers, allocatedStudents, allocatedTeachers, availableStudents, availableTeachers);
    updateAllocationStatus(studentsPercent, teachersPercent);
    
    console.log('=== RESUMO ALOCAÇÃO ===');
    console.log('Disponível:', availableStudents, 'Alocado:', allocatedStudents, 'Restante:', remainingStudents, 'Percentual:', studentsPercent + '%');
    console.log('========================');
    
    return { remainingStudents, remainingTeachers, availableStudents, availableTeachers };
}

function updateProgressBars(studentsPercent, teachersPercent, remainingStudents, remainingTeachers, allocatedStudents, allocatedTeachers, availableStudents, availableTeachers) {
    console.log('Atualizando barras de progresso...');
    
    // Barra de progresso de alunos
    const studentsFill = document.getElementById('students-progress-fill');
    const studentsText = document.getElementById('students-progress-text');
    
    console.log('Elementos encontrados - Fill:', !!studentsFill, 'Text:', !!studentsText);
    
    if (studentsFill) {
        studentsFill.style.width = studentsPercent + '%';
        console.log('Largura da barra atualizada para:', studentsPercent + '%');
        if (studentsPercent >= 90) {
            studentsFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        } else if (studentsPercent >= 70) {
            studentsFill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        } else {
            studentsFill.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa)';
        }
    } else {
        console.log('Elemento students-progress-fill não encontrado!');
    }
    
    if (studentsText) {
        const totalStudents = availableStudents || (allocatedStudents + remainingStudents);
        const newText = `${studentsPercent}% alocado (${allocatedStudents.toLocaleString('pt-BR')} de ${totalStudents.toLocaleString('pt-BR')})`;
        studentsText.textContent = newText;
        console.log('Texto de progresso atualizado para:', newText);
    } else {
        console.log('Elemento students-progress-text não encontrado!');
    }
    
    // Barra de progresso de professores
    const teachersFill = document.getElementById('teachers-progress-fill');
    const teachersText = document.getElementById('teachers-progress-text');
    
    if (teachersFill) {
        teachersFill.style.width = teachersPercent + '%';
        if (teachersPercent >= 90) {
            teachersFill.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
        } else if (teachersPercent >= 70) {
            teachersFill.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
        } else {
            teachersFill.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa)';
        }
    }
    
    if (teachersText) {
        const totalTeachers = availableTeachers || (allocatedTeachers + remainingTeachers);
        teachersText.textContent = `${teachersPercent}% alocado (${allocatedTeachers.toLocaleString('pt-BR')} de ${totalTeachers.toLocaleString('pt-BR')})`;
    }
}

function updateAllocationStatus(studentsPercent, teachersPercent) {
    const statusEl = document.getElementById('allocation-status');
    if (!statusEl) return;
    
    const avgPercent = (studentsPercent + teachersPercent) / 2;
    
    // Remover classes existentes
    statusEl.classList.remove('complete', 'warning');
    
    if (avgPercent >= 95) {
        statusEl.classList.add('complete');
        statusEl.innerHTML = '<span>✅ Alocação completa! Todos os recursos foram distribuídos.</span>';
    } else if (avgPercent >= 70) {
        statusEl.classList.add('warning');
        statusEl.innerHTML = `<span>⚡ ${avgPercent.toFixed(0)}% alocado. Quase lá!</span>`;
    } else if (avgPercent > 0) {
        statusEl.innerHTML = `<span>📊 ${avgPercent.toFixed(0)}% alocado. Continue configurando abaixo.</span>`;
    } else {
        statusEl.innerHTML = '<span>🎯 Configure as quantidades abaixo</span>';
    }
}

function setupAllocationControls() {
    console.log('Configurando controles de alocação...');
    
    // Configurar todos os inputs de alunos e professores
    const studentInputs = document.querySelectorAll('.product-students');
    const teacherInputs = document.querySelectorAll('.product-teachers');
    
    console.log('Encontrados inputs de alunos:', studentInputs.length);
    console.log('Encontrados inputs de professores:', teacherInputs.length);
    
    studentInputs.forEach((input, index) => {
        const productKey = input.dataset.product;
        console.log('Configurando input de aluno:', productKey, 'index:', index);
        
        // Garantir que o campo seja editável
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
        input.style.backgroundColor = 'white';
        input.style.cursor = 'text';
        
        // Restaurar valor salvo
        const savedValue = state.products[productKey]?.students || 0;
        input.value = savedValue;
        console.log('Valor restaurado para', productKey, ':', savedValue);
        
        // Adicionar listener direto
        input.removeEventListener('input', handleStudentAllocation); // Evitar duplicatas
        input.addEventListener('input', function(e) {
            const productKey = e.target.dataset.product;
            const newValue = parseInt(e.target.value) || 0;
            
            console.log('EVENTO DISPARADO! Produto:', productKey, 'Valor:', newValue);
            
            // Atualizar estado imediatamente
            state.products[productKey].students = newValue;
            
            // Recalcular totais alocados
            let totalAllocated = 0;
            Object.keys(state.products).forEach(key => {
                if (state.products[key].active) {
                    totalAllocated += state.products[key].students || 0;
                    console.log(`${key}: ${state.products[key].students} alunos`);
                }
            });
            
            // Obter total disponível
            const totalAvailable = getTotalAvailableStudents();
            const remaining = Math.max(0, totalAvailable - totalAllocated);
            const percentage = Math.round((totalAllocated / totalAvailable) * 100);
            
            console.log(`Total disponível: ${totalAvailable}, Alocado: ${totalAllocated}, Restante: ${remaining}, %: ${percentage}`);
            
            // Atualizar display imediatamente
            const availableEl = document.getElementById('products-total-students');
            const progressTextEl = document.getElementById('students-progress-text');
            const progressFillEl = document.getElementById('students-progress-fill');
            
            if (availableEl) {
                availableEl.textContent = remaining.toLocaleString('pt-BR');
            }
            
            if (progressTextEl) {
                progressTextEl.textContent = `${percentage}% alocado (${totalAllocated.toLocaleString('pt-BR')} de ${totalAvailable.toLocaleString('pt-BR')})`;
            }
            
            if (progressFillEl) {
                progressFillEl.style.width = percentage + '%';
            }
            
            // Salvar estado
            saveState();
        });
        
        // Adicionar múltiplos eventos para debug
        input.addEventListener('focus', function() {
            console.log('Campo de alunos focado:', productKey);
        });
        
        input.addEventListener('click', function() {
            console.log('Campo de alunos clicado:', productKey);
        });
    });
    
    teacherInputs.forEach((input, index) => {
        const productKey = input.dataset.product;
        console.log('Configurando input de professor:', productKey, 'index:', index);
        
        // Garantir que o campo seja editável
        input.removeAttribute('readonly');
        input.removeAttribute('disabled');
        input.style.pointerEvents = 'auto';
        input.style.backgroundColor = 'white';
        input.style.cursor = 'text';
        
        // Restaurar valor salvo
        const savedValue = state.products[productKey]?.teachers || 0;
        input.value = savedValue;
        console.log('Valor restaurado para professor', productKey, ':', savedValue);
        
        // Adicionar listener
        input.removeEventListener('input', handleTeacherAllocation); // Evitar duplicatas
        input.addEventListener('input', handleTeacherAllocation);
        
        // Adicionar múltiplos eventos para debug
        input.addEventListener('focus', function() {
            console.log('Campo de professores focado:', productKey);
        });
        
        input.addEventListener('click', function() {
            console.log('Campo de professores clicado:', productKey);
        });
    });
}

function handleStudentAllocation(event) {
    const input = event.target;
    const productKey = input.dataset.product;
    const newValue = parseInt(input.value) || 0;
    
    console.log('handleStudentAllocation chamado:', productKey, 'novo valor:', newValue);
    
    // Atualizar estado
    if (!state.products[productKey]) {
        console.error('Produto não encontrado no estado:', productKey);
        return;
    }
    
    state.products[productKey].students = newValue;
    console.log('Estado atualizado para produto:', productKey, 'alunos:', newValue);
    
    // Obter totais disponíveis
    const totalAvailable = getTotalAvailableStudents();
    const totalTeachers = getTotalAvailableTeachers();
    console.log('Totais disponíveis - Alunos:', totalAvailable, 'Professores:', totalTeachers);
    
    // Calcular alocados
    let totalAllocated = 0;
    Object.values(state.products).forEach(product => {
        if (product.active) {
            totalAllocated += product.students || 0;
        }
    });
    
    const remaining = Math.max(0, totalAvailable - totalAllocated);
    console.log('Total alocado:', totalAllocated, 'Restante:', remaining);
    
    // Atualizar display imediatamente
    const totalStudentsEl = document.getElementById('products-total-students');
    if (totalStudentsEl) {
        totalStudentsEl.textContent = remaining.toLocaleString('pt-BR');
        console.log('Display atualizado para:', remaining.toLocaleString('pt-BR'));
    }
    
    // Atualizar totais
    updateAvailableTotals(totalAvailable, totalTeachers);
    
    // Auto-save
    saveState();
}

function handleTeacherAllocation(event) {
    const input = event.target;
    const productKey = input.dataset.product;
    const newValue = parseInt(input.value) || 0;
    
    // Atualizar estado
    if (state.products[productKey]) {
        state.products[productKey].teachers = newValue;
    }
    
    // Atualizar totais
    updateAvailableTotals(
        getTotalAvailableStudents(),
        getTotalAvailableTeachers()
    );
    
    // Auto-save
    saveState();
}

function getTotalAvailableStudents() {
    // Usar dados das cidades em vez do cálculo antigo
    let totalStudents = 0;
    
    if (state.currentYear === 'total') {
        // Somar todos os anos de todas as cidades
        Object.values(state.cities).forEach(city => {
            if (city.yearData) {
                Object.values(city.yearData).forEach(yearData => {
                    totalStudents += yearData.students || 0;
                });
            }
        });
    } else {
        // Somar apenas o ano específico
        Object.values(state.cities).forEach(city => {
            if (city.yearData && city.yearData[state.currentYear]) {
                totalStudents += city.yearData[state.currentYear].students || 0;
            }
        });
    }
    
    console.log('Total de alunos disponíveis para', state.currentYear, ':', totalStudents);
    return totalStudents;
}

function getTotalAvailableTeachers() {
    // Usar dados das cidades em vez do cálculo antigo
    let totalTeachers = 0;
    
    if (state.currentYear === 'total') {
        // Somar todos os anos de todas as cidades
        Object.values(state.cities).forEach(city => {
            if (city.yearData) {
                Object.values(city.yearData).forEach(yearData => {
                    totalTeachers += yearData.teachers || 0;
                });
            }
        });
    } else {
        // Somar apenas o ano específico
        Object.values(state.cities).forEach(city => {
            if (city.yearData && city.yearData[state.currentYear]) {
                totalTeachers += city.yearData[state.currentYear].teachers || 0;
            }
        });
    }
    
    console.log('Total de professores disponíveis para', state.currentYear, ':', totalTeachers);
    return totalTeachers;
}

// Adicionar listener para o dropdown de ano
document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que o DOM está totalmente carregado
    setTimeout(() => {
        const investmentYearDropdown = document.getElementById('investment-year');
        console.log('Dropdown de investimento encontrado:', !!investmentYearDropdown);
        
        if (investmentYearDropdown) {
            investmentYearDropdown.addEventListener('change', calculateCompiledInvestments);
            console.log('Calculando investimentos iniciais...');
            calculateCompiledInvestments();
        } else {
            console.error('Dropdown de investimento não encontrado!');
        }
        
        // Configurar controles de ano em produtos
        setupProductYearControls();
        
        // Auto-save ao fazer mudanças
        setupAutoSave();
    }, 100);
});

// Sistema de auto-save
function setupAutoSave() {
    // Salvar automaticamente a cada mudança importante
    const autoSaveElements = [
        'input[type="range"]',
        'input[type="number"]', 
        'input[type="checkbox"]',
        'input[type="radio"]',
        'select'
    ];
    
    autoSaveElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.addEventListener('change', () => {
                // Atualizar todas as seções
                updateAllSections();
                
                // Salvar com delay
                setTimeout(() => {
                    saveState();
                }, 500);
            });
        });
    });
}

// Função para atualizar todas as seções quando há mudança
function updateAllSections() {
    console.log('Atualizando todas as seções...');
    
    // Atualizar totais de alunos
    updateTotalStudents();
    
    // Recalcular investimentos
    calculateInvestment();
    
    // Atualizar KPIs visuais
    updateEmploymentVisual();
    
    // Recalcular testes
    calculateTestsCosts();
    
    // Atualizar produtos por ano
    updateProductsByYear();
    
    // Atualizar apresentação
    updatePresentationData();
    
    // Atualizar dashboard de investimento
    if (document.getElementById('investment-year')) {
        setTimeout(() => {
            calculateCompiledInvestments();
        }, 100);
    }
}

// Funções para gerenciar cidades
function initializeCityControls() {
    // Event listeners para escolas
    document.querySelectorAll('.city-schools').forEach(input => {
        input.addEventListener('input', function() {
            const city = this.dataset.city;
            state.cities[city].schools = parseInt(this.value) || 0;
            updateCitiesTotals();
            updateAllSections();
            saveState();
        });
    });

    // Event listeners para dados por ano
    document.querySelectorAll('.city-students-year, .city-teachers-year').forEach(input => {
        console.log('Adding listener to city input:', input.dataset.city, input.dataset.year);
        
        input.addEventListener('input', function() {
            const city = this.dataset.city;
            const year = this.dataset.year;
            const field = this.classList.contains('city-students-year') ? 'students' : 'teachers';
            
            console.log('City input changed:', city, year, field, this.value);
            
            if (!state.cities[city]) {
                console.log('Creating city data for:', city);
                state.cities[city] = { schools: 0, segment: 'todos', yearData: {} };
            }
            
            if (!state.cities[city].yearData) {
                state.cities[city].yearData = {};
            }
            
            if (!state.cities[city].yearData[year]) {
                state.cities[city].yearData[year] = { students: 0, teachers: 0 };
            }
            
            const newValue = parseInt(this.value) || 0;
            state.cities[city].yearData[year][field] = newValue;
            
            console.log('Updated state for', city, year, field, ':', newValue);
            console.log('Current state:', state.cities[city].yearData[year]);
            
            console.log('Atualizando depois da mudança no campo da cidade...');
            updateCitiesTotals();
            syncPlanningToProducts();
            updateAllSections();
            
            // Salvar automaticamente após mudança
            setTimeout(() => {
                saveState();
            }, 300);
        });
    });

    // Event listeners para segmentos
    document.querySelectorAll('.city-segment').forEach(select => {
        select.addEventListener('change', function() {
            const city = this.dataset.city;
            state.cities[city].segment = this.value;
            saveState();
        });
    });

    // Event listener para mudança de ano
    const yearView = document.getElementById('year-view');
    console.log('Year view dropdown found:', !!yearView);
    if (yearView) {
        console.log('Current year view value:', yearView.value);
        
        yearView.addEventListener('change', function() {
            console.log('Ano mudou de', state.currentYear, 'para', this.value);
            state.currentYear = this.value;
            updateCitiesTotals();
            syncPlanningToProducts();
            updateAllSections();
            saveState();
        });
    }

    // Carregar valores salvos
    loadCityValues();
    updateCitiesTotals();
    
    // Garantir sincronização inicial
    console.log('Fazendo sincronização inicial...');
    syncPlanningToProducts();
}

function loadCityValues() {
    console.log('Loading city values from state:', state.cities);
    
    // Verificar se cities existe
    if (!state.cities) {
        console.error('state.cities is undefined! Using default cities.');
        state.cities = defaultState.cities;
    }
    
    // Carregar valores das cidades do estado
    Object.keys(state.cities).forEach(cityKey => {
        const city = state.cities[cityKey];
        console.log('Loading city:', cityKey, city);
        
        // Schools
        const schoolsInput = document.querySelector(`.city-schools[data-city="${cityKey}"]`);
        if (schoolsInput) {
            schoolsInput.value = city.schools;
            console.log('Loaded schools for', cityKey, ':', city.schools);
        }
        
        // Year data
        if (city.yearData) {
            Object.keys(city.yearData).forEach(year => {
                const yearData = city.yearData[year];
                console.log('Loading year data for', cityKey, year, ':', yearData);
                
                // Students for year
                const studentsInput = document.querySelector(`.city-students-year[data-city="${cityKey}"][data-year="${year}"]`);
                if (studentsInput) {
                    studentsInput.value = yearData.students;
                    console.log('Loaded students for', cityKey, year, ':', yearData.students);
                } else {
                    console.log('Students input not found for', cityKey, year);
                }
                
                // Teachers for year
                const teachersInput = document.querySelector(`.city-teachers-year[data-city="${cityKey}"][data-year="${year}"]`);
                if (teachersInput) {
                    teachersInput.value = yearData.teachers;
                    console.log('Loaded teachers for', cityKey, year, ':', yearData.teachers);
                } else {
                    console.log('Teachers input not found for', cityKey, year);
                }
            });
        } else {
            console.log('No yearData for city:', cityKey);
        }
        
        // Segment
        const segmentSelect = document.querySelector(`.city-segment[data-city="${cityKey}"]`);
        if (segmentSelect) {
            segmentSelect.value = city.segment;
            console.log('Loaded segment for', cityKey, ':', city.segment);
        }
    });
}

function updateCitiesTotals() {
    let totalSchools = 0;
    let totalStudents = 0;
    let totalTeachers = 0;

    // Somar todos os valores das cidades para o ano atual
    Object.values(state.cities).forEach(city => {
        totalSchools += city.schools || 0;
        
        if (city.yearData && city.yearData[state.currentYear]) {
            totalStudents += city.yearData[state.currentYear].students || 0;
            totalTeachers += city.yearData[state.currentYear].teachers || 0;
        }
    });

    // Atualizar displays
    const schoolsEl = document.getElementById('cities-total-schools');
    const studentsEl = document.getElementById('cities-total-students');
    const teachersEl = document.getElementById('cities-total-teachers');

    if (schoolsEl) schoolsEl.textContent = totalSchools.toLocaleString('pt-BR');
    if (studentsEl) studentsEl.textContent = totalStudents.toLocaleString('pt-BR');
    if (teachersEl) teachersEl.textContent = totalTeachers.toLocaleString('pt-BR');

    // Atualizar totais principais baseados no planejamento das cidades
    const fundamentalRatio = 0.55; // 55% fundamental
    const medioRatio = 0.35; // 35% médio  
    const tecnicoRatio = 0.10; // 10% técnico

    state.students.fundamental = Math.round(totalStudents * fundamentalRatio);
    state.students.medio = Math.round(totalStudents * medioRatio);
    state.students.tecnico = Math.round(totalStudents * tecnicoRatio);
    state.teachers = totalTeachers;

    // Atualizar displays principais
    updateTotalStudents();
}

function syncPlanningToProducts() {
    console.log('=== SINCRONIZANDO PLANEJAMENTO → PRODUTOS ===');
    console.log('Ano atual:', state.currentYear);
    console.log('Cities data:', state.cities);
    
    // Sincronizar dados do planejamento para produtos baseado no ano selecionado
    let totalStudents = 0;
    let totalTeachers = 0;

    // Calcular totais para o ano atual
    if (state.cities) {
        Object.keys(state.cities).forEach(cityKey => {
            const city = state.cities[cityKey];
            console.log(`Processando cidade ${cityKey}:`, city);
            
            if (city.yearData && city.yearData[state.currentYear]) {
                const yearData = city.yearData[state.currentYear];
                totalStudents += yearData.students || 0;
                totalTeachers += yearData.teachers || 0;
                console.log(`${cityKey} ${state.currentYear}: ${yearData.students} alunos, ${yearData.teachers} professores`);
            } else {
                console.log(`${cityKey}: Sem dados para ${state.currentYear}`);
            }
        });
    }

    console.log(`TOTAIS CALCULADOS: ${totalStudents} alunos, ${totalTeachers} professores`);

    // Atualizar displays no tab produtos
    const productsStudentsEl = document.getElementById('products-total-students');
    const productsTeachersEl = document.getElementById('products-total-teachers');

    if (productsStudentsEl) {
        productsStudentsEl.textContent = totalStudents.toLocaleString('pt-BR');
        console.log('Atualizado products-total-students para:', totalStudents.toLocaleString('pt-BR'));
    } else {
        console.error('Elemento products-total-students não encontrado!');
    }
    
    if (productsTeachersEl) {
        productsTeachersEl.textContent = totalTeachers.toLocaleString('pt-BR');
        console.log('Atualizado products-total-teachers para:', totalTeachers.toLocaleString('pt-BR'));
    } else {
        console.error('Elemento products-total-teachers não encontrado!');
    }

    console.log('=== FIM SINCRONIZAÇÃO ===');
}

// Função para exportar/imprimir
window.print = function() {
    window.print();
};

// Função de debug para testar sincronização manualmente
window.testSync = function() {
    console.log('=== TESTE MANUAL DE SINCRONIZAÇÃO ===');
    console.log('Estado atual das cidades:', state.cities);
    console.log('Ano atual:', state.currentYear);
    
    // Forçar sincronização
    syncPlanningToProducts();
    
    // Verificar elementos
    const studentsEl = document.getElementById('products-total-students');
    const teachersEl = document.getElementById('products-total-teachers');
    console.log('Elemento alunos encontrado:', !!studentsEl);
    console.log('Elemento professores encontrado:', !!teachersEl);
    
    if (studentsEl) console.log('Valor atual alunos:', studentsEl.textContent);
    if (teachersEl) console.log('Valor atual professores:', teachersEl.textContent);
};