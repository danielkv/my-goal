# Goal web / My Goal
A training worksheet , focused on CrossFit athletes. The project had as `goal` to enrich the user experience as an athlete keeping track of the workout plans and gains.

![iphone 5 5 1](https://github.com/danielkv/my-goal/assets/5912401/ab8d56f4-74fe-45ef-8515-039739e8e8b2)
![iphone 5 5 2](https://github.com/danielkv/my-goal/assets/5912401/685421f7-1291-40aa-83f4-c65441b5c69d)
![iphone 5 5 3](https://github.com/danielkv/my-goal/assets/5912401/adb8837c-c342-4fa3-b722-e66a405b98c0)

[Check out in figma](https://www.figma.com/file/K3LRczSadkeHIVBNq6zUnm/goal-app?type=design&node-id=48%3A20&mode=design&t=z0Dp7IMkQhbBltg2-1)
## Project
This project is a `monorepo` using `yarn workspaces`. It has 3 main **apps** and 3 helper **packages**.
### Apps
- **SolidJS web app**:  For admin only to add new workout plans (worksheets) and manage the users. [See more](https://github.com/danielkv/my-goal/tree/main/apps/web)
- **React Native Mobile app**: For active users to check and use during the traning. [See more](https://github.com/danielkv/my-goal/tree/main/apps/mobile)
- **Firbase functions**: Some small functions to help managing some minor users data.
### Packages
- **Utils**: Helper functions and classes to shared between web and mobile.
- **Models**: Interfaces and types shared between web and mobile.
- **CLI**: Small CLI app to help with migrations and firestore development. [See more](https://github.com/danielkv/my-goal/tree/main/packages/cli)
## Technologies
The details for each app/package you can check following the links above. Here are some of the shared techs that were used:
 - Firebase
	 - Firestore
	 - Authentication
	 - Functions
	 - Crashlitics
 ## How to run this project
To run this project, you need to setup some files and accounts:
1. A Firebase project with access to functions. (not free account)
	- Create a web, IOS ad Android certificates (download the files)
	- Create a DB on the firestore
2. Inside of `/apps/mobile/`
	- Save the IOS and Android certificates
	- Copy the file `.env.example` and rename it to `.env`
	- Set the values for the vars in the file `.env`
3. Inside of `/apps/web/`
	- Copy the file `.env.example` and rename it to `.env`
	- Set the values for the vars in the file `.env`
4. Run `yarn` to install all dependencies.
Done! If everything is correct you can run:

Firebase emulator
```
yarn fb:emulator
```
Web
```
yarn dev:web
```
Mobile
```
yarn dev:mobile
```
  
