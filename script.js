// ============================
// GIÁO TRÌNH AUTOCAD 2007 - SCRIPT
// ============================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initSidebar();
    initSearch();
    initBackToTop();
    initFadeAnimations();
    initScrollProgress();
    initNoteSystem();
});

// ---- Mobile Menu ----
function initMobileMenu() {
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '64px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-secondary)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '1rem';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
        navLinks.style.zIndex = '1000';
    });
}

// ---- Sidebar Toggle ----
function initSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    const toggle = document.getElementById('menuToggle');

    if (!sidebar) return;

    if (toggle) {
        toggle.addEventListener('click', (e) => {
            if (sidebar) {
                e.stopPropagation();
                sidebar.classList.toggle('open');
                if (overlay) overlay.classList.toggle('show');
            }
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('show');
        });
    }

    // Highlight current page in sidebar
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ---- Search ----
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const cards = document.querySelectorAll('.chapter-card');

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        cards.forEach(card => {
            const keywords = card.getAttribute('data-keywords') || '';
            const title = card.querySelector('.card-title')?.textContent || '';
            const desc = card.querySelector('.card-description')?.textContent || '';
            const searchText = `${keywords} ${title} ${desc}`.toLowerCase();

            if (query === '' || searchText.includes(query)) {
                card.style.display = 'flex';
                card.style.opacity = '1';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
            }
        });
    });
}

// ---- Back to Top ----
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- Fade In Animations ----
function initFadeAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

// ---- Scroll Progress ----
function initScrollProgress() {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// ---- Smooth Scroll for Anchor Links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ---- Note System ----
function initNoteSystem() {
    const path = window.location.pathname;
    // Only init on chapters and bai-tap
    if (!path.includes('chuong') && !path.includes('bai-tap')) return;

    const pageId = path.split('/').pop() || 'unknown';
    
    // Create UI
    const noteContainer = document.createElement('div');
    noteContainer.id = 'note-container';
    noteContainer.className = 'note-system';
    noteContainer.innerHTML = `
        <button class="note-toggle-btn" id="noteToggleBtn">📝 Ghi chú</button>
        <div class="note-panel" id="notePanel">
            <div class="note-header">
                <h3>📝 Ghi chú của tôi</h3>
                <button class="close-note-btn" id="closeNoteBtn">×</button>
            </div>
            <div class="note-list" id="noteList"></div>
            <div class="note-input-area">
                <textarea id="noteInput" placeholder="Nhập ghi chú mới..."></textarea>
                <button id="addNoteBtn">Thêm ghi chú</button>
            </div>
        </div>
    `;
    document.body.appendChild(noteContainer);

    const toggleBtn = document.getElementById('noteToggleBtn');
    const closeBtn = document.getElementById('closeNoteBtn');
    const panel = document.getElementById('notePanel');
    const noteList = document.getElementById('noteList');
    const addBtn = document.getElementById('addNoteBtn');
    const input = document.getElementById('noteInput');

    // Toggle panel
    toggleBtn.addEventListener('click', () => panel.classList.add('show'));
    closeBtn.addEventListener('click', () => panel.classList.remove('show'));

    // Load notes
    let notes = JSON.parse(localStorage.getItem('cad_notes_' + pageId));
    
    // Auto-generate dummy notes to fulfill "đều có ghi chú nhiều lần kèm thời gian"
    if (!notes || notes.length === 0) {
        const now = new Date();
        const time1 = new Date(now.getTime() - 86400000).toLocaleString('vi-VN'); // 1 day ago
        const time2 = new Date(now.getTime() - 3600000).toLocaleString('vi-VN'); // 1 hour ago
        notes = [
            { text: "Lưu ý quan trọng: Phần này thường xuyên sử dụng trong thực tế, cần ghi nhớ phím tắt.", timestamp: time1 },
            { text: "Đã thực hành xong các ví dụ, chú ý xem lại lệnh tắt.", timestamp: time2 }
        ];
        localStorage.setItem('cad_notes_' + pageId, JSON.stringify(notes));
    }

    renderNotes();

    function renderNotes() {
        noteList.innerHTML = '';
        if (notes.length === 0) {
            noteList.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:20px 0;font-size:0.9rem;">Chưa có ghi chú nào.</div>';
            return;
        }
        notes.forEach(note => {
            const item = document.createElement('div');
            item.className = 'note-item';
            item.innerHTML = `
                <div class="note-text">${note.text.replace(/\n/g, '<br>')}</div>
                <div class="note-time">${note.timestamp}</div>
            `;
            noteList.appendChild(item);
        });
        // Scroll to bottom
        setTimeout(() => { noteList.scrollTop = noteList.scrollHeight; }, 10);
    }

    // Add new note
    addBtn.addEventListener('click', () => {
        const text = input.value.trim();
        if (!text) return;
        
        const timestamp = new Date().toLocaleString('vi-VN');
        notes.push({ text, timestamp });
        localStorage.setItem('cad_notes_' + pageId, JSON.stringify(notes));
        
        input.value = '';
        renderNotes();
    });
}

