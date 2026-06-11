document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. Mobile Menu Toggle
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = document.querySelectorAll('.nav-links a:not(.nav-cta-btn)');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('open');
      
      // Accessibility toggle
      const isOpen = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking on any link
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // ==========================================
  // 2. Scroll Highlight Navigation Link
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-links a:not(.nav-cta-btn)');

  window.addEventListener('scroll', () => {
    let currentSectionId = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 150)) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${currentSectionId}`) {
        item.classList.add('active');
      }
    });
  });

  // ==========================================
  // 3. WhatsApp Booking Planner Logic
  // ==========================================
  const bookingForm = document.getElementById('whatsapp-planner-form');
  const WHATSAPP_PHONE_NUMBER = '12696153566'; // Auggie's WhatsApp number in international format

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Retrieve form values
      const name = document.getElementById('p-name').value.trim();
      const phone = document.getElementById('p-phone').value.trim();
      const pickup = document.getElementById('pickup-addr').value.trim();
      const dropoff = document.getElementById('dropoff-addr').value.trim();
      const date = document.getElementById('ride-date').value;
      const time = document.getElementById('ride-time').value;
      
      // Get selected transport type
      const transTypeRadio = document.querySelector('input[name="trans-type"]:checked');
      const transType = transTypeRadio ? transTypeRadio.value : 'Ambulatory / Sedan';
      
      const notes = document.getElementById('special-notes').value.trim();

      // Format date nicely (YYYY-MM-DD to Month Day, YYYY)
      let formattedDate = date;
      try {
        const dateObj = new Date(date + 'T00:00:00');
        formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (err) {
        console.error('Date parsing failed:', err);
      }

      // Format time nicely (24h to 12h)
      let formattedTime = time;
      try {
        const [hours, minutes] = time.split(':');
        const h = parseInt(hours, 10);
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHours = h % 12 || 12;
        formattedTime = `${displayHours}:${minutes} ${ampm}`;
      } catch (err) {
        console.error('Time formatting failed:', err);
      }

      // Construct WhatsApp message template
      const headerMsg = "Hello, I'd like to schedule a transport.\n\n";
      const detailsMsg = 
        `📋 *RIDE REQUEST DETAILS*\n` +
        `👤 *Passenger:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `📍 *Pickup:* ${pickup}\n` +
        `🏁 *Destination:* ${dropoff}\n` +
        `📅 *Date:* ${formattedDate}\n` +
        `⏰ *Time:* ${formattedTime}\n` +
        `🚐 *Type:* ${transType}\n` +
        (notes ? `📝 *Notes:* ${notes}` : '');

      const fullMessage = headerMsg + detailsMsg;

      // Encode URL parameters
      const encodedMsg = encodeURIComponent(fullMessage);
      const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodedMsg}`;

      // Open WhatsApp tab
      window.open(whatsappUrl, '_blank');
    });
  }

  // ==========================================
  // 4. Fleet Gallery Lightbox Modal
  // ==========================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');
  
  let currentImgIndex = 0;
  const galleryData = [];

  // Map gallery items and extract data
  galleryItems.forEach((item, index) => {
    const imgUrl = item.getAttribute('data-image');
    const caption = item.getAttribute('data-caption');
    const title = item.querySelector('h4').textContent;
    
    galleryData.push({
      imgUrl,
      caption: `<strong>${title}</strong><br>${caption}`,
      index
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentImgIndex = index;
    updateLightboxContent();
    lightbox.classList.add('show');
    document.body.style.overflow = 'hidden'; // Stop page scroll
  }

  function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = ''; // Re-enable page scroll
  }

  function updateLightboxContent() {
    const activeItem = galleryData[currentImgIndex];
    if (activeItem && lightboxImg && lightboxCaption) {
      lightboxImg.src = activeItem.imgUrl;
      lightboxCaption.innerHTML = activeItem.caption;
    }
  }

  function showNextImage() {
    currentImgIndex = (currentImgIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    currentImgIndex = (currentImgIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  if (lightbox) {
    // Close button click
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Prev & Next clicks
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop close event from firing
        showPrevImage();
      });
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation(); // Stop close event from firing
        showNextImage();
      });
    }

    // Click outside image closes lightbox
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard support (escape, arrows)
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('show')) {
        if (e.key === 'Escape') {
          closeLightbox();
        } else if (e.key === 'ArrowRight') {
          showNextImage();
        } else if (e.key === 'ArrowLeft') {
          showPrevImage();
        }
      }
    });
  }

  // ==========================================
  // 5. Floating WhatsApp Widget
  // ==========================================

});
