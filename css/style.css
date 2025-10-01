    /* -----------------------------------------
       Visual theme (black outside, white pages)
       ----------------------------------------- */
    :root{
      --bg: #000;
      --book-bg: #fff;
      --accent: #007bff;
      --muted: #ddd;
      --radius: 8px;
    }

    html, body {
      height: 100%;
      margin: 0;
      background: var(--bg);
      color: var(--muted);
      font-family: Inter, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* wrapper to center content */
    .wrap {
      min-height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 14px;
      box-sizing: border-box;
    }

    header {
      width: 100%;
      max-width: 1200px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    h1 {
      margin: 0;
      font-size: 18px;
      color: #fff;
    }

    /* book area (centered) */
    .book-area {
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* the #book element is controlled by JS/turn.js */
    #book {
      background: var(--book-bg);
      border-radius: var(--radius);
      box-shadow: 0 16px 60px rgba(0,0,0,0.6);
      overflow: hidden;
      position: relative;
      -webkit-tap-highlight-color: transparent;
    }

    /* pages created inside #book should fill container and center image */
    #book .page {
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    /* img inside page uses contain to avoid cropping */
    #book .page img {
      width: 100%;
      height: 100%;
      object-fit: contain; /* IMPORTANT: preserves full A4 inside page frame */
      display: block;
      user-select: none;
      -webkit-user-drag: none;
      pointer-events: none; /* allow drag gestures through turn.js */
    }

    /* controls area under book */
    .controls {
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: center;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn {
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
    }
    .btn.secondary { background: #333; }
    .btn:active { transform: translateY(1px); }

    .goto {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--muted);
    }
    input[type="number"] {
      width: 78px;
      padding: 6px;
      border-radius: 6px;
      border: 1px solid rgba(255,255,255,0.08);
      background: rgba(255,255,255,0.03);
      color: var(--muted);
    }

    .pagination {
      width: 100%;
      max-width: 1200px;
      display: flex;
      justify-content: center;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .pagination button {
      padding: 6px 8px;
      min-width: 36px;
      border-radius: 6px;
      border: 1px solid var(--accent);
      background: #fff;
      color: var(--accent);
      cursor: pointer;
    }
    .pagination button.active {
      background: var(--accent);
      color: white;
    }

    .info { color: #cfcfcf; font-size: 13px; }

    /* Loader overlay while first pages preload */
    .loader {
      position: fixed;
      left: 0; right: 0; top: 0; bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(0,0,0,0.88);
      z-index: 9999;
      gap: 12px;
      color: #fff;
      font-size: 16px;
    }
    .loader .bar {
      width: 420px;
      max-width: calc(100% - 40px);
      height: 12px;
      background: rgba(255,255,255,0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    .loader .bar > i {
      display: block;
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg,var(--accent),#00c6ff);
    }

    /* responsive */
    @media (max-width: 760px) {
      .loader .bar { width: 280px; }
      h1 { font-size: 16px; }
      .btn { padding: 10px 14px; font-size: 15px; }
    }
