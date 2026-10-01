/**
 * PurifyOps Android Native Mobile Engine v3
 * - Crisp High-Contrast WHITE & CYAN drawer navigation (Zero dimness)
 * - Rock-solid click navigation for all menu items
 * - Sleek WHITE 3-lines hamburger menu button
 * - NO logo in topbar (clean & spacious)
 * - Zero modifications to website/frontend repository
 */
(function() {
    'use strict';

    try {
        // 1. Enforce Mobile Viewport
        var meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');

        // 2. Inject Native Mobile Stylesheet
        var styleId = 'purifyops-native-app-styles';
        var styleEl = document.getElementById(styleId);
        if (!styleEl) {
            styleEl = document.createElement('style');
            styleEl.id = styleId;
            document.head.appendChild(styleEl);
        }

        styleEl.innerHTML = `
            /* --- Android App Shell --- */
            html, body {
                width: 100vw !important;
                max-width: 100vw !important;
                overflow-x: hidden !important;
                background-color: #0B0F19 !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-tap-highlight-color: transparent !important;
                -webkit-font-smoothing: antialiased !important;
            }

            .app-container, .app-layout {
                display: block !important;
                width: 100vw !important;
                max-width: 100vw !important;
                min-height: 100vh !important;
                overflow-x: hidden !important;
                position: relative !important;
                background: #0B0F19 !important;
            }

            /* --- Off-Canvas Drawer (HIGH CONTRAST, ZERO DIMNESS, CRISP WHITE) --- */
            .app-sidebar {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                bottom: 0 !important;
                width: 300px !important;
                max-width: 86vw !important;
                height: 100vh !important;
                z-index: 100000 !important;
                transform: translateX(-105%) !important;
                transition: transform 0.28s cubic-bezier(0.32, 0.72, 0, 1) !important;
                background: #0F172A !important;
                background-color: #0F172A !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                filter: none !important;
                opacity: 1 !important;
                box-shadow: 20px 0 50px rgba(0, 0, 0, 0.95) !important;
                border-right: 1px solid rgba(255, 255, 255, 0.16) !important;
                overflow-y: auto !important;
                display: flex !important;
                flex-direction: column !important;
            }

            .app-sidebar * {
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                filter: none !important;
            }

            .app-sidebar.mobile-open {
                transform: translateX(0) !important;
            }

            /* Crisp Drawer Header with White Close Button */
            .sidebar-header {
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 16px 18px !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.14) !important;
                background: #1E293B !important;
                min-height: 62px !important;
            }

            .brand-details {
                display: flex !important;
                flex-direction: column !important;
            }

            .brand-title {
                color: #FFFFFF !important;
                font-size: 20px !important;
                font-weight: 800 !important;
                letter-spacing: -0.02em !important;
                opacity: 1 !important;
            }

            .btn-close-sidebar {
                width: 36px !important;
                height: 36px !important;
                border-radius: 9px !important;
                background: rgba(255, 255, 255, 0.12) !important;
                border: 1px solid rgba(255, 255, 255, 0.22) !important;
                color: #FFFFFF !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                flex-shrink: 0 !important;
            }
            .btn-close-sidebar svg {
                stroke: #FFFFFF !important;
            }
            .btn-close-sidebar:active {
                background: rgba(239, 68, 68, 0.4) !important;
            }

            /* Bright Cyan Section Titles */
            .sidebar-nav {
                padding: 14px 12px !important;
                flex: 1 !important;
                background: #0F172A !important;
            }

            .nav-section-title {
                font-size: 11px !important;
                color: #38BDF8 !important;
                font-weight: 800 !important;
                letter-spacing: 0.12em !important;
                text-transform: uppercase !important;
                padding: 16px 12px 6px 12px !important;
                opacity: 1 !important;
            }

            /* Vivid Crisp White Clickable Nav Items */
            .nav-item {
                display: flex !important;
                align-items: center !important;
                gap: 12px !important;
                padding: 13px 16px !important;
                margin-bottom: 5px !important;
                border-radius: 10px !important;
                color: #FFFFFF !important;
                font-size: 15px !important;
                font-weight: 600 !important;
                opacity: 1 !important;
                background: rgba(255, 255, 255, 0.04) !important;
                border: 1px solid rgba(255, 255, 255, 0.07) !important;
                transition: all 0.12s ease !important;
                cursor: pointer !important;
                user-select: none !important;
                text-decoration: none !important;
            }

            .nav-item:active {
                background: rgba(255, 255, 255, 0.15) !important;
                transform: scale(0.98) !important;
            }

            .nav-item.active {
                background: linear-gradient(90deg, rgba(6, 182, 212, 0.35), rgba(59, 130, 246, 0.20)) !important;
                color: #FFFFFF !important;
                font-weight: 700 !important;
                border: 1px solid rgba(6, 182, 212, 0.6) !important;
                border-left: 4px solid #06B6D4 !important;
                box-shadow: 0 0 16px rgba(6, 182, 212, 0.25) !important;
            }

            .nav-item .nav-icon {
                width: 20px !important;
                height: 20px !important;
                color: #38BDF8 !important;
                stroke: #38BDF8 !important;
                opacity: 1 !important;
                flex-shrink: 0 !important;
            }

            /* Dimmed Backdrop Overlay (No Blur Filter) */
            #purifyops-mobile-backdrop {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(3, 7, 18, 0.70) !important;
                backdrop-filter: none !important;
                -webkit-backdrop-filter: none !important;
                filter: none !important;
                z-index: 99990 !important;
                opacity: 0;
                transition: opacity 0.20s ease;
            }
            #purifyops-mobile-backdrop.active {
                display: block !important;
                opacity: 1 !important;
            }

            /* --- Main Content Shell --- */
            .app-main {
                width: 100vw !important;
                max-width: 100vw !important;
                margin: 0 !important;
                padding: 0 !important;
                display: flex !important;
                flex-direction: column !important;
                min-height: 100vh !important;
                overflow-x: hidden !important;
            }

            /* --- Clean Topbar with Sleek White Hamburger --- */
            .topbar {
                height: 56px !important;
                min-height: 56px !important;
                padding: 0 12px !important;
                width: 100vw !important;
                box-sizing: border-box !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                background: rgba(11, 15, 25, 0.96) !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
                gap: 8px !important;
                z-index: 100 !important;
            }

            .topbar-left {
                display: flex !important;
                align-items: center !important;
                gap: 10px !important;
                min-width: 0 !important;
                flex: 1 !important;
            }

            /* Sleek WHITE 3-Lines Hamburger Button */
            #purifyops-hamburger-btn {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 40px !important;
                height: 40px !important;
                min-width: 40px !important;
                border-radius: 10px !important;
                background: rgba(255, 255, 255, 0.12) !important;
                border: 1px solid rgba(255, 255, 255, 0.25) !important;
                color: #FFFFFF !important;
                cursor: pointer !important;
                flex-shrink: 0 !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35) !important;
                transition: transform 0.12s ease !important;
            }
            #purifyops-hamburger-btn:active {
                transform: scale(0.92) !important;
                background: rgba(255, 255, 255, 0.25) !important;
            }
            #purifyops-hamburger-btn svg {
                stroke: #FFFFFF !important;
            }

            .project-selector {
                padding: 5px 10px !important;
                max-width: 130px !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
                white-space: nowrap !important;
                background: rgba(255, 255, 255, 0.07) !important;
                border: 1px solid rgba(255, 255, 255, 0.12) !important;
                border-radius: 8px !important;
            }
            .project-label {
                display: none !important;
            }
            .project-name {
                font-size: 12px !important;
                color: #E2E8F0 !important;
                max-width: 105px !important;
                overflow: hidden !important;
                text-overflow: ellipsis !important;
            }

            .topbar-right {
                display: flex !important;
                align-items: center !important;
                gap: 6px !important;
                flex-shrink: 0 !important;
            }

            .btn-ai-helper {
                padding: 6px 10px !important;
                font-size: 11px !important;
                font-weight: 600 !important;
                border-radius: 8px !important;
                white-space: nowrap !important;
                background: linear-gradient(135deg, rgba(6, 182, 212, 0.22), rgba(59, 130, 246, 0.22)) !important;
                border: 1px solid rgba(6, 182, 212, 0.4) !important;
                color: #38BDF8 !important;
            }

            /* --- Horizontal Pipeline Stepper --- */
            .pipeline-stepper {
                width: 100vw !important;
                box-sizing: border-box !important;
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch !important;
                padding: 0 10px !important;
                height: 42px !important;
                min-height: 42px !important;
                background: rgba(15, 23, 42, 0.85) !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
                scrollbar-width: none !important;
                display: flex !important;
                align-items: center !important;
            }
            .pipeline-stepper::-webkit-scrollbar {
                display: none !important;
            }
            .stepper-stage {
                flex-shrink: 0 !important;
                padding: 6px 10px !important;
                font-size: 11px !important;
            }

            /* --- Page Viewport & Card Layout --- */
            .page-viewport {
                padding: 14px 12px 40px 12px !important;
                width: 100vw !important;
                box-sizing: border-box !important;
                overflow-x: hidden !important;
                -webkit-overflow-scrolling: touch !important;
            }

            .view-container {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            /* Page Title & Actions Alignment */
            .page-header {
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-start !important;
                gap: 12px !important;
                margin-bottom: 18px !important;
                padding-bottom: 14px !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            }

            .page-title-group h1 {
                font-size: 22px !important;
                font-weight: 700 !important;
                color: #F8FAFC !important;
                letter-spacing: -0.02em !important;
                margin: 0 !important;
            }

            .page-description {
                font-size: 13px !important;
                color: #94A3B8 !important;
                margin-top: 4px !important;
            }

            /* 2-Column Equal Grid for Action Buttons */
            .page-actions {
                width: 100% !important;
                display: grid !important;
                grid-template-columns: 1fr 1fr !important;
                gap: 10px !important;
                margin: 0 !important;
            }

            .page-actions .btn {
                width: 100% !important;
                min-height: 42px !important;
                padding: 8px 12px !important;
                font-size: 13px !important;
                font-weight: 600 !important;
                border-radius: 9px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-sizing: border-box !important;
            }

            /* Overview Cards & Stat Boxes Alignment */
            .overview-hero {
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 14px !important;
                margin-bottom: 14px !important;
            }

            .quality-score-panel {
                padding: 20px 14px !important;
                border-radius: 14px !important;
                background: #111827 !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
            }

            .stats-grid, .grid-2-cols, .grid-3-cols, .grid-4-cols,
            .project-cards-grid, .dataset-cards-grid,
            [style*="grid-template-columns"] {
                display: grid !important;
                grid-template-columns: 1fr !important;
                gap: 12px !important;
            }

            .stat-card, .metric-card, .card, .glass-card {
                padding: 16px !important;
                border-radius: 12px !important;
                background: #111827 !important;
                border: 1px solid rgba(255, 255, 255, 0.08) !important;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25) !important;
                margin-bottom: 10px !important;
            }

            /* Data Tables Touch Scroll */
            .table-container, .data-table-wrapper, table {
                max-width: 100% !important;
                overflow-x: auto !important;
                -webkit-overflow-scrolling: touch !important;
                display: block !important;
            }
        `;

        // 3. Inject Backdrop if not present
        var backdrop = document.getElementById('purifyops-mobile-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'purifyops-mobile-backdrop';
            document.body.appendChild(backdrop);
            backdrop.addEventListener('click', function() {
                closeSidebar();
            });
        }

        // 4. Inject WHITE 3-Lines Hamburger Button into Topbar
        var topbarLeft = document.querySelector('.topbar-left');
        if (topbarLeft && !document.getElementById('purifyops-hamburger-btn')) {
            var hamburger = document.createElement('button');
            hamburger.id = 'purifyops-hamburger-btn';
            hamburger.type = 'button';
            hamburger.setAttribute('aria-label', 'Open navigation menu');
            hamburger.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            topbarLeft.insertBefore(hamburger, topbarLeft.firstChild);

            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleSidebar();
            });
        }

        // Clean up any old logos from topbar or duplicate headers
        var oldBrand = document.getElementById('purifyops-topbar-brand');
        if (oldBrand) oldBrand.remove();

        var oldMobileHeader = document.getElementById('sidebar-mobile-header');
        if (oldMobileHeader) oldMobileHeader.remove();

        // 5. Add Close Button to existing Sidebar Header
        var sidebar = document.querySelector('.app-sidebar');
        if (sidebar) {
            var sHeader = sidebar.querySelector('.sidebar-header');
            if (sHeader && !sHeader.querySelector('.btn-close-sidebar')) {
                var closeBtn = document.createElement('button');
                closeBtn.className = 'btn-close-sidebar';
                closeBtn.type = 'button';
                closeBtn.setAttribute('aria-label', 'Close menu');
                closeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
                sHeader.appendChild(closeBtn);
                closeBtn.onclick = function(e) {
                    e.stopPropagation();
                    closeSidebar();
                };
            }
        }

        function toggleSidebar() {
            if (!sidebar) return;
            var isOpen = sidebar.classList.toggle('mobile-open');
            var canvas = document.getElementById('gradient-waves-canvas');

            if (isOpen) {
                backdrop.classList.add('active');
                if (canvas) canvas.style.display = 'none'; // prevent GPU dimming/blur
                if (window.AndroidBridge && window.AndroidBridge.onDrawerStateChanged) {
                    window.AndroidBridge.onDrawerStateChanged(true);
                }
            } else {
                backdrop.classList.remove('active');
                if (canvas) canvas.style.display = 'block';
                if (window.AndroidBridge && window.AndroidBridge.onDrawerStateChanged) {
                    window.AndroidBridge.onDrawerStateChanged(false);
                }
            }
        }

        function closeSidebar() {
            if (sidebar) sidebar.classList.remove('mobile-open');
            if (backdrop) backdrop.classList.remove('active');
            var canvas = document.getElementById('gradient-waves-canvas');
            if (canvas) canvas.style.display = 'block';
            if (window.AndroidBridge && window.AndroidBridge.onDrawerStateChanged) {
                window.AndroidBridge.onDrawerStateChanged(false);
            }
        }

        // 6. Direct Capturing Click Listener for 100% Reliable Menu Navigation
        if (!window.__purifyops_nav_listener) {
            window.__purifyops_nav_listener = true;
            document.addEventListener('click', function(e) {
                var navItem = e.target.closest('.nav-item');
                if (navItem) {
                    var href = navItem.getAttribute('href');
                    var route = navItem.dataset.route;
                    var target = href || (route ? '#' + route : null);
                    if (target) {
                        window.location.hash = target;
                    }
                    setTimeout(closeSidebar, 80);
                }
            }, true); // Capturing phase executes immediately before anything can block it
        }

        // Route change listener
        if (!window.__purifyops_route_listener) {
            window.__purifyops_route_listener = true;
            window.addEventListener('hashchange', function() {
                closeSidebar();
            });
        }

    } catch (e) {
        console.error("PurifyOps Mobile Engine Error:", e);
    }
})();
