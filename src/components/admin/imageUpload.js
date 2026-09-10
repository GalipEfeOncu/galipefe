export const MAX_DATA_URL_BYTES = 700 * 1024;

export function getDataUrlBytes(value = '') {
    return new TextEncoder().encode(value).length;
}

export function validateImageValue(value) {
    if (!value.startsWith('data:')) return null;
    return getDataUrlBytes(value) > MAX_DATA_URL_BYTES
        ? 'Görsel Firestore için çok büyük. Daha küçük bir dosya seçin.'
        : null;
}

export async function prepareCover(file) {
    if (!file.type.startsWith('image/')) throw new Error('Yalnızca görsel dosyaları yüklenebilir.');
    const sourceUrl = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Görsel dosyası okunamadı.'));
        reader.readAsDataURL(file);
    });
    const image = await new Promise((resolve, reject) => {
        const nextImage = new Image();
        nextImage.onload = () => resolve(nextImage);
        nextImage.onerror = () => reject(new Error('Görsel işlenemedi.'));
        nextImage.src = sourceUrl;
    });
    const ratio = 16 / 9;
    let sourceWidth = image.width;
    let sourceHeight = image.height;
    let sourceX = 0;
    let sourceY = 0;
    if (sourceWidth / sourceHeight > ratio) { sourceWidth = sourceHeight * ratio; sourceX = (image.width - sourceWidth) / 2; }
    else if (sourceWidth / sourceHeight < ratio) { sourceHeight = sourceWidth / ratio; sourceY = (image.height - sourceHeight) / 2; }
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(1200, Math.round(sourceWidth));
    canvas.height = Math.round(canvas.width / ratio);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Görsel işleme başlatılamadı.');
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.82, 0.72, 0.62, 0.52, 0.45]) {
        const dataUrl = canvas.toDataURL('image/webp', quality);
        if (getDataUrlBytes(dataUrl) <= MAX_DATA_URL_BYTES) return dataUrl;
    }
    throw new Error('Görsel sıkıştırılsa da 700 KB sınırına sığmadı. Daha küçük bir dosya seçin.');
}
