// ===== ПОРТАЛ - ИНТЕРАКТИВНОСТЬ =====

// Плавная прокрутка к секциям
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();

        // Убираем активный класс со всех
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

        // Добавляем на текущий
        this.classList.add('active');

        // Находим секцию
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        // Прокручиваем
        targetSection.scrollIntoView({ behavior: 'smooth' });
    });
});

// Анимация счётчиков при загрузке
function animateCounters() {
    const counters = document.querySelectorAll('.stat-value');

    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        let current = 0;
        const increment = target / 30;

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// Запускаем анимацию при загрузке
document.addEventListener('DOMContentLoaded', animateCounters);

// Подсветка текущей секции при скролле
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

// Обновление прогресса (можно менять вручную)
function updateProgress(percent) {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.getElementById('progressPercent');

    progressFill.style.width = percent + '%';
    progressText.textContent = percent + '%';
}

// Консольное приветствие для разработчика
console.log('🚀 Добро пожаловать в твой обучающий портал!');
console.log('📊 Используй updateProgress(число) чтобы обновить прогресс');
console.log('💡 Пример: updateProgress(25)');
