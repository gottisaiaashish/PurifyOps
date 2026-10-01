package com.purifyops.app

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Bitmap
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private lateinit var progressBar: ProgressBar
    private lateinit var errorLayout: LinearLayout
    private lateinit var tvErrorMessage: TextView
    private lateinit var btnRetry: Button
    private lateinit var btnSwitchUrl: Button

    private var fileUploadCallback: ValueCallback<Array<Uri>>? = null
    private lateinit var fileChooserLauncher: ActivityResultLauncher<Intent>

    // Environments: Production Vercel or Local Emulator
    private val productionUrl = "https://purifyops-frontend.vercel.app"
    private val localEmulatorUrl = "http://10.0.2.2:5500"
    private var currentTargetUrl = productionUrl

    // Track drawer state for native back-button handling
    private var isDrawerOpen = false

    companion object {
        private const val TAG = "PurifyOps-Web"
    }

    inner class WebAppInterface {
        @JavascriptInterface
        fun onDrawerStateChanged(isOpen: Boolean) {
            runOnUiThread {
                isDrawerOpen = isOpen
                Log.d(TAG, "Mobile Drawer state changed: isOpen=$isOpen")
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        initViews()
        setupBackNavigation()
        setupFileChooser()
        setupWebView()
        setupListeners()

        loadUrl(currentTargetUrl)
    }

    private fun initViews() {
        webView = findViewById(R.id.webView)
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        progressBar = findViewById(R.id.progressBar)
        errorLayout = findViewById(R.id.errorLayout)
        tvErrorMessage = findViewById(R.id.tvErrorMessage)
        btnRetry = findViewById(R.id.btnRetry)
        btnSwitchUrl = findViewById(R.id.btnSwitchUrl)

        swipeRefreshLayout.setColorSchemeResources(R.color.primary, R.color.accent_blue)
        swipeRefreshLayout.setProgressBackgroundColorSchemeResource(R.color.surface_dark)
    }

    private fun setupBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (isDrawerOpen) {
                    val closeJs = """
                        (function() {
                            var s = document.querySelector('.app-sidebar');
                            var b = document.getElementById('purifyops-mobile-backdrop');
                            if (s) s.classList.remove('mobile-open');
                            if (b) b.classList.remove('active');
                            if (window.AndroidBridge) window.AndroidBridge.onDrawerStateChanged(false);
                        })();
                    """.trimIndent()
                    webView.evaluateJavascript(closeJs, null)
                    isDrawerOpen = false
                } else if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    private fun setupFileChooser() {
        fileChooserLauncher = registerForActivityResult(
            ActivityResultContracts.StartActivityForResult()
        ) { result ->
            if (result.resultCode == Activity.RESULT_OK) {
                val data: Intent? = result.data
                val clipData = data?.clipData
                val uri = data?.data

                val results: Array<Uri>? = when {
                    clipData != null -> {
                        val count = clipData.itemCount
                        Array(count) { i -> clipData.getItemAt(i).uri }
                    }
                    uri != null -> arrayOf(uri)
                    else -> null
                }
                fileUploadCallback?.onReceiveValue(results)
                Log.d(TAG, "File chosen successfully: ${results?.joinToString()}")
            } else {
                fileUploadCallback?.onReceiveValue(null)
                Log.d(TAG, "File chooser canceled by user")
            }
            fileUploadCallback = null
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        // Enable Chrome remote debugging (chrome://inspect)
        WebView.setWebContentsDebuggingEnabled(true)
        Log.i(TAG, "Chrome DevTools remote debugging enabled! Visit chrome://inspect on PC.")

        val settings: WebSettings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = true
        settings.textZoom = 100
        settings.setSupportZoom(true)
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        // Custom User-Agent tag to identify Android Wrapper
        val defaultUserAgent = settings.userAgentString
        settings.userAgentString = "$defaultUserAgent PurifyOpsAndroid/1.0 Mobile"

        // Inject Native JS Bridge
        webView.addJavascriptInterface(WebAppInterface(), "AndroidBridge")

        webView.webChromeClient = object : WebChromeClient() {
            // Forward console logs to Android Studio Logcat
            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                if (consoleMessage != null) {
                    val level = consoleMessage.messageLevel()
                    val msg = "[${consoleMessage.sourceId()}:${consoleMessage.lineNumber()}] ${consoleMessage.message()}"
                    when (level) {
                        ConsoleMessage.MessageLevel.ERROR -> Log.e(TAG, msg)
                        ConsoleMessage.MessageLevel.WARNING -> Log.w(TAG, msg)
                        ConsoleMessage.MessageLevel.LOG -> Log.d(TAG, msg)
                        ConsoleMessage.MessageLevel.TIP -> Log.i(TAG, msg)
                        else -> Log.v(TAG, msg)
                    }
                }
                return true
            }

            // Progress bar update and early mobile injection
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress < 100) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                    swipeRefreshLayout.isRefreshing = false
                }

                if (newProgress >= 50) {
                    injectMobileOptimizations()
                }
            }

            // Handle file chooser for CSV/Excel uploads
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                fileUploadCallback?.onReceiveValue(null)
                fileUploadCallback = filePathCallback

                val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "*/*"
                    putExtra(Intent.EXTRA_MIME_TYPES, arrayOf(
                        "text/csv",
                        "text/plain",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "application/json",
                        "*/*"
                    ))
                    if (fileChooserParams?.mode == FileChooserParams.MODE_OPEN_MULTIPLE) {
                        putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                    }
                }

                try {
                    fileChooserLauncher.launch(Intent.createChooser(intent, "Select Dataset File"))
                } catch (e: Exception) {
                    Log.e(TAG, "Cannot launch file chooser", e)
                    fileUploadCallback = null
                    return false
                }
                return true
            }
        }

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                // Keep PurifyOps internal URLs inside WebView
                return if (url.contains("purifyops-frontend.vercel.app") ||
                    url.contains("10.0.2.2") ||
                    url.contains("localhost")
                ) {
                    false
                } else {
                    // External links open in default browser
                    try {
                        startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                        true
                    } catch (e: Exception) {
                        false
                    }
                }
            }

            override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
                super.onPageStarted(view, url, favicon)
                Log.i(TAG, "Navigating to: $url")
                errorLayout.visibility = View.GONE
                injectMobileOptimizations()
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                swipeRefreshLayout.isRefreshing = false
                Log.i(TAG, "Page loaded successfully: $url")
                injectMobileOptimizations()
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                if (request?.isForMainFrame == true) {
                    val desc = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        error?.description?.toString() ?: "Unknown error"
                    } else {
                        "Connection failed"
                    }
                    Log.e(TAG, "MainFrame Load Error: $desc (URL: ${request.url})")
                    showError(desc)
                }
            }

            override fun onReceivedHttpError(
                view: WebView?,
                request: WebResourceRequest?,
                errorResponse: WebResourceResponse?
            ) {
                super.onReceivedHttpError(view, request, errorResponse)
                if (request?.isForMainFrame == true) {
                    val code = errorResponse?.statusCode ?: 0
                    Log.e(TAG, "HTTP Error: $code for ${request.url}")
                    if (code >= 400) {
                        showError("HTTP Error $code: Failed to load PurifyOps server.")
                    }
                }
            }
        }
    }

    /**
     * Injects Mobile-first CSS & UI Drawer to make PurifyOps 100% Mobile Responsive
     * without modifying a single line of code in the production web repository.
     */
    private fun injectMobileOptimizations() {
        val js = """
            (function() {
                try {
                    // 1. Force responsive viewport
                    var meta = document.querySelector('meta[name="viewport"]');
                    if (meta) {
                        meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
                    } else {
                        meta = document.createElement('meta');
                        meta.name = 'viewport';
                        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
                        document.head.appendChild(meta);
                    }

                    // 2. Inject Mobile Styling Sheet
                    if (!document.getElementById('purifyops-mobile-styles')) {
                        var style = document.createElement('style');
                        style.id = 'purifyops-mobile-styles';
                        style.innerHTML = `
                            /* Global Responsive Shell */
                            html, body {
                                width: 100vw !important;
                                max-width: 100vw !important;
                                overflow-x: hidden !important;
                                -webkit-text-size-adjust: 100% !important;
                            }

                            .app-container, .app-layout {
                                display: block !important;
                                width: 100vw !important;
                                max-width: 100vw !important;
                                height: 100% !important;
                                overflow-x: hidden !important;
                                position: relative !important;
                            }

                            /* Off-Canvas Drawer Navigation Sidebar */
                            .app-sidebar {
                                position: fixed !important;
                                top: 0 !important;
                                left: 0 !important;
                                bottom: 0 !important;
                                width: 285px !important;
                                max-width: 85vw !important;
                                min-width: 260px !important;
                                height: 100vh !important;
                                z-index: 10000 !important;
                                transform: translateX(-105%) !important;
                                transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1) !important;
                                background: #0B0F19 !important;
                                box-shadow: 12px 0 35px rgba(0, 0, 0, 0.9) !important;
                                border-right: 1px solid rgba(255, 255, 255, 0.12) !important;
                                padding-top: env(safe-area-inset-top, 0px) !important;
                            }

                            .app-sidebar.mobile-open {
                                transform: translateX(0) !important;
                            }

                            /* Dimmed Backdrop Overlay */
                            #purifyops-mobile-backdrop {
                                display: none;
                                position: fixed;
                                top: 0;
                                left: 0;
                                right: 0;
                                bottom: 0;
                                background: rgba(0, 0, 0, 0.70);
                                backdrop-filter: blur(4px);
                                -webkit-backdrop-filter: blur(4px);
                                z-index: 9999;
                                opacity: 0;
                                transition: opacity 0.25s ease;
                            }
                            #purifyops-mobile-backdrop.active {
                                display: block !important;
                                opacity: 1 !important;
                            }

                            /* Main Content Area - Full width on mobile */
                            .app-main {
                                width: 100vw !important;
                                max-width: 100vw !important;
                                margin: 0 !important;
                                padding: 0 !important;
                                display: flex !important;
                                flex-direction: column !important;
                                height: 100vh !important;
                                overflow-x: hidden !important;
                            }

                            /* Mobile Hamburger Button in Topbar */
                            #purifyops-hamburger-btn {
                                display: flex !important;
                                align-items: center;
                                justify-content: center;
                                width: 38px;
                                height: 38px;
                                min-width: 38px;
                                border-radius: 9px;
                                background: rgba(6, 182, 212, 0.16) !important;
                                border: 1px solid rgba(6, 182, 212, 0.4) !important;
                                color: #38bdf8 !important;
                                cursor: pointer;
                                margin-right: 8px;
                                flex-shrink: 0;
                                transition: all 0.2s ease;
                            }
                            #purifyops-hamburger-btn:active {
                                transform: scale(0.92);
                                background: rgba(6, 182, 212, 0.35) !important;
                            }

                            /* Topbar Clean Layout */
                            .topbar {
                                height: 54px !important;
                                min-height: 54px !important;
                                padding: 0 10px !important;
                                width: 100vw !important;
                                box-sizing: border-box !important;
                                gap: 6px !important;
                            }
                            .topbar-left {
                                gap: 6px !important;
                                flex: 1 !important;
                                min-width: 0 !important;
                            }
                            .project-selector {
                                padding: 4px 8px !important;
                                max-width: 130px !important;
                                overflow: hidden !important;
                                text-overflow: ellipsis !important;
                            }
                            .project-name {
                                max-width: 75px !important;
                                font-size: 11px !important;
                                overflow: hidden !important;
                                text-overflow: ellipsis !important;
                                white-space: nowrap !important;
                            }
                            .btn-ai-helper {
                                padding: 5px 9px !important;
                                font-size: 11px !important;
                                white-space: nowrap !important;
                            }

                            /* Horizontal Stepper Scroll */
                            .pipeline-stepper {
                                width: 100vw !important;
                                box-sizing: border-box !important;
                                overflow-x: auto !important;
                                -webkit-overflow-scrolling: touch !important;
                                padding: 0 8px !important;
                                scrollbar-width: none !important;
                            }
                            .pipeline-stepper::-webkit-scrollbar {
                                display: none !important;
                            }
                            .stepper-stage {
                                flex-shrink: 0 !important;
                                padding: 8px 10px !important;
                                font-size: 11px !important;
                            }

                            /* Page Viewport & Containers */
                            .page-viewport {
                                padding: 14px 10px 32px 10px !important;
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

                            /* Fluid 1-Column Stacking for Cards and Grids */
                            .overview-hero {
                                grid-template-columns: 1fr !important;
                                gap: 14px !important;
                            }
                            .quality-score-panel {
                                padding: 16px 12px !important;
                            }
                            .stats-grid, .grid-2-cols, .grid-3-cols, .grid-4-cols,
                            .project-cards-grid, .dataset-cards-grid,
                            [style*="grid-template-columns"] {
                                grid-template-columns: 1fr !important;
                                gap: 12px !important;
                            }

                            /* Page Headers and Action Buttons */
                            .page-header {
                                flex-direction: column !important;
                                align-items: flex-start !important;
                                gap: 10px !important;
                            }
                            .page-title-group h1 {
                                font-size: 20px !important;
                            }
                            .page-actions {
                                width: 100% !important;
                                display: flex !important;
                                flex-wrap: wrap !important;
                                gap: 8px !important;
                            }
                            .page-actions .btn {
                                flex: 1 1 auto !important;
                                justify-content: center !important;
                            }

                            /* Data Tables Scrollable without Screen Break */
                            .table-container, .data-table-wrapper, table {
                                width: 100% !important;
                                max-width: 100% !important;
                                overflow-x: auto !important;
                                -webkit-overflow-scrolling: touch !important;
                                display: block !important;
                            }

                            /* Card Padding & Sizing */
                            .glass-card, .card {
                                padding: 14px !important;
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    // 3. Setup Backdrop Element
                    var backdrop = document.getElementById('purifyops-mobile-backdrop');
                    if (!backdrop) {
                        backdrop = document.createElement('div');
                        backdrop.id = 'purifyops-mobile-backdrop';
                        document.body.appendChild(backdrop);
                        backdrop.onclick = function() {
                            closeSidebar();
                        };
                    }

                    function closeSidebar() {
                        var sidebar = document.querySelector('.app-sidebar');
                        if (sidebar) sidebar.classList.remove('mobile-open');
                        if (backdrop) backdrop.classList.remove('active');
                        if (window.AndroidBridge && window.AndroidBridge.onDrawerStateChanged) {
                            window.AndroidBridge.onDrawerStateChanged(false);
                        }
                    }

                    function toggleSidebar() {
                        var sidebar = document.querySelector('.app-sidebar');
                        if (!sidebar) return;
                        var isOpen = sidebar.classList.toggle('mobile-open');
                        if (isOpen) {
                            backdrop.classList.add('active');
                            if (window.AndroidBridge && window.AndroidBridge.onDrawerStateChanged) {
                                window.AndroidBridge.onDrawerStateChanged(true);
                            }
                        } else {
                            backdrop.classList.remove('active');
                            if (window.AndroidBridge && window.AndroidBridge.onDrawerStateChanged) {
                                window.AndroidBridge.onDrawerStateChanged(false);
                            }
                        }
                    }

                    // 4. Inject Hamburger Button into Topbar
                    var topbarLeft = document.querySelector('.topbar-left');
                    if (topbarLeft && !document.getElementById('purifyops-hamburger-btn')) {
                        var hamburger = document.createElement('button');
                        hamburger.id = 'purifyops-hamburger-btn';
                        hamburger.type = 'button';
                        hamburger.setAttribute('aria-label', 'Open navigation menu');
                        hamburger.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
                        topbarLeft.insertBefore(hamburger, topbarLeft.firstChild);

                        hamburger.onclick = function(e) {
                            e.stopPropagation();
                            toggleSidebar();
                        };
                    }

                    // 5. Auto-close drawer on navigation clicks
                    var navItems = document.querySelectorAll('.nav-item');
                    navItems.forEach(function(item) {
                        item.onclick = function() {
                            setTimeout(closeSidebar, 120);
                        };
                    });

                    // 6. Listen for hash/route changes
                    if (!window.__purifyops_mobile_listener) {
                        window.__purifyops_mobile_listener = true;
                        window.addEventListener('hashchange', function() {
                            closeSidebar();
                        });
                    }

                } catch(err) {
                    console.error("PurifyOps Mobile Injection Error:", err);
                }
            })();
        """.trimIndent()

        webView.evaluateJavascript(js) { res ->
            Log.d(TAG, "Mobile optimizations injected: $res")
        }
    }

    private fun setupListeners() {
        swipeRefreshLayout.setOnRefreshListener {
            Log.d(TAG, "User triggered swipe refresh")
            webView.reload()
        }

        btnRetry.setOnClickListener {
            errorLayout.visibility = View.GONE
            loadUrl(currentTargetUrl)
        }

        btnSwitchUrl.setOnClickListener {
            currentTargetUrl = if (currentTargetUrl == productionUrl) {
                localEmulatorUrl
            } else {
                productionUrl
            }
            Toast.makeText(this, "Target URL set to: $currentTargetUrl", Toast.LENGTH_SHORT).show()
            loadUrl(currentTargetUrl)
        }
    }

    private fun loadUrl(url: String) {
        errorLayout.visibility = View.GONE
        progressBar.visibility = View.VISIBLE
        Log.i(TAG, "Loading URL: $url")
        webView.loadUrl(url)
    }

    private fun showError(message: String) {
        swipeRefreshLayout.isRefreshing = false
        progressBar.visibility = View.GONE
        tvErrorMessage.text = message
        errorLayout.visibility = View.VISIBLE
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
