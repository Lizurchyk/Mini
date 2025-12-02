// Инициализация Telegram Web App
const tg = window.Telegram.WebApp;

// Элементы DOM
const loadingElement = document.getElementById('loading');
const userInfoElement = document.getElementById('userInfo');
const errorElement = document.getElementById('error');

// Основная функция загрузки информации о пользователе
function loadUserInfo() {
    try {
        // Скрываем ошибку, показываем загрузку
        errorElement.style.display = 'none';
        loadingElement.style.display = 'block';
        userInfoElement.style.display = 'none';
        
        // Раскрываем Web App на весь экран
        tg.expand();
        
        // Получаем данные пользователя
        const user = tg.initDataUnsafe?.user;
        
        if (!user) {
            throw new Error('Данные пользователя не найдены');
        }
        
        console.log('Все данные WebApp:', tg);
        console.log('Данные пользователя:', user);
        
        // Основная информация
        displayBasicInfo(user);
        
        // Подробная информация
        displayDetailedInfo(user);
        
        // JSON данные
        displayJsonData(user);
        
        // Показываем успешную загрузку
        setTimeout(() => {
            loadingElement.style.display = 'none';
            userInfoElement.style.display = 'block';
            loadingElement.innerHTML = '✅ Данные успешно загружены!';
        }, 500);
        
    } catch (error) {
        console.error('Ошибка:', error);
        showError();
    }
}

// Отображение основной информации
function displayBasicInfo(user) {
    // Аватар
    const avatarUrl = user.photo_url || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
    document.getElementById('userAvatar').src = avatarUrl;
    
    // Имя пользователя
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    document.getElementById('userName').textContent = fullName || 'Имя не указано';
    
    // Username
    const username = user.username ? `@${user.username}` : 'Не указан';
    document.getElementById('userId').textContent = username;
}

// Отображение подробной информации
function displayDetailedInfo(user) {
    // ID
    document.getElementById('infoId').textContent = user.id || 'Не указан';
    
    // Username
    document.getElementById('infoUsername').textContent = 
        user.username ? `@${user.username}` : 'Не указан';
    
    // Имя
    document.getElementById('infoFirstName').textContent = 
        user.first_name || 'Не указано';
    
    // Фамилия
    document.getElementById('infoLastName').textContent = 
        user.last_name || 'Не указана';
    
    // Язык
    document.getElementById('infoLanguage').textContent = 
        user.language_code || 'Не указан';
    
    // Платформа
    document.getElementById('infoPlatform').textContent = 
        tg.platform || 'Неизвестно';
    
    // Версия WebApp
    document.getElementById('infoVersion').textContent = 
        tg.version || 'Неизвестно';
    
    // Тема
    const theme = tg.colorScheme === 'dark' ? 'Темная' : 'Светлая';
    document.getElementById('infoTheme').textContent = theme;
}

// Отображение данных в формате JSON
function displayJsonData(user) {
    const allData = {
        user: user,
        webApp: {
            platform: tg.platform,
            version: tg.version,
            colorScheme: tg.colorScheme,
            themeParams: tg.themeParams,
            initData: tg.initData,
            initDataUnsafe: tg.initDataUnsafe
        },
        timestamp: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(allData, null, 2);
    
    // Форматируем JSON с подсветкой синтаксиса
    const formattedJson = syntaxHighlight(jsonString);
    document.getElementById('jsonOutput').innerHTML = formattedJson;
}

// Подсветка синтаксиса JSON
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, 
    function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// Копирование JSON в буфер обмена
function copyToClipboard() {
    const jsonText = JSON.stringify({
        user: tg.initDataUnsafe?.user,
        webApp: {
            platform: tg.platform,
            version: tg.version,
            colorScheme: tg.colorScheme
        }
    }, null, 2);
    
    navigator.clipboard.writeText(jsonText)
        .then(() => {
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = '✅ Скопировано!';
            btn.style.background = '#48bb78';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '#667eea';
            }, 2000);
        })
        .catch(err => {
            console.error('Ошибка копирования:', err);
            alert('Не удалось скопировать');
        });
}

// Показать ошибку
function showError() {
    loadingElement.style.display = 'none';
    userInfoElement.style.display = 'none';
    errorElement.style.display = 'block';
}

// Показать дополнительную информацию о Web App
function showWebAppInfo() {
    const info = `
        🌐 Платформа: ${tg.platform}
        📱 Версия: ${tg.version}
        🎨 Тема: ${tg.colorScheme}
        📏 Высота: ${tg.viewportHeight}px
        📐 Стабильная высота: ${tg.viewportStableHeight}px
        🔗 Init Data: ${tg.initData ? 'Да' : 'Нет'}
        👤 Пользователь: ${tg.initDataUnsafe?.user ? 'Да' : 'Нет'}
    `;
    console.log('Информация о Web App:', info);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Telegram WebApp объект:', tg);
    
    // Проверяем, запущено ли в Telegram
    if (window.Telegram && window.Telegram.WebApp) {
        loadUserInfo();
        showWebAppInfo();
        
        // Слушаем изменения темы
        tg.onEvent('themeChanged', loadUserInfo);
        
        // Слушаем изменения размера
        tg.onEvent('viewportChanged', function() {
            console.log('Viewport изменился:', {
                height: tg.viewportHeight,
                stableHeight: tg.viewportStableHeight
            });
        });
    } else {
        // Если запущено не в Telegram, показываем демо-данные
        console.log('Запущено вне Telegram. Показываем демо-данные.');
        
        const demoUser = {
            id: 123456789,
            first_name: 'Демо',
            last_name: 'Пользователь',
            username: 'demo_user',
            language_code: 'ru',
            is_premium: true,
            photo_url: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
        };
        
        // Заменяем tg.initDataUnsafe для демо
        window.Telegram = {
            WebApp: {
                initDataUnsafe: { user: demoUser },
                platform: 'web',
                version: '7.0',
                colorScheme: 'light',
                expand: function() {},
                onEvent: function() {}
            }
        };
        
        loadUserInfo();
    }
});

// Экспортируем функции для глобального использования
window.copyToClipboard = copyToClipboard;
window.loadUserInfo = loadUserInfo;
