// تعريف المتغيرات العامة
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let isGridView = localStorage.getItem('viewMode') !== 'list';
let audioEnabled = localStorage.getItem('audioEnabled') !== 'false';
let clickSound = new Audio('https://www.soundjay.com/buttons/sounds/button-30.mp3');

// مصفوفات المحتوى لكل قسم
const contentData = {
    new: [
        "حكمة جديدة: الصبر مفتاح الفرج.",
        "دعاء جديد: اللهم اغفر لي وارحمني.",
        "خاطرة: الحياة لحظات فاجعلها جميلة."
    ],
    hikam: [
        "لا تنتظر اللحظة المثالية، خذ اللحظة التي لديك واجعلها مثالية.",
        "العقل السليم في الجسم السليم.",
        "الحياة رحلة وليست وجهة."
    ],
    azkar: [
        "اللهم اجعل هذا التطبيق صدقة جارية...",
        "اللهم ارزقني رزقًا حلالًا طيبًا.",
        "اللهم أعني على ذكرك وشكرك."
    ],
    quotes: [
        "الحياة مليئة بالدروس والعبر...",
        "الأمل هو الضوء الذي ينير الظلام.",
        "كل بداية صعبة تنتهي بنهاية مشرفة."
    ],
    qisas: [
        "قصة الصبر: كان هناك رجل صبور انتظر سنوات حتى تحقق حلمه...",
        "قصة الوفاء: صديقان ظلا متمسكين بوعدهما رغم المسافات.",
        "قصة العطاء: رجل فقير أعطى كل ما يملك فكافأه الله."
    ],
    mawaez: [
        "تذكر دائماً أن الصبر يجلب الخير.",
        "من توكل على الله كفاه.",
        "الدنيا دار ممر وليست دار مقر."
    ],
    atab: [
        "لماذا تغيب عني وأنا أنتظرك كل يوم؟",
        "كنت أظنك الصديق الذي لا ينسى.",
        "لماذا تركتني في وقت حاجتي؟"
    ],
    iqubasat: [
        "النجاح ليس المفتاح للسعادة، السعادة هي المفتاح للنجاح. - ألبرت أينشتاين",
        "الحياة مثل المرآة، تحصل على أفضل النتائج عندما تبتسم لها.",
        "الوقت هو أثمن ما يملك الإنسان. - سقراط"
    ],
    qissaWaIbra: [
        "قصة الفقير والملك: فقير ساعد ملكاً فأصبح غنياً بفضل أمانته.",
        "قصة الكنز: رجل بحث عن كنز فوجده في قلبه.",
        "قصة الشجرة: زرعها رجل فأثمرت بعد سنوات."
    ],
    amthalShaabiya: [
        "من جد وجد.",
        "اللي ما يعرف الصقر يشويه.",
        "الوقت كالسيف إن لم تقطعه قطعك."
    ],
    hurufDhahabiya: [
        "الصمت في بعض الأحيان هو أبلغ رد.",
        "كلمة واحدة قد تغير مصير إنسان.",
        "الحب كنز لا يفنى."
    ],
    iitizar: [
        "أعتذر إن أخطأت بحقك يوماً.",
        "سامحني فالقلب لا يقصد الإساءة.",
        "أعتذر عن صمتي إن كان قد أزعجك."
    ],
    rasail: [
        "رسالة إلى صديق: أنت نعمة في حياتي.",
        "رسالة إلى أمي: أنتِ نور دربي.",
        "رسالة إلى نفسي: لا تيأس أبدًا."
    ],
    maqulat: [
        "العقل هو السلاح الأقوى في الحياة.",
        "العمل الجاد يهزم الموهبة إذا لم تُستغل.",
        "الحياة تحتاج إلى قلب شجاع."
    ],
    kalimaTayyiba: [
        "كلمة طيبة تصنع يوماً سعيداً.",
        "ابتسم فالابتسامة صدقة.",
        "شكرًا كلمة تجلب الخير."
    ],
    philosophy: [
        "الحياة لغز ان لم تحله حلك - سقراط",
        "أعرف نفسك بنفسك - أرسطو",
        "السعادة غاية بحد ذاتها - أفلاطون"
    ]
};

// عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    updateCategoriesView();
    loadSectionContent('new', contentData.new);
    loadSectionContent('favorite', favorites); // تحميل المفضلة عند التحميل
    document.getElementById('hamburger').addEventListener('click', toggleSidebar);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('toggleView').addEventListener('click', toggleViewMode);
    updateAudioIcon();
});

// عرض/إخفاء القائمة الجانبية
function toggleSidebar() {
    playSound();
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// عرض قسم معين
function showSection(sectionId) {
    playSound();
    document.querySelectorAll('.content').forEach(section => section.classList.remove('active'));
    const section = document.getElementById(sectionId);
    section.classList.add('active');
    
    if (sectionId === 'favorite') {
        loadSectionContent('favorite', favorites); // تحميل المفضلة مباشرة
    } else if (sectionId !== 'home' && sectionId !== 'settings' && sectionId !== 'decoration' && sectionId !== 'custom-cards') {
        loadSectionContent(sectionId, contentData[sectionId] || []);
    }
    closeSidebar();
}

// تحميل محتوى القسم
function loadSectionContent(sectionId, items) {
    const container = sectionId === 'favorite' ? document.getElementById('favoritesList') : document.getElementById(`${sectionId}Content`);
    if (!container) return;

    container.innerHTML = ''; // تفريغ المحتوى السابق
    if (items.length === 0) {
        const emptyMessage = sectionId === 'favorite' ? 'لا توجد عناصر في المفضلة حاليًا!' : 'لا توجد عناصر متاحة!';
        container.innerHTML = `<p class="magic-text">${emptyMessage}</p>`;
        return;
    }

    items.forEach((item) => {
        const div = document.createElement('div');
        div.className = 'item-container';
        div.innerHTML = `
            <p class="magic-text">${item}</p>
            <div class="item-actions">
                <button onclick="copyText('${item}')"><i class="fas fa-copy"></i></button>
                <button onclick="shareText('${item}')"><i class="fas fa-share-alt"></i></button>
                <button onclick="toggleFavorite('${item}', this)"><i class="fas fa-heart ${favorites.includes(item) ? 'favorite' : ''}"></i></button>
            </div>
        `;
        container.appendChild(div);
    });
}

// البحث في المحتوى
function searchContent() {
    playSound();
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!query) return showNotification('يرجى إدخال كلمة للبحث!');
    
    const results = [];
    Object.keys(contentData).forEach(section => {
        contentData[section].forEach(item => {
            if (item.toLowerCase().includes(query)) {
                results.push(item);
            }
        });
    });
    
    showSection('new');
    loadSectionContent('new', results.length ? results : ['لا توجد نتائج مطابقة!']);
}

// تبديل وضع العرض (شبكة/قائمة)
function toggleViewMode() {
    playSound();
    isGridView = !isGridView;
    localStorage.setItem('viewMode', isGridView ? 'grid' : 'list');
    updateCategoriesView();
}

// تحديث عرض الأقسام
function updateCategoriesView() {
    const list = document.getElementById('categoriesList');
    list.className = `categories ${isGridView ? 'grid-view' : 'list-view'}`;
}

// إضافة/إزالة من المفضلة
function toggleFavorite(item, button) {
    playSound();
    const index = favorites.indexOf(item);
    if (index === -1) {
        favorites.push(item); // إضافة الجملة إلى المفضلة
        button.querySelector('i').classList.add('favorite');
        showNotification('تمت الإضافة إلى المفضلة!');
    } else {
        favorites.splice(index, 1); // إزالة الجملة من المفضلة
        button.querySelector('i').classList.remove('favorite');
        showNotification('تمت الإزالة من المفضلة!');
    }
    localStorage.setItem('favorites', JSON.stringify(favorites)); // حفظ التغييرات

    // تحديث قسم المفضلة فورًا إذا كان مفتوحًا
    if (document.getElementById('favorite').classList.contains('active')) {
        loadSectionContent('favorite', favorites);
    }
}

// نسخ النص
function copyText(text) {
    playSound();
    navigator.clipboard.writeText(text).then(() => {
        showNotification('تم نسخ النص بنجاح!');
    });
}

// مشاركة النص
function shareText(text) {
    playSound();
    if (navigator.share) {
        navigator.share({
            title: 'عبر وخواطر',
            text: text,
            url: window.location.href
        }).catch(() => showNotification('حدث خطأ أثناء المشاركة!'));
    } else {
        showNotification('المشاركة غير مدعومة في متصفحك!');
    }
}

// تبديل الوضع الليلي
function toggleTheme() {
    playSound();
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    document.getElementById('themeToggle').innerHTML = `<i class="fas ${isDark ? 'fa-sun' : 'fa-moon'}"></i> تبديل الوضع ${isDark ? 'النهاري' : 'الليلي'}`;
}

// تبديل الصوت
function toggleAudio() {
    playSound();
    audioEnabled = !audioEnabled;
    localStorage.setItem('audioEnabled', audioEnabled);
    updateAudioIcon();
    showNotification(`الصوت ${audioEnabled ? 'مفعل' : 'معطل'}`);
}

// تحديث أيقونة الصوت
function updateAudioIcon() {
    document.getElementById('audioToggle').innerHTML = `<i class="fas ${audioEnabled ? 'fa-volume-up' : 'fa-volume-mute'}"></i> ${audioEnabled ? 'إيقاف' : 'تشغيل'} الصوت`;
}

// تشغيل الصوت
function playSound() {
    if (audioEnabled) clickSound.play();
}

// عرض الإشعارات
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// التحقق من التحديثات
function checkUpdate() {
    playSound();
    showNotification('التطبيق محدث إلى أحدث إصدار!');
}

// التواصل معنا
function contactUs() {
    playSound();
    window.location.href = 'mailto:support@example.com';
}

// تقييم التطبيق
function rateApp() {
    playSound();
    showNotification('شكرًا على تقييمك! يرجى زيارة متجر التطبيقات.');
}

// مشاركة التطبيق
function shareApp() {
    playSound();
    if (navigator.share) {
        navigator.share({
            title: 'عبر وخواطر',
            text: 'جرب تطبيق عبر وخواطر الرائع!',
            url: window.location.href
        }).catch(() => showNotification('حدث خطأ أثناء المشاركة!'));
    } else {
        showNotification('المشاركة غير مدعومة في متصفحك!');
    }
}

// تغيير الثيم
function changeTheme(theme) {
    playSound();
    document.body.className = '';
    if (theme !== 'default') document.body.classList.add(`theme-${theme}`);
    showNotification(`تم تغيير الثيم إلى ${theme === 'default' ? 'الافتراضي' : theme}`);
}

// تغيير حجم الخط
function changeFontSize(size) {
    playSound();
    document.body.style.fontSize = size === 'small' ? '14px' : size === 'medium' ? '16px' : '18px';
    document.querySelectorAll('.font-size-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    showNotification(`تم تغيير حجم الخط إلى ${size === 'small' ? 'صغير' : size === 'medium' ? 'متوسط' : 'كبير'}`);
}

// الإشعارات
function notifications() {
    playSound();
    showNotification('لا توجد إشعارات جديدة حاليًا!');
}

// زخرفة النص
function decorateText() {
    playSound();
    const input = document.getElementById('decorationInput').value;
    if (!input) return showNotification('يرجى إدخال نص للزخرفة!');
    
    const decorated = input.split('').map(char => {
        const decorations = {
            'ا': 'آ', 'ب': 'بّ', 'ت': 'تٌ', 'ث': 'ثْ', 'ج': 'جٍ', 'ح': 'حً', 'خ': 'خَ', 'د': 'دِ', 'ذ': 'ذٌ', 'ر': 'رٍ',
            'ز': 'زَ', 'س': 'سْ', 'ش': 'شٌ', 'ص': 'صً', 'ض': 'ضِ', 'ط': 'طٍ', 'ظ': 'ظْ', 'ع': 'عَ', 'غ': 'غٌ', 'ف': 'فً',
            'ق': 'قِ', 'ك': 'كٍ', 'ل': 'لَ', 'م': 'مٌ', 'ن': 'نْ', 'ه': 'هً', 'و': 'وٍ', 'ي': 'يَ'
        };
        return decorations[char] || char;
    }).join('');
    
    document.getElementById('decoratedOutput').innerHTML = `<p class="magic-text">${decorated}</p>`;
    showNotification('تم زخرفة النص بنجاح!');
}

// تخصيص البطاقة
function changeCardBackground(bg) {
    playSound();
    document.getElementById('cardPreview').style.background = bg;
    showNotification('تم تغيير خلفية البطاقة!');
}

function changeCardFont(font) {
    playSound();
    document.getElementById('cardPreviewText').style.fontFamily = font;
    showNotification(`تم تغيير الخط إلى ${font}!`);
}

function changeCardColor(color) {
    playSound();
    document.getElementById('cardPreviewText').style.color = color;
    showNotification('تم تغيير لون النص!');
}

// تحديث معاينة البطاقة
document.getElementById('cardText').addEventListener('input', () => {
    const text = document.getElementById('cardText').value || 'معاينة النص هنا';
    document.getElementById('cardPreviewText').textContent = text;
});

// حفظ البطاقة كصورة
function saveCard() {
    playSound();
    const card = document.getElementById('cardPreview');
    html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.download = 'card.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        showNotification('تم حفظ البطاقة كصورة!');
    });
}

// مشاركة البطاقة
function shareCard() {
    playSound();
    const card = document.getElementById('cardPreview');
    html2canvas(card).then(canvas => {
        canvas.toBlob(blob => {
            const file = new File([blob], 'card.png', { type: 'image/png' });
            if (navigator.share) {
                navigator.share({
                    files: [file],
                    title: 'بطاقة من عبر وخواطر',
                    text: 'انظر إلى هذه البطاقة الرائعة!'
                }).catch(() => showNotification('حدث خطأ أثناء المشاركة!'));
            } else {
                showNotification('المشاركة غير مدعومة في متصفحك!');
            }
        });
    });
}

// إغلاق القائمة الجانبية
function closeSidebar() {
    playSound();
    document.getElementById('sidebar').classList.remove('active');
}