# Design Guidelines: Gaming Community Web Application

## Design Approach
**Hybrid Approach**: Drawing inspiration from Discord's community-focused interface and Linear's clean dashboard aesthetics, adapted for a gaming community with white-orange branding.

## Core Design Elements

### A. Typography
- **Primary Font**: 'Inter' via Google Fonts - clean, modern readability
- **Headings**: Font weights 700-800, sizes: text-3xl (dashboard titles), text-2xl (section headers), text-xl (card titles)
- **Body Text**: Font weight 400-500, text-base for content, text-sm for labels/metadata
- **Gaming Accent**: 'Rajdhana' for community name/branding elements - adds gaming personality

### B. Layout System
**Tailwind Spacing Units**: Consistently use 4, 6, 8, 12, 16, 24 for spacing
- `p-6` for card padding
- `gap-6` for grid layouts
- `mb-8` for section spacing
- `py-12` for page containers

**Dashboard Grid**: 12-column grid for flexible layouts, use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` for stats cards

### C. Component Library

**Navigation**
- Collapsible sidebar (w-64 expanded, collapsed to icon-only w-16)
- Hamburger menu (mobile): Full-screen overlay with smooth slide-in animation
- Navigation items: Icon + label, active state with orange accent border-left (border-l-4)
- Role badge displayed in sidebar header with user avatar

**Authentication Pages**
- Centered auth cards (max-w-md) with subtle elevation
- Split layout for larger screens: left side branding/community info, right side form
- Social proof element: "Join 20 gamers" with small avatars cluster

**Dashboard Cards**
- Stats cards: Icon, metric number (large, text-3xl), label below
- Activity feed: Timeline-style with user avatars, timestamps
- Member cards: Grid layout with avatar, username, role badge, online status indicator
- Elevated cards with subtle shadow (shadow-sm hover:shadow-md transition)

**Data Displays**
- Member list: Table for admin/owner, cards for member view
- Activity timeline: Vertical line with connecting dots, alternating content
- Stats overview: 4-column grid (mobile stacks to 2-col)

**Forms**
- Full-width inputs with consistent height (h-12)
- Labels above inputs (text-sm font-medium)
- Orange focus rings (focus:ring-2 focus:ring-orange-500)
- Submit buttons prominent with orange background
- Cloudinary upload: Drag-drop zone with preview thumbnails grid

**Role-Specific Dashboards**

*Member Dashboard*:
- Welcome hero section (h-48) with community stats
- Recent activity feed (2-column: personal activity + community activity)
- Member directory grid
- Quick actions card (profile edit, upload media)

*Admin Dashboard*:
- Stats row (4 cards: total members, active today, media uploads, pending actions)
- Member management table with role assignment dropdown
- Activity monitoring section
- Media moderation grid (recent uploads with approve/reject)

*Owner Dashboard*:
- Everything from Admin plus:
- System settings card
- Role permissions matrix
- Admin management section
- Audit log timeline

### D. Responsive Breakpoints
- Mobile (base): Single column, hamburger menu, stacked cards
- Tablet (md: 768px): 2-column grids, expanded sidebar toggle
- Desktop (lg: 1024px): Full sidebar visible, 3-4 column grids

### E. Interactive Elements
- Hover states: Subtle scale (scale-105) on cards, brightness increase on buttons
- Active navigation: Bold orange accent with background tint
- Loading states: Orange spinner, skeleton screens for data fetch
- Toast notifications: Top-right position with slide-in animation
- Modal overlays: Centered with backdrop blur

### F. Images & Media

**Hero Section** (Login/Landing):
- Gaming-themed illustration or abstract geometric patterns
- Position: Top of page, h-64 on mobile, h-96 on desktop
- Overlay: Semi-transparent gradient for text readability

**User Avatars**:
- Consistent sizing: Small (w-8 h-8), Medium (w-12 h-12), Large (w-24 h-24)
- Rounded-full with orange border for online status
- Fallback: Initials on colored background

**Community Gallery**:
- Masonry grid layout for uploaded media
- Lightbox modal on click with navigation arrows
- Lazy loading for performance

### G. Accessibility
- All interactive elements keyboard navigable
- ARIA labels on icon-only buttons
- Focus indicators visible on all inputs/buttons
- Sufficient color contrast (white background ensures readability)
- Form validation with clear error messages below inputs

### Key Design Principles
1. **Gaming Energy**: Use orange strategically for CTAs, accents, and active states
2. **Clean Hierarchy**: White backgrounds with generous spacing prevent overwhelming
3. **Role Clarity**: Visual indicators (badges, colors) distinguish user permissions
4. **Mobile-First**: Hamburger menu and stacked layouts ensure mobile usability
5. **Community Focus**: Prominent member presence through avatars and activity feeds