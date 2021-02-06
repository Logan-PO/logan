## Running the mobile frontend

### On an iOS simulator or device

Run `npx react-native run-ios` to run the project on a simulator, or open `ios/mobilefrontend.xcworkspace`
in Xcode to run on a physical device.

If you experience errors related to the Podfile or CocoaPods, you might need to take some manual install actions.
 Apple's dependency manager is called CocoaPods (similar to npm for Node.js).
 React Native translates many npm dependencies to pods so the project can be run on iOS.
 
 If Podfile.lock is missing, navigate to `mobile-frontend/ios` and run `pod install` to install the dependencies.
 If any dependencies are missing or out of date, run `pod deintegrate` and `pod install` to uninstall and reinstall
 all CocoaPods. Your project should then be ready to run.

### Using the Expo client
To run the frontend, first install expo-cli using
```
npm install -g expo-cli
```

Once the expo-cli is installed, navigate to the mobile frontend directory and run:
```
expo start
```

You should be navigated to an external link, where you can simulate Android, iOS, or web.
To simulate the frontend on your own device, select **tunnel** as the connection and scan the
QR code using the expo app. This should then start running the app on your device.