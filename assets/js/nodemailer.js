document.addEventListener('DOMContentLoaded', function() {
    const submitButton = document.querySelector('input[type="submit"]');
    let isSubmitting = false; // Flag para controlar el estado del envío

    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el envío por defecto del formulario

        if (isSubmitting) return; // Si ya se está enviando, no hacer nada

        const nombre = this.querySelector('input[name="Nombre"]').value.trim();
        const email = this.querySelector('input[name="mail"]').value.trim();
        const mensaje = this.querySelector('textarea[name="Mensaje"]').value.trim();

        document.getElementById('nombre-error').textContent = '';
        document.getElementById('email-error').textContent = '';
        document.getElementById('mensaje-error').textContent = '';

        let formValid = true;

        // Validaciones personalizadas
        if (!nombre) {
            document.getElementById('nombre-error').textContent = 'Por favor, ingrese su nombre.';
            formValid = false;
        }
        if (!email) {
            document.getElementById('email-error').textContent = 'Por favor, ingrese su correo electrónico.';
            formValid = false;
        }
        if (!mensaje) {
            document.getElementById('mensaje-error').textContent = 'Por favor, ingrese su mensaje.';
            formValid = false;
        }




        // Validar reCAPTCHA
        const recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse === "") {
            Swal.fire({
                title: 'Error!',
                text: 'Por favor, complete el reCAPTCHA.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            // Si el reCAPTCHA no está completado
            formValid = false;
        }


        if (!formValid) {
            return; // Si no pasa la validación, no envía el formulario
        }

        const statusMessage = document.getElementById('status-message');

        isSubmitting = true; // Marca que se está enviando
        submitButton.disabled = true; // Deshabilita el botón
        statusMessage.textContent = 'Enviando...'; // Muestra el mensaje de "Enviando"

        const formData = new FormData(this);

        fetch('https://nodemailer-tan.vercel.app/send-email', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.text())
        .then(data => {
            // Utiliza SweetAlert2 para mostrar una alerta de éxito
            Swal.fire({
                title: 'Success!',
                text: data,
                icon: 'success',
                confirmButtonText: 'OK'
            });

            setTimeout(() => {
                submitButton.disabled = false; // Habilita el botón
                statusMessage.textContent = ''; // Limpia el mensaje de estado
                isSubmitting = false; // Restablece el estado de envío
            }, 3000); // 3000 ms = 3 segundos

        })
        .catch(error => {
            console.error('Error:', error);
            // Utiliza SweetAlert2 para mostrar una alerta de error
            Swal.fire({
                title: 'Error!',
                text: 'There was a problem sending the email.',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            submitButton.disabled = false; // Vuelve a habilitar el botón si hay un error
            statusMessage.textContent = 'Hubo un problema al enviar el mensaje. Inténtalo de nuevo.'; // Muestra mensaje de error
            isSubmitting = false; // Restablece el estado de envío
        });
    });
});
