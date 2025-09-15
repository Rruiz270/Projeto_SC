// Estado global com nova estrutura segmentada
const state = {
    students: {
        fundamental1: 140000,    // 1º ao 5º ano (Anos Iniciais)
        fundamental2: 140000,    // 6º ao 9º ano (Anos Finais)
        medio: 120000,           // 1º ao 3º ano Ensino Médio
        medioTecnico: 120000     // Ensino Médio Técnico
    },
    regions: {
        itajai_portos: { 
            name: 'Itajaí - Portos e Logística',
            schools: 120, 
            focus: 'logistica',
            yearData: {
                2025: { students: 15000, teachers: 750 },
                2026: { students: 25000, teachers: 1250 },
                2027: { students: 35000, teachers: 1750 },
                2028: { students: 45000, teachers: 2250 },
                2029: { students: 55000, teachers: 2750 }
            }
        },
        floripa_turismo: { 
            name: 'Florianópolis - Turismo e Tecnologia',
            schools: 95, 
            focus: 'tecnologia',
            yearData: {
                2025: { students: 12000, teachers: 600 },
                2026: { students: 20000, teachers: 1000 },
                2027: { students: 28000, teachers: 1400 },
                2028: { students: 36000, teachers: 1800 },
                2029: { students: 44000, teachers: 2200 }
            }
        },
        jaragua_industria: { 
            name: 'Jaraguá do Sul - Indústria WEG',
            schools: 85, 
            focus: 'industria',
            yearData: {
                2025: { students: 10000, teachers: 500 },
                2026: { students: 18000, teachers: 900 },
                2027: { students: 26000, teachers: 1300 },
                2028: { students: 33000, teachers: 1650 },
                2029: { students: 40000, teachers: 2000 }
            }
        },
        outras_regioes: { 
            name: 'Outras Regiões de SC',
            schools: 700, 
            focus: 'geral',
            yearData: {
                2025: { students: 263000, teachers: 13150 },
                2026: { students: 337000, teachers: 16850 },
                2027: { students: 411000, teachers: 20550 },
                2028: { students: 466000, teachers: 23300 },
                2029: { students: 521000, teachers: 26050 }
            }
        }
    },
    products: {
        ia: { active: true, students: 0, teachers: 0 },
        inglesGeral: { active: true, students: 0, teachers: 0 },
        inglesCarreiras: { active: true, students: 0, teachers: 0 },
        espanhol: { active: true, students: 0, teachers: 0 },
        coding: { active: true, students: 0, teachers: 0 }
    },
    tests: {
        ingles: { active: true, price: 120 },
        espanhol: { active: true, price: 100 },
        coding: { active: true, price: 150 },
        ia: { active: true, price: 130 }
    },
    budget: {
        fundamental1: 15.00,  // R$ por aluno/mês
        fundamental2: 18.00,  // R$ por aluno/mês
        medio: 22.00,         // R$ por aluno/mês
        medioTecnico: 28.00,  // R$ por aluno/mês
        teacherAI: 70,        // % de professores que farão IA
        teacherEnglish: 50    // % de professores que farão inglês
    },
    teacherValorization: {
        bronze: { bonus: 300, requirement: 'Certificação Básica IA' },
        silver: { bonus: 500, requirement: 'IA + Inglês Intermediário' },
        gold: { bonus: 800, requirement: 'Todas as Certificações + Mentoria' }
    }
};

// Inicialização quando DOM carrega
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateAllCalculations();
    updateProductDisplays();
    updateTestDisplays();
    updateInvestmentDisplays();
    saveState();
});

// Event Listeners
function initializeEventListeners() {
    // Navegação entre seções
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
        });
    });

    // Controles de segmentos de alunos
    ['fundamental1', 'fundamental2', 'medio', 'medioTecnico'].forEach(segment => {
        const rangeInput = document.getElementById(segment);
        const numberInput = document.getElementById(`${segment}-number`);
        
        if (rangeInput && numberInput) {
            rangeInput.addEventListener('input', function() {
                const value = parseInt(this.value);
                numberInput.value = value;
                state.students[segment] = value;
                updateAllCalculations();
                saveState();
            });
            
            numberInput.addEventListener('change', function() {
                const value = parseInt(this.value);
                rangeInput.value = value;
                state.students[segment] = value;
                updateAllCalculations();
                saveState();
            });
        }
    });

    // Controles de regiões
    document.querySelectorAll('.region-schools').forEach(input => {
        input.addEventListener('change', function() {
            const region = this.dataset.region;
            const value = parseInt(this.value);
            if (state.regions[region]) {
                state.regions[region].schools = value;
                updateAllCalculations();
                saveState();
            }
        });
    });
}

// Navegação entre seções
function showSection(sectionName) {
    // Remover classe active de todos os botões e seções
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.content-section').forEach(section => section.classList.remove('active'));
    
    // Adicionar classe active ao botão e seção correspondentes
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    document.getElementById(sectionName).classList.add('active');
}

// Cálculos principais
function updateAllCalculations() {
    updateTotalStudents();
    updateTotalTeachers();
    updateTotalSchools();
    updateProductAllocations();
    updateSummaryCards();
    updateProductDisplays();
    updateTestDisplays();
    updateInvestmentDisplays();
}

function updateTotalStudents() {
    const total = state.students.fundamental1 + state.students.fundamental2 + 
                 state.students.medio + state.students.medioTecnico;
    
    const totalElement = document.getElementById('total-alunos');
    if (totalElement) {
        totalElement.textContent = total.toLocaleString('pt-BR');
    }
    
    const summaryElement = document.getElementById('summary-total-students');
    if (summaryElement) {
        summaryElement.textContent = total.toLocaleString('pt-BR');
    }
}

function updateTotalTeachers() {
    const totalStudents = state.students.fundamental1 + state.students.fundamental2 + 
                         state.students.medio + state.students.medioTecnico;
    const totalTeachers = Math.round(totalStudents / 20); // Proporção 20:1
    
    const summaryElement = document.getElementById('summary-total-teachers');
    if (summaryElement) {
        summaryElement.textContent = totalTeachers.toLocaleString('pt-BR');
    }
}

function updateTotalSchools() {
    const totalSchools = Object.values(state.regions).reduce((sum, region) => sum + region.schools, 0);
    
    const summaryElement = document.getElementById('summary-total-schools');
    if (summaryElement) {
        summaryElement.textContent = totalSchools.toLocaleString('pt-BR');
    }
}

function updateProductAllocations() {
    // Alocação básica por segmento
    const total = state.students.fundamental1 + state.students.fundamental2 + 
                 state.students.medio + state.students.medioTecnico;
    
    // IA - mais focado no ensino médio e técnico
    state.products.ia.students = Math.round(
        (state.students.medio * 0.4) + (state.students.medioTecnico * 0.6)
    );
    
    // Inglês Geral - todos os segmentos
    state.products.inglesGeral.students = Math.round(total * 0.7);
    
    // Inglês Carreiras - foco no médio técnico
    state.products.inglesCarreiras.students = Math.round(state.students.medioTecnico * 0.8);
    
    // Espanhol - principalmente ensino médio
    state.products.espanhol.students = Math.round(
        (state.students.medio * 0.3) + (state.students.medioTecnico * 0.4)
    );
    
    // Coding - foco no técnico
    state.products.coding.students = Math.round(state.students.medioTecnico * 0.5);
    
    // Professores (proporção fixa)
    const totalTeachers = Math.round(total / 20);
    state.products.ia.teachers = Math.round(totalTeachers * 0.7);
    state.products.inglesGeral.teachers = Math.round(totalTeachers * 0.5);
    state.products.inglesCarreiras.teachers = Math.round(totalTeachers * 0.3);
    state.products.espanhol.teachers = Math.round(totalTeachers * 0.2);
    state.products.coding.teachers = Math.round(totalTeachers * 0.4);
}

function updateSummaryCards() {
    // Atualizar cards de resumo na seção de planejamento
    updateTotalStudents();
    updateTotalTeachers();
    updateTotalSchools();
}

// Funções de persistência
function saveState() {
    try {
        localStorage.setItem('educacaoSC_newStructure', JSON.stringify(state));
    } catch (e) {
        console.warn('Não foi possível salvar no localStorage:', e);
    }
}

function loadState() {
    try {
        const saved = localStorage.getItem('educacaoSC_newStructure');
        if (saved) {
            const parsedState = JSON.parse(saved);
            // Mesclar com estado padrão para garantir compatibilidade
            Object.assign(state, parsedState);
        }
    } catch (e) {
        console.warn('Erro ao carregar estado salvo:', e);
    }
}

// Funções de cálculo de investimento adaptadas para nova estrutura
function calculateTotalInvestment() {
    const total = (state.students.fundamental1 * state.budget.fundamental1 * 12) +
                 (state.students.fundamental2 * state.budget.fundamental2 * 12) +
                 (state.students.medio * state.budget.medio * 12) +
                 (state.students.medioTecnico * state.budget.medioTecnico * 12);
    
    return total;
}

function calculateTeacherInvestment() {
    const totalStudents = state.students.fundamental1 + state.students.fundamental2 + 
                         state.students.medio + state.students.medioTecnico;
    const totalTeachers = Math.round(totalStudents / 20);
    
    const aiTeacherCost = Math.round(totalTeachers * (state.budget.teacherAI / 100)) * 300;
    const englishTeacherCost = Math.round(totalTeachers * (state.budget.teacherEnglish / 100)) * 50 * 12;
    
    return aiTeacherCost + englishTeacherCost;
}

function calculateTestInvestment() {
    let testTotal = 0;
    
    // Certificações por produto ativo
    Object.keys(state.tests).forEach(testType => {
        if (state.tests[testType].active) {
            const productKey = testType === 'ingles' ? 'inglesGeral' : testType;
            const product = state.products[productKey];
            
            if (product) {
                const testTakers = (product.students || 0) + (product.teachers || 0);
                testTotal += testTakers * state.tests[testType].price;
            }
        }
    });
    
    return testTotal;
}

// Funções específicas para valorização do professor
function calculateTeacherValorization() {
    const totalStudents = state.students.fundamental1 + state.students.fundamental2 + 
                         state.students.medio + state.students.medioTecnico;
    const totalTeachers = Math.round(totalStudents / 20);
    
    // Estimativa de distribuição por níveis
    const bronzeTeachers = Math.round(totalTeachers * 0.4);
    const silverTeachers = Math.round(totalTeachers * 0.35);
    const goldTeachers = Math.round(totalTeachers * 0.25);
    
    const annualCost = (bronzeTeachers * state.teacherValorization.bronze.bonus * 12) +
                      (silverTeachers * state.teacherValorization.silver.bonus * 12) +
                      (goldTeachers * state.teacherValorization.gold.bonus * 12);
    
    return {
        totalTeachers,
        distribution: { bronze: bronzeTeachers, silver: silverTeachers, gold: goldTeachers },
        annualCost
    };
}

// Funções para atualizar displays das seções
function updateProductDisplays() {
    // Atualizar números na seção de produtos
    const elements = {
        'ia-students': state.products.ia.students,
        'ia-teachers': state.products.ia.teachers,
        'ingles-geral-students': state.products.inglesGeral.students,
        'ingles-geral-teachers': state.products.inglesGeral.teachers,
        'ingles-carreiras-students': state.products.inglesCarreiras.students,
        'ingles-carreiras-teachers': state.products.inglesCarreiras.teachers,
        'coding-students': state.products.coding.students,
        'coding-teachers': state.products.coding.teachers
    };
    
    Object.entries(elements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value.toLocaleString('pt-BR');
        }
    });
}

function updateTestDisplays() {
    // Calcular participantes dos testes
    const englishTakers = (state.products.inglesGeral.students || 0) + 
                         (state.products.inglesCarreiras.students || 0) +
                         (state.products.inglesGeral.teachers || 0) + 
                         (state.products.inglesCarreiras.teachers || 0);
    
    const codingTakers = (state.products.coding.students || 0) + 
                        (state.products.coding.teachers || 0);
    
    const iaTakers = (state.products.ia.students || 0) + 
                    (state.products.ia.teachers || 0);
    
    const totalTakers = englishTakers + codingTakers + iaTakers;
    
    // Calcular custos
    const englishTotal = englishTakers * state.tests.ingles.price;
    const codingTotal = codingTakers * state.tests.coding.price;
    const iaTotal = iaTakers * state.tests.ia.price;
    const totalInvestment = englishTotal + codingTotal + iaTotal;
    
    // Atualizar elementos
    const testElements = {
        'english-test-takers': englishTakers,
        'english-test-total': `R$ ${englishTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        'coding-test-takers': codingTakers,
        'coding-test-total': `R$ ${codingTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        'ia-test-takers': iaTakers,
        'ia-test-total': `R$ ${iaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
        'total-test-takers': totalTakers,
        'total-test-investment': `R$ ${totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    };
    
    Object.entries(testElements).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = typeof value === 'string' ? value : value.toLocaleString('pt-BR');
        }
    });
}

function updateInvestmentDisplays() {
    // Calcular investimentos por segmento
    const platformCosts = {
        fund1: state.students.fundamental1 * state.budget.fundamental1 * 12,
        fund2: state.students.fundamental2 * state.budget.fundamental2 * 12,
        medio: state.students.medio * state.budget.medio * 12,
        medioTecnico: state.students.medioTecnico * state.budget.medioTecnico * 12
    };
    
    const totalPlatform = Object.values(platformCosts).reduce((sum, cost) => sum + cost, 0);
    
    // Calcular custos de capacitação
    const totalStudents = state.students.fundamental1 + state.students.fundamental2 + 
                         state.students.medio + state.students.medioTecnico;
    const totalTeachers = Math.round(totalStudents / 20);
    
    const aiTrainingCost = Math.round(totalTeachers * (state.budget.teacherAI / 100)) * 300;
    const englishTrainingCost = Math.round(totalTeachers * (state.budget.teacherEnglish / 100)) * 50 * 12;
    const totalTraining = aiTrainingCost + englishTrainingCost;
    
    // Calcular valorização
    const valorization = calculateTeacherValorization();
    
    // Calcular total de certificações
    const totalCertifications = calculateTestInvestment();
    
    // Total anual
    const totalAnnual = totalPlatform + totalTraining + valorization.annualCost;
    
    // Total 5 anos (incluindo certificações uma vez)
    const total5Years = (totalAnnual * 5) + totalCertifications;
    
    // Atualizar displays seria feito aqui, mas como são muitos elementos,
    // vou deixar os cálculos prontos para uso
    console.log('Investimentos calculados:', {
        platform: totalPlatform,
        training: totalTraining,
        valorization: valorization.annualCost,
        certifications: totalCertifications,
        annual: totalAnnual,
        fiveYears: total5Years
    });
}

// Debug e utilidades
function logState() {
    console.log('Estado atual:', state);
}

// Expor funções globais necessárias
window.state = state;
window.updateAllCalculations = updateAllCalculations;
window.updateProductDisplays = updateProductDisplays;
window.updateTestDisplays = updateTestDisplays;
window.updateInvestmentDisplays = updateInvestmentDisplays;
window.saveState = saveState;
window.loadState = loadState;
window.logState = logState;

// Carregar estado salvo na inicialização
loadState();