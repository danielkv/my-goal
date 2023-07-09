# Goal web / My Goal
A training worksheet , focused on CrossFit athletes. The project had as `goal` to enrich the user experience as an athlete keeping track of the workout plans and gains.
## Project
This project is a `monorepo` using `yarn workspaces`. It has 3 main **apps** and 3 helper **packages**.
### Apps
- **SolidJS web app**:  for admin only to add new workout plans (worksheets) and manage the users. [See more](https://github.com/danielkv/my-goal/tree/main/apps/web)
- **React Native Mobile app**: For active users to check and use during the traning. [See more](https://github.com/danielkv/my-goal/tree/main/apps/mobile)
- **Firbase functions**: Some small functions to help managing some minor users data. [See more](https://github.com/danielkv/my-goal/tree/main/apps/functions) 
### Packages
- **Utils**: Helper functions and classes to shared between web and mobile. [See more](https://github.com/danielkv/my-goal/tree/main/packages/utils)
- **Models**: Interfaces and types shared between web and mobile. [See more](https://github.com/danielkv/my-goal/tree/main/packages/models)
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
  
