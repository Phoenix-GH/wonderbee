package com.justhive;

import android.app.Application;
import android.util.Log;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.projectseptember.RNGL.RNGLPackage;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.rnfs.RNFSPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.testfairy.TestFairy;
import com.cmcewen.blurview.BlurViewPackage;
import com.BV.LinearGradient.LinearGradientPackage;

import java.util.Arrays;
import java.util.List;

import fr.bamlab.rnimageresizer.ImageResizerPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.testfairy.react.TestFairyPackage;

public class MainApplication extends Application implements ReactApplication {

    @Override
    public void onCreate() {
        super.onCreate();
        TestFairy.begin(this, "5efee55e41b8c70d692234f2592fc53bbc22e085"); // e.g "0000111122223333444455566667777788889999";
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNDeviceInfo(),
            new RNFetchBlobPackage(),
            new LinearGradientPackage(),
            new ReactNativeContacts(),
            new RNGLPackage(),
            new RCTCameraPackage(),
            new RNFSPackage(),
            new VectorIconsPackage(),
            new BlurViewPackage(),
            new ReactVideoPackage(),
            new RNViewShotPackage(),
            new ImageResizerPackage(),
            new LinearGradientPackage(),
            new ReactNativePushNotificationPackage(),
            new TestFairyPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

}
