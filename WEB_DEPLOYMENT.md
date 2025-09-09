# My Baguio Trip - Web App Deployment Guide

## Overview
This document provides instructions for deploying the My Baguio Trip application as a web app. The application has been optimized for web deployment while maintaining mobile compatibility.

## Web App Features

### ✅ Completed Web Optimizations
- **Web-first configuration** in `app.json` with PWA support
- **Responsive navigation** - Top navigation bar for web, bottom tabs for mobile
- **Optimized animations** - Faster, web-appropriate animations
- **SEO optimization** - Meta tags, Open Graph, Twitter Cards
- **PWA support** - Web app manifest for installability
- **Performance optimizations** - Critical CSS, resource preloading
- **Cross-browser compatibility** - Tested on Chrome, Firefox, Safari, Edge

### 🎯 Key Web Features
- **Responsive Design**: Adapts to desktop, tablet, and mobile screens
- **Progressive Web App**: Can be installed on devices
- **SEO Optimized**: Search engine friendly with proper meta tags
- **Fast Loading**: Optimized assets and critical CSS
- **Accessibility**: Keyboard navigation and screen reader support

## Development Commands

### Start Development Server
```bash
npm run dev
# or
npm start
```

### Build for Production
```bash
npm run build
# or
npm run build:web
```

### Serve Production Build
```bash
npm run serve
```

## Deployment Options

### 1. Static Hosting (Recommended)
The app builds to static files in the `dist` folder, making it compatible with:
- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Push to `gh-pages` branch
- **AWS S3**: Upload `dist` contents to S3 bucket
- **Firebase Hosting**: `firebase deploy`

### 2. Traditional Web Hosting
Upload the contents of the `dist` folder to any web server that serves static files.

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
```

### Custom Domain
Update the following files for custom domain:
1. `app.json` - Update web configuration
2. `public/index.html` - Update Open Graph URLs
3. `public/manifest.json` - Update start_url if needed

## Performance Optimizations

### Bundle Size
- Tree shaking enabled
- Code splitting for routes
- Optimized images with Expo Image
- Minimal dependencies

### Loading Performance
- Critical CSS inlined
- Resource preloading
- Optimized font loading
- Lazy loading for non-critical components

## Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

### Mobile Browsers
- **iOS Safari**: 14+
- **Chrome Mobile**: 90+
- **Samsung Internet**: 13+

## Troubleshooting

### Common Issues

1. **Build Fails**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Routing Issues**
   - Ensure server is configured for SPA routing
   - Add fallback to `index.html` for all routes

3. **API Errors**
   - Check environment variables
   - Verify CORS settings
   - Check network connectivity

### Performance Issues
- Use browser dev tools to identify bottlenecks
- Check bundle analyzer for large dependencies
- Optimize images and assets

## Monitoring

### Analytics
Consider adding:
- Google Analytics
- Hotjar for user behavior
- Sentry for error tracking

### Performance Monitoring
- Core Web Vitals tracking
- Lighthouse audits
- Real User Monitoring (RUM)

## Security

### Headers
Security headers are configured in `public/_headers`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

### Content Security Policy
Consider adding CSP headers for additional security.

## Maintenance

### Updates
1. Update dependencies regularly
2. Test across browsers after updates
3. Monitor performance metrics
4. Update PWA manifest as needed

### Monitoring
- Set up uptime monitoring
- Monitor Core Web Vitals
- Track user engagement metrics

## Support

For issues or questions:
1. Check this documentation
2. Review browser console for errors
3. Test in incognito mode
4. Check network connectivity

---

*This web app is optimized for modern browsers and provides the best experience on desktop and mobile devices.*
