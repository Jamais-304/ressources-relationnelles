# The (RE)SOURCES RELATIONNELLES project

## Project contributions workflow

Each developer must create a branch for the feature he is currently developping.

No one should commit directly to the branch `main`. To push code on `main`, you
must do a merge request (also called "pull request" on Github).

### Detailed Git workflow

1.  **Create a ticket** in the [project](https://github.com/orgs/Jamais-304/projects/2), describing the feature you want to develop, or see existing
    and assign yourself to one of them you can resolve.

2.  **Clone the repository** to your personal computer if it’s not already done, with
    the command:
    ```bash
    git clone https://github.com/Jamais-304/ressources-relationnelles.git
    ```
3.  **Create a local branch** representing your ticket, respecting the convention:
    `ticket_type`/`ticket_number`-`branch-name`

    Example:

    ```bash
    git branch feature/22-create-ressources-model
    ```

4.  **Checkout to your ticket branch**:
    ```bash
    git checkout feature/22-create-ressources-model
    ```
5.  **Make your commits** on this branch. You **must**:

    - follow [conventional
      commits](https://www.conventionalcommits.org/en/v1.0.0/)
    - precise the scope of you commit
    - add the ticket `Refs` to your commit

    ```bash
    git commit -m "deps(S:Front): install 'vitest'@^3.0.7

    Refs: #22"

     …

    git commit -m "feat(M:Ressource): create model

    Refs: #22"

    …
    ```

    > **Note:** we advice you to use [`git-z`](https://github.com/ejpcmac/git-z), which is used in the project to
    > define all scopes and to automatically add the `Refs` on your commits,
    > based on your branch name.

6.  **Clean your branch** before you ask for a pull request.

    For this, you **should** configure your default Git editor:

    ```bash
    git config --global core.editor "editor_of_your_choice"
    ```

    Then you will be able to play easily with these commands to clean your
    branch history:

    - Modify your last commit if needed.

    ```bash
    git commit --amend
    ```

    - Modify older commits if needed.

    ```bash
    git commit --fixup <commit_hash>
    ```

    - Then use the interactive rebase to apply eventual fixups, rename or delete
      olde commits.

    ```bash
    git rebase -i <commit_hash>
    ```

7.  **Rebase your branch** on the last version of `main`. This will make you
    handle eventual conflicts locally, before the pull request. It is important
    to make your branch fit the code of your colleagues that is already merged.

    - Fetch all modifications and pull main.

    ```bash
    git fetch --all
    git checkout main
    git pull
    ```

    - Rebase you branch on the newly pulled version of `main`.

    ```bash
    git checkout feature/22-create-ressources-model
    git rebase main
    ```

    This will replay all your commits on the top of `main`, with up to date
    project code.

    > **Note:** instead of doing the `git rebase main`, you can do `git merge
main`. This will not replay all your branch commits one by one, but will
    > instead add a new commit to merge main into your branch.

8.  **Push your branch** to the upstream remote:

    ```bash
    git push
    ```

9.  **Create the pull request** on Github, and assign the review to one or many
    of the project's contributors.

    ![Github screenshot with pull request button](/assets/images/github-screenshot-pull-request.png)

    > **Note:** after you push a branch on Github, a green button shows up and
    > proposes to "Create pull request". Click on it and just complete the pull
    > request.

10. **Eventually adjust your commits** based on the returns you have on the pull
    request.

11. **Delete you branch once it’s merged**. You have to delete it locally, and
    on the remote.

    - delete the branch **locally**:

    ```bash
    git branch -D feature/22-create-ressources-model
    ```

    - delete the branch on the **remote**:

    ```bash
    git push -d origin feature/22-create-ressources-model
    ```

12. **Well done**, you just contributed to this beautiful application 🥳 !!

## Backend

You need `.env`

### With npm

Use the terminal commande `npm install` to install the dependencies and use `nodemon` or `node server.ts` to start the server and API system.

### Swagger

The API documentation with Swagger is available at : http://localhost:3000/api/docs/

Please use Chrome or Firefox to read the documentation.

#### Credentials

- **Email address** : test@test.com
- **Password** : testtest

### Tests

Use the terminal commande `npm test`
