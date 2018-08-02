
<html lang=''>
  <head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <meta name='description' content=''>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Web Starter Kit</title>

    <script src='https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'></script>
    <!-- Disable tap highlight on IE -->
    <meta name='msapplication-tap-highlight' content='no'>

    <!-- Web Application Manifest -->
    <link rel='manifest' href='manifest.json'>
    <link rel='stylesheet' href='https://use.fontawesome.com/releases/v5.1.0/css/all.css' integrity='sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt' crossorigin='anonymous'>
    <!-- Add to homescreen for Chrome on Android -->
    <meta name='mobile-web-app-capable' content='yes'>
    <meta name='application-name' content='Web Starter Kit'>
    <link rel='icon' sizes='192x192' href='images/touch/chrome-touch-icon-192x192.png'>

    <!-- Add to homescreen for Safari on iOS -->
    <meta name='apple-mobile-web-app-capable' content='yes'>
    <meta name='apple-mobile-web-app-status-bar-style' content='black'>
    <meta name='apple-mobile-web-app-title' content='Web Starter Kit'>
    <link rel='apple-touch-icon' href='images/touch/apple-touch-icon.png'>

    <!-- Tile icon for Win8 (144x144 + tile color) -->
    <meta name='msapplication-TileImage' content='images/touch/ms-touch-icon-144x144-precomposed.png'>
    <meta name='msapplication-TileColor' content='#2F3BA2'>

    <!-- Color the status bar on mobile devices -->
    <meta name='theme-color' content='#2F3BA2'>

    <!-- SEO: If your mobile URL is different from the desktop URL, add a canonical link to the desktop page https://developers.google.com/webmasters/smartphone-sites/feature-phones -->
    <!--
    <link rel='canonical' href='http://www.example.com/'>
    -->

    <!-- Material Design icons -->
    <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons'>


    <!-- Material Design Lite page styles:
    You can choose other color schemes from the CDN, more info here http://www.getmdl.io/customize/index.html
    Format: material.color1-color2.min.css, some examples:
    material.red-teal.min.css
    material.blue-orange.min.css
    material.purple-indigo.min.css
    -->

    <!-- Your styles -->
    <link href='https://fonts.googleapis.com/css?family=Muli' rel='stylesheet'>
    <link rel='stylesheet' href='http://www.joedmasonsd.com/app/styles/main.css'>

  </head>
 <body>
    <script>
      var menuCount=0;
      var alwaysShow = true;
      const isMobile = 'maxTouchPoints' in Navigator;
         function showMenuBar(){
           $('.menu-bar').fadeIn(400);
           $('#toHide').css('z-index','-2');}

    hideMenuBar = isMobile || !alwaysShow  ? () => {
      let mb = $('.menu-bar');
      mb.fadeOut(); $('.invisible-menu-bar').css('z-index','2');
    } : () => {};
      showMenuBar();
      if (alwaysShow || isMobile) {
       // $('.invisible-menu-bar')
        $('#toHide').remove();
      }



      $().ready(()=>
      {
        function setOnclick(e) {
          e.onmouseenter= menuHover;
        }
        let menuDivs = Array.from(document.getElementsByClassName('hasSub'));
        menuCount++;


      var menuHover = function(e){
        let classes = Array.from(e.target.classList)
        if(classes.indexOf('submenu')===-1)
        {
          const subMenus = [
            {'Blog' : ['Tech News', 'CSS Tricks', 'Things I've learned', 'Latest']},
            { 'Projects' :
                ['<a href='https://github.com/samdoj'>GitHub</a>',
                  '<a href='http://www.silvermoonrise.com'>Website</a>',
                  '<a href='https://play.google.com/store/apps/details?id=com.mim'>Cornell MIM</a>']},
            {'About me': ['Hobbies', 'Interests', 'How I stay sharp']},
            {'Games': ['Tic-tac-toe', 'Battleship', 'Serverless']},
            {'Options' : ['Dark theme', 'Light theme', 'DOS','<input type ='checkbox'>Shadowy</input>']}];
         let submenuTexts=e.currentTarget.innerText;
          let optionsIndex = 0;
          const subMenuKeys = subMenus.map( (undefined,n)=>{return Object.keys(subMenus[n])});
          try{
          subMenuKeys.forEach((key, n) =>
          {
            if (key[0].indexOf(submenuTexts.trim())>-1)
            {
              optionsIndex = n;
              throw (n)
            }
            console.log(key, n);
          });}
          catch(e)
          {
            console.log('matched', e);
          }
          console.log(subMenuKeys);
          e.target.classList.add('submenu');
         //e.target.classList.remove('menu');
          let currHTML = e.target.innerHTML + '<div  class = 'items'><ul>';
          const choices = Object.values(subMenus[optionsIndex])[0];
          choices.forEach((item,n) => {
            let hr = n===0 ? '' : '<hr/>';
            let li = n==0 ? '<li style='margin-top:1.5vh'>' : '<li>';
            currHTML+=`${hr}${li}${item}</li>`});
          $('.hasSub').map((div) => {return $(this).text()});
          $('.submenu').css('height',5* choices.length+ 7+'vw');

         currHTML+='</ul></div>';
         e.target.innerHTML=currHTML;
         e.target.onmouseleave = (e)=>
         {
           let el = currentTarget.cloneNode();
           setOnclick(el);
           const list = el.classList;
          // list.add('menu');
         menuDivs.forEach((e)  => {$('.submenu').css('height', ' inherit'); e.classList.remove('submenu'); e.classList.add('hasSub');})
         $('.items').remove();
         }
        var currentTarget = e.target.cloneNode(true);
        }





      };
      menuDivs.forEach(elem => {if (!isMobile) elem.onmouseenter = menuHover; else elem.onclick = menuHover;console.log(elem)});})
    </script>
    <!-- Built with love using Web Starter Kit -->



    <div class = 'invisible-menu-bar' id='toHide' onmouseenter= 'showMenuBar();'>
    </div>
    <div class = 'main-content'>
    <div class = 'menu-bar' id='menu-bar' onmouseleave=' if(!alwaysShow || isMobile) hideMenuBar();'>
      <div class='menu noSub'><a class='fas fa-home' href='http://www.joedmasonsd.com'>Home</a>

   </div>




      <div class = 'menu hasSub'>
        <div class = ' '><span class='fas fa-newspaper' />Blog</div>
    </div>


      <div class = 'menu hasSub'>
        <div ><span class = 'fas fa-code'>Projects</span></div>
</div>


   <div class = 'menu noSub'>
     <div class = ''><span class = 'fas fa-list-ul'> Resumé</span></div>
   </div>


   <div class = 'menu noSub'>
     <div class = ''><span class='fas fa-camera'>Photos</span></div>
   </div>


   <div class = 'menu hasSub'>
     <div class = ''><span class='fas fa-id-badge'>About me</span></div>
     </div>


   <div class = 'menu hasSub'>

     <div class = ' '> <span class = 'fas fa-gamepad'>Games</span></div>
     </div>

   <div class = 'menu hasSub last'>
     <div class = 'fas fa-cog'>Options</div>
   </div>
 </div>
    </div>
 </body>
</html>


