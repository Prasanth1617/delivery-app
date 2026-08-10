package com.theniretail.app;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;
import com.ionicframework.capacitor.Checkout;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    registerPlugin(Checkout.class);

    // Custom WebViewClient that catches UPI app-launch links (intent://, upi://)
    // and hands them off to the actual installed app (GPay, PhonePe, etc.),
    // instead of letting the WebView try (and fail) to load them as web pages.
    getBridge().setWebViewClient(new BridgeWebViewClient(getBridge()) {
      @Override
      public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        String url = request.getUrl().toString();

        if (url.startsWith("intent://") || url.startsWith("upi://")) {
          try {
            Intent intent;
            if (url.startsWith("intent://")) {
              intent = Intent.parseUri(url, Intent.URI_INTENT_SCHEME);
            } else {
              intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
            }
            intent.addCategory(Intent.CATEGORY_BROWSABLE);
            intent.setComponent(null);
            intent.setSelector(null);
            startActivity(intent);
          } catch (ActivityNotFoundException e) {
            // No UPI app installed that can handle this — safely ignore,
            // Razorpay's checkout UI will show its fallback options.
          } catch (Exception e) {
            e.printStackTrace();
          }
          return true; // we handled it, don't let WebView try to load it
        }

        return super.shouldOverrideUrlLoading(view, request);
      }
    });
  }

  @Override
  public void onResume() {
    super.onResume();
    // Fix: WebView retains scroll offset after keyboard dismissal,
    // causing tap targets to be offset from visual position
    View webView = getBridge().getWebView();
    if (webView != null) {
      webView.scrollTo(0, 0);
      webView.requestLayout();
    }
  }
}
