document.getElementById('downloadCV').addEventListener('click', function(event) {
    event.preventDefault(); // Evita la acción por defecto del enlace
    
    const link = document.createElement('a'); // Crea un elemento de enlace
    link.href = 'assets/curriculum_vitae.pdf'; // Ruta al archivo PDF
    link.download = 'curriculum_vitae.pdf'; // Nombre con el que se descargará el archivo
    document.body.appendChild(link); // Añade el enlace al DOM
    link.click(); // Simula un clic en el enlace
    document.body.removeChild(link); // Elimina el enlace del DOM
  });
  