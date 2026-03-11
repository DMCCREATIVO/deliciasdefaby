# Deployment Guide for aapanel

## Prerequisites
1. An aapanel installation on your server
2. Node.js 16+ installed via aapanel
3. Nginx web server installed via aapanel

## Build Process
1. Clone your repository to the server or upload your project files
2. Install dependencies:
```bash
npm install
```
3. Create a production build:
```bash
npm run build
```
This will create a `dist` folder with your production-ready files.

## Nginx Configuration
1. In aapanel, create a new website
2. Configure the following Nginx settings for your site:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/dist;
    index index.html;

    # Handle React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location /assets {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

## Environment Variables
1. Create a `.env.production` file in your project root with your production environment variables:
```env
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-supabase-anon-key
VITE_MERCADOPAGO_PUBLIC_KEY=your-production-mercadopago-key
# Add other necessary environment variables
```

## Deployment Steps
1. Upload your project files to the server
2. Navigate to your project directory
3. Install dependencies: `npm install`
4. Build the project: `npm run build`
5. Move the contents of the `dist` folder to your configured web root
6. Restart Nginx through aapanel

## SSL Configuration (Recommended)
1. In aapanel, go to SSL management
2. Apply for a Let's Encrypt certificate or upload your own SSL certificate
3. Enable HTTPS for your site

## Troubleshooting
- If you see a blank page, ensure your Nginx configuration includes the React Router handling
- Check the browser console for any errors related to environment variables
- Verify that all static assets are being served correctly
- Ensure proper permissions are set on the web root directory

## Maintenance
For future updates:
1. Pull the latest changes or upload new files
2. Run `npm install` if dependencies changed
3. Run `npm run build`
4. Replace the contents of the web root with the new `dist` folder

## Performance Optimization
- Enable Nginx caching for static assets
- Implement Gzip compression
- Use a CDN for static assets if needed
- Monitor server resources through aapanel dashboard