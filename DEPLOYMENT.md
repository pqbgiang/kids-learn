# GitHub Pages Deployment Notes

This repository is configured to deploy to GitHub Pages at: https://pqbgiang.github.io/kids-learn/

## Important Privacy Considerations

- This is a **private repository** but the **deployed site is public**
- Anyone with the URL can access the deployed application
- The source code remains private and only accessible to repository collaborators

## Deployment Instructions

To deploy updates to the site:

```bash
npm run deploy
```

This command will:
1. Build the application (`npm run build`)
2. Push the built files to the `gh-pages` branch
3. GitHub will automatically deploy from the `gh-pages` branch

## Configuration Details

- The app is configured with `"homepage": "https://pqbgiang.github.io/kids-learn"` in package.json
- React Router is configured with `<Router basename="/kids-learn">`
- SPA redirect handling is implemented for direct URL access with 404.html

## Free GitHub Plan Limitations

Working with GitHub Pages on the free plan:

- Private repositories with public GitHub Pages sites
- Limited to 3 collaborators for the private repository
- 2,000 GitHub Actions minutes per month for private repositories
- 1GB of GitHub Packages storage

## Customizing Your Site Further

To use a custom domain:
1. Go to your repository's Settings > Pages
2. Under "Custom domain", add your domain name
3. Update DNS settings with your provider
4. Update the "homepage" field in package.json

## Troubleshooting

If your deployment isn't working:
1. Check that the `gh-pages` branch exists and contains the latest build
2. Ensure GitHub Pages is configured to deploy from the `gh-pages` branch
3. Look for deployment errors in the repository's Actions tab
4. Clear your browser cache or try a private/incognito window
