
# React Native Project Setup

## Terminal and Node

```
nvm install 16.19.0
nvm use 16.19.0
nvm alias default 16.19.0  # Only for Mac OS
```

## Expo and Expo CLI

```
npm install -g expo-cli
```

## Expo Go App

Search for the Expo Go app in the relevant app store for your device (iOS or Android) and download it onto your device.

## Expo Account

Now, you need an Expo account. Head over to the [Expo signup page](https://expo.dev/signup) and follow the instructions to create an account. Once that’s done, you should be able to log in to Expo from your browser and mobile app.

To log in to your Expo account using expo-cli in the terminal/Powershell, run `expo login` and follow the login process. You can see the currently logged-in account by running `expo whoami`.

## Creating chat-app Project

In your terminal, begin by navigating to the folder where all your projects are stored. Create a new Expo project by entering:

```
npx create-expo-app hello-world --template
```

You might be asked which template you want to use for this project—press Enter to choose the blank one.

## Watchman Issue

**Error Message:**

```
metro-file-map: Watchman crawl failed. Retrying once with node crawler.
  Usually this happens when watchman isn't running. Create an empty `.watchmanconfig` file in your project's root folder or initialize a git or hg repository in your project.
  Error: Watchman error: std::__1::system_error: open: /Users/alexisabner/Desktop/05-ReactNative/hello-world: Operation not permitted. Make sure watchman is running for this project. See [Watchman Troubleshooting](https://facebook.github.io/watchman/docs/troubleshooting).
```

**Solution:**

Restart Watchman, stop the currently running Watchman service. Open Terminal. Use the following command to stop the Watchman service:

```
watchman shutdown-server
```

This command instructs Watchman to shut down its server. If Watchman is running, it will stop the service.

Run your React Native project again. You will be asked permission for watchman to watch. Say yes, and it will start working.

## Navigating Between Screens

To start, create a new Expo project (using a blank --template like you did before). Why? Because App.js will be used as a root component, serving as a hub to other screens. You want to set up a new project to reflect this functionality.

React Navigation is made by the community and not integrated into React Native, so you first need to install it. Open up your terminal and navigate to your new project folder, then type:

```
npm install --save @react-navigation/native @react-navigation/native-stack
```

Once done, run the following command to install the necessary dependencies that react-navigation uses:

```
expo install react-native-screens react-native-safe-area-context
```

In your project’s root directory, create a new folder called “components”. You will have your components in this folder.
```