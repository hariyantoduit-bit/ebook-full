  (function($){
    'use strict';

    /* =========================
       CONFIG & STATE
       ========================= */
    const TOTAL_PAGES = 173;     // sesuaikan kalau berubah
    const PER_BLOCK = 10;        // pagination per block
    const A4_ASPECT = 1.41421356; // tinggi/lebar ≈ 297/210
    const MAX_BOOK_WIDTH = 1200; // maksimal lebar book (adjustable)
    const PRELOAD_COUNT = 173;    // halaman pertama yang dipreload sebelum sembunyikan loader

    let currentPage = 1;         // halaman aktif (1-based)
    let currentBlock = 1;
    let soundAllowed = false;
    let turnInitialized = false;

    // DOM refs
    const $loader = $("#loader");
    const $loaderBar = $("#loaderBar");
    const $loaderText = $("#loaderText");
    const $loaderClose = $("#loaderClose");
    const $app = $("#app");
    const $book = $("#book");
    const $pagination = $("#pagination");
    const $pageInfo = $("#pageInfo");
    const flipSound = document.getElementById("flipSound");

    /* =========================
       Utility: page URL generator
       ========================= */
    function pageUrl(idx) {
      return `images/page${idx}.jpg`;
    }

    /* =========================
       Preload first N images, then show app
       ========================= */
    function preloadInitial() {
      let cnt = 0;
      const toLoad = Math.min(TOTAL_PAGES, PRELOAD_COUNT);
      $loaderText.text(`Memuat ${cnt}/${toLoad}...`);
      for (let i=1;i<=toLoad;i++){
        (function(i){
          const img = new Image();
          img.onload = function(){
            cnt++;
            updateLoader(cnt, toLoad);
            if(cnt === toLoad){
              // enough preloaded -> reveal app
              setTimeout(() => {
                showApp();
                // background preload for remaining
                setTimeout(preloadRemaining, 200);
              }, 150);
            }
          };
          img.onerror = function(){
            cnt++;
            updateLoader(cnt, toLoad);
            if(cnt === toLoad){
              setTimeout(() => { showApp(); setTimeout(preloadRemaining,200); }, 150);
            }
          };
          img.src = pageUrl(i);
        })(i);
      }
    }

    function updateLoader(count, total) {
      $loaderText.text(`Memuat ${count}/${total}...`);
      const pct = Math.round((count/total) * 100);
      $loaderBar.css("width", pct + "%");
    }

    function preloadRemaining() {
      // lazy preload remaining pages but do not block UI
      for (let i = PRELOAD_COUNT + 1; i <= TOTAL_PAGES; i++){
        const img = new Image();
        img.onload = function(){ /* noop */ };
        img.onerror = function(){ /* noop */ };
        img.src = pageUrl(i);
      }
    }

    $loaderClose.on("click", function(){
      // user forces close loader (accept blanks)
      showApp();
      setTimeout(preloadRemaining, 200);
    });

    function showApp() {
      $loader.hide();
      $app.show();
    }

    /* =========================
       Helpers: compute optimal page size & display mode
       - pageWidth/pageHeight returned are for ONE A4 page (portrait)
       - displayMode: "single" for portrait, "double" for landscape
       ========================= */
    function computeLayout() {
      const vw = Math.min(window.innerWidth * 0.95, MAX_BOOK_WIDTH);
      const vh = Math.round(window.innerHeight * 0.83);

      const isLandscape = window.innerWidth > window.innerHeight;
      let pageWidth;

      if(isLandscape) {
        // allow two pages across with small margins
        const candidate = Math.min((window.innerWidth * 0.88) / 2, MAX_BOOK_WIDTH / 2);
        pageWidth = Math.max(200, Math.round(candidate));
      } else {
        // single page fits available width
        pageWidth = Math.max(200, Math.round(Math.min(vw, window.innerWidth * 0.95)));
      }

      let pageHeight = Math.round(pageWidth * A4_ASPECT);

      // if pageHeight too tall for viewport, reduce width accordingly
      if(pageHeight > vh){
        pageHeight = vh;
        pageWidth = Math.round(pageHeight / A4_ASPECT);
      }

      return {
        pageWidth,
        pageHeight,
        displayMode: isLandscape ? "double" : "single"
      };
    }

    /* =========================
       Build page DOM elements inside #book
       - We create a <div class="page"><img/></div> for each page (1..TOTAL_PAGES)
       - For first PRELOAD_COUNT, img.src is set. Others set later via turn.js missing callback or lazy loader.
       ========================= */
    function buildPages() {
      $book.empty();
      for(let i=1;i<=TOTAL_PAGES;i++){
        const div = document.createElement("div");
        div.className = "page";
        div.dataset.page = i;
        // create img element; initially only set src for first PRELOAD_COUNT
        const img = document.createElement("img");
        img.alt = `Halaman ${i}`;
        if(i <= PRELOAD_COUNT){
          img.src = pageUrl(i);
        }
        // append
        div.appendChild(img);
        $book.append(div);
      }
    }

    /* =========================
       initTurn — initializes turn.js with computed sizes
       - if already inited, it destroys previous instance and re-init
       - ensures pages are sized and turn receives correct display mode
       ========================= */
    function initTurn() {
      // compute size
      const layout = computeLayout();
      const pageW = layout.pageWidth;
      const pageH = layout.pageHeight;
      const display = layout.displayMode;
      // container width
      const containerW = display === "double" ? pageW * 2 : pageW;

      // destroy if exists
      if(turnInitialized && $book.data("turn")) {
        try { $book.turn("destroy"); } catch(e){ /* ignore */ }
        $book.removeData("turn");
      }

      // set dimensions on #book to give turn.js pixel values
      $book.css({
        width: containerW + "px",
        height: pageH + "px"
      });

      // initialize turn
      $book.turn({
        width: containerW,
        height: pageH,
        display: display,
        autoCenter: true,
        acceleration: true,
        gradients: true,
        elevation: 70,
        duration: 500,
        when: {
          // fired prior to page turning — good spot to play sound
          turning: function(e, page, view) {
            // play sound if allowed
            if(soundAllowed){
              try { flipSound.currentTime = 0; flipSound.play().catch(()=>{}); } catch(err){}
            }
          },
          // after page turned, update currentPage and UI
          turned: function(e, page, view) {
            currentPage = page;
            updateAfterTurn();
          },
          // when turn.js asks for content that might be missing
          missing: function(e, pages) {
            // fill missing pages' <img> src lazily
            pages.forEach(function(p){
              const $p = $book.children(`[data-page='${p}']`);
              if($p.length){
                const img = $p.find("img");
                if(img && !img.attr("src")){
                  img.attr("src", pageUrl(p));
                }
              }
            });
          }
        }
      });

      // mark initialized
      turnInitialized = true;

      // show desired starting page
      try { $book.turn("page", currentPage); } catch(e) { /* ignore */ }
    }

    /* =========================
       UI sync after turn
       ========================= */
    function updateAfterTurn() {
      // ensure page info & pagination reflect currentPage
      $pageInfo.text(`Halaman ${currentPage} / ${TOTAL_PAGES}`);
      $("#gotoInput").val(currentPage);
      highlightPagination();
    }

    /* =========================
       Pagination: create per-block buttons
       ========================= */
    function createPagination(block = 1) {
      currentBlock = block;
      $pagination.empty();
      const start = (block - 1) * PER_BLOCK + 1;
      const end = Math.min(start + PER_BLOCK - 1, TOTAL_PAGES);

      if(block > 1){
        $("<button>").text("«").on("click", function(){ createPagination(block - 1); }).appendTo($pagination);
      }

      for(let i=start;i<=end;i++){
        const $btn = $("<button>").text(i).on("click", function(){ goTo(i); });
        $pagination.append($btn);
      }

      if(end < TOTAL_PAGES){
        $("<button>").text("»").on("click", function(){ createPagination(block + 1); }).appendTo($pagination);
      }

      highlightPagination();
    }

    function highlightPagination(){
      $pagination.children("button").removeClass("active");
      const idx = (currentPage - 1) % PER_BLOCK;
      const numericBtns = $pagination.children("button").filter(function(){ return $(this).text() !== "«" && $(this).text() !== "»"; });
      if(numericBtns.length && numericBtns[idx]){
        $(numericBtns[idx]).addClass("active");
      }
    }

    /* =========================
       Navigation helpers: goPrevious, goNext, goTo
       - Respect display mode: in double mode prefer stepping spreads
       ========================= */
    function detectDisplay() {
      if(!$book.data("turn")) return computeLayout().displayMode;
      try { return $book.turn("display"); } catch(e) { return computeLayout().displayMode; }
    }

    function goPrevious(){
      const mode = detectDisplay();
      if(mode === "double"){
        // two-page logic: move to previous spread (left page even)
        if(currentPage <= 2) return goTo(1);
        if(currentPage % 2 === 1) {
          // currently on right -> previous is left (page-1)
          goTo(currentPage - 1);
        } else {
          // on left -> previous spread: -2
          goTo(Math.max(1, currentPage - 2));
        }
      } else {
        goTo(Math.max(1, currentPage - 1));
      }
    }

    function goNext(){
      const mode = detectDisplay();
      if(mode === "double"){
        if(currentPage >= TOTAL_PAGES - 1) return goTo(TOTAL_PAGES);
        if(currentPage % 2 === 0) {
          // on left -> next left (skip 2)
          goTo(Math.min(TOTAL_PAGES, currentPage + 2));
        } else {
          // on right -> go to next left (current+1)
          goTo(Math.min(TOTAL_PAGES, currentPage + 1));
        }
      } else {
        goTo(Math.min(TOTAL_PAGES, currentPage + 1));
      }
    }

    function goTo(n) {
      n = Math.max(1, Math.min(TOTAL_PAGES, Math.floor(n) || 1));
      // if double display, align to even-left pages when appropriate
      const mode = detectDisplay();
      if(mode === "double"){
        // prefer landing on left-even pages for spreads (except page 1 allowed)
        if(n > 1 && n % 2 === 1) n = n - 1; // if odd, take left page = n-1
      }
      try {
        $book.turn("page", n);
      } catch(e){
        // if turn not ready, set state and will be applied on init
        currentPage = n;
      }
    }

    /* =========================
       Resize handling: if display mode (single/double) changes, re-init turn.
       Otherwise update size with turn('size',w,h)
       Debounced to avoid thrash.
       ========================= */
    let resizeTimer = null;
    let lastDisplayMode = null;

    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function(){
        const layout = computeLayout();
        const newDisplay = layout.displayMode;
        const w = newDisplay === "double" ? layout.pageWidth * 2 : layout.pageWidth;
        const h = layout.pageHeight;

        if(!turnInitialized){
          // if turn not initialized yet, ignore
          return;
        }

        // if display mode changed (single <-> double), reinitialize turn to avoid weird artifacts
        if(lastDisplayMode && lastDisplayMode !== newDisplay){
          try { $book.turn("destroy"); } catch(e) {}
          $book.removeData("turn");
          turnInitialized = false;
          initTurn();
        } else {
          // just resize in-place
          try { $book.turn("size", w, h); } catch(e) { /* ignore */ }
        }
        lastDisplayMode = newDisplay;
      }, 180);
    }

    /* =========================
       Fullscreen helpers
       ========================= */
    function requestFullscreenSafely() {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(()=>{});
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen && el.webkitRequestFullscreen();
      else if (el.msRequestFullscreen) el.msRequestFullscreen && el.msRequestFullscreen();
    }
    function exitFullscreenSafely() {
      if (document.exitFullscreen) document.exitFullscreen && document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen && document.webkitExitFullscreen();
    }
    function toggleFullscreen() {
      if (document.fullscreenElement) exitFullscreenSafely(); else requestFullscreenSafely();
    }

    $("#fullscreenToggle").on("click", toggleFullscreen);

    /* =========================
       Attach UI events
       ========================= */
    function attachUI() {
      $("#prevBtn").on("click", goPrevious);
      $("#nextBtn").on("click", goNext);
      $("#gotoBtn").on("click", function(){ const n = parseInt($("#gotoInput").val()||"1",10); goTo(n); });
      $("#gotoInput").on("keyup", function(e){ if(e.key === "Enter") { const n = parseInt($(this).val()||"1",10); goTo(n); } });

      // keyboard
      $(document).on("keyup", function(e){
        if(e.key === "ArrowLeft") goPrevious();
        if(e.key === "ArrowRight" || e.key === " ") goNext();
      });

      // enable sound after first tap/click due to browser autoplay policy
      document.body.addEventListener("click", function unlockSound(){ soundAllowed = true; document.body.removeEventListener("click", unlockSound); }, { once: true });
    }

    /* =========================
       Start sequence: preload -> build pages -> init turn -> UI
       ========================= */
    function start() {
      // show loader and preload initial pages
      preloadInitial();

      // build page elements (img tags inserted for PRELOAD_COUNT pages)
      buildPages();

      // small delay to allow DOM paint then init turn
      setTimeout(function(){
        initTurn();
        createPagination(1);
        updateAfterTurn();
        attachUI();
        lastDisplayMode = detectDisplay();
      }, 300);

      // window resize/orientation hooks
      $(window).on("resize orientationchange", function(){
        onResize();
      });

      // automatically request fullscreen on mobile (gentle)
      if(/Mobi|Android/i.test(navigator.userAgent)){
        setTimeout(function(){ requestFullscreenSafely(); }, 600);
      }
    }

    // kick off once DOM ready
    $(function(){
      start();
    });

  })(jQuery);
