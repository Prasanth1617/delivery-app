package com.theniretail.app;

import android.os.Bundle;
import android.view.View;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
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