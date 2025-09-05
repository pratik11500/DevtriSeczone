# Devtri Seczone Private Limited - Corporate Website

A modern corporate website featuring security services, manpower solutions, and a comprehensive customer reviews system.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=YOUR_GITHUB_REPO_URL)

## 📁 Project Structure

```
├── index.html              # Main homepage
├── admin.html              # Admin panel for review management
├── style.css               # Main stylesheet
├── vercel.json            # Vercel deployment configuration
├── package.json           # Project dependencies and scripts
├── .vercelignore          # Files to ignore during deployment
├── static/                # Static assets
│   └── images/           # All website images
├── main/                 # Service pages
│   ├── security.html
│   ├── manpower.html
│   ├── consistency.html
│   ├── payroll.html
│   ├── staffing.html
│   └── services.html
└── documents/            # Legal documents (PDFs)
```

## 🌟 Features

### Customer Reviews System
- Interactive review cards with user icons
- Like/dislike functionality with real-time counts
- 5-star rating display
- "See More" expandable reviews
- 4 reviews per row responsive layout

### Admin Panel
- Password-protected admin interface
- Review management and deletion
- Secure authentication (Password: `Ashish@1234`)
- Responsive admin dashboard

### Services
- Security Services
- IT Security (CCTV)
- Manpower Solutions
- Staffing Services
- Consistency Services
- Payroll Services

## 🚀 Deployment Instructions

### Method 1: Automatic Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration
   - Click "Deploy"

### Method 2: Vercel CLI Deployment

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Set up custom domain** (optional):
   ```bash
   vercel --prod
   ```

## ⚙️ Configuration Files

### vercel.json
- Configures static file serving
- Sets up proper routing for all pages
- Includes security headers
- Optimizes caching for static assets

### .vercelignore
- Excludes unnecessary files from deployment
- Keeps deployment size minimal
- Excludes server-side files and development dependencies

## 🔧 Local Development

```bash
# Serve locally using Python
python -m http.server 5000

# Or using Node.js (if you have a server)
npm start
```

## 🌐 Website URLs

After deployment, your website will be available at:
- **Homepage**: `https://your-domain.vercel.app/`
- **Admin Panel**: `https://your-domain.vercel.app/admin.html`
- **Services**: `https://your-domain.vercel.app/main/[service-name].html`

## 🔐 Admin Access

- **URL**: `/admin.html`
- **Password**: `Ashish@1234`
- **Features**: Review management, deletion capabilities

## 📱 Responsive Design

The website is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

## 🛡️ Security Features

- XSS protection headers
- Content type validation
- Frame options security
- Secure admin authentication
- Static file optimization

## 📞 Contact Information

- **Phone**: +91 78270 50067
- **Email**: info.ds@devtriseczone.com
- **Address**: Shop/4, Panchdhapa Apt, Thankar Pada, Kalyan, Maharashtra, India, 421301

## 📄 License

© 2025 Devtri Seczone Private Limited. All rights reserved.