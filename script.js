document.addEventListener('DOMContentLoaded',function(event){
    var writerArray = [ "Father", "Husband", "Software Engineer", "Swimmer", "Biker"];
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