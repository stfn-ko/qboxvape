// FORWARD DECLARATIONS
  const root = document.documentElement;

  const ageVerificationCookie = getCookie('ageVerification');

  const header = query('.header');
  const qrImage = query('.qr-code img');
  const qrCodeElement = query('.qr-code');
  const productName = query('.taste-name');
  const buttons = queryAll('.menu .circle'); 
  const buttonMinor = query(`#button-minor`);
  const image = query(".middle-element img");
  const clickOnMeText = query('.click-on-me');
  const button18plus = query(`#button-18plus`);
  const sliderVape = query('.middle-element img');
  const phrases = Array.from(queryAll(".phrase"));
  const tastyLogoNew = query('.tasty-logo-new img');
  const ageVerification = query('.age-verification');
  const productImageNew = query('.product-display-new img');
  const tastyLogoPrevious = query('.tasty-logo-previous img');
  const productImagePrevious = query('.product-display-previous img');
  const randColorElements = queryAll('.faq-block, .contact-box, .emphasize, .share-qbox-contents');
  
  const timeoutAddModal = 500;
  const timeoutRemoveModal = 800;
  
  const usedColors = [];
  const colors = [  
    'BRI',
    'TM',
    'PC',
    'KPFG',
    'DA',
    'PI',
    'SRC',
    'WI',
    'BSR',
    'L99'];

  let prevScrollPos = window.pageYOffset;


// HELPER FUNTIONS
  function query(selector) { return document.querySelector(selector);}
  function queryAll(selector) { return document.querySelectorAll(selector);}
  

// FUNCTIONS
  // cookies
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }
  
  function setCookie(name, value, days) {
    let expirationDate = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expirationDate = `; expires=${date.toUTCString()}`;
    }

    document.cookie = `${name}=${value}${expirationDate}; path=/`;
  }
  

  // navigation
  function selectTarget() {
    const navigateToElements = queryAll('.navigate-to');
    
    navigateToElements.forEach((navigateTo) => {
      const targetClass = navigateTo.dataset.targetClass;
      scrollToTarget(targetClass);
    });
  }
  
  function scrollToTarget(targetClass) {
    const clickableElements = queryAll(`.navigate-to[data-target-class="${targetClass}"]`);
    
    clickableElements.forEach((clickable) => {
      clickable.addEventListener('click', () => {
        const target = query(`.${targetClass}`);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function handleMobileNavigation() {
    let currentScrollPos = window.pageYOffset;
    
    (prevScrollPos > currentScrollPos) ?
    header.classList.remove('header--hidden') :
    header.classList.add('header--hidden');
    
    prevScrollPos = currentScrollPos;
  }


  // share handling
  async function share() {
    const response = await fetch('./manifest.json');
    const qrLogo = 'public/qr/QR_transparent.png';
    const qrDone = 'public/qr/QR_transparent_done.png';
    const data = await response.json();
    const { url, text, title, taskTextInitial, taskTextComplete, taskTextFallbackComplete } = data.share_info;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    try {
      if (isMobile && navigator.share) {
        // Use navigator.share for mobile devices
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } else {
        // Use Clipboard API for desktop devices
        if (navigator.clipboard)
        await navigator.clipboard.writeText(url);
        else 
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      }
      

      qrImage.src = qrDone;
      clickOnMeText.textContent = taskTextComplete;

      
    } catch (error) {
      console.log('Error:', error);
      clickOnMeText.textContent = taskTextFallbackComplete;
      if (isMobile) window.location.href = `sms:&body=${encodeURIComponent(url)}`;
    }
    
    // Reset the button text after a delay
    setTimeout(() => {
      clickOnMeText.textContent = taskTextInitial;
      qrImage.src = qrLogo;
    }, 1500);
  }


  // age verification
  if (ageVerificationCookie === 'true') ageVerification.remove(); 
  else setTimeout(() => { 
    ageVerification.classList.remove('hide');
  }, timeoutAddModal);
  

  function handle18plusButton() {
    ageVerification.classList.add('hide');
    setCookie('ageVerification', 'true', 1);
    setTimeout(() => {
      ageVerification.remove();
    }, timeoutRemoveModal);
  }

  function handleMinorButton() {
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  }

  
  // selector menu
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      // Remove the 'selected' class from all buttons in the menu
      buttons.forEach((button) => {
        button.disabled = true;
        button.classList.remove('selected');
      });
      
      // Add the 'selected' class to the clicked button
      event.target.classList.add('selected');
      
      productName.style.opacity = 0;
      
      productImagePrevious.style.opacity = 0;
      productImageNew.src = `./public/product/${event.target.id}.png`;

      tastyLogoPrevious.style.opacity = 0;
      tastyLogoNew.src = `./public/tasty_logos/${event.target.id}_logo.png`;
      
      setTimeout(() => {
        productName.textContent = event.target.title;
        productName.style.opacity = 1;
        
        productImagePrevious.style.opacity = 1;
        productImagePrevious.src = `./public/product/${event.target.id}.png`;
        
        tastyLogoPrevious.style.opacity = 1;
        tastyLogoPrevious.src = `./public/tasty_logos/${event.target.id}_logo.png`;
        
        buttons.forEach((button) => {
          button.disabled = false;
        });
      }, 300);
    });
  });


  //slider phrases' opacity handler
  function updateOpacity() {
    const rect = image.getBoundingClientRect();
    const top = rect.top;
    const bottom = rect.bottom;
  
    phrases.forEach((phrase) => {
      const phraseRect = phrase.getBoundingClientRect();
      const phraseTop = phraseRect.top;
      const phraseBottom = phraseRect.bottom;
  
      if (bottom > phraseTop && top < phraseBottom) {
        phrase.style.opacity = 1;
      } else {
        phrase.style.opacity = 0;
      }
    });
  }
  

  // faq blocks
  queryAll('.faq-block').forEach(faqBlock => {
    const faqExpand = faqBlock.querySelector('.faq-expand');
    const faqContent = faqBlock.querySelector('.faq-block-content');
    
    // add click event listener to the whole block
    faqBlock.addEventListener('click', () => {
      // toggle the active class on the block and the expand button
      faqBlock.classList.toggle('active');
      faqExpand.classList.toggle('active');
      
      // if the block is active
      if (faqBlock.classList.contains('active')) {
        // expand the content and remove the hide class
        faqContent.style.maxHeight = faqContent.scrollHeight + 'px';
        faqContent.style.marginTop = '1em';
        faqContent.classList.remove('hide');
      } else {
        // collapse the content, add hide class and set margin-top to -1em
        faqContent.style.maxHeight = '0';
        faqContent.style.marginTop = '-1em';
        faqContent.classList.add('hide');
      }
    });
  });


  // randomize colors
  randColorElements.forEach((element, index) => {
    let randomColor;
    
    // Assign unique color to the first colors.length faq-blocks
    if (index < colors.length) {
      do randomColor = colors[Math.floor(Math.random() * colors.length)];
      while (usedColors.includes(randomColor));
      usedColors.push(randomColor);
    } 
    
    else randomColor = colors[Math.floor(Math.random() * colors.length)];

    element.style.setProperty('--rand-color', `var(--${randomColor})`);
  });
  

  // randomize prdocut picture
  const randProducImg = colors[Math.floor(Math.random() * colors.length) + 1];
  sliderVape.src = `./public/product/${randProducImg}.png`;
  
  // event listeners 
  qrCodeElement.addEventListener('click', share);
  buttonMinor.addEventListener('click', handleMinorButton);
  window.addEventListener('scroll', handleMobileNavigation);
  button18plus.addEventListener('click', handle18plusButton);
  document.addEventListener('DOMContentLoaded', selectTarget); 
  window.addEventListener("scroll", updateOpacity);
  