let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

function showSection(sectionId) {
    let sections = document.querySelectorAll('.content');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
    if (sectionId === 'favorite') {
        displayFavorites();
    }
}

// تبديل بين الوضع الداكن والفاتح
const themeToggle = document.getElementById("themeToggle");
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// وظائف الإعدادات
function contactUs() {
    window.open('https://Basitapp.blogspot.com', '_blank');
}

function rateApp() {
    alert("شكرًا لتقييمك! يرجى تقييم التطبيق في المتجر.");
}

function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'حكم من نور',
            text: 'جرب تطبيق حكم من نور المميز!',
            url: window.location.href
        }).catch(error => console.log('خطأ في المشاركة:', error));
    } else {
        alert('شارك الرابط: ' + window.location.href);
    }
}

function notifications() {
    // طلب إذن المستخدم للإشعارات
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            showNotification("تم تفعيل الإشعارات!", "ستتلقى تذكيرات وتحديثات جديدة.");
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showNotification("تم تفعيل الإشعارات!", "ستتلقى تذكيرات وتحديثات جديدة.");
                    // إعداد تذكير دوري كمثال
                    setInterval(() => {
                        showNotification("تذكير يومي", "تأمل في حكمة اليوم: الصبر مفتاح الفرج.");
                    }, 60000); // كل دقيقة (يمكن تغييره إلى 24 ساعة: 86400000)
                }
            });
        } else {
            alert("تم رفض الإشعارات. يرجى تفعيلها يدويًا من إعدادات المتصفح.");
        }
    } else {
        alert("المتصفح لا يدعم الإشعارات.");
    }
}

function editProfile() {
    alert("يمكنك تعديل الاسم أو البريد الإلكتروني هنا!");
}

// وظيفة البحث
function searchContent() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const sections = document.querySelectorAll('.content');
    sections.forEach(section => {
        const text = section.innerText.toLowerCase();
        if (text.includes(searchTerm)) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
    if (!document.querySelector('.content.active')) {
        document.getElementById('home').classList.add('active');
    }
}

// وظائف الميزات تحت كل عنصر
function copyText(button) {
    const textElement = button.parentElement.previousElementSibling;
    const text = textElement.textContent || textElement.innerText;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            alert('تم نسخ النص بنجاح: ' + text);
        }).catch(err => {
            console.error('فشل في النسخ:', err);
            fallbackCopyTextToClipboard(text);
        });
    } else {
        fallbackCopyTextToClipboard(text);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        alert('تم نسخ النص بنجاح: ' + text);
    } catch (err) {
        alert('فشل في النسخ، حاول مرة أخرى: ' + err);
    }
    document.body.removeChild(textArea);
}

function shareText(button) {
    const textElement = button.parentElement.previousElementSibling;
    const text = textElement.textContent || textElement.innerText;
    if (navigator.share) {
        navigator.share({
            title: 'نص من حكم من نور',
            text: text
        }).catch(error => console.log('خطأ في المشاركة:', error));
    } else {
        alert('النص جاهز للمشاركة: ' + text);
    }
}

function whatsappShare(button) {
    const textElement = button.parentElement.previousElementSibling;
    const text = textElement.textContent || textElement.innerText;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
}

function addToFavorites(button) {
    const textElement = button.parentElement.previousElementSibling;
    const text = textElement.textContent || textElement.innerText;
    if (!favorites.includes(text)) {
        favorites.push(text);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        alert('تمت إضافة العنصر إلى المفضلة!');
        displayFavorites();
    } else {
        alert('هذا العنصر موجود بالفعل في المفضلة!');
    }
}

function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    favorites.forEach(fav => {
        const div = document.createElement('div');
        div.className = 'item-container';
        div.innerHTML = `
            <p>${fav}</p>
            <div class="item-actions">
                <button onclick="copyText(this)">نسخ</button>
                <button onclick="shareText(this)">مشاركة</button>
                <button onclick="whatsappShare(this)">واتساب</button>
                <button onclick="removeFromFavorites(this)">حذف من المفضلة</button>
            </div>
        `;
        favoritesList.appendChild(div);
    });
}

function removeFromFavorites(button) {
    const textElement = button.parentElement.previousElementSibling;
    const text = textElement.textContent || textElement.innerText;
    favorites = favorites.filter(fav => fav !== text);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavorites();
    alert('تم حذف العنصر من المفضلة!');
}

// وظيفة عرض الإشعارات
function showNotification(title, body) {
    if (Notification.permission === "granted") {
        new Notification(title, {
            body: body,
            icon: 'icon.png' // يمكنك استبدالها بمسار أيقونة
        });
    }
}

// مثال على تفعيل إشعار عند إضافة عنصر إلى المفضلة
function triggerNotificationOnFavorite() {
    if (Notification.permission === "granted") {
        showNotification("تم الإضافة!", "تمت إضافة عنصر جديد إلى المفضلة.");
    }
}