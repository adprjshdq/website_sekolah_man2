document.addEventListener('DOMContentLoaded', () => {
  initMobileDrawer();
  initHeaderScroll();
  initHeroCarousel();
  initNumberCounters();
  initGalleryFilter();
  initLightbox();
  initFaqAccordion();
  initFormValidation();
  highlightActiveMenu();
});


/* 1. Mobile Drawer Navigation */

function initMobileDrawer() {
  const toggleBtn = document.querySelector('.adipraja_mobile_toggle');
  const drawer = document.getElementById('adipraja_mobile_drawer');
  const overlay = document.getElementById('adipraja_drawer_overlay');
  const closeBtn = document.getElementById('adipraja_drawer_close');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('adipraja_open');
    overlay.classList.add('adipraja_open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('adipraja_open');
    overlay.classList.remove('adipraja_open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
}


/* 2. Header Sticky Shadow saat Di-Scroll */

function initHeaderScroll() {
  const header = document.querySelector('.adipraja_header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('adipraja_scrolled');
    } else {
      header.classList.remove('adipraja_scrolled');
    }
  });
}


/* 3. Hero Carousel / Image Slider */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.adipraja_hero_slide');
  const dots = document.querySelectorAll('.adipraja_dot');
  const prevBtn = document.querySelector('.adipraja_carousel_prev');
  const nextBtn = document.querySelector('.adipraja_carousel_next');

  if (slides.length === 0) return;

  // Banner statis (hanya 1 slide): sembunyikan tombol panah & dot yang tidak berfungsi
  if (slides.length === 1) {
    if (prevBtn) prevBtn.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';
    dots.forEach(dot => { dot.style.display = 'none'; });
    return;
  }

  let currentIndex = 0;
  let slideInterval;

  function goToSlide(index) {
    slides[currentIndex].classList.remove('adipraja_active');
    if (dots.length > currentIndex) dots[currentIndex].classList.remove('adipraja_active');

    currentIndex = (index + slides.length) % slides.length;

    slides[currentIndex].classList.add('adipraja_active');
    if (dots.length > currentIndex) dots[currentIndex].classList.add('adipraja_active');
  }

  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, 5000);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      goToSlide(idx);
      startAutoPlay();
    });
  });

  const heroSection = document.querySelector('.adipraja_hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}


/* 4. Running Counter Numbers (Intersection Observer) */
function initNumberCounters() {
  const statNumbers = document.querySelectorAll('.adipraja_stat_number[data-target]');
  if (statNumbers.length === 0) return;

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';

        animateCounter(el, target, prefix, suffix);
        observerInstance.unobserve(el);
      }
    });
  }, observerOptions);

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element, target, prefix, suffix) {
  let current = 0;
  const duration = 1500;
  const stepTime = 20;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = `${prefix}${target}${suffix}`;
      clearInterval(timer);
    } else {
      element.textContent = `${prefix}${Math.floor(current)}${suffix}`;
    }
  }, stepTime);
}


/* 5. Gallery Category Filter */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.adipraja_filter_btn');
  const items = document.querySelectorAll('.adipraja_galeri_item');

  if (filterBtns.length === 0 || items.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('adipraja_active'));
      btn.classList.add('adipraja_active');

      const filterValue = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'adiprajaFadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}


/* 6. Lightbox Modal Preview Foto */
function initLightbox() {
  const lightboxTriggers = document.querySelectorAll('.adipraja_lightbox_trigger');
  const lightbox = document.getElementById('adipraja_lightbox_modal');
  const lightboxImg = document.getElementById('adipraja_lightbox_image');
  const lightboxCaption = document.getElementById('adipraja_lightbox_caption_text');
  const closeBtn = document.getElementById('adipraja_lightbox_close_btn');

  if (!lightbox || !lightboxImg) return;

  lightboxTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const src = trigger.getAttribute('data-img') || trigger.querySelector('img')?.src;
      const caption = trigger.getAttribute('data-caption') || 'Dokumentasi MAN 2 Kota Tasikmalaya';

      if (src) {
        lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = caption;
        lightbox.classList.add('adipraja_show');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('adipraja_show');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('adipraja_show')) {
      closeLightbox();
    }
  });
}

/* 7. Accordion FAQ */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.adipraja_faq_btn');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const content = item.querySelector('.adipraja_faq_content');
      const isActive = item.classList.contains('adipraja_active');

      // Tutup semua yang lain
      document.querySelectorAll('.adipraja_faq_item').forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('adipraja_active');
          const otherContent = otherItem.querySelector('.adipraja_faq_content');
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      // Toggle item saat ini
      if (isActive) {
        item.classList.remove('adipraja_active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('adipraja_active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}


/* 8. Form Validasi & Pengiriman ke Email (Web3Forms) */
const WEB3FORMS_ACCESS_KEY = '59555177-b5fe-40d5-be2f-9d932bed7b5b';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

function adiprajaGetFieldValue(id) {
  const el = document.getElementById(id);
  if (!el) return '';
  if (el.type === 'checkbox') return el.checked ? 'Ya' : 'Tidak';
  if (el.tagName === 'SELECT') {
    const opt = el.options[el.selectedIndex];
    return (opt ? opt.textContent : el.value || '').trim();
  }
  return (el.value || '').trim();
}

function adiprajaSetFormLoading(form, isLoading) {
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  if (isLoading) {
    btn.dataset.adiprajaOriginalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'wait';
    btn.innerHTML = 'MENGIRIM...';
  } else {
    btn.disabled = false;
    btn.style.opacity = '';
    btn.style.cursor = '';
    if (btn.dataset.adiprajaOriginalHtml) {
      btn.innerHTML = btn.dataset.adiprajaOriginalHtml;
    }
  }
}

async function adiprajaSendToEmail(payload) {
  if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY.indexOf('GANTI') === 0) {
    throw new Error('ACCESS_KEY_BELUM_DIISI');
  }

  const body = Object.assign({ access_key: WEB3FORMS_ACCESS_KEY }, payload);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    let data = null;
    try { data = await response.json(); } catch (_) { /* respons bukan JSON */ }

    if (!response.ok || !data || data.success !== true) {
      const msg = (data && data.message) || `Gagal mengirim (HTTP ${response.status})`;
      throw new Error(msg);
    }
    return data;
  } finally {
    clearTimeout(timeout);
  }
}

function initFormValidation() {
  const kontakForm = document.getElementById('adipraja_kontak_form');
  const penerimaanForm = document.getElementById('adipraja_penerimaan_form');
  const emailsubscriptionForm = document.getElementById('adipraja_emailsubscription_form');
  const successModal = document.getElementById('adipraja_success_modal');
  const modalCloseBtn = document.getElementById('adipraja_modal_close_btn');
  const modalTitle = document.getElementById('adipraja_modal_title');
  const modalMessage = document.getElementById('adipraja_modal_msg');

  function showSuccess(title, message) {
    if (!successModal) {
      alert(`${title}\n\n${message}`);
      return;
    }
    if (modalTitle) modalTitle.textContent = title;
    if (modalMessage) modalMessage.textContent = message;
    successModal.classList.add('adipraja_show');
  }

  function showSendError(err) {
    console.error('[Form] Pengiriman gagal:', err);
    if (err && err.message === 'ACCESS_KEY_BELUM_DIISI') {
      showSuccess(
        'Formulir Belum Terhubung ke Email',
        'Formulir ini belum diaktifkan oleh pengelola website. Silakan hubungi admin melalui WhatsApp atau telepon yang tertera di halaman Kontak.'
      );
      return;
    }
    if (err && err.name === 'AbortError') {
      showSuccess('Koneksi Terlalu Lama', 'Pengiriman melebihi batas waktu. Periksa koneksi internet Anda lalu coba kirim ulang.');
      return;
    }
    showSuccess(
      'Pesan Gagal Terkirim',
      'Maaf, terjadi kendala saat mengirim pesan. Silakan coba beberapa saat lagi, atau hubungi kami langsung melalui WhatsApp/telepon.'
    );
  }

  if (modalCloseBtn && successModal) {
    modalCloseBtn.addEventListener('click', () => {
      successModal.classList.remove('adipraja_show');
    });
  }

  // Form Kontak -> email admin
  if (kontakForm) {
    kontakForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const botcheck = kontakForm.querySelector('input[name="botcheck"]');
      if (botcheck && botcheck.checked) return; // honeypot: hentikan bot tanpa kirim

      const nama = adiprajaGetFieldValue('adipraja_input_name');
      const email = adiprajaGetFieldValue('adipraja_input_kontak_email');
      const phone = adiprajaGetFieldValue('adipraja_input_phone');
      const topik = adiprajaGetFieldValue('adipraja_input_subject');
      const pesan = adiprajaGetFieldValue('adipraja_input_message');

      adiprajaSetFormLoading(kontakForm, true);
      try {
        await adiprajaSendToEmail({
          subject: `[Website] Pesan Kontak: ${topik || 'Tanpa Topik'}`,
          from_name: 'Formulir Kontak Website MAN 2',
          replyto: email,
          'Nama Lengkap': nama,
          'Alamat Email': email,
          'No. Telepon / WhatsApp': phone,
          'Topik Pesan': topik,
          'Isi Pesan': pesan,
          'Waktu Kirim': new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })
        });

        kontakForm.reset();
        showSuccess(
          'Pesan Berhasil Terkirim!',
          `Terima kasih Bapak/Ibu ${nama}. Pesan Anda sudah masuk ke email admin MAN 2 Kota Tasikmalaya dan akan dibalas dalam 1x24 jam.`
        );
      } catch (err) {
        showSendError(err);
      } finally {
        adiprajaSetFormLoading(kontakForm, false);
      }
    });
  }

  // Form PPDB / Admissions -> email admin
  if (penerimaanForm) {
    penerimaanForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const botcheck = penerimaanForm.querySelector('input[name="botcheck"]');
      if (botcheck && botcheck.checked) return;

      const namaSiswa = adiprajaGetFieldValue('adipraja_input_student_name') || 'Calon Siswa';
      const email = adiprajaGetFieldValue('adipraja_input_email');
      const noReg = 'PPDB-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);

      adiprajaSetFormLoading(penerimaanForm, true);
      try {
        await adiprajaSendToEmail({
          subject: `[PPDB] Pendaftaran Baru: ${namaSiswa} (${noReg})`,
          from_name: 'Formulir PPDB Website MAN 2',
          replyto: email,
          'Nomor Registrasi': noReg,
          'Nama Lengkap Siswa': namaSiswa,
          'NISN': adiprajaGetFieldValue('adipraja_input_nisn'),
          'Tempat & Tanggal Lahir': adiprajaGetFieldValue('adipraja_input_pob'),
          'Jenis Kelamin': adiprajaGetFieldValue('adipraja_input_gender'),
          'Asal Sekolah': adiprajaGetFieldValue('adipraja_input_school_origin'),
          'Pilihan Jenjang & Peminatan': adiprajaGetFieldValue('adipraja_input_program'),
          'Nama Orang Tua / Wali': adiprajaGetFieldValue('adipraja_input_parent_name'),
          'Nomor WhatsApp': adiprajaGetFieldValue('adipraja_input_whatsapp'),
          'Alamat Email': email,
          'Jalur Pendaftaran': adiprajaGetFieldValue('adipraja_input_track'),
          'Alamat Tempat Tinggal': adiprajaGetFieldValue('adipraja_input_address'),
          'Pernyataan Data Benar': adiprajaGetFieldValue('adipraja_confirm_check'),
          'Waktu Kirim': new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })
        });

        penerimaanForm.reset();
        showSuccess(
          'Pendaftaran Berhasil Dikirim!',
          `Data pendaftaran ananda ${namaSiswa} sudah masuk ke email panitia PPDB MAN 2 Kota Tasikmalaya dengan Nomor Registrasi: ${noReg}. Silakan simpan nomor tersebut dan cek WhatsApp atau Email untuk jadwal verifikasi berkas.`
        );
      } catch (err) {
        showSendError(err);
      } finally {
        adiprajaSetFormLoading(penerimaanForm, false);
      }
    });
  }

  /* 9. Highlighting Active Menu Navigasi */
  function highlightActiveMenu() {
    const normalizePath = (value) => {
      if (!value) return '';
      return decodeURIComponent(value)
        .split('#')[0]
        .split('?')[0]
        .replace(/^\.\//, '')
        .split('/')
        .pop();
    };

    const currentPath = normalizePath(window.location.pathname) || 'beranda.html';
    const navLinks = document.querySelectorAll('.adipraja_nav_link, .adipraja_drawer_link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      if (normalizePath(href) === currentPath) {
        link.classList.add('adipraja_active');
      }
    });
  }
}
