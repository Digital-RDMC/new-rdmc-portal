# PowerShell script to deploy to Vercel with force installation
Write-Host "Starting deployment with force installation for dependency conflicts..."
vercel --force
Write-Host "Deployment complete!"
