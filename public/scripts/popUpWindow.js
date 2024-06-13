window.onload = function() {
    setTimeout(function() {
      openPopup();
    }, 2000); // 10 seconds
  };
  
  function openPopup() {
    document.getElementById('popup').style.display = 'block';
  }
  
  function closePopup() {
    document.getElementById('popup').style.display = 'none';
  }
  