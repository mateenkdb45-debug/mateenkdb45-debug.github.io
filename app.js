// Sample data from the application_data_json
const samplePapers = [
    {
        title: "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        authors: ["Patrick Lewis", "Ethan Perez", "Aleksandra Piktus"],
        abstract: "Large pre-trained language models have been shown to store factual knowledge in their parameters, and achieve state-of-the-art results when fine-tuned on downstream NLP tasks. However, their ability to access and precisely manipulate knowledge is still limited, and hence on knowledge-intensive tasks, their performance lags behind task-specific architectures. Additionally, providing provenance for their decisions and updating their world knowledge remain open research problems.",
        year: 2020,
        venue: "NeurIPS",
        citations: 1250,
        relevance_score: 0.95,
        doi: "10.48550/arXiv.2005.11401"
    },
    {
        title: "Multi-Agent Systems for Scientific Discovery",
        authors: ["Sarah Johnson", "Michael Chen", "David Rodriguez"],
        abstract: "This paper presents a comprehensive framework for multi-agent systems in scientific discovery, focusing on collaborative research automation. We demonstrate how specialized AI agents can work together to accelerate the research process through literature analysis, hypothesis generation, and experimental design coordination.",
        year: 2023,
        venue: "AAAI",
        citations: 89,
        relevance_score: 0.87,
        doi: "10.1609/aaai.v37i1.12345"
    },
    {
        title: "Natural Language Processing for Academic Literature Analysis",
        authors: ["Emma Wilson", "James Thompson", "Maria Garcia"],
        abstract: "We propose novel NLP techniques for automated analysis of academic literature, including citation network analysis and topic modeling. Our approach leverages transformer-based models to extract semantic relationships and identify research trends across large corpora of scientific publications.",
        year: 2022,
        venue: "ACL",
        citations: 234,
        relevance_score: 0.82,
        doi: "10.18653/v1/2022.acl-long.123"
    }
];

const sampleHypotheses = [
    {
        hypothesis: "Multi-agent research systems can improve literature review efficiency by 60% compared to traditional manual methods",
        confidence: 0.85,
        testability: "High",
        category: "System Performance",
        background: "Based on analysis of current research automation tools and efficiency metrics from comparative studies in academic workflow optimization."
    },
    {
        hypothesis: "IBM Granite models outperform general-purpose LLMs in academic text summarization tasks",
        confidence: 0.78,
        testability: "High", 
        category: "Model Performance",
        background: "Considering specialized training on academic corpora and domain-specific optimization for research-oriented tasks."
    }
];

const researchStatistics = {
    papers_processed: 15420,
    citations_managed: 48930,
    reports_generated: 1250,
    hypotheses_created: 890,
    accuracy_rate: 94.2
};

const graniteModels = [
    {
        name: "Granite 3.2 8B Instruct",
        description: "General-purpose instruction-following model optimized for research tasks",
        parameters: "8B",
        use_case: "Text generation, summarization, analysis"
    },
    {
        name: "Granite 3.2 2B Instruct", 
        description: "Lightweight model for fast processing and real-time applications",
        parameters: "2B",
        use_case: "Quick queries, classification, filtering"
    },
    {
        name: "Granite Guardian 3.2",
        description: "Safety and quality control model for content validation",
        parameters: "Specialized",
        use_case: "Content moderation, quality assessment"
    }
];

// Global state
let currentModule = 'dashboard';
let selectedPapers = [];
let currentCitations = [];
let currentHypotheses = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    animateCounters();
    populateStatistics();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const module = this.getAttribute('data-module');
            switchModule(module);
        });
    });
}

function switchModule(moduleName) {
    // Hide all modules
    const modules = document.querySelectorAll('.module');
    modules.forEach(module => {
        module.classList.remove('active');
    });

    // Show selected module
    const targetModule = document.getElementById(moduleName);
    if (targetModule) {
        targetModule.classList.add('active');
    }

    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-module') === moduleName) {
            link.classList.add('active');
        }
    });

    currentModule = moduleName;
    
    // Initialize module-specific content
    switch(moduleName) {
        case 'literature':
            initializeLiteratureSearch();
            break;
        case 'analysis':
            initializeAnalysis();
            break;
        case 'hypothesis':
            initializeHypothesis();
            break;
        case 'citations':
            initializeCitations();
            break;
        case 'reports':
            initializeReports();
            break;
    }
}

// Animate counters on dashboard
function animateCounters() {
    const counters = [
        { element: document.getElementById('papers-count'), target: researchStatistics.papers_processed },
        { element: document.getElementById('citations-count'), target: researchStatistics.citations_managed },
        { element: document.getElementById('reports-count'), target: researchStatistics.reports_generated },
        { element: document.getElementById('hypotheses-count'), target: researchStatistics.hypotheses_created }
    ];

    counters.forEach(counter => {
        if (counter.element) {
            animateCounter(counter.element, counter.target);
        }
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 20);
}

function populateStatistics() {
    // This could be used for additional statistics display
    console.log('Statistics populated:', researchStatistics);
}

// Literature Search Module
function initializeLiteratureSearch() {
    const queryInput = document.getElementById('search-query');
    if (queryInput && !queryInput.value) {
        queryInput.value = 'multi-agent systems for scientific discovery';
    }
}

function performSearch() {
    const query = document.getElementById('search-query').value;
    const resultsContainer = document.getElementById('search-results');
    
    if (!query.trim()) {
        alert('Please enter a search query');
        return;
    }

    // Show loading state
    resultsContainer.innerHTML = '<div class="loading-message">Searching with IBM Granite models...</div>';
    resultsContainer.classList.add('active');

    // Simulate search with delay
    setTimeout(() => {
        displaySearchResults(samplePapers);
    }, 1500);
}

function displaySearchResults(papers) {
    const resultsContainer = document.getElementById('search-results');
    
    let resultsHTML = `
        <div class="results-header">
            <h3>Search Results (${papers.length} papers found)</h3>
            <p>Results ranked by IBM Granite semantic similarity</p>
        </div>
    `;

    papers.forEach((paper, index) => {
        resultsHTML += `
            <div class="result-item" data-paper-index="${index}">
                <div class="result-header">
                    <h4 class="result-title">${paper.title}</h4>
                    <span class="relevance-score">${Math.round(paper.relevance_score * 100)}% match</span>
                </div>
                <div class="result-authors">Authors: ${paper.authors.join(', ')}</div>
                <div class="result-meta">
                    <span><strong>Year:</strong> ${paper.year}</span>
                    <span><strong>Venue:</strong> ${paper.venue}</span>
                    <span><strong>Citations:</strong> ${paper.citations}</span>
                    <span><strong>DOI:</strong> ${paper.doi}</span>
                </div>
                <div class="result-abstract">${paper.abstract}</div>
                <div class="result-actions">
                    <button class="btn btn--primary btn--sm" onclick="selectPaper(${index})">Select for Analysis</button>
                    <button class="btn btn--outline btn--sm" onclick="addToCitations(${index})">Add to Citations</button>
                    <button class="btn btn--outline btn--sm" onclick="viewFullText(${index})">View Full Text</button>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = resultsHTML;
}

function selectPaper(index) {
    const paper = samplePapers[index];
    if (!selectedPapers.find(p => p.doi === paper.doi)) {
        selectedPapers.push(paper);
        showNotification(`"${paper.title}" selected for analysis`);
        
        // Update UI to show selection
        const resultItem = document.querySelector(`[data-paper-index="${index}"]`);
        resultItem.style.border = '2px solid var(--ibm-blue-primary)';
        resultItem.style.background = 'var(--color-bg-1)';
    }
}

function addToCitations(index) {
    const paper = samplePapers[index];
    if (!currentCitations.find(c => c.doi === paper.doi)) {
        currentCitations.push(paper);
        showNotification(`Citation added for "${paper.title}"`);
    }
}

function viewFullText(index) {
    const paper = samplePapers[index];
    showNotification(`Opening full text for "${paper.title}"`);
    // In a real app, this would open the paper or redirect to the publisher
}

// Document Analysis Module
function initializeAnalysis() {
    if (selectedPapers.length > 0) {
        displayAnalysisResults();
    }
}

function simulateUpload() {
    const analysisResults = document.getElementById('analysis-results');
    analysisResults.innerHTML = '<div class="loading-message">Processing documents with IBM Granite...</div>';
    analysisResults.classList.add('active');

    setTimeout(() => {
        // Simulate analysis of uploaded papers
        if (selectedPapers.length === 0) {
            // Use first sample paper as uploaded document
            selectedPapers.push(samplePapers[0]);
        }
        displayAnalysisResults();
    }, 2000);
}

function displayAnalysisResults() {
    const resultsContainer = document.getElementById('analysis-results');
    
    if (selectedPapers.length === 0) {
        resultsContainer.innerHTML = '<p>No documents selected for analysis. Please select papers from the Literature Search.</p>';
        resultsContainer.classList.add('active');
        return;
    }

    let analysisHTML = `
        <div class="analysis-header">
            <h3>Document Analysis Results</h3>
            <p>Analysis completed using IBM Granite 3.2 8B Instruct model</p>
        </div>
    `;

    selectedPapers.forEach((paper, index) => {
        const concepts = extractKeyConcepts(paper);
        const entities = extractEntities(paper);
        
        analysisHTML += `
            <div class="analysis-item">
                <h4>${paper.title}</h4>
                <div class="analysis-section">
                    <h5>Key Concepts</h5>
                    <div class="key-concepts">
                        ${concepts.map(concept => `<span class="concept-tag">${concept}</span>`).join('')}
                    </div>
                </div>
                <div class="analysis-section">
                    <h5>Named Entities</h5>
                    <div class="key-concepts">
                        ${entities.map(entity => `<span class="concept-tag">${entity}</span>`).join('')}
                    </div>
                </div>
                <div class="analysis-section">
                    <h5>AI-Generated Summary</h5>
                    <p>${generateSummary(paper)}</p>
                </div>
                <div class="analysis-section">
                    <h5>Research Impact Score</h5>
                    <div class="impact-score">
                        <strong>${calculateImpactScore(paper)}/10</strong>
                        <span class="score-explanation">Based on citations, venue prestige, and content analysis</span>
                    </div>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = analysisHTML;
    resultsContainer.classList.add('active');
}

function extractKeyConcepts(paper) {
    // Simulate concept extraction
    const concepts = [
        'Language Models',
        'Knowledge Retrieval',
        'Neural Networks',
        'Multi-Agent Systems',
        'Natural Language Processing',
        'Scientific Discovery',
        'Automated Research',
        'Machine Learning'
    ];
    
    return concepts.slice(0, Math.floor(Math.random() * 4) + 3);
}

function extractEntities(paper) {
    // Simulate entity extraction
    const entities = [
        'BERT',
        'GPT',
        'Transformer',
        'NeurIPS',
        'AAAI',
        'Stanford University',
        'MIT',
        'Google Research'
    ];
    
    return entities.slice(0, Math.floor(Math.random() * 3) + 2);
}

function generateSummary(paper) {
    const summaries = [
        "This research presents innovative approaches to automated knowledge discovery using advanced AI architectures. The methodology demonstrates significant improvements in processing efficiency and accuracy.",
        "The paper introduces novel frameworks for multi-agent collaboration in research environments. Key findings show substantial benefits in research workflow automation and knowledge synthesis.",
        "This work advances the state-of-the-art in natural language understanding for academic content. The proposed methods show promising results for large-scale literature analysis tasks."
    ];
    
    return summaries[Math.floor(Math.random() * summaries.length)];
}

function calculateImpactScore(paper) {
    // Simple impact calculation based on citations and venue
    const citationScore = Math.min(paper.citations / 100, 5);
    const venueScore = paper.venue === 'NeurIPS' ? 4 : paper.venue === 'AAAI' ? 3.5 : 3;
    const yearScore = (2024 - paper.year) <= 2 ? 1 : 0.5;
    
    return Math.min(Math.round((citationScore + venueScore + yearScore) * 10) / 10, 10);
}

// Hypothesis Generation Module
function initializeHypothesis() {
    // Pre-populate if we have analysis results
    if (selectedPapers.length > 0) {
        const questionField = document.getElementById('research-question');
        const contextField = document.getElementById('research-context');
        
        if (questionField && !questionField.value) {
            questionField.value = "How can multi-agent AI systems improve the efficiency of scientific research processes?";
        }
        
        if (contextField && !contextField.value) {
            contextField.value = "Current research workflows are time-intensive and require significant manual effort. AI-powered systems show promise for automation, but the effectiveness of multi-agent approaches needs investigation.";
        }
    }
}

function generateHypotheses() {
    const question = document.getElementById('research-question').value;
    const context = document.getElementById('research-context').value;
    const resultsContainer = document.getElementById('hypothesis-results');
    
    if (!question.trim() || !context.trim()) {
        alert('Please provide both research question and context');
        return;
    }

    // Show loading state
    resultsContainer.innerHTML = '<div class="loading-message">Generating hypotheses with IBM Granite Guardian...</div>';
    resultsContainer.classList.add('active');

    setTimeout(() => {
        displayGeneratedHypotheses();
    }, 2000);
}

function displayGeneratedHypotheses() {
    const resultsContainer = document.getElementById('hypothesis-results');
    
    let hypothesesHTML = `
        <div class="hypothesis-header">
            <h3>Generated Hypotheses</h3>
            <p>Hypotheses generated using IBM Granite models with research context analysis</p>
        </div>
    `;

    // Use sample hypotheses and generate additional ones
    const allHypotheses = [...sampleHypotheses, generateAdditionalHypotheses()].flat();
    
    allHypotheses.forEach((hyp, index) => {
        hypothesesHTML += `
            <div class="hypothesis-item">
                <div class="hypothesis-text">${hyp.hypothesis}</div>
                <div class="hypothesis-meta">
                    <div class="meta-item">
                        <div class="meta-label">Confidence</div>
                        <div class="meta-value">${Math.round(hyp.confidence * 100)}%</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Testability</div>
                        <div class="meta-value">${hyp.testability}</div>
                    </div>
                    <div class="meta-item">
                        <div class="meta-label">Category</div>
                        <div class="meta-value">${hyp.category}</div>
                    </div>
                </div>
                <div class="hypothesis-background">
                    <strong>Background:</strong> ${hyp.background}
                </div>
                <div class="hypothesis-actions" style="margin-top: 16px;">
                    <button class="btn btn--primary btn--sm" onclick="refineHypothesis(${index})">Refine Hypothesis</button>
                    <button class="btn btn--outline btn--sm" onclick="generateTestPlan(${index})">Generate Test Plan</button>
                </div>
            </div>
        `;
    });

    resultsContainer.innerHTML = hypothesesHTML;
    currentHypotheses = allHypotheses;
}

function generateAdditionalHypotheses() {
    return [
        {
            hypothesis: "Automated citation analysis can reduce research literature review time by 75% while maintaining accuracy above 90%",
            confidence: 0.82,
            testability: "High",
            category: "Automation Efficiency",
            background: "Analyzing the potential of AI-driven citation networks and semantic analysis for accelerating literature reviews."
        },
        {
            hypothesis: "Domain-specific language models like IBM Granite achieve 15% better performance than general models in academic text processing",
            confidence: 0.76,
            testability: "High",
            category: "Model Specialization",
            background: "Evaluating the benefits of specialized training data and model architecture for academic domain tasks."
        }
    ];
}

function refineHypothesis(index) {
    const hypothesis = currentHypotheses[index];
    showNotification(`Refining hypothesis: "${hypothesis.hypothesis.substring(0, 50)}..."`);
    // In a real app, this would open a refinement interface
}

function generateTestPlan(index) {
    const hypothesis = currentHypotheses[index];
    showNotification(`Generating test plan for: "${hypothesis.hypothesis.substring(0, 50)}..."`);
    // In a real app, this would generate an experimental design
}

// Citation Management Module
function initializeCitations() {
    if (currentCitations.length === 0) {
        // Add sample citations from selected papers
        currentCitations = [...samplePapers];
    }
    displayCitations();
}

function displayCitations() {
    const citationList = document.getElementById('citation-list');
    const formatSelect = document.querySelector('.citation-format');
    const format = formatSelect ? formatSelect.value : 'APA Style';
    
    if (currentCitations.length === 0) {
        citationList.innerHTML = '<p>No citations added yet. Add papers from the Literature Search.</p>';
        citationList.classList.add('active');
        return;
    }

    let citationsHTML = `
        <div class="citations-header">
            <h3>Bibliography (${currentCitations.length} items)</h3>
            <p>Formatted in ${format}</p>
        </div>
    `;

    currentCitations.forEach((paper, index) => {
        const citation = formatCitation(paper, format);
        citationsHTML += `
            <div class="citation-item">
                <div class="citation-text">${citation}</div>
                <div class="citation-actions">
                    <button class="btn btn--outline btn--sm" onclick="editCitation(${index})">Edit</button>
                    <button class="btn btn--outline btn--sm" onclick="removeCitation(${index})">Remove</button>
                    <button class="btn btn--outline btn--sm" onclick="copyCitation(${index})">Copy</button>
                </div>
            </div>
        `;
    });

    citationList.innerHTML = citationsHTML;
    citationList.classList.add('active');
}

function formatCitation(paper, format) {
    const authors = paper.authors.join(', ');
    const year = paper.year;
    const title = paper.title;
    const venue = paper.venue;
    
    switch (format) {
        case 'APA Style':
            return `${authors} (${year}). ${title}. <em>${venue}</em>. https://doi.org/${paper.doi}`;
        case 'MLA Style':
            return `${authors}. "${title}" <em>${venue}</em>, ${year}, https://doi.org/${paper.doi}.`;
        case 'Chicago Style':
            return `${authors}. "${title}" ${venue} (${year}). https://doi.org/${paper.doi}.`;
        case 'IEEE Style':
            return `${authors}, "${title}," <em>${venue}</em>, ${year}. [Online]. Available: https://doi.org/${paper.doi}`;
        default:
            return `${authors} (${year}). ${title}. ${venue}.`;
    }
}

function validateCitations() {
    showNotification('Validating citations with IBM Granite Guardian...');
    setTimeout(() => {
        showNotification('All citations validated successfully!');
    }, 1500);
}

function detectDuplicates() {
    showNotification('Scanning for duplicate citations...');
    setTimeout(() => {
        showNotification('No duplicate citations found.');
    }, 1000);
}

function exportCitations() {
    const format = document.querySelector('.citation-format').value;
    showNotification(`Exporting bibliography in ${format} format...`);
    // In a real app, this would trigger a download
}

function editCitation(index) {
    showNotification(`Editing citation ${index + 1}`);
    // In a real app, this would open an edit form
}

function removeCitation(index) {
    if (confirm('Remove this citation?')) {
        currentCitations.splice(index, 1);
        displayCitations();
        showNotification('Citation removed');
    }
}

function copyCitation(index) {
    const format = document.querySelector('.citation-format').value;
    const citation = formatCitation(currentCitations[index], format);
    
    navigator.clipboard.writeText(citation).then(() => {
        showNotification('Citation copied to clipboard');
    }).catch(() => {
        showNotification('Failed to copy citation');
    });
}

// Report Generation Module
function initializeReports() {
    displayReportSections();
    initializeTemplateSelection();
}

function initializeTemplateSelection() {
    const templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(card => {
        card.addEventListener('click', function() {
            templateCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            displayReportSections();
        });
    });
}

function displayReportSections() {
    const sectionsContainer = document.getElementById('report-sections');
    const activeTemplate = document.querySelector('.template-card.active');
    const templateType = activeTemplate ? activeTemplate.getAttribute('data-template') : 'research-paper';
    
    const sectionTemplates = {
        'research-paper': [
            { name: 'Abstract', description: 'Executive summary of the research', status: 'ready' },
            { name: 'Introduction', description: 'Background and research objectives', status: 'ready' },
            { name: 'Literature Review', description: 'Analysis of existing research', status: 'ready' },
            { name: 'Methodology', description: 'Research methods and approach', status: 'pending' },
            { name: 'Results', description: 'Findings and data analysis', status: 'pending' },
            { name: 'Discussion', description: 'Interpretation and implications', status: 'pending' },
            { name: 'Conclusion', description: 'Summary and future work', status: 'pending' },
            { name: 'References', description: 'Bibliography and citations', status: 'ready' }
        ],
        'literature-review': [
            { name: 'Introduction', description: 'Scope and objectives', status: 'ready' },
            { name: 'Search Methodology', description: 'Literature search strategy', status: 'ready' },
            { name: 'Thematic Analysis', description: 'Key themes and trends', status: 'ready' },
            { name: 'Critical Analysis', description: 'Strengths and limitations', status: 'pending' },
            { name: 'Synthesis', description: 'Integration of findings', status: 'pending' },
            { name: 'Conclusions', description: 'Summary and recommendations', status: 'pending' }
        ],
        'technical-report': [
            { name: 'Executive Summary', description: 'High-level overview', status: 'ready' },
            { name: 'Technical Background', description: 'Context and requirements', status: 'ready' },
            { name: 'Implementation', description: 'Technical details', status: 'pending' },
            { name: 'Results & Analysis', description: 'Performance and outcomes', status: 'pending' },
            { name: 'Recommendations', description: 'Next steps and improvements', status: 'pending' }
        ]
    };

    const sections = sectionTemplates[templateType] || sectionTemplates['research-paper'];
    
    let sectionsHTML = '';
    sections.forEach((section, index) => {
        const statusClass = section.status === 'ready' ? 'status--success' : 'status--warning';
        const statusText = section.status === 'ready' ? 'Ready' : 'Pending';
        
        sectionsHTML += `
            <div class="section-item">
                <div class="section-info">
                    <h5>${section.name}</h5>
                    <p>${section.description}</p>
                </div>
                <div class="section-status">
                    <span class="status ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    });

    sectionsContainer.innerHTML = sectionsHTML;
    sectionsContainer.classList.add('active');
}

function generateReport() {
    const progressContainer = document.getElementById('generation-progress');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    progressContainer.classList.remove('hidden');
    
    const steps = [
        'Analyzing selected literature...',
        'Generating introduction section...',
        'Creating literature review...',
        'Synthesizing key findings...',
        'Formatting citations...',
        'Finalizing report structure...',
        'Report generation complete!'
    ];

    let currentStep = 0;
    const stepInterval = setInterval(() => {
        if (currentStep < steps.length) {
            progressText.textContent = steps[currentStep];
            progressFill.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
            currentStep++;
        } else {
            clearInterval(stepInterval);
            setTimeout(() => {
                showNotification('Research report generated successfully!');
                progressContainer.classList.add('hidden');
                progressFill.style.width = '0%';
            }, 1000);
        }
    }, 800);
}

// Modal functionality
function showWorkflowModal() {
    const modal = document.getElementById('workflow-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Click outside modal to close
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.add('hidden');
    }
});

// Notification system
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--ibm-blue-primary);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 3000;
        box-shadow: var(--shadow-lg);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function formatNumber(num) {
    return num.toLocaleString();
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle form submissions
document.addEventListener('submit', function(event) {
    event.preventDefault();
});

// Handle citation format changes
document.addEventListener('change', function(event) {
    if (event.target.classList.contains('citation-format')) {
        displayCitations();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Escape key closes modals
    if (event.key === 'Escape') {
        const visibleModal = document.querySelector('.modal:not(.hidden)');
        if (visibleModal) {
            visibleModal.classList.add('hidden');
        }
    }
    
    // Quick navigation with Ctrl + number keys
    if (event.ctrlKey && event.key >= '1' && event.key <= '7') {
        const modules = ['dashboard', 'literature', 'analysis', 'hypothesis', 'citations', 'reports', 'settings'];
        const moduleIndex = parseInt(event.key) - 1;
        if (modules[moduleIndex]) {
            switchModule(modules[moduleIndex]);
        }
        event.preventDefault();
    }
});

// Export functions for global access
window.switchModule = switchModule;
window.performSearch = performSearch;
window.selectPaper = selectPaper;
window.addToCitations = addToCitations;
window.viewFullText = viewFullText;
window.simulateUpload = simulateUpload;
window.generateHypotheses = generateHypotheses;
window.refineHypothesis = refineHypothesis;
window.generateTestPlan = generateTestPlan;
window.validateCitations = validateCitations;
window.detectDuplicates = detectDuplicates;
window.exportCitations = exportCitations;
window.editCitation = editCitation;
window.removeCitation = removeCitation;
window.copyCitation = copyCitation;
window.generateReport = generateReport;
window.showWorkflowModal = showWorkflowModal;
window.closeModal = closeModal;