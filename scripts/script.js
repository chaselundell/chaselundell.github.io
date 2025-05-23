document.addEventListener('DOMContentLoaded',function(event){
    var writerArray = [ "Father", "Husband", "Programmer", "Swimmer", "Biker"];
    // type one char in the typwriter repeat until end of string
    function typeWriter(text, i, fnCallback) {
      if (i < (text.length)) {
        // add next character to h1
       document.querySelector(".message").innerHTML = text.substring(0, i+1) +'<span id="caret" aria-hidden="true"></span>';
  
        // wait for a while and call this function again for next character
        setTimeout(function() {
          typeWriter(text, i + 1, fnCallback)
        }, 100);
      }
      // text finished, call callback if there is a callback function
      else if (typeof fnCallback == 'function') {
        // call callback after timeout
        setTimeout(fnCallback, 700);
      }
    }
    // start a typewriter animation for a text in the writerArray array
     function StartTextAnimation(i) {
       if (typeof writerArray[i] == 'undefined'){
          setTimeout(function() {
            StartTextAnimation(0);
          }, 20000);
       }
      if (i < writerArray[i].length) {
       typeWriter(writerArray[i], 0, function(){
         if(i + 1 == writerArray.length) {
            i = -1;
         }
         StartTextAnimation(i + 1);
       });
      }
    }
    // start the text animation
    StartTextAnimation(0);
  });

// === ADD SMOOTH SCROLL FOR NAV LINKS (Optional) ===
const navLinks = document.querySelectorAll('#main-nav a[href^="#"]');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default anchor jump
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Calculate scroll position, accounting for fixed nav height
            const navHeight = document.getElementById('main-nav').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});
// === END SMOOTH SCROLL CODE ===

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight != "0px" && content.style.maxHeight != ""){
      content.style.maxHeight = "0px";
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    } 
  });
}