# Technical Context: Fiyova Technology Stack

## Core Technologies

### Frontend Framework
- **Next.js 15**: React framework with App Router
- **React 18**: UI library with Server Components
- **TypeScript**: Type-safe development

### Styling & UI
- **Tailwind CSS v4**: Utility-first CSS framework
- **HeroUI**: Component library for consistent UI
- **Lucide React**: Icon library for visual elements

### Payment Integration
- **Dodo Payments**: Primary payment processor
- **Dodo Payments SDK**: Official JavaScript SDK
- **Standard Webhooks**: Webhook signature verification

## Development Setup

### Environment Variables
```bash
DODO_PAYMENTS_API_KEY=u9MhyWORfeA3Odd4.zwZDxSW2y-k69FbYhixdmmrSg5OmBdGEYY_1dMqBbW6R_32d
DODO_REDIRECT_URL=http://localhost:3000/checkout/complete
DODO_MODE=Live
```

### Dependencies
```json
{
  "dodopayments": "^1.0.0",
  "standardwebhooks": "^1.0.0",
  "next": "15.0.0",
  "react": "18.0.0",
  "typescript": "5.0.0"
}
```

### Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## Technical Constraints

### API Integration
- **Authentication**: Bearer token authentication with Dodo Payments
- **Rate Limiting**: Respect API rate limits
- **Error Handling**: Graceful degradation when APIs fail
- **Caching**: Implement appropriate caching strategies

### Security Requirements
- **API Keys**: Store securely in environment variables
- **Webhook Verification**: Verify webhook signatures
- **Input Validation**: Validate all user inputs
- **HTTPS**: Required for production deployment

### Performance Requirements
- **Server-Side Rendering**: Use Server Components for data fetching
- **Caching**: Implement proper cache headers
- **Bundle Size**: Optimize for minimal payload
- **Loading States**: Provide user feedback during operations

## Deployment Considerations

### Production Environment
- **Environment Variables**: Configure production API keys
- **Domain Configuration**: Update redirect URLs for production
- **HTTPS**: Ensure secure connections
- **Monitoring**: Set up error tracking and logging

### API Configuration
- **Dodo Dashboard**: Configure webhook and redirect URLs
- **Webhook URL**: `https://yourdomain.com/api/webhooks/dodo`
- **Redirect URL**: `https://yourdomain.com/checkout/complete`

## Development Workflow

### Code Organization
- **Components**: Reusable UI components in `/components`
- **Pages**: Route handlers in `/app`
- **API Routes**: Backend logic in `/app/api`
- **Utilities**: Helper functions in `/lib`

### Testing Strategy
- **API Testing**: Test payment flows end-to-end
- **Error Scenarios**: Test failure cases and recovery
- **Cross-Browser**: Ensure compatibility across browsers
- **Mobile**: Test responsive design on various devices
