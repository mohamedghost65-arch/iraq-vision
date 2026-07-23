// ==========================================
// 1. المتغيرات والبيانات الوهمية (Dummy Data)
// ==========================================

let moviesData = JSON.parse(localStorage.getItem('moviesData'));

// Initialize if empty
if (!moviesData) {
    moviesData = [];
    localStorage.setItem('moviesData', JSON.stringify(moviesData));
} else if (moviesData.length > 0 && moviesData[0].title === 'حارس بغداد') {
    // Clean up existing dummy data automatically
    moviesData = [];
    localStorage.setItem('moviesData', JSON.stringify(moviesData));
}

// قائمة تصنيفات الأفلام (الأنواع)
const genresList = [
    { name: 'اثارة', image: 'https://images.unsplash.com/photo-1552345388-c7e3f8901b09?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'مغامرة', image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'خيالي', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'خيال علمي', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'دراما', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'رومانسي', image: 'https://images.unsplash.com/photo-1518199266791-5375a83164ba?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'جريمة', image: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'غموض', image: 'https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'رعب', image: 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'حرب', image: 'https://images.unsplash.com/photo-1530267746571-085e68345c20?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'سحر', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' },
    { name: 'تشويق', image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=200&w=300' }
];

// قوائم المحفوظات الخاصة (مقسمة لثلاث فئات)
let continueWatchingIds = JSON.parse(localStorage.getItem('continueWatchingIds')) || [1];
let likedIds = JSON.parse(localStorage.getItem('likedIds')) || [2, 5];
let watchLaterIds = JSON.parse(localStorage.getItem('watchLaterIds')) || [3];

// استرجاع معلومات الحساب عند التحميل
document.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('accountName');
    if (savedName) {
        const nameDisplay = document.getElementById('account-name-display');
        if (nameDisplay) nameDisplay.innerText = savedName;
    }
    
    const savedAvatar = localStorage.getItem('accountAvatar');
    if (savedAvatar) {
        const accImg = document.getElementById('account-profile-img');
        const profImg = document.getElementById('profile-img');
        if (accImg) accImg.src = savedAvatar;
        if (profImg) profImg.src = savedAvatar;
    }
});

// المتغيرات من الـ DOM
const loginForm = document.getElementById('login-form');
const loginBtn = document.getElementById('login-btn');
const loginText = document.getElementById('login-text');
const loginSpinner = document.getElementById('login-spinner');
const loginSection = document.getElementById('login-section');
const mainPlatform = document.getElementById('main-platform');
const logoutBtn = document.getElementById('logout-btn');
const videoModal = document.getElementById('video-modal');
const navbar = document.getElementById('navbar');

const profileImg = document.getElementById('profile-img');
const dropdownMenu = document.getElementById('dropdown-menu');
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.getElementById('nav-links');

const detailsModal = document.getElementById('movie-details-modal');
const detailsTitle = document.getElementById('details-title');
const detailsHero = document.getElementById('details-hero');
const detailsDesc = document.getElementById('details-desc');
const detailsYear = document.getElementById('details-year');
const detailsRating = document.getElementById('details-rating');

// متغيرات SPA (Single Page Application)
const views = {
    home: document.getElementById('view-home'),
    category: document.getElementById('view-category'),
    search: document.getElementById('view-search'),
    mylist: document.getElementById('view-mylist'),
    custom_grid: document.getElementById('view-custom-grid'),
    account: document.getElementById('view-account'),
    settings: document.getElementById('view-settings'),
    help: document.getElementById('view-help')
};
const categoryTitle = document.getElementById('category-title');
const categoryGrid = document.getElementById('category-grid');
const searchGrid = document.getElementById('search-grid');
const noResults = document.getElementById('no-results');
const searchQueryText = document.getElementById('search-query-text');

const filterBar = document.getElementById('filter-bar');
const genreFilter = document.getElementById('genre-filter');
const originFilter = document.getElementById('origin-filter');
const yearFilter = document.getElementById('year-filter');
let currentCategoryName = '';

// Toast Notifications
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
    toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    setTimeout(() => {
        if(container.contains(toast)) container.removeChild(toast);
    }, 3000);
}

// ==========================================
// 2. تسجيل الدخول مع تأثير التحميل (Loading) وتفعيل إظهار كلمة المرور
// ==========================================
const togglePassword = document.getElementById('toggle-password');
const passwordInput = document.getElementById('password');
const pageLoader = document.getElementById('page-loader');

// استرجاع البريد الإلكتروني إذا تم تحديد "تذكرني" سابقاً
document.addEventListener('DOMContentLoaded', () => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
        const emailInput = document.getElementById('email');
        const rememberCheckbox = document.getElementById('remember');
        if (emailInput) emailInput.value = savedEmail;
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
    
    // Show/hide admin link based on role
    const adminLink = document.getElementById('admin-panel-link');
    if (adminLink) {
        adminLink.style.display = localStorage.getItem('isAdmin') === 'true' ? 'block' : 'none';
    }
});

if (togglePassword) {
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.classList.toggle('fa-eye');
        this.classList.toggle('fa-eye-slash');
    });
}

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const savedPassword = localStorage.getItem('userPass');
    
    // التحقق من كلمة المرور إذا تم حفظها مسبقاً
    if (savedPassword && password !== savedPassword) {
        showAuthAlert('كلمة المرور غير صحيحة', 'error');
        return;
    }
    
    // حفظ البريد الإلكتروني إذا تم تحديد "تذكرني"
    const rememberMe = document.getElementById('remember').checked;
    if (rememberMe) {
        localStorage.setItem('userEmail', email);
    } else {
        localStorage.removeItem('userEmail');
    }
    
    // Store current logged-in user
    localStorage.setItem('accountEmail', email);
    
    // Check if user is admin
    let usersData = JSON.parse(localStorage.getItem('usersData')) || [];
    let user = usersData.find(u => u.email === email);
    let isAdmin = (user && user.role === 'admin') || (email === 'admin@iraqvision.com');
    if (isAdmin) {
        localStorage.setItem('isAdmin', 'true');
    } else {
        localStorage.removeItem('isAdmin');
    }
    
    // إظهار الدوران (Spinner) وتعطيل الزر
    loginText.classList.add('hidden');
    loginSpinner.classList.remove('hidden');
    loginBtn.disabled = true;

    // إظهار تنبيه النجاح
    showAuthAlert('تم تسجيل الدخول بنجاح', 'success');
    
    // محاكاة طلب للسيرفر
    setTimeout(() => {
        loginSection.classList.add('hidden');
        mainPlatform.classList.remove('hidden');
        
        loginForm.reset();
        loginText.classList.remove('hidden');
        loginSpinner.classList.add('hidden');
        loginBtn.disabled = false;
        
        // Show/hide admin link based on role
        const adminLink = document.getElementById('admin-panel-link');
        if (adminLink) {
            adminLink.style.display = localStorage.getItem('isAdmin') === 'true' ? 'block' : 'none';
        }
        
        initHome(); // تحميل بيانات الرئيسية
    }, 1500);
});

// تفعيل زر "هل نسيت كلمة المرور؟"
const forgotPasswordLink = document.querySelector('.forgot-password');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (email) {
            showToast('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني', 'success');
        } else {
            showToast('الرجاء إدخال البريد الإلكتروني أولاً', 'warning');
        }
    });
}

// تفعيل أزرار تسجيل الدخول الاجتماعي
const socialBtns = document.querySelectorAll('.btn-social');
socialBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const platform = this.classList.contains('google') ? 'Google' : 'Facebook';
        showToast(`سيتم تفعيل الدخول بواسطة ${platform} قريباً`, 'info');
    });
});

logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('accountEmail');
    mainPlatform.classList.add('hidden');
    loginSection.classList.remove('hidden');
    window.scrollTo(0,0);
    dropdownMenu.classList.remove('active');
    navigate('home'); // إعادة تعيين للعرض الرئيسي
});

// ==========================================
// 3. جلب الأفلام من الـ API (MovieBox)
// ==========================================

async function fetchMoviesFromAPI() {
    try {
        console.log("جاري جلب الأفلام من السيرفر...");
        // الاتصال بالبروكسي المرفوع على الإنترنت لجلب أحدث الأفلام
        const response = await fetch("https://iraq-proxy.onrender.com/api/get-movies");
        const json = await response.json();
        
        if (json && json.data && json.data.list) {
            const apiMovies = json.data.list;
            
            // تحويل البيانات القادمة من الـ API إلى صيغتنا المعتمدة
            const newMoviesData = apiMovies.map(m => {
                return {
                    id: m.subjectId,
                    title: m.title,
                    desc: m.description || m.genre || "فيلم ممتع ومشوق يستحق المشاهدة.",
                    image: (m.cover && m.cover.url) ? m.cover.url : 'assets/placeholder.jpg',
                    trailer: "", // الفيديو المباشر سيتكفل به playVideo
                    year: m.releaseDate ? m.releaseDate.substring(0, 4) : "2024",
                    rating: m.imdbRatingValue ? `${m.imdbRatingValue}/10` : "+16",
                    category: "أفلام", // يمكنك تحديثه برمجياً لو توفر
                    tags: m.genre ? m.genre.split(',') : ["دراما"]
                };
            });
            
            // تحديث المصفوفة الأصلية
            moviesData = newMoviesData;
            console.log("تم تحديث قائمة الأفلام:", moviesData);
            
            // إعادة رسم الواجهة
            loadCategory('home');
        }
    } catch (error) {
        console.error("حدث خطأ أثناء جلب قائمة الأفلام:", error);
    }
}

// تنفيذ الجلب عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    fetchMoviesFromAPI();
});

// ==========================================
// 3. التوجيه ومحاكاة الصفحات (SPA Navigation)
// ==========================================
function navigate(targetView, categoryName = null) {
    // إخفاء كل الصفحات
    Object.values(views).forEach(view => view.classList.remove('active', 'hidden'));
    Object.values(views).forEach(view => view.classList.add('hidden'));

    // تحديث الأزرار النشطة في النافبار
    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
    
    if (targetView === 'home') {
        views.home.classList.remove('hidden');
        views.home.classList.add('active');
        document.querySelector('.nav-item[data-target="home"]').classList.add('active');
        initHome();
    } 
    else if (targetView === 'category') {
        views.category.classList.remove('hidden');
        views.category.classList.add('active');
        
        // تفعيل الزر المناسب
        let targetBtn = Array.from(document.querySelectorAll('.nav-item')).find(btn => btn.innerText.trim() === categoryName);
        if(targetBtn) targetBtn.classList.add('active');
        
        currentCategoryName = categoryName;
        categoryTitle.innerText = categoryName;
        loadCategory(categoryName);
    }
    else if (targetView === 'search') {
        views.search.classList.remove('hidden');
        views.search.classList.add('active');
    }
    else if (targetView === 'mylist') {
        views.mylist.classList.remove('hidden');
        views.mylist.classList.add('active');
        document.querySelector('.nav-item[data-target="mylist"]').classList.add('active');
        // loadMyLists() is not needed for the card view
    }
    else if (targetView === 'custom_grid') {
        views.custom_grid.classList.remove('hidden');
        views.custom_grid.classList.add('active');
        document.querySelector('.nav-item[data-target="mylist"]').classList.add('active');
    }
    else if (targetView === 'account' || targetView === 'settings' || targetView === 'help') {
        if (views[targetView]) {
            views[targetView].classList.remove('hidden');
            views[targetView].classList.add('active');
        }
    }
    
    // إغلاق قائمة الموبايل بعد النقر
    navLinks.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// الاستماع لنقرات القائمة
document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.getAttribute('data-target');
        const text = this.innerText.trim();
        
        if (target === 'home') navigate('home');
        else if (target === 'mylist') navigate('mylist');
        else navigate('category', text);
    });
});

// ==========================================
// 4. تعبئة البيانات (Rendering)
// ==========================================

// إنشاء كارد الفيلم كـ HTML
function createMovieCard(movie) {
    return `
        <div class="movie-card reveal" onclick="openMovieDetails(${movie.id})">
            <div class="movie-card-img-wrapper">
                <img src="${movie.image}" alt="${movie.title}">
                <div class="movie-card-overlay custom-hover-overlay">
                    <div class="hover-action-row" style="display: flex; gap: 8px; margin-bottom: 10px;">
                        <button class="action-circle-btn primary-hover-btn" onclick="event.stopPropagation(); playVideo();"><i class="fas fa-play"></i></button>
                        <button class="action-circle-btn secondary-hover-btn" onclick="event.stopPropagation(); toggleMyList(this, ${movie.id})"><i class="fas fa-plus"></i></button>
                        <button class="action-circle-btn secondary-hover-btn" onclick="event.stopPropagation();"><i class="fas fa-heart"></i></button>
                    </div>
                    <div class="hover-meta-row" style="display: flex; justify-content: center; gap: 8px; font-size: 0.85rem; font-weight: bold; margin-bottom: 15px;">
                        <span style="color: #46d369;">98% تطابق</span>
                        <span style="border: 1px solid #aaa; padding: 0 4px; color: #ddd;">+16</span>
                        <span style="color: #ddd;">ساعتان</span>
                    </div>
                    <i class="fas fa-chevron-down more-info-icon" style="position: absolute; bottom: 10px; font-size: 1.2rem; color: #fff; opacity: 0.7;"></i>
                </div>
            </div>
            <div class="movie-card-info">
                <h4 class="movie-card-title">${movie.title}</h4>
                <div class="movie-card-meta">
                    <span class="movie-year">${movie.year}</span>
                    <span class="movie-rating">${movie.rating}</span>
                </div>
            </div>
        </div>
    `;
}

function createCircularMovieCard(movie) {
    return `
        <div class="circular-movie-card reveal" onclick="openMovieDetails(${movie.id})">
            <div class="circular-img-wrapper">
                <img src="${movie.image}" alt="${movie.title}">
            </div>
        </div>
    `;
}

function createTop10Card(movie, index) {
    return `
        <div class="top-10-card reveal" onclick="openMovieDetails(${movie.id})">
            <div class="top-10-number">${index + 1}</div>
            <div class="top-10-img-wrapper">
                <img src="${movie.image}" alt="${movie.title}">
            </div>
        </div>
    `;
}

function createContinueWatchingCard(movie) {
    const progress = Math.floor(Math.random() * 60) + 20; // 20% to 80%
    return `
        <div class="movie-card reveal continue-card" onclick="openMovieDetails(${movie.id})" style="position: relative; overflow: hidden;">
            <div class="movie-card-img-wrapper">
                <img src="${movie.image}" alt="${movie.title}">
                <div class="movie-card-overlay">
                    <i class="fas fa-play play-icon"></i>
                </div>
            </div>
            <div class="progress-bar-container" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: rgba(255,255,255,0.2); z-index: 5;">
                <div style="width: ${progress}%; height: 100%; background: #e50914;"></div>
            </div>
        </div>
    `;
}

function scrollRow(rowId, direction) {
    const row = document.getElementById(rowId);
    if(row) {
        row.scrollBy({ left: direction * 300, behavior: 'smooth' });
    }
}

// مراقب الظهور للحركات (Scroll Reveal)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};
const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function observeCards() {
    const cards = document.querySelectorAll('.movie-card.reveal');
    cards.forEach((card, index) => {
        // تأخير الحركة قليلاً لتعطي شعور التتالي
        card.style.transitionDelay = `${(index % 5) * 0.1}s`;
        scrollObserver.observe(card);
    });
}

// تحميل الصفحة الرئيسية
function initHome() {
    const rowGenres = document.getElementById('row-genres');
    const rowMustWatch = document.getElementById('row-must-watch');
    const rowNew = document.getElementById('row-new');
    const rowTop10 = document.getElementById('row-top10');
    const rowContinue = document.getElementById('row-continue');
    const rowTrending = document.getElementById('row-trending');
    
    if (rowGenres) {
        rowGenres.innerHTML = genresList.map(g => `
            <div class="genre-card" style="background-image: url('${g.image}')" onclick="openGenreCategory('${g.name}')">
                <span>${g.name}</span>
            </div>
        `).join('');
    }
    
    if (rowContinue) {
        rowContinue.innerHTML = moviesData.slice(2, 6).map(createContinueWatchingCard).join('');
    }
    
    if (rowMustWatch) {
        rowMustWatch.innerHTML = moviesData.map(createCircularMovieCard).join('');
    }
    
    if (rowTop10) {
        rowTop10.innerHTML = moviesData.slice(0, 10).map((m, i) => createTop10Card(m, i)).join('');
    }
    
    if (rowNew) {
        rowNew.innerHTML = moviesData.filter(m => m.isNew).map(createMovieCard).join('');
    }
    if (rowTrending) {
        rowTrending.innerHTML = moviesData.filter(m => m.isTrending).map(createMovieCard).join('');
    }
    
    // مراقبة العناصر الجديدة
    setTimeout(observeCards, 100);
}

function openGenreCategory(genreName) {
    navigate('category', genreName);
    
    setTimeout(() => {
        const filter = document.getElementById('genre-filter');
        if (filter) {
            let opt = Array.from(filter.options).find(o => o.text === genreName || o.value === genreName);
            if (!opt) {
                const newOpt = document.createElement('option');
                newOpt.value = genreName;
                newOpt.textContent = genreName;
                filter.appendChild(newOpt);
            }
            filter.value = genreName;
            applyFilters();
        }
    }, 50);
}

// تحميل قسم (مسلسلات، أفلام، أطفال)
function loadCategory(catName) {
    categoryTitle.textContent = catName;
    currentCategoryName = catName;
    
    if (filterBar) filterBar.classList.remove('hidden');
    if (genreFilter) genreFilter.value = 'all';
    if (originFilter) originFilter.value = 'all';
    if (yearFilter) yearFilter.value = 'all';

    applyFilters();
}

function applyFilters() {
    let filteredMovies = moviesData.filter(m => m.category === currentCategoryName);
    
    if (genreFilter && genreFilter.value !== 'all') {
        filteredMovies = filteredMovies.filter(m => m.genre === genreFilter.value);
    }

    if (originFilter && originFilter.value !== 'all') {
        filteredMovies = filteredMovies.filter(m => m.origin === originFilter.value);
    }
    
    if (yearFilter && yearFilter.value !== 'all') {
        if (yearFilter.value === 'old') {
            filteredMovies = filteredMovies.filter(m => parseInt(m.year) < 2020);
        } else {
            filteredMovies = filteredMovies.filter(m => m.year === yearFilter.value);
        }
    }

    if (filteredMovies.length > 0) {
        categoryGrid.innerHTML = filteredMovies.map(createMovieCard).join('');
    } else {
        categoryGrid.innerHTML = `<p style="text-align:center; width:100%; grid-column: 1/-1; color:var(--text-muted)">لا توجد محتويات تطابق الفرز حالياً.</p>`;
    }
    
    setTimeout(observeCards, 100);
}

if (genreFilter) genreFilter.addEventListener('change', applyFilters);
if (originFilter) originFilter.addEventListener('change', applyFilters);
if (yearFilter) yearFilter.addEventListener('change', applyFilters);

// تحميل الأقسام المخصصة لقوائمي
function openCustomListGrid(listType) {
    navigate('custom_grid');
    const gridTitle = document.getElementById('custom-grid-title');
    const gridContainer = document.getElementById('custom-grid-container');
    
    let idsArr = [];
    let titleStr = '';
    
    if (listType === 'continueWatching') {
        idsArr = continueWatchingIds;
        titleStr = 'أكمل المشاهدة';
    } else if (listType === 'liked') {
        idsArr = likedIds;
        titleStr = 'أعجبني';
    } else if (listType === 'watchLater') {
        idsArr = watchLaterIds;
        titleStr = 'المشاهدة لاحقاً';
    }
    
    gridTitle.textContent = titleStr;
    
    const filtered = moviesData.filter(m => idsArr.includes(m.id));
    if (filtered.length > 0) {
        gridContainer.innerHTML = filtered.map(createMovieCard).join('');
    } else {
        gridContainer.innerHTML = `<p style="text-align:center; width:100%; color:var(--text-muted); padding: 50px;">قائمة "${titleStr}" فارغة حالياً.</p>`;
    }
    
    setTimeout(observeCards, 100);
}

// ==========================================
// 5. محرك البحث (Live Search)
// ==========================================
searchBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    searchInput.classList.toggle('active');
    if(searchInput.classList.contains('active')) {
        searchInput.focus();
    }
});

searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim().toLowerCase();
    
    const searchSuggestions = document.getElementById('search-suggestions');
    if (!searchSuggestions) return;
        
    if(query.length === 0) {
        searchSuggestions.classList.add('hidden');
        navigate('home');
    } else {
        const results = moviesData.filter(m => m.title.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query));
        
        if(results.length > 0) {
            searchSuggestions.innerHTML = results.slice(0, 5).map(m => `
                <div class="suggestion-item" onclick="openMovieDetails(${m.id}); document.getElementById('search-suggestions').classList.add('hidden');">
                    <img src="${m.image}" class="suggestion-img">
                    <div class="suggestion-info">
                        <div class="suggestion-title">${m.title}</div>
                        <div class="suggestion-meta">2024 • ${m.isTrending ? 'الأعلى مشاهدة' : 'متاح الآن'}</div>
                    </div>
                </div>
            `).join('');
            searchSuggestions.classList.remove('hidden');
        } else {
            searchSuggestions.innerHTML = '<div style="padding: 15px; text-align: center; color: #888;">لا توجد نتائج</div>';
            searchSuggestions.classList.remove('hidden');
        }
    }
});

searchInput.addEventListener('keydown', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if(e.key === 'Enter' && query.length > 0) {
        const searchSuggestions = document.getElementById('search-suggestions');
        if (searchSuggestions) searchSuggestions.classList.add('hidden');
        
        navigate('search');
        document.getElementById('search-query-text').textContent = query;
        const results = moviesData.filter(m => m.title.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query));
        
        const searchGrid = document.getElementById('search-grid');
        const noResults = document.getElementById('no-results');
        if (results.length > 0) {
            searchGrid.innerHTML = results.map(createMovieCard).join('');
            searchGrid.classList.remove('hidden');
            noResults.classList.add('hidden');
        } else {
            searchGrid.classList.add('hidden');
            noResults.classList.remove('hidden');
        }
    }
});

document.addEventListener('click', (e) => {
    if(!e.target.closest('.search-box')) {
        const searchSuggestions = document.getElementById('search-suggestions');
        if(searchSuggestions) searchSuggestions.classList.add('hidden');
    }
});


// ==========================================
// 6. الهيرو المتغير (Hero Carousel Logic)
// ==========================================
const heroSlider = document.getElementById('hero-slider');
const heroTitle = document.getElementById('hero-title');
const heroDesc = document.getElementById('hero-desc');
const heroDots = document.querySelectorAll('.slider-dot');
const heroVideo = document.getElementById('hero-video');

const heroMovies = moviesData.filter(m => m.isTrending).slice(0, 3);
let currentHeroIndex = 0;

function updateHero() {
    if(heroMovies.length === 0) return;
    const movie = heroMovies[currentHeroIndex];
    
    if(heroVideo) {
        heroVideo.style.opacity = 0;
        setTimeout(() => {
            heroVideo.src = movie.trailer || '';
            heroVideo.poster = movie.image;
            heroVideo.play().catch(e => console.log('Autoplay blocked:', e));
            heroVideo.style.opacity = 1;
        }, 300);
    } else {
        heroSlider.style.backgroundImage = `url('${movie.image}')`;
    }
    
    heroTitle.textContent = movie.title;
    heroDesc.textContent = movie.desc;
    
    const heroMyListBtn = document.getElementById('hero-mylist-btn');
    heroMyListBtn.setAttribute('onclick', `toggleMyList(this, ${movie.id})`);
    updateListBtnVisual(heroMyListBtn, movie.id);

    heroDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentHeroIndex);
    });
}

// التغيير التلقائي كل 5 ثواني
setInterval(() => {
    if(views.home.classList.contains('active')) {
        currentHeroIndex = (currentHeroIndex + 1) % heroMovies.length;
        updateHero();
    }
}, 5000);

heroDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentHeroIndex = index;
        updateHero();
    });
});

// ==========================================
// 7. النوافذ المنبثقة والقوائم والمشغل
// ==========================================
let vjsPlayer = null;

async function playVideo(movieId = null) {
    let subjectId = movieId || "dummy_id"; // في المستقبل ستمرر ID حقيقي للفيلم هنا
    
    // إظهار نافذة التحميل أو المشغل
    videoModal.classList.remove('hidden');
    
    try {
        console.log("جاري الاتصال بسيرفر البروكسي لجلب الفيديو...");
        
        // الاتصال بالسيرفر الوسيط (البروكسي المرفوع)
        const response = await fetch(`https://iraq-proxy.onrender.com/api/get-video?subjectId=${subjectId}&se=1&ep=1`);
        const data = await response.json();
        
        // طباعة البيانات في الكونسول لنعرف مسار رابط الفيديو بدقة
        console.log("البيانات المستلمة من السيرفر:", data);
        
        // البحث عن الرابط المباشر في الرد (محاولة استخراج HLS أو Streams)
        let videoUrl = "";
        if (data && data.data) {
            if (data.data.hls && data.data.hls.length > 0) {
                videoUrl = data.data.hls[0].url;
            } else if (data.data.streams && data.data.streams.length > 0) {
                videoUrl = data.data.streams[0].url;
            } else if (data.data.dash && data.data.dash.length > 0) {
                videoUrl = data.data.dash[0].url;
            }
        }
        
        if (!vjsPlayer) {
            vjsPlayer = videojs('my-video');
        }
        
        // إذا وجدنا الرابط، نقوم بتحديث المشغل
        if (videoUrl) {
            console.log("تم العثور على الرابط المباشر:", videoUrl);
            vjsPlayer.src({
                src: videoUrl,
                type: videoUrl.includes('.m3u8') ? 'application/x-mpegURL' : 'video/mp4'
            });
        } else {
            console.warn("لم يتم العثور على رابط مباشر للفيديو في الرد.");
        }
        
        vjsPlayer.play();
        
    } catch (error) {
        console.error("حدث خطأ أثناء جلب الفيديو:", error);
    }
}

function closeVideo() {
    videoModal.classList.add('hidden');
    if (vjsPlayer) {
        vjsPlayer.pause();
    }
}

function openMovieDetails(id) {
    const movie = moviesData.find(m => m.id === id);
    if (!movie) return;

    detailsTitle.textContent = movie.title;
    detailsDesc.textContent = movie.desc;
    detailsYear.textContent = movie.year;
    detailsRating.textContent = movie.rating;
    
    document.getElementById('details-director').textContent = movie.director || 'غير معروف';
    document.getElementById('details-cast').textContent = movie.cast || 'غير معروف';

    const detailsTrailer = document.getElementById('details-trailer');
    if (detailsTrailer) {
        detailsTrailer.src = movie.trailer || '';
        detailsTrailer.poster = movie.image;
    }

    const btnContinue = document.getElementById('btn-continue-watching');
    const btnLike = document.getElementById('btn-like');
    const btnWatchLater = document.getElementById('btn-watch-later');
    
    if(btnContinue) btnContinue.setAttribute('onclick', `toggleContinueWatching(this, ${id})`);
    if(btnLike) btnLike.setAttribute('onclick', `toggleLike(this, ${id})`);
    if(btnWatchLater) btnWatchLater.setAttribute('onclick', `toggleWatchLater(this, ${id})`);
    
    updateCustomListBtns(id);

    detailsModal.classList.remove('hidden');
}

function closeMovieDetails() {
    detailsModal.classList.add('hidden');
    const detailsTrailer = document.getElementById('details-trailer');
    if (detailsTrailer) {
        detailsTrailer.pause();
    }
}

function toggleContinueWatching(btn, id) {
    toggleIdInArray(continueWatchingIds, id);
    localStorage.setItem('continueWatchingIds', JSON.stringify(continueWatchingIds));
    btn.classList.toggle('active');
    refreshMyListsIfActive();
}

function toggleLike(btn, id) {
    toggleIdInArray(likedIds, id);
    localStorage.setItem('likedIds', JSON.stringify(likedIds));
    btn.classList.toggle('active');
    refreshMyListsIfActive();
}

function toggleWatchLater(btn, id) {
    toggleIdInArray(watchLaterIds, id);
    localStorage.setItem('watchLaterIds', JSON.stringify(watchLaterIds));
    btn.classList.toggle('active');
    refreshMyListsIfActive();
}

function toggleIdInArray(arr, id) {
    const index = arr.indexOf(id);
    if (index > -1) {
        arr.splice(index, 1);
    } else {
        arr.push(id);
    }
}

function updateCustomListBtns(id) {
    const btnContinue = document.getElementById('btn-continue-watching');
    const btnLike = document.getElementById('btn-like');
    const btnWatchLater = document.getElementById('btn-watch-later');
    
    if(btnContinue) {
        if (continueWatchingIds.includes(id)) btnContinue.classList.add('active');
        else btnContinue.classList.remove('active');
    }
    
    if(btnLike) {
        if (likedIds.includes(id)) btnLike.classList.add('active');
        else btnLike.classList.remove('active');
    }
    
    if(btnWatchLater) {
        if (watchLaterIds.includes(id)) btnWatchLater.classList.add('active');
        else btnWatchLater.classList.remove('active');
    }
}

function refreshMyListsIfActive() {
    if (views.custom_grid && views.custom_grid.classList.contains('active')) {
        const titleStr = document.getElementById('custom-grid-title').textContent;
        if (titleStr === 'أكمل المشاهدة') openCustomListGrid('continueWatching');
        else if (titleStr === 'أعجبني') openCustomListGrid('liked');
        else if (titleStr === 'المشاهدة لاحقاً') openCustomListGrid('watchLater');
    }
}

// قائمة المستخدم المنسدلة
profileImg.addEventListener('click', function(e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('active');
});

// قائمة الموبايل
mobileMenuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    navLinks.classList.toggle('active');
});

// إغلاق كل شيء عند النقر خارجاً
window.addEventListener('click', function(event) {
    if (event.target == videoModal) {
        closeVideo();
    }
    if (event.target == detailsModal) {
        closeMovieDetails();
    }
    if (!dropdownMenu.contains(event.target) && event.target !== profileImg) {
        dropdownMenu.classList.remove('active');
    }
    if (!searchInput.contains(event.target) && event.target !== searchBtn) {
        if(searchInput.value === '') {
            searchInput.classList.remove('active');
        }
    }
    if (!navLinks.contains(event.target) && event.target !== mobileMenuBtn && !mobileMenuBtn.contains(event.target)) {
        navLinks.classList.remove('active');
    }
    
    // إغلاق الإشعارات
    const notifDropdown = document.getElementById('notifications-dropdown');
    const notifContainer = document.querySelector('.notifications-container');
    if (notifDropdown && notifContainer && !notifContainer.contains(event.target)) {
        notifDropdown.classList.remove('active');
    }
});

// تفعيل الإشعارات والتفاعلات
const notifContainer = document.querySelector('.notifications-container');
const notifDropdown = document.getElementById('notifications-dropdown');
if (notifContainer && notifDropdown) {
    notifContainer.addEventListener('click', function(e) {
        // Only toggle if the click is on the bell icon or the container itself, not the dropdown
        if(e.target.closest('.notifications-dropdown') === null) {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
        }
    });
}

// Dynamic User Notifications
let userNotifications = JSON.parse(localStorage.getItem('userNotifications')) || [];

function saveUserNotifications() {
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
}

function renderUserNotifications() {
    const list = document.getElementById('notifications-list');
    if (!list) return;
    
    if (userNotifications.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding: 20px; color: var(--text-muted);">لا توجد إشعارات</p>';
    } else {
        list.innerHTML = userNotifications.map(n => `
            <li class="${n.isRead ? '' : 'unread'}" data-id="${n.id}">
                <img src="${n.image}" alt="Notification">
                <div class="notif-content">
                    <p>${n.text}</p>
                    <span style="font-size: 0.75rem; color: #888;">منذ وقت قصير</span>
                </div>
                <div class="notif-actions">
                    ${!n.isRead ? `<i class="fas fa-check" onclick="markAsRead(event, ${n.id})" title="تحديد كمقروء"></i>` : ''}
                    <i class="fas fa-trash" onclick="deleteNotification(event, ${n.id})" title="حذف"></i>
                </div>
            </li>
        `).join('');
    }
    updateNotificationBadge();
}

function updateNotificationBadge() {
    const badge = document.querySelector('.notification-badge');
    if (!badge) return;
    const unreadCount = userNotifications.filter(n => !n.isRead).length;
    if (unreadCount > 0) {
        badge.textContent = unreadCount;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function deleteNotification(event, id) {
    event.stopPropagation();
    userNotifications = userNotifications.filter(n => n.id !== id);
    saveUserNotifications();
    renderUserNotifications();
}

function markAsRead(event, id) {
    event.stopPropagation();
    const notif = userNotifications.find(n => n.id === id);
    if (notif) {
        notif.isRead = true;
        saveUserNotifications();
        renderUserNotifications();
    }
}

function markAllAsRead(event) {
    event.stopPropagation();
    userNotifications.forEach(n => n.isRead = true);
    saveUserNotifications();
    renderUserNotifications();
}

// Render on load
document.addEventListener('DOMContentLoaded', () => {
    renderUserNotifications();
});

// تغيير خلفية شريط التنقل عند التمرير
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
}
});

// ==========================================
// 8. Profile Edit Logic (Name & Avatar)
// ==========================================
function toggleNameEdit() {
    const display = document.getElementById('account-name-display');
    const input = document.getElementById('account-name-input');
    const editBtn = document.getElementById('edit-name-btn');
    const saveBtn = document.getElementById('save-name-btn');
    
    display.classList.add('hidden');
    editBtn.classList.add('hidden');
    input.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    input.focus();
}

function saveNameEdit() {
    const display = document.getElementById('account-name-display');
    const input = document.getElementById('account-name-input');
    const editBtn = document.getElementById('edit-name-btn');
    const saveBtn = document.getElementById('save-name-btn');
    
    const newName = input.value.trim();
    if(newName !== "") {
        display.innerText = newName;
        localStorage.setItem('accountName', newName);
        showToast('تم تحديث الاسم بنجاح!');
    }
    
    display.classList.remove('hidden');
    editBtn.classList.remove('hidden');
    input.classList.add('hidden');
    saveBtn.classList.add('hidden');
}

let selectedAvatarUrl = "";

function openAvatarModal() {
    document.getElementById('avatar-modal').classList.add('active');
}

function closeAvatarModal() {
    document.getElementById('avatar-modal').classList.remove('active');
}

function selectAvatar(imgElement, url) {
    const avatars = document.querySelectorAll('.avatar-option');
    avatars.forEach(av => av.classList.remove('selected'));
    imgElement.classList.add('selected');
    selectedAvatarUrl = url;
}

function saveAvatar() {
    if (selectedAvatarUrl !== "") {
        document.getElementById('account-profile-img').src = selectedAvatarUrl;
        document.getElementById('profile-img').src = selectedAvatarUrl; // Update navbar image too
        localStorage.setItem('accountAvatar', selectedAvatarUrl);
        showToast('تم تغيير صورة الحساب بنجاح!');
        closeAvatarModal();
    } else {
        showToast('الرجاء اختيار صورة أولاً', 'error');
    }
}

// ==========================================
// 9. Subscription Flow Logic
// ==========================================
function showSubscribeSection() {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('subscribe-section').classList.remove('hidden');
    goToSubStep(1);
}

function showLoginSection() {
    document.getElementById('subscribe-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

function goToSubStep(stepNum) {
    // Hide all steps
    document.querySelectorAll('.sub-step').forEach(step => step.classList.add('hidden'));
    document.querySelectorAll('.sub-step').forEach(step => step.classList.remove('active'));
    
    // Show target step
    const targetStep = document.getElementById('sub-step-' + stepNum);
    targetStep.classList.remove('hidden');
    // slight delay for animation
    setTimeout(() => targetStep.classList.add('active'), 10);
    
    // Update progress indicator
    for(let i=1; i<=3; i++) {
        const dot = document.getElementById('step-dot-' + i);
        if(i <= stepNum) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    }
    
    // Load Admin Payment info if reaching step 3
    if (stepNum === 3) {
        const adminZain = localStorage.getItem('adminZain') || 'غير متوفر حالياً';
        const adminVisa = localStorage.getItem('adminVisa') || 'غير متوفر حالياً';
        const zainDisplay = document.getElementById('display-admin-zain');
        const visaDisplay = document.getElementById('display-admin-visa');
        if(zainDisplay) zainDisplay.innerText = adminZain;
        if(visaDisplay) visaDisplay.innerText = adminVisa;
    }
}

let selectedPlanPrice = "10,000";
function selectPlan(planId, cardElement) {
    document.querySelectorAll('.plan-card').forEach(card => card.classList.remove('selected'));
    cardElement.classList.add('selected');
    
    if (planId === 'basic') selectedPlanPrice = "5,000";
    else if (planId === 'standard') selectedPlanPrice = "10,000";
    else if (planId === 'premium') selectedPlanPrice = "15,000";
    document.getElementById('pay-btn').innerText = `إتمام التحويل (${selectedPlanPrice} د.ع)`;
}

function selectPayment(methodId, methodElement) {
    document.querySelectorAll('.pay-method').forEach(m => m.classList.remove('active'));
    methodElement.classList.add('active');
    
    document.querySelectorAll('.payment-form').forEach(f => f.classList.add('hidden'));
    document.querySelectorAll('.payment-form').forEach(f => f.classList.remove('active'));
    
    const targetForm = document.getElementById('payment-' + methodId);
    targetForm.classList.remove('hidden');
    setTimeout(() => targetForm.classList.add('active'), 10);
}

function completeSubscription() {
    const btn = document.getElementById('pay-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إرسال إشعار التحويل...';
    
    setTimeout(() => {
        showToast('تم إرسال إشعار التحويل، سيتم تفعيل حسابك بعد المراجعة!', 'success');
        document.getElementById('subscribe-section').classList.add('hidden');
        document.getElementById('main-platform').classList.remove('hidden');
        document.getElementById('page-loader').classList.remove('hidden');
        
        setTimeout(() => {
            document.getElementById('page-loader').classList.add('hidden');
            btn.innerText = `إتمام التحويل (${selectedPlanPrice} د.ع)`;
        }, 1500);
        
    }, 2000);
}

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

// تشغيل الواجهة الأولية خلف الكواليس
initHome();
updateHero();

// ==========================================
// 12. إعدادات الحساب
// ==========================================
function saveSettings() {
    const lang = document.getElementById('settings-lang').value;
    const passNew = document.getElementById('settings-pass-new').value;
    const passConfirm = document.getElementById('settings-pass-confirm').value;
    const emailNotif = document.getElementById('settings-email-notif').checked;
    
    if (passNew || passConfirm) {
        if (passNew !== passConfirm) {
            showToast('كلمتا المرور غير متطابقتين', 'error');
            return;
        }
        if (passNew.length < 6) {
            showToast('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل', 'warning');
            return;
        }
    }
    
    // محاكاة حفظ الإعدادات
    const btn = event.currentTarget;
    const originalText = btn.innerText;
    btn.innerText = 'جاري الحفظ...';
    btn.disabled = true;
    
    setTimeout(() => {
        if (passNew) {
            localStorage.setItem('userPass', passNew);
        }
        
        document.getElementById('settings-pass-new').value = '';
        document.getElementById('settings-pass-confirm').value = '';
        showToast('تم حفظ الإعدادات بنجاح!', 'success');
        
        btn.innerText = originalText;
        btn.disabled = false;
    }, 1000);
}

function showAuthAlert(message, type) {
    const modal = document.getElementById('auth-alert-modal');
    if (!modal) return;
    const iconContainer = document.getElementById('auth-alert-icon');
    const textContainer = document.getElementById('auth-alert-text');
    
    if (type === 'success') {
        iconContainer.innerHTML = '<i class="fas fa-check-circle" style="color: #2ecc71; text-shadow: 0 0 20px rgba(46, 204, 113, 0.5);"></i>';
    } else {
        iconContainer.innerHTML = '<i class="fas fa-times-circle" style="color: #e74c3c; text-shadow: 0 0 20px rgba(231, 76, 60, 0.5);"></i>';
    }
    
    textContainer.textContent = message;
    
    // استخدام كلاس active للإظهار
    modal.classList.add('active');
    
    setTimeout(() => {
        modal.classList.remove('active');
    }, 2000);
}
