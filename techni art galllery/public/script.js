// Wait for the DOM content to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function () {
    // Select all artwork elements and add a click event listener to each
    const artworks = document.querySelectorAll(".artwork");
    artworks.forEach((artwork) => {
      artwork.addEventListener("click", function () {
        // When an artwork is clicked, get the full-size image path from the data-image attribute and open the lightbox
        const imageSrc = this.querySelector("img").getAttribute("data-image");
        openLightbox(imageSrc);
      });
    });
  });
  
  // Function to open the lightbox with the full-size image
  function openLightbox(imageSrc) {
    // Create a lightbox container and set its class
    const lightboxContainer = document.createElement("div");
    lightboxContainer.classList.add("lightbox-container");
  
    // Create an image element and set its source and alternative text
    const lightboxImage = document.createElement("img");
    lightboxImage.src = imageSrc;
    lightboxImage.alt = "Full-size Artwork";
    lightboxContainer.appendChild(lightboxImage);
  
    // Create a close button for the lightbox
    const closeButton = document.createElement("span");
    closeButton.classList.add("lightbox-close");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", function () {
      // When the close button is clicked, close the lightbox
      closeLightbox();
    });
    lightboxContainer.appendChild(closeButton);
  
    // Add the lightbox container to the body and prevent scrolling while the lightbox is open
    document.body.appendChild(lightboxContainer);
    document.body.style.overflow = "hidden";
  }
  
  // Function to close the lightbox
  function closeLightbox() {
    // Find the lightbox container and remove it from the DOM
    const lightboxContainer = document.querySelector(".lightbox-container");
    lightboxContainer.remove();
  
    // Restore the ability to scroll when the lightbox is closed
    document.body.style.overflow = "auto";
  }
  

// Function to fetch artworks from the backend and create the gallery
async function loadArtworks() {
    try {
      const response = await fetch("/api/artworks");
      const artworks = await response.json();
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = ""; // Clear existing content
  
      artworks.forEach((artwork) => {
        const artworkElement = document.createElement("div");
        artworkElement.classList.add("artwork");
        artworkElement.innerHTML = `
          <img src="${artwork.thumbnail}" alt="${artwork.title}">
          <h4>${artwork.title}</h4>
          <p>Category: ${artwork.category}</p>
        `;
        gallery.appendChild(artworkElement);
      });
    } catch (error) {
      console.error("Error fetching artworks:", error);
    }
  }
  
  // Function to handle file upload on the frontend
  async function handleFileUpload(event) {
    const fileInput = event.target;
    const file = fileInput.files[0];
  
    if (!file) {
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData,
      });
  
      // After successful upload, reload the artworks gallery
      loadArtworks();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  }
  
// Call the loadArtworks function when the page loads
document.addEventListener("DOMContentLoaded", loadArtworks);
  
// Listen for file upload changes
const fileUploadInput = document.getElementById("file-upload");
fileUploadInput.addEventListener("change", handleFileUpload);
  