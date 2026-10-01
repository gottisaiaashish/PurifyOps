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

    companion object {
        private const val TAG = "PurifyOps-Web"
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
                if (webView.canGoBack()) {
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
        settings.setSupportZoom(true)
        settings.builtInZoomControls = false
        settings.displayZoomControls = false
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        // Custom User-Agent tag to identify Android Wrapper
        val defaultUserAgent = settings.userAgentString
        settings.userAgentString = "$defaultUserAgent PurifyOpsAndroid/1.0"

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

            // Progress bar update
            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress < 100) {
                    progressBar.visibility = View.VISIBLE
                    progressBar.progress = newProgress
                } else {
                    progressBar.visibility = View.GONE
                    swipeRefreshLayout.isRefreshing = false
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
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                swipeRefreshLayout.isRefreshing = false
                Log.i(TAG, "Page loaded successfully: $url")
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
