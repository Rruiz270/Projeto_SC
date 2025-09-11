// Função para atualizar breakdown detalhado
function updateInvestmentBreakdown(selectedYear) {
    const tbody = document.getElementById('investment-breakdown-body');
    const totalElement = document.getElementById('breakdown-total');
    
    if (!tbody || !totalElement) return;
    
    tbody.innerHTML = '';
    let grandTotal = 0;
    
    // Multiplicador por ano
    let yearMultiplier = 1;
    if (selectedYear !== 'total') {
        const year = parseInt(selectedYear);
        switch(year) {
            case 2025: yearMultiplier = 0.15; break;
            case 2026: yearMultiplier = 0.20; break;
            case 2027: yearMultiplier = 0.25; break;
            case 2028: yearMultiplier = 0.20; break;
            case 2029: yearMultiplier = 0.20; break;
        }
    }
    
    // Alunos - Ensino Fundamental
    if (state.students.fundamental > 0) {
        const fundamentalTotal = state.students.fundamental * state.budget.fundamental * 12 * yearMultiplier * state.modalityCostModifier;
        tbody.innerHTML += `
            <tr>
                <td>Alunos</td>
                <td>Ensino Fundamental - Plataforma Digital</td>
                <td>${Math.round(state.students.fundamental * yearMultiplier).toLocaleString('pt-BR')}</td>
                <td>R$ ${state.budget.fundamental.toFixed(2)}/mês</td>
                <td>R$ ${fundamentalTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;
        grandTotal += fundamentalTotal;
    }
    
    // Alunos - Ensino Médio
    if (state.students.medio > 0) {
        const medioTotal = state.students.medio * state.budget.medio * 12 * yearMultiplier * state.modalityCostModifier;
        tbody.innerHTML += `
            <tr>
                <td>Alunos</td>
                <td>Ensino Médio - Plataforma Digital</td>
                <td>${Math.round(state.students.medio * yearMultiplier).toLocaleString('pt-BR')}</td>
                <td>R$ ${state.budget.medio.toFixed(2)}/mês</td>
                <td>R$ ${medioTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;
        grandTotal += medioTotal;
    }
    
    // Alunos - Técnico
    if (state.students.tecnico > 0) {
        const tecnicoTotal = state.students.tecnico * state.budget.tecnico * 12 * yearMultiplier * state.modalityCostModifier;
        tbody.innerHTML += `
            <tr>
                <td>Alunos</td>
                <td>Ensino Técnico - Plataforma Digital + Certificação</td>
                <td>${Math.round(state.students.tecnico * yearMultiplier).toLocaleString('pt-BR')}</td>
                <td>R$ ${state.budget.tecnico.toFixed(2)}/mês</td>
                <td>R$ ${tecnicoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;
        grandTotal += tecnicoTotal;
    }
    
    // Professores - IA
    if (state.products.ia.active && state.budget.teacherAI > 0) {
        const aiTeachers = Math.round(state.teachers * (state.budget.teacherAI / 100) * yearMultiplier);
        const aiTeachersTotal = aiTeachers * 300;
        tbody.innerHTML += `
            <tr>
                <td>Professores</td>
                <td>Capacitação em IA (curso único)</td>
                <td>${aiTeachers.toLocaleString('pt-BR')}</td>
                <td>R$ 300,00</td>
                <td>R$ ${aiTeachersTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;
        grandTotal += aiTeachersTotal;
    }
    
    // Professores - Inglês
    if ((state.products.inglesGeral.active || state.products.inglesCarreiras.active) && state.budget.teacherEnglish > 0) {
        const englishTeachers = Math.round(state.teachers * (state.budget.teacherEnglish / 100) * yearMultiplier);
        const englishTeachersTotal = englishTeachers * 50 * 12;
        tbody.innerHTML += `
            <tr>
                <td>Professores</td>
                <td>Capacitação em Inglês (mensal)</td>
                <td>${englishTeachers.toLocaleString('pt-BR')}</td>
                <td>R$ 50,00/mês</td>
                <td>R$ ${englishTeachersTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
            </tr>
        `;
        grandTotal += englishTeachersTotal;
    }
    
    // Infraestrutura não é considerada - fornecida pelo estado
    // (removido os custos de laboratórios e plataforma digital)
    
    // Testes - Inglês
    if (state.tests.ingles.active) {
        const englishGeneralStudents = Math.round((state.products.inglesGeral.students || 0) * yearMultiplier);
        const englishCareerStudents = Math.round((state.products.inglesCarreiras.students || 0) * yearMultiplier);
        const englishGeneralTeachers = Math.round((state.products.inglesGeral.teachers || 0) * yearMultiplier);
        const englishCareerTeachers = Math.round((state.products.inglesCarreiras.teachers || 0) * yearMultiplier);
        const englishTestTakers = englishGeneralStudents + englishCareerStudents + englishGeneralTeachers + englishCareerTeachers;
        const englishTestTotal = englishTestTakers * state.tests.ingles.price;
        
        if (englishTestTakers > 0) {
            tbody.innerHTML += `
                <tr>
                    <td>Avaliações</td>
                    <td>Certificação Internacional de Inglês</td>
                    <td>${englishTestTakers.toLocaleString('pt-BR')}</td>
                    <td>R$ ${state.tests.ingles.price.toFixed(2)}</td>
                    <td>R$ ${englishTestTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            `;
            grandTotal += englishTestTotal;
        }
    }
    
    // Testes - Espanhol
    if (state.tests.espanhol.active) {
        const spanishStudents = Math.round((state.products.espanhol.students || 0) * yearMultiplier);
        const spanishTeachers = Math.round((state.products.espanhol.teachers || 0) * yearMultiplier);
        const spanishTestTakers = spanishStudents + spanishTeachers;
        const spanishTestTotal = spanishTestTakers * state.tests.espanhol.price;
        
        if (spanishTestTakers > 0) {
            tbody.innerHTML += `
                <tr>
                    <td>Avaliações</td>
                    <td>Certificação de Espanhol</td>
                    <td>${spanishTestTakers.toLocaleString('pt-BR')}</td>
                    <td>R$ ${state.tests.espanhol.price.toFixed(2)}</td>
                    <td>R$ ${spanishTestTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            `;
            grandTotal += spanishTestTotal;
        }
    }
    
    // Testes - Coding
    if (state.tests.coding.active) {
        const codingStudents = Math.round((state.products.coding.students || 0) * yearMultiplier);
        const codingTeachers = Math.round((state.products.coding.teachers || 0) * yearMultiplier);
        const codingTestTakers = codingStudents + codingTeachers;
        const codingTestTotal = codingTestTakers * state.tests.coding.price;
        
        if (codingTestTakers > 0) {
            tbody.innerHTML += `
                <tr>
                    <td>Avaliações</td>
                    <td>Certificação de Programação</td>
                    <td>${codingTestTakers.toLocaleString('pt-BR')}</td>
                    <td>R$ ${state.tests.coding.price.toFixed(2)}</td>
                    <td>R$ ${codingTestTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            `;
            grandTotal += codingTestTotal;
        }
    }
    
    // Testes - IA
    if (state.tests.ia.active) {
        const iaStudents = Math.round((state.products.ia.students || 0) * yearMultiplier);
        const iaTeachers = Math.round((state.products.ia.teachers || 0) * yearMultiplier);
        const iaTestTakers = iaStudents + iaTeachers;
        const iaTestTotal = iaTestTakers * state.tests.ia.price;
        
        if (iaTestTakers > 0) {
            tbody.innerHTML += `
                <tr>
                    <td>Avaliações</td>
                    <td>Certificação em IA</td>
                    <td>${iaTestTakers.toLocaleString('pt-BR')}</td>
                    <td>R$ ${state.tests.ia.price.toFixed(2)}</td>
                    <td>R$ ${iaTestTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
            `;
            grandTotal += iaTestTotal;
        }
    }
    
    // Atualizar total
    totalElement.textContent = 'R$ ' + grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}