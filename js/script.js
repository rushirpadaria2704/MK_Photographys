$(document).ready(function () {
  const root = $('html, body');
  const sections = $('section[id], header[id]');
  const navLinks = $('.nav-link');

  $(window).on('scroll', function () {
    const scrollTop = $(this).scrollTop();

    if (scrollTop > 40) {
      $('.main-navbar').addClass('scrolled');
      $('.back-to-top').addClass('visible');
    } else {
      $('.main-navbar').removeClass('scrolled');
      $('.back-to-top').removeClass('visible');
    }

    sections.each(function () {
      const top = $(this).offset().top - 100;
      const bottom = top + $(this).outerHeight();
      if (scrollTop >= top && scrollTop <= bottom) {
        const id = $(this).attr('id');
        navLinks.removeClass('active');
        $(`.nav-link[href="#${id}"]`).addClass('active');
      }
    });
  });

  $('.back-to-top').on('click', function () {
    root.animate({ scrollTop: 0 }, 700);
  });

  $('a[href^="#"]').on('click', function (event) {
    const targetId = $(this).attr('href');
    if (targetId.length > 1 && $(targetId).length) {
      event.preventDefault();
      const top = $(targetId).offset().top - 70;
      root.animate({ scrollTop: top }, 700);
    }
  });

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  $('.filter-btn').on('click', function () {
    const filter = $(this).data('filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    $('.portfolio-item').each(function () {
      const category = $(this).data('category');
      const matched = filter === 'all' || category.toString().split(' ').includes(filter);
      $(this).toggle(matched);
      $(this).toggleClass('hidden', !matched);
    });
  });

  const portfolioItems = $('.portfolio-item');
  const modalEl = document.getElementById('portfolioModal');
  const modalImage = $('#modalImage');
  const modalTitle = $('#modalTitle');
  let currentIndex = 0;

  function openPortfolioImage(index) {
    const visibleItems = portfolioItems.filter(':visible');
    if (!visibleItems.length) return;

    currentIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const imagePath = $(item).data('full');
    const title = $(item).data('title');

    modalImage.attr('src', imagePath);
    modalTitle.text(title);
    if (modalEl && typeof bootstrap !== 'undefined') {
      const bsModal = bootstrap.Modal.getOrCreateInstance(modalEl);
      bsModal.show();
    }
  }

  portfolioItems.on('click', function () {
    const visibleItems = portfolioItems.filter(':visible');
    currentIndex = visibleItems.index(this);
    openPortfolioImage(currentIndex);
  });

  $('#prevImage').on('click', function () {
    const visibleItems = portfolioItems.filter(':visible');
    if (!visibleItems.length) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    modalImage.attr('src', $(item).data('full'));
    modalTitle.text($(item).data('title'));
  });

  $('#nextImage').on('click', function () {
    const visibleItems = portfolioItems.filter(':visible');
    if (!visibleItems.length) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    const item = visibleItems[currentIndex];
    modalImage.attr('src', $(item).data('full'));
    modalTitle.text($(item).data('title'));
  });

  $('#portfolioModal').on('hidden.bs.modal', function () {
    modalImage.attr('src', '');
  });

  $('.play-button').on('click', function () {
    const video = $(this).siblings('video')[0];
    if (!video) return;

    if (video.paused) {
      video.play();
      $(this).hide();
    } else {
      video.pause();
      $(this).show();
    }
  });

  $('video').on('play', function () {
    $('.play-button').hide();
  });

  $('video').on('pause ended', function () {
    $('.play-button').show();
  });

  const enquiryForm = $('#enquiryForm');
  // Target recipient mobile number (country code + phone number without spaces or symbols)
  let RECIPIENT_MOBILE_NUMBER = '+447930940934';

  enquiryForm.on('submit', function (event) {
    event.preventDefault();

    let valid = true;
    $(this).find('input, select, textarea').each(function () {
      const field = $(this);
      const value = $.trim(field.val());
      const isRequired = field.prop('required');
      if (isRequired && !value) {
        field.css('border-color', '#e25d5d');
        valid = false;
      } else {
        field.css('border-color', 'rgba(255,255,255,0.18)');
      }

      if (field.attr('type') === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          field.css('border-color', '#e25d5d');
          valid = false;
        }
      }
    });

    if (valid) {
      const name = $('#name').val().trim();
      const email = $('#email').val().trim();
      const phone = $('#phone').val().trim();
      const date = $('#date').val().trim();
      const venue = $('#venue').val().trim() || 'N/A';
      const location = $('#location').val().trim();
      const service = $('#service').val();
      const guests = $('#guests').val().trim();
      const message = $('#message').val().trim();

      const formattedMessage = `*New Wedding Enquiry - MK Photography*\n\n` +
        `👤 *Full Name:* ${name}\n` +
        `📧 *Email:* ${email}\n` +
        `📞 *Client Phone:* ${phone}\n` +
        `📅 *Wedding Date:* ${date}\n` +
        `🏰 *Venue:* ${venue}\n` +
        `📍 *Location:* ${location}\n` +
        `📸 *Service Required:* ${service}\n` +
        `👥 *Guest Count:* ${guests}\n` +
        `💬 *Message:* ${message}`;

      const cleanPhone = RECIPIENT_MOBILE_NUMBER.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedMessage)}`;

      // Open WhatsApp app/web with pre-filled message
      window.open(whatsappUrl, '_blank');

      alert('Thank you! Redirecting to WhatsApp to send your enquiry details...');
      enquiryForm[0].reset();
    }
  });

  $('.navbar-toggler').on('click', function () {
    const expanded = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', String(!expanded));
  });

  $('.nav-link').on('click', function () {
    if ($(window).width() < 992) {
      const navCollapse = document.getElementById('mainNav');
      if (navCollapse && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    }
  });
});
