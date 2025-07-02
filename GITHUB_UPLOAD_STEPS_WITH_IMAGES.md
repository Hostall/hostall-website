# How to Upload index.html to GitHub - Step-by-Step Guide with Images

## Step 1: Sign in to GitHub

Go to [github.com](https://github.com) and sign in to your account.

![GitHub Login](https://docs.github.com/assets/cb-25662/mw-1440/images/help/site/header-logged-out.webp)

## Step 2: Go to Your Repository

After logging in, you'll see your repositories. Click on the repository for your HOSTALL project.

![Repositories](https://docs.github.com/assets/cb-19005/mw-1440/images/help/repository/repo-tabs-overview.webp)

## Step 3: Upload Your Files

### Click "Add file" Button

Look for the "Add file" button near the top right of your repository page.

![Add File Button](https://docs.github.com/assets/cb-26723/mw-1440/images/help/repository/upload-files-button.webp)

### Select "Upload files"

From the dropdown menu, select "Upload files".

![Upload Files Option](https://docs.github.com/assets/cb-33216/mw-1440/images/help/repository/upload-files.webp)

### Drag and Drop Your Files

You'll see an upload area where you can either:
- Drag and drop your files directly
- Click "choose your files" to select them from your computer

![Drag and Drop Area](https://docs.github.com/assets/cb-34115/mw-1440/images/help/repository/upload-files-drag-and-drop.webp)

Upload these files:
- `index.html` (your main website file)
- `app.js` (if you have JavaScript code)
- Any image files your website needs

## Step 4: Commit Your Changes

After uploading your files, scroll down to the "Commit changes" section.

![Commit Changes Section](https://docs.github.com/assets/cb-33207/mw-1440/images/help/repository/commit-changes-button.webp)

1. Add a commit message like: "Upload HOSTALL website files"
2. Keep the default option "Commit directly to the main branch"
3. Click the green "Commit changes" button

## Step 5: Verify Your Files Were Uploaded

After the upload completes, you'll be taken back to your repository. You should now see your uploaded files in the file list.

![Repository with Files](https://docs.github.com/assets/cb-61138/mw-1440/images/help/repository/repository-contents-path.webp)

## Step 6: Make the Small Change to index.html

For your HOSTALL project, you need to:

1. Click on `index.html` in your repository to open it
2. Click the pencil icon (✏️) to edit the file

![Edit File Button](https://docs.github.com/assets/cb-14255/mw-1440/images/help/repository/edit-file-edit-button.webp)

3. Find the title tag (around line 14) that looks like this:
```html
<title>HOSTALL - Best Hostels in Lahore | Boys & Girls Hostels | Affordable Accommodation</title>
```

4. Change it to:
```html
<title>HOSTALL - Best Hostels in Lahore | Boys & Girls Hostels | Affordable Accommodation | Live</title>
```

5. Scroll down and click "Commit changes"

This small change will trigger your GitHub Actions workflow and deploy your website to Cloudflare Pages.

## What's Next?

After making this change:

1. GitHub Actions will automatically run your deployment workflow
2. Your website will be deployed to Cloudflare Pages
3. You can then add your custom domain (hostall.org)

Need more help? Let me know what specific step you're stuck on!