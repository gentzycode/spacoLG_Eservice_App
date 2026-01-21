# Quick Start Guide - Enhanced Landing Page

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd /Users/Apple/Documents/GitHub/LGA-BACKEND/YenagoaFrontend
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. View the Landing Page
Open your browser and navigate to:
```
http://localhost:5173/
```

### 4. Build for Production
```bash
npm run build
```

## 📁 Key Files Modified/Created

### New Files
- `src/public/pages/LandingEnhanced.jsx` - Main landing page component
- `LANDING_PAGE_REDESIGN.md` - Complete documentation
- `QUICK_START_GUIDE.md` - This guide

### Updated Files
- `src/App.jsx` - Updated to use LandingEnhanced
- `tailwind.config.js` - Added custom animations
- `src/index.css` - Enhanced with animations and effects
- `package.json` - Added aos and react-intersection-observer

## 🎨 Color Scheme

### Service Gradients
- **Blue**: Birth Certificate
- **Purple**: Death Certificate
- **Green**: LG ID
- **Orange**: Club Registration
- **Teal**: Waste Management
- **Indigo**: Street Registration
- **Pink**: Ticketing
- **Red**: Other Services

### Main Colors
- Primary Blue: `#3B82F6`
- Purple: `#8B5CF6`
- Yellow: `#F59E0B`
- Orange: `#F97316`

## ⚡ Features at a Glance

### Hero Section
- ✅ Full-screen gradient background
- ✅ Animated blob backgrounds
- ✅ Floating logo with rotation
- ✅ Quick actions card with glassmorphism
- ✅ Search functionality
- ✅ Scroll indicator

### Services Section
- ✅ 8 colorful service cards
- ✅ Unique gradient per service
- ✅ Hover animations
- ✅ Icon integration
- ✅ Service descriptions

### Features Section
- ✅ 4 feature cards with icons
- ✅ Gradient backgrounds
- ✅ Scroll animations
- ✅ Statistics counters

### Footer
- ✅ 4-column layout
- ✅ Quick links
- ✅ Contact information
- ✅ Animated logo

## 🌓 Dark Mode

Toggle dark mode using the button at bottom-right:
- Sun icon = Dark mode active
- Moon icon = Light mode active

Settings are saved in localStorage.

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🎭 Animations Used

### Framer Motion
- Container stagger animations
- Item fade-in animations
- Hover scale effects
- Floating animations
- Button interactions

### AOS (Animate On Scroll)
- `fade-up` - Fade and slide up
- `zoom-in` - Zoom in effect
- `flip-left` - Flip from left
- Custom delays per element

### CSS Animations
- `blob` - Organic movement
- `float` - Gentle floating
- `shimmer` - Loading shimmer
- `gradient` - Gradient shift
- `pulse-glow` - Glowing pulse

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#YOUR_COLOR',
    // ...
  }
}
```

### Adjust Animations
Edit `src/index.css`:
```css
@keyframes yourAnimation {
  /* Your keyframes */
}
```

### Modify Content
Edit `src/public/pages/LandingEnhanced.jsx`:
- Update service array (line 8-50)
- Update features array (line 52-74)
- Update stats array (line 76-81)

## 🐛 Troubleshooting

### Animations not working?
1. Clear browser cache
2. Hard reload (Cmd+Shift+R / Ctrl+Shift+R)
3. Check browser console for errors

### Build fails?
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Styles not applying?
```bash
npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

## 📊 Performance Tips

1. **Images**: Optimize images before adding
2. **Animations**: Use will-change for smoother animations
3. **Code Splitting**: Keep lazy loading for routes
4. **Build**: Always build before production deployment

## 🚢 Deployment

### Build the project
```bash
npm run build
```

### Preview build locally
```bash
npm run preview
```

### Deploy `dist` folder to your hosting

## 💡 Pro Tips

1. **Test on mobile devices** - Use Chrome DevTools
2. **Check accessibility** - Use Lighthouse
3. **Monitor performance** - Use Performance tab
4. **Test dark mode** - Toggle and verify all sections

## 📞 Need Help?

Check the main documentation:
- `LANDING_PAGE_REDESIGN.md` - Complete feature list
- Browser console for errors
- React DevTools for component issues

## ✅ Checklist Before Going Live

- [ ] All images optimized
- [ ] Content reviewed and approved
- [ ] Dark mode tested
- [ ] Mobile responsive verified
- [ ] Performance tested (Lighthouse)
- [ ] Accessibility checked
- [ ] Cross-browser tested
- [ ] Build successful
- [ ] Preview looks correct

---

**Quick Commands:**
```bash
# Development
npm run dev

# Build
npm run build

# Preview
npm run preview

# Lint
npm run lint
```

🎉 **You're all set! Enjoy your world-class landing page!**
