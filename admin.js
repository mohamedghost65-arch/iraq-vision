// Users Data from localStorage
let usersData = JSON.parse(localStorage.getItem('usersData'));

// Seed default users if none exist, or if dummy users exist, clear them
if (!usersData || (usersData.length > 0 && usersData[0].email === 'ahmed@example.com' && usersData[0].id === 1)) {
    usersData = [];
    
    // Add logged-in user as admin if exists
    const accName = localStorage.getItem('accountName');
    const accEmail = localStorage.getItem('accountEmail') || 'admin@iraqvision.com';
    if (accName && !usersData.find(u => u.email === accEmail)) {
        usersData.unshift({
            id: Date.now(),
            name: accName,
            email: accEmail,
            date: new Date().toISOString().split('T')[0],
            role: 'admin',
            status: 'active'
        });
    }
    
    localStorage.setItem('usersData', JSON.stringify(usersData));
}

// Function to save usersData to localStorage
function saveUsersData() {
    localStorage.setItem('usersData', JSON.stringify(usersData));
}

// Settings Data
let settingsData = {
    siteName: 'أهوار فيجن',
    maintenanceMode: false
};

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const adminViews = document.querySelectorAll('.admin-view');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        adminViews.forEach(view => view.classList.remove('active'));
        const target = item.getAttribute('data-target');
        document.getElementById(`view-${target}`).classList.add('active');
    });
});

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        if(container.contains(toast)) container.removeChild(toast);
    }, 3000);
}

// Init Dashboard Stats
function initStats() {
    document.getElementById('total-movies').textContent = moviesData ? moviesData.length : 0;
    document.getElementById('total-users').textContent = usersData.length;
    
    // Populate Recent Movies (last 4)
    const recentMoviesBody = document.getElementById('recent-movies-list');
    if (recentMoviesBody) {
        if (moviesData && moviesData.length > 0) {
            const latest = moviesData.slice(0, 4);
            recentMoviesBody.innerHTML = latest.map(m => `
                <tr>
                    <td><img src="${m.image}" style="width:40px; height:60px; object-fit:cover; border-radius:5px;" alt="Poster"></td>
                    <td><strong>${m.title}</strong></td>
                    <td><span style="background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 12px; font-size: 0.8rem;">${m.category}</span></td>
                    <td>${m.year}</td>
                </tr>
            `).join('');
        } else {
            recentMoviesBody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">لا توجد أفلام مضافة حتى الآن</td></tr>`;
        }
    }
    
    // Populate Recent Users (last 3)
    const recentUsersBody = document.getElementById('recent-users-list');
    if (recentUsersBody) {
        if (usersData && usersData.length > 0) {
            const latestUsers = usersData.slice(-3).reverse();
            recentUsersBody.innerHTML = latestUsers.map(u => `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--brand-color); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 1.2rem;">
                            ${u.name.charAt(0)}
                        </div>
                        <div>
                            <h4 style="margin: 0; color: white; font-size: 0.95rem;">${u.name}</h4>
                            <span style="font-size: 0.8rem; color: var(--text-muted);">${u.email}</span>
                        </div>
                    </div>
                    <span style="font-size: 0.8rem; color: var(--text-muted);"><i class="fas fa-calendar-alt"></i> ${u.date}</span>
                </div>
            `).join('');
        } else {
            recentUsersBody.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-muted);">لا يوجد مستخدمين مسجلين</div>`;
        }
    }
}

// Function to switch tabs from dashboard buttons
function switchTab(target) {
    const targetNav = document.querySelector(`.nav-item[data-target="${target}"]`);
    if (targetNav) targetNav.click();
}

let currentPageMovies = 1;
const itemsPerPageMovies = 5; // عدد العناصر في كل صفحة

// Render Movies Table
function renderMovies() {
    const tbody = document.getElementById('movies-table-body');
    const paginationContainer = document.getElementById('movies-pagination');
    if(!moviesData || !tbody) return;

    const searchTerm = document.getElementById('movie-search').value.toLowerCase();
    const filterCat = document.getElementById('movie-filter').value;

    const filtered = moviesData.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchTerm) || m.desc.toLowerCase().includes(searchTerm);
        const matchesCat = filterCat === "" || m.category === filterCat;
        return matchesSearch && matchesCat;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPageMovies);
    if (currentPageMovies > totalPages && totalPages > 0) currentPageMovies = totalPages;
    if (currentPageMovies === 0 && totalPages > 0) currentPageMovies = 1;

    const startIdx = (currentPageMovies - 1) * itemsPerPageMovies;
    const endIdx = startIdx + itemsPerPageMovies;
    const paginated = filtered.slice(startIdx, endIdx);

    tbody.innerHTML = paginated.map(m => `
        <tr>
            <td><img src="${m.image}" class="table-img" alt="Poster"></td>
            <td><strong>${m.title}</strong></td>
            <td>${m.category} - ${m.genre}</td>
            <td>${m.year}</td>
            <td>
                <span class="status-badge status-active">معروض</span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon edit" title="تعديل" onclick="editMovie(${m.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete" title="حذف" onclick="deleteMovie(${m.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">لا توجد أفلام متطابقة مع البحث</td></tr>`;
    }
    
    renderPagination(totalPages, currentPageMovies, 'movies-pagination', (page) => {
        currentPageMovies = page;
        renderMovies();
    });

    initStats();
}

let currentPageUsers = 1;
const itemsPerPageUsers = 5;

// Render Users Table
function renderUsers() {
    const tbody = document.getElementById('users-table-body');
    const paginationContainer = document.getElementById('users-pagination');
    if(!tbody) return;

    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const filterRole = document.getElementById('user-filter').value;

    const filtered = usersData.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm) || u.email.toLowerCase().includes(searchTerm);
        const matchesRole = filterRole === "" || u.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPageUsers);
    if (currentPageUsers > totalPages && totalPages > 0) currentPageUsers = totalPages;
    if (currentPageUsers === 0 && totalPages > 0) currentPageUsers = 1;

    const startIdx = (currentPageUsers - 1) * itemsPerPageUsers;
    const endIdx = startIdx + itemsPerPageUsers;
    const paginated = filtered.slice(startIdx, endIdx);

    tbody.innerHTML = paginated.map(u => `
        <tr>
            <td><strong>${u.name}</strong></td>
            <td>${u.email}</td>
            <td>${u.date}</td>
            <td>
                <span class="role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}">
                    ${u.role === 'admin' ? 'مدير' : 'مستخدم عادي'}
                </span>
            </td>
            <td>
                <span class="status-badge ${u.status === 'active' ? 'status-active' : 'status-banned'}">
                    ${u.status === 'active' ? 'نشط' : 'محظور'}
                </span>
            </td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon edit" title="تعديل" onclick="editUser(${u.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete" title="حذف" onclick="deleteUser(${u.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:30px; color:var(--text-muted);">لا يوجد مستخدمين متطابقين مع البحث</td></tr>`;
    }

    renderPagination(totalPages, currentPageUsers, 'users-pagination', (page) => {
        currentPageUsers = page;
        renderUsers();
    });
}

function renderPagination(totalPages, currentPage, containerId, onPageClick) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    if (totalPages <= 1) return;

    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'pagination';
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.innerText = i;
        btn.className = i === currentPage ? 'page-btn active' : 'page-btn';
        btn.onclick = () => onPageClick(i);
        paginationDiv.appendChild(btn);
    }
    
    container.appendChild(paginationDiv);
}

// Modals Logic
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    
    if (modalId === 'add-movie-modal') {
        document.getElementById('add-movie-form').reset();
        document.getElementById('editingMovieId').value = '';
        document.getElementById('movie-modal-title').textContent = 'إضافة محتوى جديد';
        if (typeof updatePosterPreview === 'function') updatePosterPreview();
    } else if (modalId === 'add-user-modal') {
        document.getElementById('add-user-form').reset();
        document.getElementById('userId').value = '';
        document.getElementById('user-modal-title').textContent = 'إضافة مستخدم جديد';
        document.getElementById('userPassword').required = true;
    }
}

function openUserModal() {
    openModal('add-user-modal');
}

// Movies Filtering Listeners
document.getElementById('movie-search').addEventListener('input', renderMovies);
document.getElementById('movie-filter').addEventListener('change', renderMovies);

// Users Filtering Listeners
document.getElementById('user-search').addEventListener('input', renderUsers);
document.getElementById('user-filter').addEventListener('change', renderUsers);

// Handle Add/Edit Movie Form
const addMovieForm = document.getElementById('add-movie-form');
if (addMovieForm) {
    addMovieForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const editingId = document.getElementById('editingMovieId').value;
        const title = document.getElementById('movieTitle').value;
        const genre = document.getElementById('movieGenre').value;
        const category = document.getElementById('movieCategory').value;
        const origin = document.getElementById('movieOrigin').value;
        const desc = document.getElementById('movieDesc').value;
        const image = document.getElementById('movieImage').value;
        const trailer = document.getElementById('movieTrailer').value;
        const year = document.getElementById('movieYear').value;
        const rating = document.getElementById('movieRating').value;
        const isNew = document.getElementById('movieIsNew').checked;
        const isTrending = document.getElementById('movieIsTrending').checked;
        
        if (editingId) {
            // Edit existing movie
            const index = moviesData.findIndex(m => m.id == editingId);
            if (index > -1) {
                moviesData[index] = { ...moviesData[index], title, category, genre, origin, desc, year, rating, image, trailer, isNew, isTrending };
                showToast('تم تعديل المحتوى بنجاح!');
            }
        } else {
            // Create new movie
            const newMovie = {
                id: Date.now(),
                title, category, genre, origin, desc, year, rating, image, trailer,
                director: 'مجهول', cast: 'غير محدد',
                isNew, isTrending
            };
            moviesData.unshift(newMovie);
            showToast('تمت إضافة المحتوى بنجاح!');
            addAdminNotification(`تمت إضافة ${category.slice(0, -2)} "${title}"`, 'fas fa-film', 'var(--brand-color)');
            
            // إضافة إشعار للمستخدمين
            let userNotifs = JSON.parse(localStorage.getItem('userNotifications')) || [];
            userNotifs.unshift({
                id: Date.now(),
                text: `تمت إضافة ${category.slice(0, -2)} جديد: <strong>${title}</strong>`,
                image: image || 'https://via.placeholder.com/100',
                isRead: false
            });
            localStorage.setItem('userNotifications', JSON.stringify(userNotifs));
        }
        
        localStorage.setItem('moviesData', JSON.stringify(moviesData));
        renderMovies();
        closeModal('add-movie-modal');
    });
}

function editMovie(id) {
    const movie = moviesData.find(m => m.id === id);
    if(movie) {
        document.getElementById('editingMovieId').value = movie.id;
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('movieGenre').value = movie.genre;
        document.getElementById('movieCategory').value = movie.category;
        document.getElementById('movieOrigin').value = movie.origin;
        document.getElementById('movieDesc').value = movie.desc;
        document.getElementById('movieImage').value = movie.image;
        document.getElementById('movieTrailer').value = movie.trailer;
        document.getElementById('movieYear').value = movie.year;
        document.getElementById('movieRating').value = movie.rating;
        document.getElementById('movieIsNew').checked = movie.isNew;
        document.getElementById('movieIsTrending').checked = movie.isTrending;
        
        document.getElementById('movie-modal-title').textContent = 'تعديل بيانات الفيلم';
        openModal('add-movie-modal');
    }
}

function deleteMovie(id) {
    if(confirm('هل أنت متأكد من حذف هذا العمل؟')) {
        const index = moviesData.findIndex(m => m.id === id);
        if (index > -1) {
            moviesData.splice(index, 1);
            localStorage.setItem('moviesData', JSON.stringify(moviesData));
            renderMovies();
            showToast('تم حذف المحتوى بنجاح!', 'info');
        }
    }
}

// Handle Add/Edit User Form
const addUserForm = document.getElementById('add-user-form');
if (addUserForm) {
    addUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const editingId = document.getElementById('userId').value;
        const name = document.getElementById('userName').value;
        const email = document.getElementById('userEmail').value;
        const role = document.getElementById('userRole').value;
        const status = document.getElementById('userStatus').value;
        
        if (editingId) {
            const index = usersData.findIndex(u => u.id == editingId);
            if (index > -1) {
                usersData[index] = { ...usersData[index], name, email, role, status };
                showToast('تم تحديث بيانات المستخدم!');
                saveUsersData();
            }
        } else {
            const newUser = {
                id: Date.now(),
                name, email, role, status,
                date: new Date().toISOString().split('T')[0]
            };
            usersData.push(newUser);
            showToast('تمت إضافة المستخدم بنجاح!');
            saveUsersData();
            addAdminNotification(`تم تسجيل مستخدم جديد: ${name}`, 'fas fa-user-plus', '#2ecc71');
        }
        
        renderUsers();
        closeModal('add-user-modal');
    });
}

function editUser(id) {
    const user = usersData.find(u => u.id === id);
    if(user) {
        document.getElementById('userId').value = user.id;
        document.getElementById('userName').value = user.name;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userStatus').value = user.status;
        document.getElementById('userPassword').required = false; // Not required on edit
        
        document.getElementById('user-modal-title').textContent = 'تعديل بيانات المستخدم';
        openModal('add-user-modal');
    }
}

function deleteUser(id) {
    if(confirm('هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذه الخطوة.')) {
        const index = usersData.findIndex(u => u.id === id);
        if (index > -1) {
            usersData.splice(index, 1);
            saveUsersData();
            renderUsers();
            showToast('تم حذف المستخدم.', 'info');
        }
    }
}

// Settings Form
const settingsForm = document.getElementById('settings-form');
if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        settingsData.siteName = document.getElementById('site-name').value;
        settingsData.maintenanceMode = document.getElementById('maintenance-mode').checked;
        settingsData.siteEmail = document.getElementById('site-email').value;
        settingsData.siteDesc = document.getElementById('site-desc').value;
        settingsData.siteFb = document.getElementById('site-fb').value;
        settingsData.siteIg = document.getElementById('site-ig').value;
        settingsData.allowRegistration = document.getElementById('allow-registration').checked;
        
        localStorage.setItem('platformSettings', JSON.stringify(settingsData));
        showToast('تم حفظ إعدادات المنصة بنجاح!');
    });
}

function initPlatformSettings() {
    const saved = localStorage.getItem('platformSettings');
    if (saved) {
        settingsData = JSON.parse(saved);
        if (document.getElementById('site-name')) document.getElementById('site-name').value = settingsData.siteName || '';
        if (document.getElementById('site-email')) document.getElementById('site-email').value = settingsData.siteEmail || '';
        if (document.getElementById('site-desc')) document.getElementById('site-desc').value = settingsData.siteDesc || '';
        if (document.getElementById('site-fb')) document.getElementById('site-fb').value = settingsData.siteFb || '';
        if (document.getElementById('site-ig')) document.getElementById('site-ig').value = settingsData.siteIg || '';
        if (document.getElementById('allow-registration')) document.getElementById('allow-registration').checked = settingsData.allowRegistration !== false;
        if (document.getElementById('maintenance-mode')) document.getElementById('maintenance-mode').checked = settingsData.maintenanceMode === true;
    }
}

// Payment Settings
function savePaymentSettings() {
    const visa = document.getElementById('admin-visa').value;
    const zain = document.getElementById('admin-zain').value;
    localStorage.setItem('adminVisa', visa);
    localStorage.setItem('adminZain', zain);
    showToast('تم حفظ أرقام الحسابات بنجاح!');
}

function initPaymentSettings() {
    const visa = localStorage.getItem('adminVisa');
    const zain = localStorage.getItem('adminZain');
    if (visa && document.getElementById('admin-visa')) document.getElementById('admin-visa').value = visa;
    if (zain && document.getElementById('admin-zain')) document.getElementById('admin-zain').value = zain;
}

// Initialize tables on load
document.addEventListener('DOMContentLoaded', () => {
    // Update logged in user info in topbar
    const accName = localStorage.getItem('accountName');
    const accAvatar = localStorage.getItem('accountAvatar');
    if (accName) {
        const adminNameSpan = document.querySelector('.admin-profile span');
        if (adminNameSpan) adminNameSpan.innerText = accName;
    }
    if (accAvatar) {
        const adminImg = document.querySelector('.admin-profile img');
        if (adminImg) adminImg.src = accAvatar;
    }

    initStats();
    initPlatformSettings();
    initPaymentSettings();
    renderAdminNotifications();
    renderMovies();
    renderUsers();
});

// Dynamic Notifications
let adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];

function saveAdminNotifications() {
    localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
}

function addAdminNotification(text, iconClass, iconColor) {
    adminNotifications.unshift({
        id: Date.now(),
        text,
        iconClass,
        iconColor,
        isRead: false
    });
    saveAdminNotifications();
    renderAdminNotifications();
}

function renderAdminNotifications() {
    const list = document.getElementById('notif-list');
    const countSpan = document.getElementById('notif-count');
    const dot = document.querySelector('.notification-dot');
    
    if (!list) return;

    if (adminNotifications.length === 0) {
        list.innerHTML = '<li style="text-align: center; color: var(--text-muted); padding: 20px;">لا توجد إشعارات</li>';
        countSpan.innerText = '0';
        if(dot) dot.style.display = 'none';
        return;
    }

    const unreadCount = adminNotifications.filter(n => !n.isRead).length;
    countSpan.innerText = adminNotifications.length;
    if(dot) {
        dot.style.display = unreadCount > 0 ? 'block' : 'none';
    }

    list.innerHTML = adminNotifications.map(n => `
        <li class="admin-notif-item ${n.isRead ? '' : 'unread'}" data-id="${n.id}">
            <div style="flex: 1;"><i class="${n.iconClass}" style="color: ${n.iconColor};"></i> <span>${n.text}</span></div>
            <i class="fas fa-trash delete-admin-notif" onclick="deleteAdminNotification(${n.id})"></i>
        </li>
    `).join('');
}

function toggleAdminDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    
    // Close other dropdowns first
    const allDropdowns = document.querySelectorAll('.admin-dropdown');
    allDropdowns.forEach(dd => {
        if (dd.id !== dropdownId) {
            dd.classList.add('hidden');
        }
    });

    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        
        // Mark as read if it's the notifications dropdown
        if (dropdownId === 'notif-dropdown') {
            let hasUnread = false;
            adminNotifications.forEach(n => {
                if(!n.isRead) { n.isRead = true; hasUnread = true; }
            });
            if(hasUnread) {
                saveAdminNotifications();
                setTimeout(renderAdminNotifications, 1000); // Re-render after a second to show animation
            }
            if(document.querySelector('.notification-dot')) document.querySelector('.notification-dot').style.display = 'none';
        }
    } else {
        dropdown.classList.add('hidden');
    }
}

function updateNotifCount() {
    renderAdminNotifications();
}

function deleteAdminNotification(id) {
    adminNotifications = adminNotifications.filter(n => n.id !== id);
    saveAdminNotifications();
    renderAdminNotifications();
    showToast('تم حذف الإشعار', 'info');
}

function clearAllAdminNotifications() {
    adminNotifications = [];
    saveAdminNotifications();
    renderAdminNotifications();
    showToast('تم مسح جميع الإشعارات', 'info');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.topbar-actions')) {
        const allDropdowns = document.querySelectorAll('.admin-dropdown');
        allDropdowns.forEach(dd => {
            dd.classList.add('hidden');
        });
    }
});

// TMDB API Integration
async function fetchTMDBData() {
    const title = document.getElementById('movieTitle').value.trim();
    if (!title) {
        showToast('يرجى إدخال اسم العمل أولاً', 'error');
        return;
    }
    
    const category = document.getElementById('movieCategory').value;
    // TMDB differentiates between 'tv' and 'movie'
    const type = (category === 'مسلسلات') ? 'tv' : 'movie';
    const apiKey = '41a42ead864d0978acadaba701c5e011';
    
    showToast('جاري البحث في قاعدة بيانات TMDB...', 'info');
    
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&language=ar&query=${encodeURIComponent(title)}`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            const result = data.results[0];
            
            const dateStr = result.release_date || result.first_air_date || '';
            const year = dateStr.split('-')[0] || '';
            const posterUrl = result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : '';
            
            if (year) document.getElementById('movieYear').value = year;
            if (result.overview) document.getElementById('movieDesc').value = result.overview;
            if (posterUrl) document.getElementById('movieImage').value = posterUrl;
            
            // Auto-detect origin
            if (result.original_language) {
                const lang = result.original_language;
                const originSelect = document.getElementById('movieOrigin');
                if (lang === 'ar') originSelect.value = 'عربي';
                else if (lang === 'tr') originSelect.value = 'تركي';
                else if (['hi', 'ta', 'te', 'ml', 'kn'].includes(lang)) originSelect.value = 'هندي';
                else originSelect.value = 'أجنبي';
            }
            
            // جلب التفاصيل الإضافية (مثل التريلر، التصنيف، والتقييم العمري)
            try {
                const appendOptions = type === 'movie' ? 'videos,release_dates' : 'videos,content_ratings';
                const detailsResponse = await fetch(`https://api.themoviedb.org/3/${type}/${result.id}?api_key=${apiKey}&language=ar&append_to_response=${appendOptions}`);
                const detailsData = await detailsResponse.json();
                
                // جلب تصنيفات الفيلم
                if (detailsData.genres && detailsData.genres.length > 0) {
                    document.getElementById('movieGenre').value = detailsData.genres.map(g => g.name).join('، ');
                }
                
                // جلب التقييم العمري (Age Rating)
                let rating = '';
                if (type === 'movie' && detailsData.release_dates && detailsData.release_dates.results) {
                    const usRelease = detailsData.release_dates.results.find(r => r.iso_3166_1 === 'US');
                    if (usRelease && usRelease.release_dates && usRelease.release_dates.length > 0) {
                        rating = usRelease.release_dates.find(r => r.certification !== '')?.certification || '';
                    }
                } else if (type === 'tv' && detailsData.content_ratings && detailsData.content_ratings.results) {
                    const usRating = detailsData.content_ratings.results.find(r => r.iso_3166_1 === 'US');
                    if (usRating) {
                        rating = usRating.rating;
                    }
                }
                
                if (rating) {
                    // تحويل بعض التقييمات الأمريكية لشكل مفهوم
                    if(rating === 'R') rating = '+18';
                    if(rating === 'PG-13' || rating === 'TV-14') rating = '+13';
                    if(rating === 'PG' || rating === 'TV-PG') rating = '+8';
                    if(rating === 'G' || rating === 'TV-G') rating = 'لجميع الأعمار';
                    if(rating === 'TV-MA') rating = '+18';
                    
                    document.getElementById('movieRating').value = rating;
                } else {
                    document.getElementById('movieRating').value = '+13'; // قيمة افتراضية
                }
                
                // جلب المقطع الدعائي (Trailer)
                let videos = detailsData.videos?.results || [];
                if (videos.length === 0) {
                    // إذا لم توجد فيديوهات بالعربية، نجلب باللغة الافتراضية
                    const vidResp = await fetch(`https://api.themoviedb.org/3/${type}/${result.id}/videos?api_key=${apiKey}`);
                    const vidData = await vidResp.json();
                    videos = vidData.results || [];
                }
                
                const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos.find(v => v.site === 'YouTube');
                if (trailer) {
                    document.getElementById('movieTrailer').value = `https://www.youtube.com/watch?v=${trailer.key}`;
                }
            } catch (err) {
                console.error('Error fetching details:', err);
            }
            
            showToast('تم جلب جميع البيانات بنجاح!', 'success');
            updatePosterPreview();
        } else {
            showToast('لم يتم العثور على نتائج مطابقة لهذا الاسم', 'error');
        }
    } catch (error) {
        console.error('TMDB Error:', error);
        showToast('حدث خطأ في الاتصال بقاعدة البيانات', 'error');
    }
}

// Update poster preview image
function updatePosterPreview() {
    const url = document.getElementById('movieImage').value.trim();
    const preview = document.getElementById('poster-preview');
    const placeholder = document.getElementById('poster-placeholder');
    
    if (url) {
        preview.src = url;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
        
        // Handle image load error
        preview.onerror = function() {
            preview.style.display = 'none';
            placeholder.style.display = 'flex';
            placeholder.querySelector('span').textContent = 'تعذر تحميل الصورة من الرابط';
            placeholder.querySelector('i').className = 'fas fa-exclamation-triangle';
            placeholder.querySelector('i').style.color = 'var(--warning-color)';
        };
        preview.onload = function() {
            placeholder.querySelector('span').textContent = 'معاينة البوستر';
            placeholder.querySelector('i').className = 'fas fa-image';
            placeholder.querySelector('i').style.color = 'var(--text-muted)';
        };
    } else {
        preview.style.display = 'none';
        placeholder.style.display = 'flex';
        placeholder.querySelector('span').textContent = 'معاينة البوستر';
        placeholder.querySelector('i').className = 'fas fa-image';
        placeholder.querySelector('i').style.color = 'var(--text-muted)';
    }
}
