const fs = require('fs');

try {
    let content = fs.readFileSync('index.html', 'utf8');

    // Remove the trailing incomplete "<" if it exists
    if (content.endsWith('<')) {
        content = content.slice(0, -1);
    }
    // Or if it ends with newline then <
    if (content.trim().endsWith('<')) {
        content = content.trim().slice(0, -1);
    }

    // Append the missing scripts and closing tags
    const missingContent = `
            <!-- Service Worker Registration for PWA -->
            <script>
                if ('serviceWorker' in navigator) {
                    window.addEventListener('load', () => {
                        navigator.serviceWorker.register('./sw.js')
                            .then(registration => {
                                console.log('Service Worker qeydiyyatı uğurlu:', registration.scope);
                            })
                            .catch(error => {
                                console.log('Service Worker qeydiyyatı uğursuz:', error);
                            });
                    });
                }
            </script>
            <script src="script.js"></script>
</body>
</html>`;

    content += missingContent;

    // Fix the few remaining replacement chars in the footer/modal areas
    // Line 1193: close button
    content = content.replace(/onclick="hideEdiBubble\(\)"><\/button>/g, 'onclick="hideEdiBubble()">×</button>');
    // Line 1200: Edi avatar
    content = content.replace(/class="edi-avatar"><\/div>/g, 'class="edi-avatar">🦊</div>');
    // Line 1204: close button
    content = content.replace(/onclick="closeEdiPopup\(\)"><\/button>/g, 'onclick="closeEdiPopup()">×</button>');

    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Successfully appended missing scripts and fixed footer icons.');

} catch (err) {
    console.error('Error fixing html end:', err);
}
