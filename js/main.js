// FORWARD DECLARATIONS
  const root = document.documentElement;

  const ageVerificationCookie = getCookie('ageVerification');

  const header = query('.header');
  const qrCodeElement = query('.qr-code');
  const buttons = queryAll('.menu .circle'); 
  const buttonMinor = query(`#button-minor`);
  const clickOnMeText = query('.click-on-me');
  const button18plus = query(`#button-18plus`);
  const middleElement = query('.middle-element');
  const slidesContainer = query('.slides-container');
  const ageVerification = query('.age-verification');
  const randColorElements = queryAll('.faq-block, .contact-box, .phrase, .share-qbox-contents');
  
  const timeoutAddModal = 500;
  const timeoutRemoveModal = 800;
  
  const usedColors = [];
  const colors = [  
    '--BRI',
    '--TM',
    '--PC',
    '--KPFG',
    '--DA',
    '--PI',
    '--SRC',
    '--WI',
    '--BSR',
    '--L99'];

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
    const data = await response.json();
    const { url, text, title, taskTextInitial, taskTextComplete } = data.share_info;
    
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
    try {
      if (isMobile && navigator.share) {
        // Use navigator.share for mobile devices
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
        console.log('Successful share');
      } else {
        // Use Clipboard API for desktop devices
        await navigator.clipboard.writeText(url);
        console.log('Successful copy');
      }
      
      clickOnMeText.textContent = taskTextComplete;
      
    } catch (error) {
      console.log('Error:', error);
      
      if (isMobile) {
        // Fallback behavior for mobile devices
        window.location.href = `sms:&body=${encodeURIComponent(url)}`;
      } else {
        // Fallback behavior for desktop devices
        clickOnMeText.textContent = "scan this QR!";
      }
    }
  
    // Reset the button text after a delay
    setTimeout(() => {
      clickOnMeText.textContent = taskTextInitial;
    }, 1000);
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
        button.classList.remove('selected');
      });
      
      // Add the 'selected' class to the clicked button
      event.target.classList.add('selected');
    });
  });
  

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


  // random colors
  randColorElements.forEach((element, index) => {
    let randomColor;
    
    // Assign unique color to the first colors.length faq-blocks
    if (index < colors.length) {
      do {
        randomColor = colors[Math.floor(Math.random() * colors.length)];
      } while (usedColors.includes(randomColor));
      
      usedColors.push(randomColor);
    } else {
      randomColor = colors[Math.floor(Math.random() * colors.length)];
    }

    element.style.setProperty('--rand-color', `var(${randomColor})`);
  });
  
  
  // event listeners 
  qrCodeElement.addEventListener('click', share)
  button18plus.addEventListener('click', handle18plusButton);
  buttonMinor.addEventListener('click', handleMinorButton);
  window.addEventListener('scroll', handleMobileNavigation);
  document.addEventListener('DOMContentLoaded', selectTarget);