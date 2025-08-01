const inputImage = document.querySelector("#add-file"); // Constante del archivo que se ingrese
const imagesContainer = document.querySelector(".files-container"); // Contenedor de las imagenes que se ingresen
const refreshButton = document.querySelector("#reload"); // Se obtiene el boton de reinicio

// Funcion para crear el elemento imagen con el src de los archivos ingresado
const createImageElement = (src) => {
    const imgElement = document.createElement("img");
    imgElement.draggable = true; // Se indica que la imagen si es draggable
    imgElement.src = src; // Se incorpora la fuente de la imagen
    imgElement.className = "image-item";

    // Evento para indicar que la imagen inicio a ser dragged
    imgElement.addEventListener("dragstart", handleDragStart);

    // Evento para indicar que la imagen termino de ser dragger
    imgElement.addEventListener("dragend", handleDragEnd);

    return imgElement;
};

// Funcion para tomar los archivos que llegan y convertilos en elementos imagenes
const fromFilesCreateElements = (files) => {
    Array.from(files).forEach((file) => {
            const reader = new FileReader();

            // Cuando el documento se cargue, creo un elemento img que va a contener la imagen ingresada.
            reader.onload = (eventReader) => {
                const imgElement = createImageElement(eventReader.target.result); // Se crea el elemento con el metodo establecido
                // Se incorpora la imagen al contenedor de las imagenes
                imagesContainer.appendChild(imgElement);
            };

            reader.readAsDataURL(file);
        });
}

// Evento para cuando se suban documentos, estos se guarden en la constante files
inputImage.addEventListener("change", (event) => {
    const { files } = event.target;

    // Si tengo un documento con el FileReader() leo el documento file con readAsDataURL(image)
    if (files && files.length > 0) {
        fromFilesCreateElements(files)  // Con los archivos que tengo, creo los elementos de imagen
    }
});

// Constantes para saber si el elemento esta dragged y su contenedor padre
let draggedElement = null;
let sourceContainer = null;

// Funcion cuando comienza el drag para actualizar el estado de dragged y sourceContainer
function handleDragStart(event) {
    draggedElement = event.target;
    sourceContainer = draggedElement.parentNode;
}

// Funcion para cuando termina el drag para actualizar los estados de dragged y sourceContainer a null
function handleDragEnd(event) {
    event.preventDefault();
    draggedElement = null;
    sourceContainer = null;
}

// Se obtienen todos los elementos donde se colocaran las imagenes
const rows = document.querySelectorAll(".tier-list-item");

// Para cada uno de los elementos, se incluyen los eventos drop, dragover y dragleave
rows.forEach((row) => {
    row.addEventListener("drop", handleDrop); // Evento que indica que elemento fue drop en un target
    row.addEventListener("dragover", handleDragOver); // Evento que indica que elemento esta siendo target
    row.addEventListener("dragleave", handleDragLeave); // Evento que indica que elemento dejo de ser target
});

// Se asigna los mismos eventos al contenedor de las imagenes para lograr retornarlo
imagesContainer.addEventListener("drop", handleDrop); // Evento que indica que elemento fue drop en un target
imagesContainer.addEventListener("dragover", handleDragOver); // Evento que indica que elemento esta siendo target
imagesContainer.addEventListener("dragleave", handleDragLeave); // Evento que indica que elemento dejo de ser target
imagesContainer.addEventListener("drop", handleDropFromDesktop)

// Funcion para manejar el Drop de las imagenes
function handleDrop(event) {
    event.preventDefault();

    // Se obtiene el currentTarget y la dataTransfer del evento
    const { currentTarget, dataTransfer } = event;

    // Si hay contenedor y elemento dragged, removemos el elemento de su contenedor principal
    if (sourceContainer && draggedElement) {
        sourceContainer.removeChild(draggedElement);
    }

    // Si hay elemento dragged, creamos un elemento imagen con la dataTransfer y la colocamos en el contenedor Target
    if (draggedElement) {
        const src = dataTransfer.getData("text/plain");
        const imgElement = createImageElement(src);
        currentTarget.appendChild(imgElement);
    }

    // Removemos la clase drag-over sobre el contenedor target, ya que el elemento hizo drop sobre este
    currentTarget.classList.remove("drag-over");

    // Removemos la previsualizacion del elemento si es que contiene.
    currentTarget.querySelector(".preview-element")?.remove();
}

// Funcion para manejar las imagenes que estan Over
function handleDragOver(event) {
    event.preventDefault();

    // Se obtiene el contenedor target sobre el que se encuentra la imagen
    const { currentTarget, dataTransfer } = event;

    // Si el contenedor target es igual al contenedor fuente, retorna
    if (sourceContainer === currentTarget) return;

    // Se asigna una clase drag-over para hacer efecto de que esta sobre ese elemento
    currentTarget.classList.add("drag-over");

    // Se selecciona elemento de previsualizacion para comprobar que no este dentro del contenedor target
    const dragPreview = document.querySelector(".preview-element");

    // Si tenemos un elemento dragged y la previsualizacion no esta en el contenedor creamos un elemento preview y lo agregamos al contenedor target
    if (draggedElement && !dragPreview) {
        const previewElement = draggedElement.cloneNode(true);
        previewElement.classList.add("preview-element");
        currentTarget.appendChild(previewElement);
    }
}

// Funcion para manejar las imagenes que dejaron el contenedor target
function handleDragLeave(event) {
    event.preventDefault();

    // Se obtiene el contenedor target sobre el que se encuentraba la imagen
    const { currentTarget } = event;

    // Se remueve del contenedo en el que estaba la imagen la clase drag-over
    currentTarget.classList.remove("drag-over");

    // Se elimina el elemento preview del contenedor en el que estaba la imagen
    currentTarget.querySelector(".preview-element")?.remove();
}

function handleDropFromDesktop (event) {
    event.preventDefault()

    const { currentTarget, dataTransfer } = event;

    const images = currentTarget.querySelectorAll('.image-item');
    const src = dataTransfer.getData("text/plain")
    let foundImage = false;

    // Debido a que el handleDrop ya crea un elemento imagen, se verifica si la imagen no esta en el contenedor
    images.forEach(image => {
        if (image.src === src) {
            foundImage = true;
        }
    })

    // Si el contenedor target es igual al contenedor fuente, retorna
    if (sourceContainer === currentTarget) return;

    // Crea elementos a partir de los archivos y verifica que la imagen no este ya en el contenedor
    if(dataTransfer.types.includes('Files') && !foundImage) {
        const { files } = dataTransfer;
        fromFilesCreateElements(files)
    }
}

// Boton para reiniciar el tierList
refreshButton.addEventListener("click", handleRefresh);


// Funcion que regresa las imagenes del tierList al contenedor de imagenes
function handleRefresh() {
    const images = document.querySelectorAll(".tier-list-item .image-item");

    images.forEach((image) => {
        image.remove();
        imagesContainer.appendChild(image);
    });
}