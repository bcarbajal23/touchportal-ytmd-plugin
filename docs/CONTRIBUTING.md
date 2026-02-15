# Contributing to Touch Portal YTMD Plugin

Thank you for considering contributing to the plug-in. Since the plug-in is Node executable, the end-user doesn't have to install Node on their machine for this to run. Below are some guidelines on how to contribute.

### Prerequisites:
Ensure that you have the following installed:
 - Node: 20.x
 - NPM: 10.x or higher
 - Touch Portal: v4.3 or greater (Using API version 10).
 
### Local Development Setup  

1. **Fork the respository**

2. **Clone your fork to you machine**:
    ```
    git clone https://github.com/YOUR-USERNAME/touchportal-ytmd-plugin.git
    ```
    
3. **Install all the dependencies**:
    ```
    npm ci
    ```

4. **Create a new branch** for your feature or bugfix. Please use descriptive branch names:
    ```
    git checkout -b new-awesome-feature
    ```

### Building and Testing Local Changes

The project was developed using TypeScript and the package executable was compiled using `@yao-pkg/pkg`, which allows a NodeJS executable to be ran on any device without having to install Node.  
You may need to install `@yao-pkg/pkg` on your machine for this to build the executable.
```
npm install -g @yao-pkg/pkg
```
*In the future I may install this into project itself. If you see `@yao-pkg/pkg` in the `package.json`, then you can skip this step*.

1. **Compile the TypeScript**:

    ```
    npm run build
    ```

2. **Package up the** `ytmd_plugin_v2.tpp` **file**:

    ```
    node scripts/build.js
    ``` 

    *This will generate the binaries and bundle them into `ytmd_plugin_v2.tpp` into the root directory (**DO NOT COMMIT THIS FILE!**)*.
    
3. **Test in Touch Portal**: Import the generated `ytmd_plugin_v2.tpp`file into your local Touch Portal instance to verify your changes work as expected. Be sure to delete any other versions of plug-in as this may cause issues. You can always create a back-up of your Touch Portal or just re-download the latest release and reinstall it after you're done testing.

4. **(Optional)**: If you can test your changes on multiple operating systems, that would be awesome. But it is not necessary 😁.


### Submitting a Pull Request

Once you are happy with your changes and have tested them locally, go ahead and submit a PR.
1. **Commit your changes**:
 
```
git add .
git commit -m feat: added cool new feature
```
*Use the [semantic-commit-messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) styling when making your commits*.

2. **Push to your fork**: 

```
git push origin new-awesome-feature 
```
*You might have add the flag `--set-upstream`.*

3. **Open a Pull Request:**

    - Go to the original repository on GitHub.
    - Click **Compare & Pull Request**
    - Provide a *Title* and *Desciption* of what your Bug Fix or Feature does.
    - **Note**: Please **DO NOT** bump the versions in the `package.json` and `entry.tp`. Those will get bumped on the next release.


**Automated Checks**

When you submit your, the GitHub Action pipeline will automatically kick off to verify your code changes. It will attempt to compile the TypeScript and build the Node executable. **Your PR must pass this build check for it can be merged**. If it fails, head over to the Action Log on your PR to see what went wrong!

Thank you again for contributing to the YouTube Music Desktop App plug-in ❤️. Happy Developing!  🧑‍💻 👨‍💻 👩‍💻
